import { Module, Container, customElements, ControlElement, Styles, Label, IconName, Control, StackLayout, Alert, Icon } from '@ijstech/components';
import { PaymentMethod, PaymentProvider, PaymentType } from '../interface';
import assets from '../assets';
import { PaymentProviders } from '../store';
import { alertStyle, fullWidthButtonStyle } from './index.css';
import { PaymentHeader } from './common/index';
import translations from '../translations.json';
import { Model } from '../model';
const Theme = Styles.Theme.ThemeVars;

interface ScomPaymentWidgetPaymentMethodElement extends ControlElement {
    model?: Model;
    onSelectedPaymentProvider?: (paymentProvider: PaymentProvider) => void;
    onBack?: () => void;
}

interface ScomPaymentWidgetPaymentTypeElement extends ControlElement {
    type: PaymentType;
    title: string;
    description?: string;
    iconName: IconName;
    onSelectPaymentType?: (type: PaymentType) => void;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['scom-payment-widget--payment-method']: ScomPaymentWidgetPaymentMethodElement;
            ['scom-payment-widget--payment-type']: ScomPaymentWidgetPaymentTypeElement;
        }
    }
}

@customElements('scom-payment-widget--payment-method')
export class PaymentMethodModule extends Module {
    private header: PaymentHeader;
    private lbPayMethod: Label;
    private pnlPaymentType: StackLayout;
    private pnlFiatPayment: PaymentTypeModule;
    private pnlCryptoPayment: PaymentTypeModule;
    private pnlPaymentMethod: StackLayout;
    private pnlMethodItems: StackLayout;
    private mdAlert: Alert;
    private _model: Model;
    public onSelectedPaymentProvider: (paymentProvider: PaymentProvider) => void;
    public onBack: () => void;

    get model() {
        return this._model;
    }

    set model(value: Model) {
        this._model = value;
        this.updateAmount();
    }

    constructor(parent?: Container, options?: ScomPaymentWidgetPaymentMethodElement) {
        super(parent, options);
    }

    private updateAmount() {
        if (this.header && this.model) {
            const { title, currency, totalAmount } = this.model;
            this.header.setHeader(title, currency, totalAmount);
        }
    }

    private getPaymentProviders(type: PaymentType) {
        if (type === PaymentType.Crypto) {
            const cryptoOptions = this.model.payment?.cryptoPayoutOptions || [];
            if (!cryptoOptions.length) return [];
            const hasTonWallet = cryptoOptions.find(opt => ['TON', 'TON-TESTNET'].includes(opt.networkCode)) != null;
            if (!hasTonWallet) {
                return PaymentProviders.filter(v => v.type === type && v.provider !== PaymentProvider.TonWallet);
            } else if (cryptoOptions.length === 1) {
                return PaymentProviders.filter(v => v.provider === PaymentProvider.TonWallet);
            }
        }
        return PaymentProviders.filter(v => v.type === type);
    }

