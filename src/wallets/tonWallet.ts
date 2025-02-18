import { Component, RequireJS, application } from "@ijstech/components";
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
            chainName: this.networkType === 'testnet' ? 'TON Testnet' : 'TON',
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

    private getTonAPIEndpoint(): string {
        const publicIndexingRelay = application.store?.publicIndexingRelay;
        return `${publicIndexingRelay}/ton`;
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
            window.open(`https://tonscan.org/tx/${hash}`);
        }
        else {
            window.open(`https://testnet.tonscan.org/tx/${hash}`);
        }
    }

    async exponentialBackoffRetry<T>(
        fn: () => Promise<T>, // Function to retry
        retries: number, // Maximum number of retries
        delay: number, // Initial delay duration in milliseconds
        maxDelay: number, // Maximum delay duration in milliseconds
        factor: number, // Exponential backoff factor
        stopCondition: (data: T) => boolean = () => true // Stop condition
    ): Promise<T> {
        let currentDelay = delay;
    
        for (let i = 0; i < retries; i++) {
            try {
                const data = await fn();
                if (stopCondition(data)) {
                    return data;
                }
                else {
                    console.log(`Attempt ${i + 1} failed. Retrying in ${currentDelay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, currentDelay));
                    currentDelay = Math.min(maxDelay, currentDelay * factor);
                }
            } 
            catch (error) {
                console.error('error', error);
                console.log(`Attempt ${i + 1} failed. Retrying in ${currentDelay}ms...`);
                await new Promise(resolve => setTimeout(resolve, currentDelay));
                currentDelay = Math.min(maxDelay, currentDelay * factor);
            }
        }
        throw new Error(`Failed after ${retries} retries`);
    }

    private async getTonBalance() {
        try {
            const address = this.getWalletAddress();
            const apiEndpoint = this.getTonAPIEndpoint();
            const func = async () => {
                const response = await fetch(`${apiEndpoint}/getAddressBalance`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        network: this.networkType,
                        address: address
                    })
                });
                const result = await response.json();
                return result;
            }
            const stopCondition = (result: any) => {
                return result?.success;
            }
            const result = await this.exponentialBackoffRetry(
                func,
                3, 
                1000, 
                10000, 
                2,
                stopCondition
            );
            const balance = result.data?.balance;
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
        const apiEndpoint = this.getTonAPIEndpoint();
        const func = async () => {
            const response = await fetch(`${apiEndpoint}/runGetMethod`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    network: this.networkType,
                    params: {
                        address: senderJettonAddress,
                        method: 'get_wallet_data',
                        stack: [],
                    }
                })
            });
            const result = await response.json();
            return result;
        }
        const stopCondition = (result: any) => {
            return result?.success;
        }
        const result = await this.exponentialBackoffRetry(
            func,
            3, 
            1000, 
            10000, 
            2,
            stopCondition
        );
        if (!result.success) {
            return '0';
        }
        const data = result.data;
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
        const apiEndpoint = this.getTonAPIEndpoint();
        const func = async () => {
            const response = await fetch(`${apiEndpoint}/runGetMethod`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    network: this.networkType,
                    params: {
                        address: jettonMasterAddress,
                        method: 'get_wallet_address',
                        stack: [
                            {
                                type: 'slice',
                                value: base64Cell,
                            },
                        ],
                    }
                })
            });
            const result = await response.json();
            return result;
        }
        const stopCondition = (result: any) => {
            return result?.success;
        }
        const result = await this.exponentialBackoffRetry(
            func,
            3, 
            1000, 
            10000, 
            2,
            stopCondition
        );
        if (!result.success) {
            throw new Error('Failed to get jetton wallet address');
        }
        const data = result.data;
        const cell = this.toncore.Cell.fromBase64(data.stack[0].value);
        const slice = cell.beginParse();
        const address = slice.loadAddress();
        return address.toString({
            bounceable: true,
            testOnly: this.networkType === 'testnet'
        }) as string;
    }

    async estimateNetworkFee(address: string, body: string) {
        const apiEndpoint = this.getTonAPIEndpoint();
        const response = await fetch(`${apiEndpoint}/estimateFee`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                network: this.networkType,
                params: {
                    address: address,
                    body: body,
                    ignore_chksig: false
                }
            })
        });
        const result = await response.json();
        const data = result.data;
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
