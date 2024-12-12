import { Module, Container, customElements, ControlElement, Styles, Label, FormatUtils, StackLayout, Image, Button, application, Icon, RequireJS } from '@ijstech/components';
import { IPaymentStatus, PaymentProvider } from '../interface';
import assets from '../assets';
import configData from '../defaultData';
import { ITokenObject, assets as tokenAssets, tokenStore } from '@scom/scom-token-list';
import { isClientWalletConnected, State, PaymentProviders } from '../store';
import { Constants, IEventBusRegistry, IRpcWallet, Wallet } from '@ijstech/eth-wallet';
import ScomDappContainer, { DappContainerHeader } from '@scom/scom-dapp-container';
import { fullWidthButtonStyle, halfWidthButtonStyle } from './index.css';
import { PaymentHeader } from './common/index';
import translations from '../translations.json';
import { Model } from '../model';
const path = application.currentModuleDir;
const Theme = Styles.Theme.ThemeVars;

interface ScomPaymentWidgetWalletPaymentElement extends ControlElement {
    model?: Model;
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
    private pnlPayAmount: StackLayout;
    private header: PaymentHeader;
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
    private _dappContainer: ScomDappContainer;
    private _model: Model;
    private _state: State;
    private rpcWalletEvents: IEventBusRegistry[] = [];
    private isWalletInitialized: boolean;
    private isToPay: boolean;
    private copyAddressTimer: any;
    private copyAmountTimer: any;
    private iconCopyAddress: Icon;
    private iconCopyAmount: Icon;
    private tonConnectUI: any;
    private tonWeb: any;
    private isTonWalletConnected: boolean;
    private provider: PaymentProvider;

    public onBack: () => void;
    public onPaid: (paymentStatus: IPaymentStatus) => void;

    constructor(parent?: Container, options?: ScomPaymentWidgetWalletPaymentElement) {
        super(parent, options);
    }

    get dappContainer() {
        return this._dappContainer;
    }

    set dappContainer(container: ScomDappContainer) {
        this._dappContainer = container;
    }

    get model() {
        return this._model;
    }

    set model(value: Model) {
        this._model = value;
        this.updateAmount();
    }

    get state() {
        return this._state;
    }

    set state(value: State) {
        this._state = value;
    }

    get tokens() {
        return this.model.tokens;
    }

    get wallets() {
        return this.model.wallets;
    }

    get networks() {
        return this.model.networks;
    }

    get rpcWallet(): IRpcWallet {
        return this.state.getRpcWallet();
    }

    async onStartPayment(provider: PaymentProvider) {
        if (!this.header) return;
        this.provider = provider;
        if (provider === PaymentProvider.Metamask) {
            await this.initWallet();
        } else if (provider === PaymentProvider.TonWallet) {
            this.initTonWallet();
        }
        this.showFirstScreen();
        this.updateAmount();
        this.checkWalletStatus();
    }

    private showFirstScreen() {
        this.header.visible = true;
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
        if (this.header && this.model) {
            const { title, currency, totalAmount } = this.model;
            this.header.setHeader(title, currency, totalAmount);
            if (this.lbPayItem.caption !== title) this.lbPayItem.caption = title;
            const formattedAmount = `${FormatUtils.formatNumber(totalAmount, { decimalFigures: 2 })} ${currency}`;
            if (this.lbPayAmount.caption !== formattedAmount) this.lbPayAmount.caption = formattedAmount;
        }
    }

    private async checkWalletStatus() {
        const paymentProvider = this.provider;
        let isConnected: boolean;
        if (paymentProvider === PaymentProvider.Metamask) {
            isConnected = isClientWalletConnected();
        } else if (paymentProvider === PaymentProvider.TonWallet) {
            isConnected = this.isTonWalletConnected;
        }
        this.pnlWallet.visible = !isConnected;
        const provider = PaymentProviders.find(v => v.provider === paymentProvider);
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
        const containerData = {
            wallets: this.wallets,
            networks: this.networks,
            showHeader: true,
            rpcWalletId: this.state.getRpcWallet()?.instanceId
        }
        this.dappContainer.setData(containerData)
    }

    private handleConnectWallet() {
        if (this.provider === PaymentProvider.Metamask) {
            const header = this.dappContainer.querySelector('dapp-container-header') as DappContainerHeader;
            header?.openConnectModal();
        } else if (this.provider === PaymentProvider.TonWallet) {
            this.connectTonWallet();
        }
    }

