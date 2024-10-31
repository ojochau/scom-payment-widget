import { Module, Container, customElements, ControlElement, Styles, Label, FormatUtils, StackLayout, Image, Button, application, Icon, RequireJS } from '@ijstech/components';
import { INetworkConfig, IPaymentInfo, IPaymentStatus, PaymentProvider } from '../interface';
import assets from '../assets';
import configData from '../data';
import { ITokenObject, assets as tokenAssets, tokenStore } from '@scom/scom-token-list';
import { isClientWalletConnected, State, PaymentProviders } from '../store';
import { Constants, IEventBusRegistry, IRpcWallet, Wallet } from '@ijstech/eth-wallet';
import { IWalletPlugin } from '@scom/scom-wallet-modal';
import ScomDappContainer from '@scom/scom-dapp-container';
import { textCenterStyle } from './index.css';
const path = application.currentModuleDir;
const Theme = Styles.Theme.ThemeVars;

interface ScomPaymentWidgetWalletPaymentElement extends ControlElement {
    wallets?: IWalletPlugin[];
    networks?: INetworkConfig[];
    tokens?: ITokenObject[];
    payment?: IPaymentInfo;
    onBack?: () => void;
    onPaid?: (paymentStatus: IPaymentStatus) => void;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['scom-payment-widget--wallet-payment']: ScomPaymentWidgetWalletPaymentElement;
        }
    }
}

@customElements('scom-payment-widget--wallet-payment')
export class WalletPayment extends Module {
    private pnlAmount: StackLayout;
    private pnlPayAmount: StackLayout;
    private lbItem: Label;
    private lbAmount: Label;
    private lbPayItem: Label;
    private lbPayAmount: Label;
    private imgPayToken: Image;
    private btnTonWallet: Button;
    private pnlNetwork: StackLayout;
    private pnlWallet: StackLayout;
    private pnlTokens: StackLayout;
    private pnlTokenItems: StackLayout;
    private pnlPayDetail: StackLayout;
    private imgToken: Image;
    private lbToAddress: Label;
    private lbAmountToPay: Label;
    private lbUSD: Label;
    private btnBack: Button;
    private btnPay: Button;
    private imgWallet: Image;
    private lbWallet: Label;
    private imgCurrentWallet: Image;
    private lbCurrentAddress: Label;
    private imgCurrentNetwork: Image;
    private lbCurrentNetwork: Label;
    private _payment: IPaymentInfo;
    private _wallets: IWalletPlugin[] = [];
    private _networks: INetworkConfig[] = [];
    private _tokens: ITokenObject[] = [];
    private _state: State;
    private rpcWalletEvents: IEventBusRegistry[] = [];
    private isInitialized: boolean;
    private isWalletInitialized: boolean;
    private isToPay: boolean;
    private copyAddressTimer: any;
    private copyAmountTimer: any;
    private iconCopyAddress: Icon;
    private iconCopyAmount: Icon;
    private tonConnectUI: any;
    private tonWeb: any;
    private isTonWalletConnected: boolean;

    public onBack: () => void;
    public onPaid: (paymentStatus: IPaymentStatus) => void;

    constructor(parent?: Container, options?: ScomPaymentWidgetWalletPaymentElement) {
        super(parent, options);
    }

    get payment() {
        return this._payment;
    }

    set payment(value: IPaymentInfo) {
        this._payment = value;
        this.updateAmount();
    }

    get state() {
        return this._state;
    }

    set state(value: State) {
        this._state = value;
    }

    get wallets() {
        return this._wallets ?? configData.defaultData.wallets;
    }

    set wallets(value: IWalletPlugin[]) {
        this._wallets = value;
    }

    get networks() {
        return this._networks ?? configData.defaultData.networks;
    }

    set networks(value: INetworkConfig[]) {
        this._networks = value;
    }

    get tokens() {
        return this._tokens ?? configData.defaultData.tokens;
    }

    set tokens(value: ITokenObject[]) {
        this._tokens = value;
    }

