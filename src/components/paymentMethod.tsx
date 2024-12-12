import { Module, Container, customElements, ControlElement, Styles, Label, IconName, Control, StackLayout, Alert } from '@ijstech/components';
import { PaymentProvider, PaymentType } from '../interface';
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

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['scom-payment-widget--payment-method']: ScomPaymentWidgetPaymentMethodElement;
        }
    }
}


const paymentTypes: { type: PaymentType, title: string, description?: string, iconName: IconName, providerImages?: string[] }[] = [
    {
        type: PaymentType.Fiat,
        title: '$fiat_currency',
        // description: 'Stripe, Paypal, Payme,...etc',
        iconName: 'exchange-alt',
        // providerImages: ['stripe.png', 'paypal.png']
    },
    {
        type: PaymentType.Crypto,
        title: '$crypto_currency',
        description: 'Metamask, Ton Wallet,...etc',
        iconName: 'wallet',
        providerImages: ['metamask.png', 'ton.png']
    }
]

@customElements('scom-payment-widget--payment-method')
export class PaymentMethod extends Module {
    private header: PaymentHeader;
    private lbPayMethod: Label;
    private pnlPaymentType: StackLayout;
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

    private renderMethodItems(type: PaymentType) {
        this.lbPayMethod.caption = this.i18n.get(type === PaymentType.Fiat ? '$select_payment_gateway' : '$select_your_wallet');
        const providers = PaymentProviders.filter(v => v.type === type);
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

    private handlePaymentType(target: Control) {
        const type = target.id as PaymentType;
        if (type === PaymentType.Fiat) {
            this.model.paymentMethod = 'Stripe';
            this.handlePaymentProvider(PaymentProvider.Stripe);
        } else if (type) {
            //TODO
            this.model.paymentMethod = 'EVM';
            this.mdAlert.title = this.i18n.get('$coming_soon');
            this.mdAlert.content = this.i18n.get('$payment_coming_soon');
            this.mdAlert.status = 'warning';
            this.mdAlert.showModal();
            return;
            this.renderMethodItems(type);
            this.pnlPaymentType.visible = false;
            this.pnlPaymentMethod.visible = true;
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
        this.lbPayMethod.caption = this.i18n.get('$how_will_you_pay');
        this.pnlPaymentType.visible = true;
        this.pnlPaymentMethod.visible = false;
    }

    async init() {
        this.i18n.init({ ...translations });
        super.init();
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
                    {paymentTypes.map(v =>
                        <i-stack
                            id={v.type}
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
                                    <i-icon name={v.iconName} width={20} height={20} fill={Theme.colors.primary.main} />
                                    <i-label caption={v.title} font={{ size: '1rem', bold: true, color: Theme.text.primary }} />
                                </i-stack>
                                {v.description ? <i-label caption={v.description} font={{ color: Theme.text.secondary }} /> : []}
                                {v.providerImages?.length ? <i-stack direction="horizontal" gap="0.25rem">
                                    {v.providerImages.map(image =>
                                        <i-image width={20} height={20} url={assets.fullPath(`img/${image}`)} />
                                    )}
                                </i-stack> : []}
                            </i-stack>
                            <i-icon name="arrow-right" width={20} height={20} fill={Theme.text.primary} margin={{ left: 'auto', right: 'auto' }} />
                        </i-stack>
                    )}
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