    private handleShowNetworks() {
        const header = this.dappContainer.querySelector('dapp-container-header') as DappContainerHeader;
        header?.openNetworkModal();
    }

    private handleSelectToken(token: ITokenObject, isTon?: boolean) {
        this.header.visible = false;
        this.pnlTokenItems.visible = false;
        this.pnlPayAmount.visible = true;
        this.pnlPayDetail.visible = true;
        this.btnPay.visible = true;
        this.btnBack.width = 'calc(50% - 1rem)';
        this.isToPay = true;
        const tokenImg = isTon ? assets.fullPath('img/ton.png') : tokenAssets.tokenPath(token, token.chainId);
        this.imgToken.url = tokenImg;
        const { totalAmount, currency, walletAddress } = this.model;
        const toAddress = walletAddress;
        this.lbToAddress.caption = toAddress.substr(0, 12) + '...' + toAddress.substr(-12);
        const formattedAmount = FormatUtils.formatNumber(totalAmount, { decimalFigures: 2 });
        this.lbAmountToPay.caption = `${formattedAmount} ${token.symbol}`;
        this.lbUSD.caption = `${formattedAmount} ${currency || 'USD'}`;
        this.lbUSD.visible = !isTon;
        this.imgPayToken.url = tokenImg;
    }

    private async handleCopyAddress() {
        try {
            await application.copyToClipboard(this.model.walletAddress);
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
            await application.copyToClipboard(this.model.totalAmount.toString());
            this.iconCopyAmount.name = 'check';
            this.iconCopyAmount.fill = Theme.colors.success.main;
            if (this.copyAmountTimer) clearTimeout(this.copyAmountTimer);
            this.copyAmountTimer = setTimeout(() => {
                this.iconCopyAmount.name = 'copy';
                this.iconCopyAmount.fill = Theme.text.primary;
            }, 500)
        } catch { }
    }

    private async handlePay() {
        if (this.onPaid) {
            let address = '';
            if (this.provider === PaymentProvider.Metamask) {
                const wallet = Wallet.getClientInstance();
                address = wallet.address;
                this.model.networkCode = wallet.chainId.toString();
            } else if (this.provider === PaymentProvider.TonWallet) {
                const account = this.tonConnectUI.account;
                address = account.address;
                this.model.networkCode = 'TON';
            }
            await this.model.handlePlaceMarketplaceOrder();
            // TODO - pay with crypto 
            const receipt = '0x00000000000000000000000000000';
            this.model.referenceId = receipt;
            this.onPaid({ status: 'pending', provider: this.provider, receipt, ownerAddress: address });
            setTimeout(async () => {
                await this.model.handlePaymentSuccess();
                this.onPaid({ status: 'complete', provider: this.provider, receipt, ownerAddress: address });
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
        this.i18n.init({ ...translations });
        super.init();
        this.loadLib();
        this.onBack = this.getAttribute('onBack', true) || this.onBack;
        this.onPaid = this.getAttribute('onPaid', true) || this.onPaid;
        const state = this.getAttribute('state', true);
        if (state) {
            this.state = state;
        }
        const model = this.getAttribute('model', true);
        if (model) {
            this.model = model;
        }
    }

    render() {
        return <i-stack direction="vertical" alignItems="center" width="100%">
            <i-stack
                direction="vertical"
                alignItems="center"
                width="100%"
                minHeight={60}
                margin={{ bottom: '1rem' }}
            >
                <scom-payment-widget--header id="header" />
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
                        caption="$connect_wallet"
                        background={{ color: Theme.colors.primary.main }}
                        class={fullWidthButtonStyle}
                        onClick={this.handleConnectWallet}
                    />
                    <i-button
                        caption="$back"
                        background={{ color: Theme.colors.secondary.main }}
                        class={fullWidthButtonStyle}
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
                        <i-label caption="$paid_to_address" />
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
                            caption="$back"
                            minWidth={90}
                            background={{ color: Theme.colors.secondary.main }}
                            class={fullWidthButtonStyle}
                            onClick={this.handleBack}
                        />
                        <i-button
                            id="btnPay"
                            visible={false}
                            caption="$pay"
                            background={{ color: Theme.colors.primary.main }}
                            class={halfWidthButtonStyle}
                            onClick={this.handlePay}
                        />
                    </i-stack>
                </i-stack>
            </i-stack>
            <i-button id="btnTonWallet" visible={false} />
        </i-stack>
    }
}