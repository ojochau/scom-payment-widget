import { Module, Container, customElements, ControlElement, Styles, Label, FormatUtils, StackLayout, Image, Button, application, Icon, Panel } from '@ijstech/components';
import { IPaymentStatus, PaymentProvider } from '../interface';
import assets from '../assets';
import configData from '../defaultData';
import { ITokenObject, assets as tokenAssets, tokenStore } from '@scom/scom-token-list';
import { PaymentProviders } from '../store';
import { BigNumber, Utils, Wallet } from '@ijstech/eth-wallet';
import { fullWidthButtonStyle, halfWidthButtonStyle } from './index.css';
import { PaymentHeader } from './common/index';
import translations from '../translations.json';
import { Model } from '../model';
import { EVMWallet, TonWallet } from '../wallets';

const path = application.currentModuleDir;
const Theme = Styles.Theme.ThemeVars;

enum Step {
    ConnectWallet,
    SelectToken,
    Pay
}

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
    // private pnlPayAmount: StackLayout;
    private header: PaymentHeader;
    // private lbPayItem: Label;
    // private lbPayAmount: Label;
    // private imgPayToken: Image;
    private btnTonWallet: Button;
    private pnlNetwork: StackLayout;
    private pnlWallet: StackLayout;
    private pnlPay: StackLayout;
    private pnlCryptos: StackLayout;
    private pnlTokenItems: StackLayout;
    private pnlPayDetail: StackLayout;
    private lbToAddress: Label;
    private lbAmountToPay: Label;
    // private lbUSD: Label;
    private btnBack: Button;
    private btnSwitchNetwork: Button;
    private btnPay: Button;
    private lbWallet: Label;
    private lbCurrentAddress: Label;
    private imgCurrentNetwork: Image;
    private lbCurrentNetwork: Label;
    private _model: Model;
    private currentStep: Step = Step.ConnectWallet;
    private copyAddressTimer: any;
    private copyAmountTimer: any;
    private iconCopyAddress: Icon;
    private iconCopyAmount: Icon;
    private pnlEVMWallet: Panel;
    private selectedToken: ITokenObject;

    public onBack: () => void;
    public onPaid: (paymentStatus: IPaymentStatus) => void;

    constructor(parent?: Container, options?: ScomPaymentWidgetWalletPaymentElement) {
        super(parent, options);
    }

    get model() {
        return this._model;
    }

    set model(value: Model) {
        this._model = value;
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

    get provider() {
        return this.model.walletModel instanceof TonWallet ? PaymentProvider.TonWallet : PaymentProvider.Metamask;
    }

    async onStartPayment() {
        if (!this.header) return;
        this.btnBack.enabled = true;
        this.model.handleWalletConnected = this.handleWalletConnected.bind(this);
        this.model.handleWalletChainChanged = this.handleWalletChainChanged.bind(this);
        this.goToStep(Step.ConnectWallet);
        this.updateAmount();
    }

    private handleWalletConnected() {
        this.checkWalletStatus();
    }

    private handleWalletChainChanged() {
        this.checkWalletStatus();
    }

    private goToStep(step: Step) {
        if (step === Step.ConnectWallet) {
            // this.header.visible = true;
            // this.pnlPayAmount.visible = false;
            this.pnlCryptos.visible = true;
            this.pnlPayDetail.visible = false;
            this.pnlWallet.visible = true;
            this.pnlPay.visible = false;
            this.btnPay.visible = false;
            this.btnBack.width = '100%';
            this.currentStep = Step.ConnectWallet;
        }
        else if (step === Step.SelectToken) {
            // this.header.visible = true;
            // this.pnlPayAmount.visible = false;
            this.pnlCryptos.visible = true;
            this.pnlPayDetail.visible = false;
            this.pnlWallet.visible = false;
            this.pnlPay.visible = true;
            this.btnPay.visible = false;
            this.btnBack.width = '100%';
            this.currentStep = Step.SelectToken;
        }
        else if (step === Step.Pay) {
            // this.header.visible = false;
            // this.pnlPayAmount.visible = true;
            this.pnlCryptos.visible = false;
            this.pnlPayDetail.visible = true;
            this.pnlWallet.visible = false;
            this.pnlPay.visible = true;
            this.btnPay.visible = true;
            this.btnBack.width = 'calc(50% - 1rem)';
            this.updatePaymentButtonVisibility();
            this.updateBtnPay(false);
            this.currentStep = Step.Pay;
        }
    }

    private updateAmount() {
        if (this.header && this.model) {
            const { title, currency, totalAmount } = this.model;
            this.header.setHeader(title, currency, totalAmount);
            // if (this.lbPayItem.caption !== title) this.lbPayItem.caption = title;
            // const formattedAmount = `${FormatUtils.formatNumber(totalAmount, { decimalFigures: 6, hasTrailingZero: false })} ${currency}`;
            // if (this.lbPayAmount.caption !== formattedAmount) this.lbPayAmount.caption = formattedAmount;
        }
    }

    private async checkWalletStatus() {
        const paymentProvider = this.provider;
        let isConnected = this.model.walletModel.isWalletConnected();
        const provider = PaymentProviders.find(v => v.provider === paymentProvider);
        if (isConnected) {
            if (this.currentStep === Step.ConnectWallet) {
                this.goToStep(Step.SelectToken);
            }
            else if (this.currentStep === Step.Pay) {
                this.updatePaymentButtonVisibility();
            }
            const address = this.model.walletModel.getWalletAddress();
            if (provider) {
                this.lbCurrentAddress.caption = address.substr(0, 6) + '...' + address.substr(-4);
                const network = this.model.walletModel.getNetworkInfo();
                if (network) {
                    this.imgCurrentNetwork.url = network.image;
                    this.lbCurrentNetwork.caption = network.chainName;
                    this.pnlNetwork.visible = true;
                }
                else {
                    this.pnlNetwork.visible = false;
                }
            }
            await this.renderTokens(paymentProvider);
        } 
        else {
            this.goToStep(Step.ConnectWallet);
        }
    }

    private async renderTokens(paymentProvider: PaymentProvider) {
        const isTonWallet = paymentProvider === PaymentProvider.TonWallet;
        const network = this.model.walletModel.getNetworkInfo();
        const chainId = network.chainId;
        let tokens: ITokenObject[] = [];
        if (isTonWallet) {
            tokens = this.tokens.filter(v => v.networkCode === network.networkCode);
        }
        else {
            tokens = this.tokens.filter(v => v.chainId === chainId);
        }
        const nodeItems: HTMLElement[] = [];
        for (const token of tokens) {
            const tokenImgUrl = tokenAssets.tokenPath(token, chainId);
            const networkName = network?.chainName || '';
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
                    onClick={() => this.handleSelectToken(token, isTonWallet)}
                >
                    <i-stack direction="horizontal" alignItems="center" gap="0.75rem">
                        <i-image width={20} height={20} minWidth={20} url={tokenImgUrl} />
                        <i-stack direction="vertical" gap="0.25rem">
                            <i-label caption={token.name || token.symbol} font={{ bold: true, color: Theme.text.primary }} />
                            <i-label caption={networkName} font={{ size: '0.75rem', color: Theme.text.primary }} />
                        </i-stack>
                    </i-stack>
                </i-stack>
            );
        }
        this.pnlTokenItems.clearInnerHTML();
        this.pnlTokenItems.append(...nodeItems);
    }

    private async handleConnectWallet() {
        const moduleDir = this['currentModuleDir'] || path;
        const provider = await this.model.connectWallet(moduleDir, this.pnlEVMWallet);
    }

    private handleShowNetworks() {
        this.model.walletModel.openNetworkModal(this.pnlEVMWallet);
    }

    private updatePaymentButtonVisibility() {
        if (this.model.walletModel.isNetworkConnected()) {
            this.btnPay.visible = true;
            this.btnSwitchNetwork.visible = false;
        } else {
            this.btnPay.visible = false;
            this.btnSwitchNetwork.visible = true;
        }
    }

    private async handleSelectToken(token: ITokenObject, isTon?: boolean) {
        this.goToStep(Step.Pay);
        const tokenAddress = token.address === Utils.nullAddress ? undefined : token.address;
        this.model.payment.address = this.model.payment.cryptoPayoutOptions.find(option => {
            if (isTon) {
                const networkInfo = this.model.walletModel.getNetworkInfo();
                if (tokenAddress) {
                    return option.networkCode === networkInfo.networkCode && option.tokenAddress === tokenAddress;
                }
                else {
                    return option.networkCode === networkInfo.networkCode && !option.tokenAddress;
                }
            }
            return option.chainId === token.chainId.toString() && option.tokenAddress == tokenAddress;
        })?.walletAddress || "";
        const { totalAmount, currency, toAddress } = this.model;
        this.lbToAddress.caption = toAddress;
        const formattedAmount = FormatUtils.formatNumber(totalAmount, { decimalFigures: 6, hasTrailingZero: false });
        this.lbAmountToPay.caption = `${formattedAmount} ${token.symbol}`;
        // this.lbUSD.caption = `${formattedAmount} ${currency || 'USD'}`;
        // this.lbUSD.visible = !isTon;
        // this.imgPayToken.url = tokenImg;
        this.selectedToken = token;
        const tokenBalance = await this.model.walletModel.getTokenBalance(token); 
        if (new BigNumber(totalAmount).shiftedBy(token.decimals).gt(tokenBalance)) {
            this.btnPay.enabled = false;
        }
        else {
            this.btnPay.enabled = true;
        }
    }

    private async handleCopyAddress() {
        try {
            await application.copyToClipboard(this.model.toAddress);
            this.iconCopyAddress.name = 'check';
            this.iconCopyAddress.fill = Theme.colors.success.main;
            if (this.copyAddressTimer) clearTimeout(this.copyAddressTimer);
            this.copyAddressTimer = setTimeout(() => {
                this.iconCopyAddress.name = 'copy';
                this.iconCopyAddress.fill = Theme.text.primary;
            }, 500)
        } catch { }
    }

    private async handleDisconnectWallet() {
        await this.model.walletModel.disconnectWallet();
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

    private updateBtnPay(value: boolean) {
        this.btnPay.rightIcon.spin = value;
        this.btnPay.rightIcon.visible = value;
        this.btnBack.enabled = !value;
    }

    private async handleSwitchNetwork() {
        await this.model.walletModel.switchNetwork();
    }

    private async handlePay() {
        if (this.onPaid) {
            this.updateBtnPay(true);
            try {
                let address = this.model.walletModel.getWalletAddress();
                if (this.provider === PaymentProvider.Metamask) {
                    const wallet = Wallet.getClientInstance();
                    this.model.networkCode = this.model.cryptoPayoutOptions.find(option => option.chainId === wallet.chainId.toString())?.networkCode;
                } else if (this.provider === PaymentProvider.TonWallet) {
                    const networkInfo = this.model.walletModel.getNetworkInfo();
                    this.model.networkCode = networkInfo.networkCode;
                }
        
                await this.model.walletModel.transferToken(
                    this.model.payment.address,
                    this.selectedToken,
                    this.model.totalAmount,
                    async (error: Error, receipt?: string) => {
                        this.updateBtnPay(false);
                        if (error) {
                            this.onPaid({ status: 'failed', provider: this.provider, receipt: '', ownerAddress: address });
                            return;
                        }
                        this.model.referenceId = receipt;
                        await this.model.handlePlaceMarketplaceOrder();
                        await this.model.handlePaymentSuccess();
                        this.onPaid({ status: 'completed', provider: this.provider, receipt, ownerAddress: address });
                        this.updateBtnPay(false);
                    }
                );
            } catch {
                this.updateBtnPay(false);
            }
        }
    }

    private handleBack() {
        if (this.currentStep === Step.SelectToken) {
            this.goToStep(Step.ConnectWallet);
            return;
        }
        else if (this.currentStep === Step.Pay) {
            this.goToStep(Step.SelectToken);
            return;
        }
        if (this.onBack) this.onBack();
    }

    async init() {
        this.i18n.init({ ...translations });
        super.init();
        this.onBack = this.getAttribute('onBack', true) || this.onBack;
        this.onPaid = this.getAttribute('onPaid', true) || this.onPaid;
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
                {/* <i-stack
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
                </i-stack> */}
            </i-stack>
            <i-stack direction="vertical" gap="1.5rem" width="100%" height="100%" alignItems="center" padding={{ top: '1rem', bottom: '1rem' }}>
                <i-stack id="pnlWallet" visible={false} direction="vertical" gap="2rem" width="100%" height="100%" alignItems="center" justifyContent="center" padding={{ left: '1rem', right: '1rem' }}>
                    <i-icon name="wallet" width={64} height={64} fill={Theme.colors.primary.main} />
                    <i-label id="lbWallet" font={{ size: '0.825rem', bold: true }} caption='$connect_web3_wallet' />
                    <i-button
                        caption="$connect"
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
                <i-stack id="pnlPay" visible={false} direction="vertical" gap="1rem" justifyContent="center" alignItems="center" height="100%" width="100%">
                    <i-stack direction="horizontal" justifyContent="space-between" alignItems="center" gap="1rem" width="100%" wrap="wrap" margin={{ bottom: '0.5rem' }} padding={{ left: '1rem', right: '1rem' }}>
                        <i-stack
                            direction="horizontal"
                            gap="0.5rem"
                            alignItems="center"
                            padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}
                            border={{ style: 'solid', width: 1, color: Theme.divider, radius: 8 }}
                        >
                            <i-icon name="wallet" width={24} height={24} fill={Theme.colors.primary.main} />
                            <i-label id="lbCurrentAddress" />
                            <i-stack
                                direction="horizontal"
                                padding={{ top: '0.25rem', bottom: '0.25rem', left: '0.25rem', right: '0.25rem' }}
                                gap="0.375rem"
                                cursor="pointer"
                                onClick={this.handleDisconnectWallet}
                            >
                                <i-icon name="power-off" width={16} height={16} />
                            </i-stack>
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
                    <i-stack id="pnlCryptos" direction="vertical" gap="1rem" width="100%" height="100%" padding={{ left: '1rem', right: '1rem' }} >
                        <i-label font={{ size: '1rem', color: Theme.text.primary, bold: true }} caption='$select_crypto' />
                        <i-stack id="pnlTokenItems" direction="vertical" gap="1rem" width="100%" height="100%" minHeight={100} maxHeight={240} overflow="auto" />
                    </i-stack>
                    <i-stack id="pnlPayDetail" visible={false} direction="vertical" gap="0.25rem" width="100%" height="100%" padding={{ left: '1rem', right: '1rem' }}>
                        <i-label caption="$paid_to_address" />
                        <i-stack
                            direction="horizontal"
                            alignItems="stretch"
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
                                <i-label id="lbToAddress" wordBreak="break-all" font={{ color: Theme.input.fontColor }} />
                            </i-stack>
                            <i-stack
                                direction="horizontal"
                                width={32}
                                minWidth={32}
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
                        <i-label caption="$amount_to_pay" />
                        <i-stack
                            direction="horizontal"
                            alignItems="stretch"
                            width="100%"
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
                                <i-label id="lbAmountToPay" wordBreak="break-all" font={{ color: Theme.input.fontColor }} />
                                {/* <i-label id="lbUSD" wordBreak="break-all" font={{ size: '0.75rem', color: Theme.colors.primary.main }} /> */}
                            </i-stack>
                            <i-stack
                                direction="horizontal"
                                width={32}
                                minWidth={32}
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
                            id="btnSwitchNetwork"
                            visible={false}
                            caption="$switch_network"
                            background={{ color: Theme.colors.primary.main }}
                            class={halfWidthButtonStyle}
                            onClick={this.handleSwitchNetwork}
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
            <i-panel id="pnlEVMWallet"></i-panel>
        </i-stack>
    }
}