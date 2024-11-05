import { Module, Container, customElements, ControlElement, Styles, Label, FormatUtils, IconName, Control, StackLayout } from '@ijstech/components';
import { IPaymentInfo, PaymentProvider, PaymentType } from '../interface';
import assets from '../assets';
import { PaymentProviders } from '../store';
import { textCenterStyle } from './index.css';
const Theme = Styles.Theme.ThemeVars;

interface ScomPaymentWidgetPaymentMethodElement extends ControlElement {
    payment?: IPaymentInfo;
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
        title: 'Fiat currency',
        // description: 'Stripe, Paypal, Payme,...etc',
        iconName: 'exchange-alt',
        // providerImages: ['stripe.png', 'paypal.png']
    },
    {
        type: PaymentType.Crypto,
        title: 'Crypto currency',
        description: 'Metamask, Ton Wallet,...etc',
        iconName: 'wallet',
        providerImages: ['metamask.png', 'ton.png']
    }
]

@customElements('scom-payment-widget--payment-method')
export class PaymentMethod extends Module {
    private lbItem: Label;
    private lbAmount: Label;
    private lbPayMethod: Label;
    private pnlPaymentType: StackLayout;
    private pnlPaymentMethod: StackLayout;
    private pnlMethodItems: StackLayout;
    private _payment: IPaymentInfo;
    public onSelectedPaymentProvider: (payment: IPaymentInfo, paymentProvider: PaymentProvider) => void;
    public onBack: () => void;

    get payment() {
        return this._payment;
    }

    set payment(value: IPaymentInfo) {
        this._payment = value;
        this.updateAmount();
    }

    constructor(parent?: Container, options?: ScomPaymentWidgetPaymentMethodElement) {
        super(parent, options);
    }

    private updateAmount() {
        if (this.lbAmount && this.payment) {
            const { title, amount, currency } = this.payment;
            this.lbItem.caption = title || '';
            const formattedAmount = FormatUtils.formatNumber(amount || 0, { decimalFigures: 2 });
            this.lbAmount.caption = `${formattedAmount} ${currency || 'USD'}`;
        }
    }

    private renderMethodItems(type: PaymentType) {
        this.lbPayMethod.caption = type === PaymentType.Fiat ? 'Select a payment gateway' : 'Select your wallet';
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
            this.handlePaymentProvider(PaymentProvider.Stripe);
        } else if (type) {
            this.renderMethodItems(type);
            this.pnlPaymentType.visible = false;
            this.pnlPaymentMethod.visible = true;
        }
    }

    private handlePaymentProvider(provider: PaymentProvider) {
        if (this.onSelectedPaymentProvider) this.onSelectedPaymentProvider(this.payment, provider);
    }

    private handleBack() {
        if (this.pnlPaymentType.visible && this.onBack) {
            this.onBack();
            return;
        }
        this.lbPayMethod.caption = 'How will you pay?';
        this.pnlPaymentType.visible = true;
        this.pnlPaymentMethod.visible = false;
    }

    async init() {
        super.init();
        this.onBack = this.getAttribute('onBack', true) || this.onBack;
        this.onSelectedPaymentProvider = this.getAttribute('onSelectedPaymentProvider', true) || this.onSelectedPaymentProvider;
        const payment = this.getAttribute('payment', true);
        if (payment) {
            this.payment = payment;
        }
    }

    render() {
        return <i-stack direction="vertical" gap="1rem" alignItems="center" width="100%">
            <i-stack
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
            <i-stack direction="vertical" gap="1rem" width="100%" height="100%" alignItems="center" padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}>
                <i-label id="lbPayMethod" caption="How will you pay?" font={{ size: '1rem', bold: true, color: Theme.colors.primary.main }} />
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
                    width="100%"
                    maxWidth={180}
                    caption="Back"
                    padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
                    font={{ size: '1rem', color: Theme.colors.secondary.contrastText }}
                    background={{ color: Theme.colors.secondary.main }}
                    border={{ radius: 12 }}
                    onClick={this.handleBack}
                />
            </i-stack>
        </i-stack>
    }
}