import { RequireJS } from "@ijstech/components";
import { Utils } from "@ijstech/eth-wallet";
import { ITokenObject } from "@scom/scom-token-list";

export class TonWallet {
    private toncore: any;
    private tonConnectUI: any;
    private _isWalletConnected: boolean = false;
    private _onTonWalletStatusChanged: (isConnected: boolean) => void;

    constructor(
        moduleDir: string, 
        onTonWalletStatusChanged: (isConnected: boolean) => void
    ) {
        this.loadLib(moduleDir);
        this._onTonWalletStatusChanged = onTonWalletStatusChanged;
        this.initWallet();
    }

    isWalletConnected() {
        return this._isWalletConnected;
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

    async initWallet() {
        try {
            let UI = window['TON_CONNECT_UI'];
            if (!this.tonConnectUI) {
                this.tonConnectUI = new UI.TonConnectUI({
                    manifestUrl: 'https://ton.noto.fan/tonconnect/manifest.json',
                    buttonRootId: 'pnlHeader'
                });
            }
            this.tonConnectUI.connectionRestored.then(async (restored: boolean) => {
                this._isWalletConnected = this.tonConnectUI.connected;
                if (this._onTonWalletStatusChanged) this._onTonWalletStatusChanged(this._isWalletConnected);
            });
            this.tonConnectUI.onStatusChange((walletAndwalletInfo) => {
                this._isWalletConnected = !!walletAndwalletInfo;
                if (this._onTonWalletStatusChanged) this._onTonWalletStatusChanged(this._isWalletConnected);
            });
        } catch (err) {
            // alert(err)
            console.log(err);
        }
    }

    async connectWallet() {
        try {
            await this.tonConnectUI.openModal();
        }
        catch (err) {
            alert(err)
        }
    }

    async sendTransaction(txData: any) {
        return await this.tonConnectUI.sendTransaction(txData);
    }

    constructPayloadForTokenTransfer(to: string, token: ITokenObject, amount: number) {
        const body = this.toncore.beginCell()
            .storeUint(0, 32) 
            .storeAddress(to)
            .storeCoins(Utils.toDecimals(amount, token.decimals)) 
            .endCell();
        const payload = body.toBoc().toString("base64");
        return payload;
    }

    getWalletAddress() {    
        return this.tonConnectUI.account;
    }

    async getTonBalance() {
        try {
            const address = this.tonConnectUI.account;
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

    async transferToken(
        to: string, 
        token: ITokenObject, 
        amount: number, 
        callback?: (error: Error, receipt?: string) => Promise<void>,
        confirmationCallback?: (receipt: any) => Promise<void>
    ) {
        let receipt: any;
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
            receipt = await this.sendTransaction(transaction);
        }
        else {
            const payload = this.constructPayloadForTokenTransfer(to, token, amount);
            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
                messages: [
                    {
                        address: token.address,
                        amount: 0,
                        payload: payload
                    }
                ]
            };
            receipt = await this.sendTransaction(transaction);
        }
        return receipt;
    }
}
