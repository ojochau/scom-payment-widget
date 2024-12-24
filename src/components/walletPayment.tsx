import { Module, Container, customElements, ControlElement, Styles, Label, FormatUtils, StackLayout, Image, Button, application, Icon, Panel } from '@ijstech/components';
import { IPaymentStatus, PaymentProvider } from '../interface';
import assets from '../assets';
import configData from '../defaultData';
import { ITokenObject, assets as tokenAssets, tokenStore } from '@scom/scom-token-list';
import { PaymentProviders } from '../store';
import { Utils, Wallet } from '@ijstech/eth-wallet';
import { fullWidthButtonStyle, halfWidthButtonStyle } from './index.css';
import { PaymentHeader } from './common/index';
import translations from '../translations.json';
import { Model } from '../model';
import { EVMWallet, TonWallet } from '../wallets';

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
    private lbWallet: Label;
    private imgCurrentWallet: Image;
    private lbCurrentAddress: Label;
    private imgCurrentNetwork: Image;
    private lbCurrentNetwork: Label;
    private _model: Model;
    private isToPay: boolean;
    private copyAddressTimer: any;
    private copyAmountTimer: any;
    private iconCopyAddress: Icon;
    private iconCopyAmount: Icon;
    private provider: PaymentProvider;
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
        this.updateAmount();
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

    async onStartPayment(provider: PaymentProvider) {
        if (!this.header) return;
        this.provider = provider;
        if (provider === PaymentProvider.Metamask) {
            const evmWallet = new EVMWallet();
            this.model.walletModel = evmWallet;
            evmWallet.on("chainChanged", this.handleEVMWalletChainChanged.bind(this));
            evmWallet.on("walletConnected", this.handleEVMWalletConnected.bind(this));
            evmWallet.setData({
                wallets: this.model.wallets,
                networks: this.model.networks,
                defaultChainId: configData.defaultData.defaultChainId
            })
        }
        else if (provider === PaymentProvider.TonWallet) {
            const moduleDir = this['currentModuleDir'] || path;
            const tonWallet = new TonWallet(moduleDir, this.handleTonWalletStatusChanged.bind(this));
            this.model.walletModel = tonWallet;
        }
        await this.model.walletModel.initWallet();
        this.showFirstScreen();
        this.updateAmount();
        this.checkWalletStatus();
    }

    private handleTonWalletStatusChanged(isConnected: boolean) {
        this.checkWalletStatus();
    }

    private handleEVMWalletConnected() {
        this.checkWalletStatus();
    }

    private handleEVMWalletChainChanged() {
        this.showFirstScreen();
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
        let isConnected = this.model.walletModel.isWalletConnected();
        this.pnlWallet.visible = !isConnected;
        const provider = PaymentProviders.find(v => v.provider === paymentProvider);
        if (isConnected) {
            const address = this.model.walletModel.getWalletAddress();
            if (paymentProvider === PaymentProvider.Metamask) {
                const evmWallet = this.model.walletModel as EVMWallet;
                const network = evmWallet.getNetworkInfo();
                if (provider) {
                    this.imgCurrentWallet.url = assets.fullPath(`img/${provider.image}`);
                    this.lbCurrentAddress.caption = address.substr(0, 6) + '...' + address.substr(-4);
                    this.imgCurrentNetwork.url = network.image;
                    this.lbCurrentNetwork.caption = network.chainName;
                    this.pnlNetwork.visible = true;
                }
                await this.renderErcTokens();
            } else if (paymentProvider === PaymentProvider.TonWallet) {
                this.pnlNetwork.visible = false;
                if (provider) {
                    this.imgCurrentWallet.url = assets.fullPath(`img/${provider.image}`);
                    this.lbCurrentAddress.caption = address.substr(0, 6) + '...' + address.substr(-4);
                }
                await this.renderTonToken();
            }
        } else if (provider) {
            this.lbWallet.caption = `$connect_web3_wallet`;
        }
        this.pnlTokens.visible = isConnected;
    }

    // private async updateTokenBalances(tokens?: ITokenObject[]) {
    //     const arr = (tokens || this.tokens).reduce((acc, token) => {
    //         const { chainId } = token;
    //         if (!acc[chainId]) {
    //             acc[chainId] = [];
    //         }
    //         acc[chainId].push(token);
    //         return acc;
    //     }, {});
    //     let promises: Promise<any>[] = [];
    //     for (const chainId in arr) {
    //         const tokens = arr[chainId];
    //         promises.push(tokenStore.updateTokenBalancesByChainId(Number(chainId), tokens));
    //     }
    //     await Promise.all(promises);
    // }

    private async renderErcTokens() {
        const evmWallet = this.model.walletModel as EVMWallet;
        const chainId = evmWallet.getRpcWallet()?.chainId;
        const tokens = this.tokens.filter(v => v.chainId === chainId);
        // await this.updateTokenBalances(tokens);
        const network = evmWallet.getNetworkInfo(chainId);
        const nodeItems: HTMLElement[] = [];
        for (const token of tokens) {
            // const balances = tokenStore.getTokenBalancesByChainId(chainId) || {};
            // const tokenBalance = balances[token.address?.toLowerCase() || token.symbol] || 0;
            // const formattedBalance = FormatUtils.formatNumber(tokenBalance, { decimalFigures: 2 });
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
                    {/* <i-stack direction="vertical" gap="0.25rem">
                        <i-label caption={`${formattedBalance} ${token.symbol}`} font={{ bold: true, color: Theme.text.primary }} />
                    </i-stack> */}
                </i-stack>
            );
        }
        this.pnlTokenItems.clearInnerHTML();
        this.pnlTokenItems.append(...nodeItems);
    }

    // private async getTonBalance() {
    //     const tonWallet = this.model.walletModel as TonWallet;
    //     const balance = await tonWallet.getTonBalance();
    //     return balance.toFixed();
    // }

    private async renderTonToken() {
        const tonToken = {
            chainId: undefined,
            name: 'Toncoin',
            symbol: 'TON',
            decimals: 18
        }
        // const balance = await this.getTonBalance();
        // const formattedBalance = FormatUtils.formatNumber(balance, { decimalFigures: 2 });
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
            {/* <i-stack direction="vertical" gap="0.25rem">
                <i-label caption={`${formattedBalance} ${tonToken.symbol}`} font={{ bold: true, color: Theme.text.primary }} />
            </i-stack> */}
        </i-stack>);
    }

    private handleConnectWallet() {
        this.model.walletModel.connectWallet(this.pnlEVMWallet);
    }

    private handleShowNetworks() {
        const evmWallet = this.model.walletModel as EVMWallet;
        evmWallet.openNetworkModal(this.pnlEVMWallet);
    }

    private handleSelectToken(token: ITokenObject, isTon?: boolean) {
        this.header.visible = false;
        this.pnlTokenItems.visible = false;
        this.pnlPayAmount.visible = true;
        this.pnlPayDetail.visible = true;
        this.btnPay.visible = true;
        this.updateBtnPay(false);
        this.btnBack.width = 'calc(50% - 1rem)';
        this.isToPay = true;
        const tokenImg = isTon ? assets.fullPath('img/ton.png') : tokenAssets.tokenPath(token, token.chainId);
        this.imgToken.url = tokenImg;
        const tokenAddress = token.address === Utils.nullAddress ? undefined : token.address;
        this.model.payment.address = this.model.payment.cryptoPayoutOptions.find(option => {
            if (isTon) return option.cryptoCode === "TON";
            return option.tokenAddress === tokenAddress
        })?.walletAddress || "";
        const { totalAmount, currency, walletAddress } = this.model;
        const toAddress = walletAddress;
        this.lbToAddress.caption = toAddress.substr(0, 12) + '...' + toAddress.substr(-12);
        const formattedAmount = FormatUtils.formatNumber(totalAmount, { decimalFigures: 2 });
        this.lbAmountToPay.caption = `${formattedAmount} ${token.symbol}`;
        this.lbUSD.caption = `${formattedAmount} ${currency || 'USD'}`;
        this.lbUSD.visible = !isTon;
        this.imgPayToken.url = tokenImg;
        this.selectedToken = token;
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
    }

    private async handlePay() {
        if (this.onPaid) {
            this.updateBtnPay(true);
            let address = this.model.walletModel.getWalletAddress();
            if (this.provider === PaymentProvider.Metamask) {
                const wallet = Wallet.getClientInstance();
                this.model.networkCode = this.model.cryptoPayoutOptions.find(option => option.chainId === wallet.chainId.toString())?.networkCode;
            } else if (this.provider === PaymentProvider.TonWallet) {
                this.model.networkCode = 'TON';
            }

            await this.model.handlePlaceMarketplaceOrder();
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
                    this.onPaid({ status: 'pending', provider: this.provider, receipt, ownerAddress: address });
                },
                async (receipt: any) => {
                    await this.model.handlePaymentSuccess();
                    this.onPaid({ status: 'completed', provider: this.provider, receipt: receipt.transactionHash, ownerAddress: address });
                    this.updateBtnPay(false);
                }
            );
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
                    <i-icon name="wallet" width={64} height={64} fill={Theme.colors.primary.main} />
                    <i-label id="lbWallet" font={{ size: '0.825rem', bold: true }} />
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
            <i-panel id="pnlEVMWallet"></i-panel>
        </i-stack>
    }
}