    private renderMethodItems(type: PaymentType) {
        this.lbPayMethod.caption = this.i18n.get(type === PaymentType.Fiat ? '$select_payment_gateway' : '$select_your_wallet');
        const providers = this.getPaymentProviders(type);
        const nodeItems: HTMLElement[] = [];
        for (const item of providers) {
            nodeItems.push(
                <i-stack
                    direction="horizontal"
                    justifyContent="center"
                    gap="0.5rem"
                    width="100%"
                    minHeight={40}
                    border={{ width: 1, style: 'solid', color: Theme.divider, radius: 8 }}
                    padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}
                    cursor="pointer"
                    onClick={() => this.handlePaymentProvider(item.provider)}
                >
                    <i-stack direction="horizontal" alignItems="center" gap="0.75rem" width="calc(100% - 30px)">
                        <i-image width={20} height={20} url={assets.fullPath(`img/${item.image}`)} />
                        <i-label caption={item.provider} font={{ size: '1rem', bold: true, color: Theme.text.primary }} />
                    </i-stack>
                    <i-icon name="arrow-right" width={20} height={20} fill={Theme.text.primary} margin={{ left: 'auto', right: 'auto' }} />
                </i-stack>
            );
        }
        this.pnlMethodItems.clearInnerHTML();
        this.pnlMethodItems.append(...nodeItems);
    }

    private handlePaymentType(type: PaymentType) {
        if (type === PaymentType.Fiat) {
            this.model.paymentMethod = PaymentMethod.Stripe;
            this.handlePaymentProvider(PaymentProvider.Stripe);
        } else if (type) {
            this.handlePaymentProvider(PaymentProvider.Metamask);
            // this.renderMethodItems(type);
            // this.pnlPaymentType.visible = false;
            // this.pnlPaymentMethod.visible = true;
        }
    }

    private handlePaymentProvider(provider: PaymentProvider) {
        if (this.onSelectedPaymentProvider) this.onSelectedPaymentProvider(provider);
    }

    private handleBack() {
        if (this.pnlPaymentType.visible && this.onBack) {
            this.onBack();
            return;
        }
        this.updateUI();
    }

    updateUI() {
        this.pnlPaymentType.visible = true;
        this.pnlPaymentMethod.visible = false;
        const { cryptoPayoutOptions, stripeAccountId, hasPayment } = this.model;
        this.pnlCryptoPayment.visible = cryptoPayoutOptions.length > 0;
        this.pnlFiatPayment.visible = !!stripeAccountId;
        this.lbPayMethod.caption = this.i18n.get(hasPayment ? '$how_will_you_pay' : '$the_stall_owner_has_not_set_up_payments_yet');
    }

    async init() {
        this.i18n.init({ ...translations });
        super.init();
        this.getPaymentProviders = this.getPaymentProviders.bind(this);
        this.renderMethodItems = this.renderMethodItems.bind(this);
        this.onBack = this.getAttribute('onBack', true) || this.onBack;
        this.onSelectedPaymentProvider = this.getAttribute('onSelectedPaymentProvider', true) || this.onSelectedPaymentProvider;
        const model = this.getAttribute('model', true);
        if (model) {
            this.model = model;
        }
    }

    render() {
        return <i-stack direction="vertical" alignItems="center" width="100%">
            <scom-payment-widget--header id="header" margin={{ bottom: '1rem' }} />
            <i-stack direction="vertical" gap="1rem" width="100%" height="100%" alignItems="center" padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}>
                <i-label id="lbPayMethod" caption="$how_will_you_pay" font={{ size: '1rem', bold: true, color: Theme.colors.primary.main }} />
                <i-stack id="pnlPaymentType" direction="vertical" gap="1rem" width="100%" height="100%" alignItems="center">
                    <scom-payment-widget--payment-type
                        id="pnlFiatPayment"
                        width="100%"
                        type={PaymentType.Fiat}
                        title="$fiat_currency"
                        iconName="exchange-alt"
                        onSelectPaymentType={this.handlePaymentType}
                    ></scom-payment-widget--payment-type>
                    <scom-payment-widget--payment-type
                        id="pnlCryptoPayment"
                        width="100%"
                        type={PaymentType.Crypto}
                        title="$web3_wallet"
                        iconName="wallet"
                        visible={false}
                        onSelectPaymentType={this.handlePaymentType}
                    ></scom-payment-widget--payment-type>
                </i-stack>
                <i-stack id="pnlPaymentMethod" visible={false} direction="vertical" gap="2rem" justifyContent="center" alignItems="center" height="100%" width="100%">
                    <i-stack id="pnlMethodItems" direction="vertical" gap="1rem" width="100%" height="100%" />
                </i-stack>
                <i-button
                    caption="$back"
                    class={fullWidthButtonStyle}
                    background={{ color: Theme.colors.secondary.main }}
                    onClick={this.handleBack}
                />
            </i-stack>
            <i-alert id="mdAlert" class={alertStyle} />
        </i-stack>
    }
}

@customElements('scom-payment-widget--payment-type')
class PaymentTypeModule extends Module {
    private iconPaymentType: Icon;
    private lblPaymentType: Label;
    private lblDescription: Label;
    private type: PaymentType;
    private _model: Model;
    public onSelectPaymentType: (type: PaymentType) => void;

    get model() {
        return this._model;
    }

    set model(value: Model) {
        this._model = value;
    }

    private handlePaymentType() {
        if (this.onSelectPaymentType) this.onSelectPaymentType(this.type);
    }

    async init() {
        this.i18n.init({ ...translations });
        super.init();
        this.type = this.getAttribute('type', true);
        this.lblPaymentType.caption = this.getAttribute('title', true, "");
        this.iconPaymentType.name = this.getAttribute('iconName', true);
        const description = this.getAttribute('description', true);
        if (description) {
            this.lblDescription.caption = description;
            this.lblDescription.visible = true;
        }
    }

    render() {
        return (
            <i-stack
                direction="horizontal"
                alignItems="center"
                gap="1rem"
                width="100%"
                border={{ width: 1, style: 'solid', color: Theme.divider, radius: 8 }}
                padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}
                cursor="pointer"
                onClick={this.handlePaymentType}
            >
                <i-stack direction="vertical" gap="0.75rem" width="calc(100% - 30px)">
                    <i-stack direction="horizontal" gap="0.5rem" alignItems="center">
                        <i-icon id="iconPaymentType" width={20} height={20} fill={Theme.colors.primary.main} />
                        <i-label id="lblPaymentType" font={{ size: '1rem', bold: true, color: Theme.text.primary }} />
                    </i-stack>
                    <i-label id="lblDescription" font={{ color: Theme.text.secondary }} visible={false} />
                </i-stack>
                <i-icon name="arrow-right" width={20} height={20} fill={Theme.text.primary} margin={{ left: 'auto', right: 'auto' }} />
            </i-stack>
        )
    }
}