    get rpcWallet(): IRpcWallet {
        return this.state.getRpcWallet();
    }

    async onStartPayment(payment: IPaymentInfo) {
        this.payment = payment;
        if (!this.pnlAmount) return;
        this.isInitialized = true;
        if (this.payment.provider === PaymentProvider.Metamask) {
            await this.initWallet();
        } else if (this.payment.provider === PaymentProvider.TonWallet) {
            this.initTonWallet();
        }
        this.showFirstScreen();
        this.updateAmount();
        this.checkWalletStatus();
    }

    private showFirstScreen() {
        this.pnlAmount.visible = true;
        this.pnlPayAmount.visible = false;
        this.pnlTokenItems.visible = true;
        this.pnlPayDetail.visible = false;
        this.btnPay.visible = false;
        this.btnBack.width = '100%';
        this.isToPay = false;
    }

    private removeRpcWalletEvents() {
        const rpcWallet = this.rpcWallet;
        for (let event of this.rpcWalletEvents) {
            rpcWallet.unregisterWalletEvent(event);
        }
        this.rpcWalletEvents = [];
    }

    private async resetRpcWallet() {
        this.removeRpcWalletEvents();
        await this.state.initRpcWallet(configData.defaultData.defaultChainId);
        const rpcWallet = this.rpcWallet;
        const chainChangedEvent = rpcWallet.registerWalletEvent(this, Constants.RpcWalletEvent.ChainChanged, async (chainId: number) => {
            this.showFirstScreen();
            this.checkWalletStatus();
        });
        const connectedEvent = rpcWallet.registerWalletEvent(this, Constants.RpcWalletEvent.Connected, async (connected: boolean) => {
            this.checkWalletStatus();
        });
        this.rpcWalletEvents.push(chainChangedEvent, connectedEvent);
        this.updateDappContainer();
    }

    private async initWallet() {
        if (this.isWalletInitialized) return;
        try {
            await Wallet.getClientInstance().init();
            await this.resetRpcWallet();
            await this.rpcWallet.init();
            this.isWalletInitialized = true;
        } catch (err) {
            console.log(err);
        }
    }

    private initTonWallet() {
        try {
            if (this.tonConnectUI) return;
            let UI = window['TON_CONNECT_UI'];
            this.tonConnectUI = new UI.TonConnectUI({
                manifestUrl: 'https://ton.noto.fan/tonconnect/manifest.json',
                buttonRootId: 'btnTonWallet'
            });
            this.tonConnectUI.connectionRestored.then(async (restored: boolean) => {
                this.isTonWalletConnected = this.tonConnectUI.connected;
                this.checkWalletStatus();
            });
            this.tonConnectUI.onStatusChange((walletAndwalletInfo) => {
                this.isTonWalletConnected = !!walletAndwalletInfo;
                this.checkWalletStatus();
            });
        } catch (err) {
            console.log(err);
        }
    }

    private async connectTonWallet() {
        try {
            await this.tonConnectUI.openModal();
        }
        catch (err) {
            console.log(err);
        }
    }

    private async loadTonWeb() {
        if (this.tonWeb) return;
        const self = this;
        const moduleDir = this['currentModuleDir'] || path;
        return new Promise<void>((resolve, reject) => {
            RequireJS.config({
                baseUrl: `${moduleDir}/lib`,
                paths: {
                    'tonweb': 'tonweb'
                }
            })
            RequireJS.require(['tonweb'], function (TonWeb: any) {
                // self.tonWeb = new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC'));
                self.tonWeb = new TonWeb();
                resolve();
            });
        })
    }

    private async loadTonConnectUI() {
        if (window['TON_CONNECT_UI']) return;
        const moduleDir = this['currentModuleDir'] || path;
        return new Promise<void>((resolve, reject) => {
            RequireJS.config({
                baseUrl: `${moduleDir}/lib`,
                paths: {
                    'tonconnect-ui': 'tonconnect-ui'
                }
            })
            RequireJS.require(['tonconnect-ui'], function (TonConnectUI: any) {
                window['TON_CONNECT_UI'] = TonConnectUI;
                resolve();
            });
        })
    }

