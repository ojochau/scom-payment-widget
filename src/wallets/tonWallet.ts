import { Component, RequireJS } from "@ijstech/components";
import { Utils } from "@ijstech/eth-wallet";
import { ITokenObject } from "@scom/scom-token-list";
import TonWalletProvider from "./tonProvider";

const JETTON_TRANSFER_OP = 0xf8a7ea5; // 32-bit

export class TonWallet {
    private provider: TonWalletProvider;
    private toncore: any;
    private _isWalletConnected: boolean = false;
    private _onTonWalletStatusChanged: (isConnected: boolean) => void;

    constructor(
        provider: TonWalletProvider,
        moduleDir: string,
        onTonWalletStatusChanged: (isConnected: boolean) => void
    ) {
        this.provider = provider;
        this.loadLib(moduleDir);
        this._onTonWalletStatusChanged = onTonWalletStatusChanged;
    }

    isWalletConnected() {
        return this.provider.tonConnectUI.connected;
    }

    isNetworkConnected() {
        return this.provider.tonConnectUI.connected;
    }

    async loadLib(moduleDir: string) {
        let self = this;
        return new Promise((resolve, reject) => {
            RequireJS.config({
                baseUrl: `${moduleDir}/lib`,
                paths: {
                    'ton-core': 'ton-core',
                }
            })
            RequireJS.require(['ton-core'], function (TonCore: any) {
                self.toncore = TonCore;
                resolve(self.toncore);
            });
        })
    }

    async connectWallet() {
        try {
            await this.provider.tonConnectUI.openModal();
        }
        catch (err) {
            alert(err)
        }
    }

    getNetworkInfo() {
        return null;
    }

    async openNetworkModal(modalContainer: Component) {
    }

    async switchNetwork() {
    }

    async disconnectWallet() {
        await this.provider.disconnect();
    }

    async sendTransaction(txData: any) {
        return await this.provider.tonConnectUI.sendTransaction(txData);
    }

    constructPayloadForTokenTransfer(
        to: string,
        token: ITokenObject,
        amount: number
    ): string {
        const recipientAddress = this.toncore.Address.parse(to);
        const jettonAmount = Utils.toDecimals(amount, token.decimals);

        const bodyCell = this.toncore.beginCell()
            .storeUint(JETTON_TRANSFER_OP, 32)  // function ID
            .storeUint(0, 64)                  // query_id (can be 0 or a custom value)
            .storeCoins(jettonAmount)          // amount in nano-jettons
            .storeAddress(recipientAddress)    // destination
            .storeAddress(null)        // response_destination (set to NULL if you don't need callback)
            .storeMaybeRef(null)               // custom_payload (None)
            .storeCoins(this.toncore.toNano('0.02'))        // forward_ton_amount (some TON to forward, e.g. 0.02)
            .storeMaybeRef(null)               // forward_payload (None)
            .endCell();

        return bodyCell.toBoc().toString('base64');
    }

    getWalletAddress() {
        return this.provider.tonConnectUI.account?.address;
    }

    viewExplorerByTransactionHash(hash: string) {
        window.open(`https://tonscan.org/transaction/${hash}`);
    }

    async getTonBalance() {
        try {
            const address = this.provider.tonConnectUI.account;
            const result = await fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${address}`, {
                method: 'GET',
            });
            const data = await result.json();
            const balance = Utils.fromDecimals(data.balance, 9);
            return balance;
        } catch (error) {
            console.error('Error fetching balance:', error);
            throw error;
        }
    }

    buildOwnerSlice(userAddress: string): string {
        const owner = this.toncore.Address.parse(userAddress);
        const cell = this.toncore.beginCell()
            .storeAddress(owner)
            .endCell();
        return cell.toBoc().toString('base64');
    }

    async getJettonWalletAddress(jettonMasterAddress: string, userAddress: string) {
        const base64Cell = this.buildOwnerSlice(userAddress);
        const response = await fetch('https://toncenter.com/api/v3/runGetMethod', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                address: jettonMasterAddress,
                method: 'get_wallet_address',
                stack: [
                    {
                        type: 'slice',
                        value: base64Cell,
                    },
                ],
            })
        });
        const data = await response.json();
        const cell = this.toncore.Cell.fromBase64(data.stack[0].value);
        const slice = cell.beginParse();
        const address = slice.loadAddress();
        return address.toString() as string;
    }

    getTransactionMessageHash(boc: string) {
        const cell =  this.toncore.Cell.fromBase64(boc);
        const hashBytes = cell.hash();
        const messageHash = hashBytes.toString('base64');
        return messageHash;
    }

    async transferToken(
        to: string,
        token: ITokenObject,
        amount: number,
        callback?: (error: Error, receipt?: string) => Promise<void>,
        confirmationCallback?: (receipt: any) => Promise<void>
    ) {
        let result: any;
        let messageHash: string;
        try {
            if (!token.address) {
                const transaction = {
                    validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
                    messages: [
                        {
                            address: to,
                            amount: Utils.toDecimals(amount, 9),
                            payload: ''
                        }
                    ]
                };
                result = await this.sendTransaction(transaction);
            }
            else {
                const senderJettonAddress = await this.getJettonWalletAddress(token.address, this.getWalletAddress());
                const recipientJettonAddress = await this.getJettonWalletAddress(token.address, to);
                const payload = this.constructPayloadForTokenTransfer(recipientJettonAddress, token, amount);
                const transaction = {
                    validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
                    messages: [
                        {
                            address: senderJettonAddress,
                            amount: Utils.toDecimals('0.1', 9), //FIXME: need to estimate the fee
                            payload: payload
                        }
                    ]
                };
                result = await this.sendTransaction(transaction);
            }
            if (result) {
                messageHash = this.getTransactionMessageHash(result.boc);
                if (callback) {
                    callback(null, messageHash);
                }
            }
        }
        catch (error) {
            callback(error);
        }
        return messageHash;
    }
}
