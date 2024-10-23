import { Module, Container, customElements, ControlElement, Styles, Label, FormatUtils, StackLayout, Image, Button, application, Icon, RequireJS } from '@ijstech/components';
import { INetworkConfig, IPaymentInfo, IPaymentStatus, PaymentProvider } from '../interface';
import assets from '../assets';
import configData from '../data';
import { ITokenObject, assets as tokenAssets, tokenStore } from '@scom/scom-token-list';
import { State, PaymentProviders } from '../store';
import { Wallet } from '@ijstech/eth-wallet';
import { IWalletPlugin } from '@scom/scom-wallet-modal';
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
    private lbAmount: Label;
    private lbPayAmount: Label;
    private imgPayToken: Image;
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
    private payment: IPaymentInfo;
    private _wallets: IWalletPlugin[] = [];
    private _networks: INetworkConfig[] = [];
    private _tokens: ITokenObject[] = [];
    private _state: State;
    private isInitialized: boolean;
    private isWalletConnected: boolean;
    private isToPay: boolean;
    private copyAddressTimer: any;
    private copyAmountTimer: any;
    private iconCopyAddress: Icon;
    private iconCopyAmount: Icon;

    public onBack: () => void;
    public onPaid: (paymentStatus: IPaymentStatus) => void;

    constructor(parent?: Container, options?: ScomPaymentWidgetWalletPaymentElement) {
        super(parent, options);
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

    async onStartPayment(payment: IPaymentInfo) {
        this.payment = payment;
        if (!this.pnlAmount) return;
        this.isInitialized = true;
        if (this.payment.provider === PaymentProvider.Metamask) {
            // TODO
        } else if (this.payment.provider === PaymentProvider.TonWallet) {
            // TODO
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

    private updateAmount() {
        if (this.lbAmount) {
            const amount = FormatUtils.formatNumber(this.payment?.amount || 0, { decimalFigures: 2 });
            this.lbAmount.caption = `${amount} USD`;
            this.lbPayAmount.caption = `${amount} USD`;
        }
    }

    private async checkWalletStatus() {
        const paymentProvider = this.payment.provider;
        let isConnected: boolean = this.isWalletConnected;
        if (paymentProvider === PaymentProvider.Metamask) {
            // TODO
        } else if (paymentProvider === PaymentProvider.TonWallet) {
            // TODO
        }
        this.pnlWallet.visible = !isConnected;
        const provider = PaymentProviders.find(v => v.provider === this.payment.provider);
        if (isConnected) {
            if (paymentProvider === PaymentProvider.Metamask) {
                const address = '0xA81961100920df22CF98703155029822f2F7f033';
                const chainId = 97;
                const network = {
                    image: '/libs/@scom/scom-network-list/img/bscMainnet.svg',
                    chainName: 'BNB Chain Testnet'
                };
                if (provider) {
                    this.imgCurrentWallet.url = assets.fullPath(`img/${provider.image}`);
                    this.lbCurrentAddress.caption = address.substr(0, 6) + '...' + address.substr(-4);
                    this.imgCurrentNetwork.url = network.image;
                    this.lbCurrentNetwork.caption = network.chainName;
                    this.pnlNetwork.visible = true;
                }
                await this.renderTokens(chainId);
            } else if (paymentProvider === PaymentProvider.TonWallet) {
                // TODO
            }
        } else if (provider) {
            this.imgWallet.url = assets.fullPath(`img/${provider.image}`);
            this.lbWallet.caption = `Connect to ${provider.provider}`;
        }
        this.pnlTokens.visible = isConnected;
    }

    private async renderTokens(chainId: number) {
        const tokens = this.tokens.filter(v => v.chainId === chainId);
        const network = {
            image: '/libs/@scom/scom-network-list/img/bscMainnet.svg',
            chainName: 'BNB Chain Testnet'
        };
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
                    minHeight={40}
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

    private handleConnectWallet() {
        this.isWalletConnected = true;
        this.checkWalletStatus();
    }

    private handleShowNetworks() {

    }

    private handleSelectToken(token: ITokenObject) {
        this.pnlAmount.visible = false;
        this.pnlTokenItems.visible = false;
        this.pnlPayAmount.visible = true;
        this.pnlPayDetail.visible = true;
        this.btnPay.visible = true;
        this.btnBack.width = 'calc(50% - 1rem)';
        this.isToPay = true;
        this.imgToken.url = tokenAssets.tokenPath(token, token.chainId);
        const address = this.payment.address || '';
        this.lbToAddress.caption = address.substr(0, 12) + '...' + address.substr(-12);
        const amount = FormatUtils.formatNumber(this.payment.amount || 0, { decimalFigures: 2 });
        this.lbAmountToPay.caption = `${amount} ${token.symbol}`;
        this.lbUSD.caption = `${amount} USD`;
        this.imgPayToken.url = tokenAssets.tokenPath(token, token.chainId);
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
            const wallet = Wallet.getClientInstance();
            const address = wallet.address;
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
                    minHeight={60}
                    padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}
                    background={{ color: Theme.colors.primary.main }}
                >
                    <i-label caption="Amount to pay" font={{ size: '0.675rem', bold: true, transform: 'uppercase', color: Theme.text.primary }} opacity={0.8} />
                    <i-label id="lbAmount" font={{ size: '0.875rem', color: Theme.text.primary, bold: true }} />
                </i-stack>
                <i-stack
                    id="pnlPayAmount"
                    visible={false}
                    direction="horizontal"
                    gap="0.25rem"
                    alignItems="center"
                    width="100%"
                    minHeight={60}
                    padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}
                    border={{ bottom: { style: 'solid', width: 1, color: Theme.divider } }}
                >
                    <i-image id="imgPayToken" width={20} height={20} minWidth={20} display="flex" />
                    <i-label id="lbPayAmount" font={{ size: '1rem', color: Theme.text.primary, bold: true }} />
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
                    <i-stack id="pnlTokenItems" direction="vertical" gap="1rem" width="100%" height="100%" minHeight={200} maxHeight="calc(100vh - 305px)" overflow="auto" padding={{ left: '1rem', right: '1rem' }} />
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
                                <i-label caption="Amount to pay" font={{ size: '0.75rem', transform: 'uppercase', color: Theme.input.fontColor }} opacity={0.8} />
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
                    <i-stack direction="horizontal" width="100%" alignItems="center" justifyContent="center" gap="2rem" wrap="wrap" padding={{ left: '1rem', right: '1rem' }}>
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
        </i-stack>
    }
}