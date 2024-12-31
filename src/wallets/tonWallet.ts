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

    getJettonWalletAddress(jettonMasterAddress: string, userAddress: string) {
        const JETTON_WALLET_CODE_BASE64 = 'b5ee9c7201021301000385000114ff00f4a413f4bcf2c80b0102016202030202cb0405001ba0f605da89a1f401f481f481a9a30201ce06070201580a0b02f70831c02497c138007434c0c05c6c2544d7c0fc07783e903e900c7e800c5c75c87e800c7e800c1cea6d0000b4c7c076cf16cc8d0d0d09208403e29fa96ea68c1b088d978c4408fc06b809208405e351466ea6cc1b08978c840910c03c06f80dd6cda0841657c1ef2ea7c09c6c3cb4b01408eebcb8b1807c073817c160080900113e910c30003cb85360005c804ff833206e953080b1f833de206ef2d29ad0d30731d3ffd3fff404d307d430d0fa00fa00fa00fa00fa00fa00300008840ff2f00201580c0d020148111201f70174cfc0407e803e90087c007b51343e803e903e903534544da8548b31c17cb8b04ab0bffcb8b0950d109c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c032481c007e401d3232c084b281f2fff274013e903d010c7e800835d270803cb8b13220060072c15401f3c59c3e809dc072dae00e02f33b51343e803e903e90353442b4cfc0407e80145468017e903e9014d771c1551cdbdc150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c0325c007e401d3232c084b281f2fff2741403f1c147ac7cb8b0c33e801472a84a6d8206685401e8062849a49b1578c34975c2c070c00870802c200f1000aa13ccc88210178d4519580a02cb1fcb3f5007fa0222cf165006cf1625fa025003cf16c95005cc2391729171e25007a813a008aa005004a017a014bcf2e2c501c98040fb004300c85004fa0258cf1601cf16ccc9ed5400725269a018a1c882107362d09c2902cb1fcb3f5007fa025004cf165007cf16c9c8801001cb0527cf165004fa027101cb6a13ccc971fb0050421300748e23c8801001cb055006cf165005fa027001cb6a8210d53276db580502cb1fcb3fc972fb00925b33e24003c85004fa0258cf1601cf16ccc9ed5400eb3b51343e803e903e9035344174cfc0407e800870803cb8b0be903d01007434e7f440745458a8549631c17cb8b049b0bffcb8b0b220841ef765f7960100b2c7f2cfc07e8088f3c58073c584f2e7f27220060072c148f3c59c3e809c4072dab33260103ec01004f214013e809633c58073c5b3327b55200087200835c87b51343e803e903e9035344134c7c06103c8608405e351466e80a0841ef765f7ae84ac7cbd34cfc04c3e800c04e81408f214013e809633c58073c5b3327b5520';
        function base64ToUint8Array(base64: string): Uint8Array {
            const binaryString = atob(base64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes;
        }
        const JETTON_WALLET_CODE = this.toncore.Cell.fromBoc(base64ToUint8Array(JETTON_WALLET_CODE_BASE64))[0];
        const JETTON_MASTER_ADDRESS = this.toncore.Address.parse(jettonMasterAddress);
        const USER_ADDRESS = this.toncore.Address.parse(userAddress);

        const jettonWalletStateInit = this.toncore.beginCell().store(this.toncore.storeStateInit({
            code: JETTON_WALLET_CODE,
            data: this.toncore.beginCell()
                .storeCoins(0)
                .storeAddress(USER_ADDRESS)
                .storeAddress(JETTON_MASTER_ADDRESS)
                .storeRef(JETTON_WALLET_CODE)
                .endCell()
        }))
            .endCell();
        const userJettonWalletAddress = new this.toncore.Address(0, jettonWalletStateInit.hash());
        return userJettonWalletAddress.toString();
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
            const jettonAddress = this.getJettonWalletAddress(token.address, to);
            console.log('Jetton address:', jettonAddress);
            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
                messages: [
                    {
                        address: jettonAddress,
                        amount: Utils.toDecimals('0.1', 9),
                        payload: payload
                    }
                ]
            };
            receipt = await this.sendTransaction(transaction);
        }
        return receipt;
    }
}
