import { Component, RequireJS } from "@ijstech/components";
import { Utils } from "@ijstech/eth-wallet";
import { ITokenObject } from "@scom/scom-token-list";
import TonWalletProvider from "./tonProvider";
import assets from '../assets';

const JETTON_TRANSFER_OP = 0xf8a7ea5; // 32-bit
type NetworkType = 'mainnet' | 'testnet';

export class TonWallet {
    private provider: TonWalletProvider;
    private toncore: any;
    private _isWalletConnected: boolean = false;
    private _onTonWalletStatusChanged: (isConnected: boolean) => void;
    private networkType: NetworkType = 'testnet';

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

    // async connectWallet() {
    //     try {
    //         await this.provider.tonConnectUI.openModal();
    //     }
    //     catch (err) {
    //         alert(err)
    //     }
    // }

    getNetworkInfo() {
        return {
            chainId: 0,
            chainName: 'TON',
            networkCode: this.networkType === 'testnet' ? 'TON-TESTNET' : 'TON',
            nativeCurrency: {
                name: 'TON',
                symbol: 'TON',
                decimals: 9
            },
            image: assets.fullPath('img/ton.png'),
            rpcUrls: []
        }
    }

    private getTonCenterAPIEndpoint(): string {
        switch (this.networkType) {
            case 'mainnet':
                return 'https://toncenter.com/api';
            case 'testnet':
                return 'https://testnet.toncenter.com/api';
            default:
                throw new Error('Unsupported network type');
        }
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
        amount: string
    ): string {
        const recipientAddress = this.toncore.Address.parse(to);

        const bodyCell = this.toncore.beginCell()
            .storeUint(JETTON_TRANSFER_OP, 32)  // function ID
            .storeUint(0, 64)                  // query_id (can be 0 or a custom value)
            .storeCoins(amount)          // amount in nano-jettons
            .storeAddress(recipientAddress)    // destination
            .storeAddress(null)        // response_destination (set to NULL if you don't need callback)
            .storeMaybeRef(null)               // custom_payload (None)
            .storeCoins(this.toncore.toNano('0.02'))        // forward_ton_amount (some TON to forward, e.g. 0.02)
            .storeMaybeRef(null)               // forward_payload (None)
            .endCell();

        return bodyCell.toBoc().toString('base64');
    }

    getWalletAddress() {
        const rawAddress = this.provider.tonConnectUI.account?.address;
        const nonBounceableAddress = this.toncore.Address.parse(rawAddress).toString({ bounceable: false })
        return nonBounceableAddress;
    }

    viewExplorerByTransactionHash(hash: string) {
        if (this.networkType === 'mainnet') {
            window.open(`https://tonscan.org/transactions/${hash}`);
        }
        else {
            window.open(`https://testnet.tonscan.org/transactions/${hash}`);
        }
    }

    private async getTonBalance() {
        try {
            const address = this.getWalletAddress();
            const apiEndpoint = this.getTonCenterAPIEndpoint();
            const result = await fetch(`${apiEndpoint}/v2/getAddressBalance?address=${address}`, {
                method: 'GET',
            });
            const data = await result.json();
            const balance = data.result;
            return balance;
        } catch (error) {
            console.error('Error fetching balance:', error);
            throw error;
        }
    }

    async getTokenBalance(token: ITokenObject) {
        if (!token.address) {
            return await this.getTonBalance();
        }
        const senderJettonAddress = await this.getJettonWalletAddress(token.address, this.getWalletAddress());
        const apiEndpoint = this.getTonCenterAPIEndpoint();
        const response = await fetch(`${apiEndpoint}/v3/runGetMethod`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                address: senderJettonAddress,
                method: 'get_wallet_data',
                stack: [],
            }),
        });

        const data = await response.json();
        if (data.exit_code !== 0) {
            return '0';
        }
        const balanceStack = data.stack?.[0];

        const balanceStr: string = balanceStack.value
        const balance = BigInt(balanceStr).toString();
        return balance;
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
        const apiEndpoint = this.getTonCenterAPIEndpoint();
        const response = await fetch(`${apiEndpoint}/v3/runGetMethod`, {
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
        return address.toString({
            bounceable: true,
            testOnly: this.networkType === 'testnet'
        }) as string;
    }

    async estimateNetworkFee(address: string, body: string) {
        const apiEndpoint = this.getTonCenterAPIEndpoint();
        const response = await fetch(`${apiEndpoint}/v3/estimateFee`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                address: address,
                body: body,
                ignore_chksig: false
            })
        });
        const data = await response.json();
        return data;
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
                            amount: Utils.toDecimals(amount, 9).toFixed() ,
                            payload: ''
                        }
                    ]
                };
                result = await this.sendTransaction(transaction);
            }
            else {
                const senderJettonAddress = await this.getJettonWalletAddress(token.address, this.getWalletAddress());
                const jettonAmount = Utils.toDecimals(amount, token.decimals).toFixed();
                const payload = this.constructPayloadForTokenTransfer(to, jettonAmount);
                // const networkFee = await this.estimateNetworkFee(this.getWalletAddress(), payload);
                // const sourceFees = networkFee.source_fees;
                // const totalFee = new BigNumber(sourceFees.fwd_fee).plus(sourceFees.gas_fee).plus(sourceFees.in_fwd_fee).plus(sourceFees.storage_fee);
                const transaction = {
                    validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
                    messages: [
                        {
                            address: senderJettonAddress,
                            amount: Utils.toDecimals('0.05', 9),
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