    private async loadLib() {
        const promises: Promise<void>[] = [];
        promises.push(this.loadTonConnectUI())
        promises.push(this.loadTonWeb())
        await Promise.all(promises);
    }

    private updateAmount() {
        if (this.lbAmount && this.payment) {
            const { amount, currency } = this.payment;
            const title = this.payment.title || '';
            if (this.lbItem.caption !== title) this.lbItem.caption = title;
            if (this.lbPayItem.caption !== title) this.lbPayItem.caption = title;
            const formattedAmount = `${FormatUtils.formatNumber(amount || 0, { decimalFigures: 2 })} ${currency || 'USD'}`;
            if (this.lbAmount.caption !== formattedAmount) this.lbAmount.caption = formattedAmount;
            if (this.lbPayAmount.caption !== formattedAmount) this.lbPayAmount.caption = formattedAmount;
        }
    }

    private async checkWalletStatus() {
        const paymentProvider = this.payment.provider;
        let isConnected: boolean;
        if (paymentProvider === PaymentProvider.Metamask) {
            isConnected = isClientWalletConnected();
        } else if (paymentProvider === PaymentProvider.TonWallet) {
            isConnected = this.isTonWalletConnected;
        }
        this.pnlWallet.visible = !isConnected;
        const provider = PaymentProviders.find(v => v.provider === this.payment.provider);
        if (isConnected) {
            if (paymentProvider === PaymentProvider.Metamask) {
                const wallet = this.state.getRpcWallet();
                const address = wallet.address;
                const chainId = wallet.chainId;
                const network = this.state.getNetworkInfo(chainId);
                if (provider) {
                    this.imgCurrentWallet.url = assets.fullPath(`img/${provider.image}`);
                    this.lbCurrentAddress.caption = address.substr(0, 6) + '...' + address.substr(-4);
                    this.imgCurrentNetwork.url = network.image;
                    this.lbCurrentNetwork.caption = network.chainName;
                    this.pnlNetwork.visible = true;
                }
                await this.renderErcTokens(chainId);
            } else if (paymentProvider === PaymentProvider.TonWallet) {
                const account = this.tonConnectUI.account;
                const address = account.address;
                this.pnlNetwork.visible = false;
                if (provider) {
                    this.imgCurrentWallet.url = assets.fullPath(`img/${provider.image}`);
                    this.lbCurrentAddress.caption = address.substr(0, 6) + '...' + address.substr(-4);
                }
                await this.renderTonToken();
            }
        } else if (provider) {
            this.imgWallet.url = assets.fullPath(`img/${provider.image}`);
            this.lbWallet.caption = `Connect to ${provider.provider}`;
        }
        this.pnlTokens.visible = isConnected;
    }

    private async updateTokenBalances(tokens?: ITokenObject[]) {
        const arr = (tokens || this.tokens).reduce((acc, token) => {
            const { chainId } = token;
            if (!acc[chainId]) {
                acc[chainId] = [];
            }
            acc[chainId].push(token);
            return acc;
        }, {});
        let promises: Promise<any>[] = [];
        for (const chainId in arr) {
            const tokens = arr[chainId];
            promises.push(tokenStore.updateTokenBalancesByChainId(Number(chainId), tokens));
        }
        await Promise.all(promises);
    }

