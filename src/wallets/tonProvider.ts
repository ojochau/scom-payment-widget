import {} from '@ijstech/eth-contract';
import { IClientProviderOptions, IClientSideProvider, IClientSideProviderEvents, IConnectWalletEventPayload, Wallet, Constants, EventBus } from '@ijstech/eth-wallet';
import {application} from '@ijstech/components';
let moduleDir = application.currentModuleDir;

function fullPath(path: string): string{
    if (path.indexOf('://') > 0)
        return path
    return `${moduleDir}/${path}`
}

export default class TonWalletProvider implements IClientSideProvider {
    protected _events?: IClientSideProviderEvents;
    protected _options?: IClientProviderOptions;
    protected _isConnected: boolean = false;
    protected _name: string;
    protected _image: string;
    protected _selectedAddress: string;
    public provider: any;
    public tonConnectUI: any;
    public onAccountChanged: (account: string) => void;
    public onChainChanged: (chainId: string) => void;
    public onConnect: (connectInfo: any) => void;
    public onDisconnect: (error: any) => void;

    constructor(events?: IClientSideProviderEvents, options?: IClientProviderOptions) {
        this._events = events;
        this._options = options;
        if (this._options) {
            if (this._options.name) {
                this._name = this._options.name;
            }
            if (this._options.image) {
                this._image = this._options.image;
            }	
        }
    };
    get name() {
        return this._name;
    };
    get displayName() {
        return 'TON Wallet';
    };
    get image() {
        return '';
    };
    installed() {
        return true;
    };
    get events() {
        return this._events;
    };
    get options() {
        return this._options;
    };
    get selectedAddress() {
        return this._selectedAddress;
    };
    protected initEvents() {
        try {
            this.provider = window['TON_CONNECT_UI'];
            if (!this.tonConnectUI) {
                this.tonConnectUI = new this.provider.TonConnectUI({
                    manifestUrl: 'https://ton.noto.fan/tonconnect/manifest.json',
                    buttonRootId: 'btnTonWallet'
                });
                this.tonConnectUI.connectionRestored.then(async (restored: boolean) => {
                    const account = this.tonConnectUI.account;
                    this._isConnected = this.tonConnectUI.connected;
                    this.onAccountChanged(account);
                });
                this.tonConnectUI.onStatusChange((walletAndwalletInfo) => {
                    const account = this.tonConnectUI.account;
                    this._isConnected = this.tonConnectUI.connected;
                    this.onAccountChanged(account);
                });
            }
        } catch (err) {
            // alert(err)
            console.log(err);
        }
    };
    async connect(eventPayload?: IConnectWalletEventPayload) {
        if (this._events) {
            this.onAccountChanged = this._events.onAccountChanged;
            this.onConnect = this._events.onConnect;
            this.onDisconnect = this._events.onDisconnect;
        }
        this.initEvents();
        if (this.tonConnectUI.connected) {
            if (this.onAccountChanged) this.onAccountChanged(this.tonConnectUI.account);
        }
        else {
            try {
                await this.tonConnectUI.openModal();
            }
            catch (err) {
                console.log(err);
            }
        }
    };
    async disconnect() {
        await this.tonConnectUI.disconnect();
        this._isConnected = false;
    };
    isConnected() {
        return this.tonConnectUI?.connected;
    };
    switchNetwork(chainId: number): Promise<boolean> {
        throw new Error('Method not implemented.');
    };
    encrypt(key: string): Promise<string>{
        throw new Error('Method not implemented.');
    };
    decrypt(data: string): Promise<string>{
        throw new Error('Method not implemented.');
    };
}