    private async renderErcTokens(chainId: number) {
        const tokens = this.tokens.filter(v => v.chainId === chainId);
        await this.updateTokenBalances(tokens);
        const network = this.state.getNetworkInfo(chainId);
        const nodeItems: HTMLElement[] = [];
        for (const token of tokens) {
            const balances = tokenStore.getTokenBalancesByChainId(chainId) || {};
            const tokenBalance = balances[token.address?.toLowerCase() || token.symbol] || 0;
            const formattedBalance = FormatUtils.formatNumber(tokenBalance, { decimalFigures: 2 });
            nodeItems.push(
                <i-stack
                    direction="horizontal"
                    justifyContent="space-between"
                    alignItems="center"
                    wrap="wrap"
                    gap="0.5rem"
                    width="100%"
                    border={{ width: 1, style: 'solid', color: Theme.divider, radius: 8 }}
                    padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}
                    cursor="pointer"
                    onClick={() => this.handleSelectToken(token)}
                >
                    <i-stack direction="horizontal" alignItems="center" gap="0.75rem">
                        <i-image width={20} height={20} minWidth={20} url={tokenAssets.tokenPath(token, chainId)} />
                        <i-stack direction="vertical" gap="0.25rem">
                            <i-label caption={token.name || token.symbol} font={{ bold: true, color: Theme.text.primary }} />
                            <i-label caption={network.chainName || ''} font={{ size: '0.75rem', color: Theme.text.primary }} />
                        </i-stack>
                    </i-stack>
                    <i-stack direction="vertical" gap="0.25rem">
                        <i-label caption={`${formattedBalance} ${token.symbol}`} font={{ bold: true, color: Theme.text.primary }} />
                    </i-stack>
                </i-stack>
            );
        }
        this.pnlTokenItems.clearInnerHTML();
        this.pnlTokenItems.append(...nodeItems);
    }

    private async getTonBalance() {
        const account = this.tonConnectUI.account;
        const balance = await this.tonWeb.getBalance(account.address);
        return this.tonWeb.utils.fromNano(balance);
    }

    private async renderTonToken() {
        const tonToken = {
            chainId: undefined,
            name: 'Toncoin',
            symbol: 'TON',
            decimals: 18
        }
        const balance = await this.getTonBalance();
        const formattedBalance = FormatUtils.formatNumber(balance, { decimalFigures: 2 });
        this.pnlTokenItems.clearInnerHTML();
        this.pnlTokenItems.appendChild(<i-stack
            direction="horizontal"
            justifyContent="space-between"
            alignItems="center"
            wrap="wrap"
            gap="0.5rem"
            width="100%"
            border={{ width: 1, style: 'solid', color: Theme.divider, radius: 8 }}
            padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}
            cursor="pointer"
            onClick={() => this.handleSelectToken(tonToken, true)}
        >
            <i-stack direction="horizontal" alignItems="center" gap="0.75rem">
                <i-image width={20} height={20} minWidth={20} url={assets.fullPath('img/ton.png')} />
                <i-stack direction="vertical" gap="0.25rem">
                    <i-label caption={tonToken.name} font={{ bold: true, color: Theme.text.primary }} />
                    <i-label caption="Ton" font={{ size: '0.75rem', color: Theme.text.primary }} />
                </i-stack>
            </i-stack>
            <i-stack direction="vertical" gap="0.25rem">
                <i-label caption={`${formattedBalance} ${tonToken.symbol}`} font={{ bold: true, color: Theme.text.primary }} />
            </i-stack>
        </i-stack>);
    }

    private updateDappContainer() {
        const dappContainer = this.closest('i-scom-dapp-container') as ScomDappContainer;
        const containerData = {
            wallets: this.wallets,
            networks: this.networks,
            showHeader: true,
            rpcWalletId: this.state.getRpcWallet()?.instanceId
        }
        dappContainer.setData(containerData)
    }

    private handleConnectWallet() {
        if (this.payment.provider === PaymentProvider.Metamask) {
            const dappContainer = this.closest('i-scom-dapp-container');
            const header = dappContainer.querySelector('dapp-container-header');
            const btnConnectWallet = header.querySelector('#btnConnectWallet') as Button;
            btnConnectWallet.click();
        } else if (this.payment.provider === PaymentProvider.TonWallet) {
            this.connectTonWallet();
        }
    }

    private handleShowNetworks() {
        const dappContainer = this.closest('i-scom-dapp-container');
        const header = dappContainer.querySelector('dapp-container-header');
        const btnNetwork = header.querySelector('#btnNetwork') as Button;
        btnNetwork.click();
    }

    private handleSelectToken(token: ITokenObject, isTon?: boolean) {
        this.pnlAmount.visible = false;
        this.pnlTokenItems.visible = false;
        this.pnlPayAmount.visible = true;
        this.pnlPayDetail.visible = true;
        this.btnPay.visible = true;
        this.btnBack.width = 'calc(50% - 1rem)';
        this.isToPay = true;
        const tokenImg = isTon ? assets.fullPath('img/ton.png') : tokenAssets.tokenPath(token, token.chainId);
        this.imgToken.url = tokenImg;
        const { address, amount, currency } = this.payment;
        const toAddress = address || '';
        this.lbToAddress.caption = toAddress.substr(0, 12) + '...' + toAddress.substr(-12);
        const formattedAmount = FormatUtils.formatNumber(amount || 0, { decimalFigures: 2 });
        this.lbAmountToPay.caption = `${formattedAmount} ${token.symbol}`;
        this.lbUSD.caption = `${formattedAmount} ${currency || 'USD'}`;
        this.lbUSD.visible = !isTon;
        this.imgPayToken.url = tokenImg;
    }

    private async handleCopyAddress() {
        try {
            await application.copyToClipboard(this.payment.address);
            this.iconCopyAddress.name = 'check';
            this.iconCopyAddress.fill = Theme.colors.success.main;
            if (this.copyAddressTimer) clearTimeout(this.copyAddressTimer);
            this.copyAddressTimer = setTimeout(() => {
                this.iconCopyAddress.name = 'copy';
                this.iconCopyAddress.fill = Theme.text.primary;
            }, 500)
        } catch { }
    }

    private async handleCopyAmount() {
        try {
            await application.copyToClipboard(this.payment.amount.toString());
            this.iconCopyAmount.name = 'check';
            this.iconCopyAmount.fill = Theme.colors.success.main;
            if (this.copyAmountTimer) clearTimeout(this.copyAmountTimer);
            this.copyAmountTimer = setTimeout(() => {
                this.iconCopyAmount.name = 'copy';
                this.iconCopyAmount.fill = Theme.text.primary;
            }, 500)
        } catch { }
    }

    private handlePay() {
        if (this.onPaid) {
            let address = '';
            if (this.payment.provider === PaymentProvider.Metamask) {
                const wallet = Wallet.getClientInstance();
                address = wallet.address;
            } else if (this.payment.provider === PaymentProvider.TonWallet) {
                const account = this.tonConnectUI.account;
                address = account.address;
            }
            this.onPaid({ status: 'pending', provider: this.payment.provider, receipt: '0x00000000000000000000000000000', ownerAddress: address });
            setTimeout(() => {
                this.onPaid({ status: 'complete', provider: this.payment.provider, receipt: '0x00000000000000000000000000000', ownerAddress: address });
            }, 3000)
        }
    }

    private handleBack() {
        if (this.isToPay) {
            this.showFirstScreen();
            return;
        }
        if (this.onBack) this.onBack();
    }

    async init() {
        super.init();
        this.loadLib();
        this.onBack = this.getAttribute('onBack', true) || this.onBack;
        this.onPaid = this.getAttribute('onPaid', true) || this.onPaid;
        const state = this.getAttribute('state', true);
        if (state) {
            this.state = state;
        }
        const payment = this.getAttribute('payment', true);
        if (payment) {
            this.payment = payment;
        }
        const tokens = this.getAttribute('tokens', true);
        if (tokens) {
            this.tokens = tokens;
        }
        if (this.payment && !this.isInitialized) {
            this.onStartPayment(this.payment);
        }
    }

    render() {
        return <i-stack direction="vertical" alignItems="center" height="100%">
            <i-stack
                direction="vertical"
                alignItems="center"
                width="100%"
                minHeight={60}
                margin={{ bottom: '1rem' }}
            >
                <i-stack
                    id="pnlAmount"
                    direction="vertical"
                    gap="0.5rem"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    minHeight={85}
                    padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}
                    background={{ color: Theme.colors.primary.main }}
                >
                    <i-label id="lbItem" class={textCenterStyle} font={{ size: '0.875rem', color: Theme.text.primary, bold: true }} wordBreak="break-word" />
                    <i-label caption="Amount to pay" font={{ size: '0.675rem', bold: true, transform: 'uppercase', color: Theme.text.primary }} />
                    <i-label id="lbAmount" font={{ size: '0.875rem', color: Theme.text.primary, bold: true }} />
                </i-stack>
                <i-stack
                    id="pnlPayAmount"
                    visible={false}
                    direction="vertical"
                    gap="0.5rem"
                    width="100%"
                    minHeight={85}
                    padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}
                    border={{ bottom: { style: 'solid', width: 1, color: Theme.divider } }}
                >
                    <i-label id="lbPayItem" font={{ size: '1rem', color: Theme.text.primary, bold: true }} wordBreak="break-word" />
                    <i-stack
                        direction="horizontal"
                        gap="0.25rem"
                        alignItems="center"
                        width="100%"
                    >
                        <i-image id="imgPayToken" width={20} height={20} minWidth={20} display="flex" />
                        <i-label id="lbPayAmount" font={{ size: '1rem', color: Theme.text.primary, bold: true }} />
                    </i-stack>
                </i-stack>
            </i-stack>
            <i-stack direction="vertical" gap="1.5rem" width="100%" height="100%" alignItems="center" padding={{ top: '1rem', bottom: '1rem' }}>
                <i-stack id="pnlWallet" visible={false} direction="vertical" gap="2rem" width="100%" height="100%" alignItems="center" justifyContent="center" padding={{ left: '1rem', right: '1rem' }}>
                    <i-image id="imgWallet" width={64} height={64} />
                    <i-label id="lbWallet" font={{ size: '0.825rem', bold: true }} />
                    <i-button
                        caption="Connect Wallet"
                        width="100%"
                        maxWidth={180}
                        padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
                        font={{ size: '1rem', color: Theme.colors.primary.contrastText }}
                        background={{ color: Theme.colors.primary.main }}
                        border={{ radius: 12 }}
                        onClick={this.handleConnectWallet}
                    />
                    <i-button
                        caption="Back"
                        width="100%"
                        maxWidth={180}
                        padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
                        font={{ size: '1rem', color: Theme.colors.secondary.contrastText }}
                        background={{ color: Theme.colors.secondary.main }}
                        border={{ radius: 12 }}
                        onClick={this.handleBack}
                    />
                </i-stack>
                <i-stack id="pnlTokens" visible={false} direction="vertical" gap="1rem" justifyContent="center" alignItems="center" height="100%" width="100%">
                    <i-stack direction="horizontal" justifyContent="space-between" alignItems="center" gap="1rem" width="100%" wrap="wrap" margin={{ bottom: '0.5rem' }} padding={{ left: '1rem', right: '1rem' }}>
                        <i-stack
                            direction="horizontal"
                            gap="0.5rem"
                            alignItems="center"
                            padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}
                            border={{ style: 'solid', width: 1, color: Theme.divider, radius: 8 }}
                        >
                            <i-image id="imgCurrentWallet" width={24} height={24} minWidth={24} />
                            <i-label id="lbCurrentAddress" />
                        </i-stack>
                        <i-stack
                            id="pnlNetwork"
                            direction="horizontal"
                            gap="0.5rem"
                            alignItems="center"
                            padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}
                            border={{ style: 'solid', width: 1, color: Theme.divider, radius: 8 }}
                            cursor="pointer"
                            width="fit-content"
                            onClick={this.handleShowNetworks}
                        >
                            <i-image id="imgCurrentNetwork" width={24} height={24} minWidth={24} />
                            <i-label id="lbCurrentNetwork" />
                        </i-stack>
                    </i-stack>
                    <i-stack id="pnlTokenItems" direction="vertical" gap="1rem" width="100%" height="100%" minHeight={100} maxHeight={240} overflow="auto" padding={{ left: '1rem', right: '1rem' }} />
                    <i-stack id="pnlPayDetail" visible={false} direction="vertical" gap="0.25rem" width="100%" height="100%" alignItems="center" padding={{ left: '1rem', right: '1rem' }}>
                        <i-label caption="Paid to address" />
                        <i-stack
                            direction="horizontal"
                            alignItems="center"
                            width="100%"
                            margin={{ bottom: '1rem' }}
                            border={{ radius: 8 }}
                            background={{ color: Theme.input.background }}
                            overflow="hidden"
                        >
                            <i-stack
                                direction="horizontal"
                                gap="0.5rem"
                                alignItems="center"
                                width="100%"
                                padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}
                            >
                                <i-image id="imgToken" width={16} height={16} minWidth={16} display="flex" />
                                <i-label id="lbToAddress" wordBreak="break-all" font={{ color: Theme.input.fontColor }} />
                            </i-stack>
                            <i-stack
                                direction="horizontal"
                                width={32}
                                minWidth={32}
                                height="100%"
                                alignItems="center"
                                justifyContent="center"
                                cursor="pointer"
                                margin={{ left: 'auto' }}
                                background={{ color: Theme.colors.primary.main }}
                                onClick={this.handleCopyAddress}
                            >
                                <i-icon id="iconCopyAddress" name="copy" width={16} height={16} cursor="pointer" fill={Theme.text.primary} />
                            </i-stack>
                        </i-stack>
                        <i-stack
                            direction="horizontal"
                            alignItems="center"
                            width="100%"
                            border={{ radius: 8 }}
                            background={{ color: Theme.input.background }}
                            overflow="hidden"
                        >
                            <i-stack
                                direction="vertical"
                                gap="0.5rem"
                                justifyContent="center"
                                alignItems="center"
                                width="100%"
                                padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}
                            >
                                <i-label caption="Amount to pay" font={{ size: '0.75rem', transform: 'uppercase', color: Theme.input.fontColor }} />
                                <i-label id="lbAmountToPay" wordBreak="break-all" font={{ size: '0.875rem', color: Theme.colors.primary.main, bold: true }} />
                                <i-label id="lbUSD" wordBreak="break-all" font={{ size: '0.75rem', color: Theme.colors.primary.main }} />
                            </i-stack>
                            <i-stack
                                direction="horizontal"
                                width={32}
                                minWidth={32}
                                height="100%"
                                alignItems="center"
                                justifyContent="center"
                                cursor="pointer"
                                margin={{ left: 'auto' }}
                                background={{ color: Theme.colors.primary.main }}
                                onClick={this.handleCopyAmount}
                            >
                                <i-icon id="iconCopyAmount" name="copy" width={16} height={16} fill={Theme.text.primary} />
                            </i-stack>
                        </i-stack>
                    </i-stack>
                    <i-stack direction="horizontal" width="100%" alignItems="center" justifyContent="center" gap="1rem" wrap="wrap-reverse" padding={{ left: '1rem', right: '1rem' }}>
                        <i-button
                            id="btnBack"
                            caption="Back"
                            width="100%"
                            maxWidth={180}
                            minWidth={90}
                            padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
                            font={{ size: '1rem', color: Theme.colors.secondary.contrastText }}
                            background={{ color: Theme.colors.secondary.main }}
                            border={{ radius: 12 }}
                            onClick={this.handleBack}
                        />
                        <i-button
                            id="btnPay"
                            visible={false}
                            caption="Pay"
                            width="calc(50% - 1rem)"
                            maxWidth={180}
                            minWidth={90}
                            padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
                            font={{ size: '1rem', color: Theme.colors.primary.contrastText }}
                            background={{ color: Theme.colors.primary.main }}
                            border={{ radius: 12 }}
                            onClick={this.handlePay}
                        />
                    </i-stack>
                </i-stack>
            </i-stack>
            <i-button id="btnTonWallet" visible={false} />
        </i-stack>
    }
}