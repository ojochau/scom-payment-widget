import { Module, Container, customElements, ControlElement, Styles, Alert, Button } from '@ijstech/components';
import { IPaymentInfo } from '../interface';
import { getStripeKey, stripeCurrencies, stripeSpecialCurrencies, stripeZeroDecimalCurrencies } from '../store';
import { alertStyle, halfWidthButtonStyle } from './index.css';
import { loadStripe } from '../utils';
import { PaymentHeader } from './common/index';
import translations from '../translations.json';
const Theme = Styles.Theme.ThemeVars;
declare const window: any;

interface ScomPaymentWidgetStripePaymentElement extends ControlElement {
    payment?: IPaymentInfo;
    baseStripeApi?: string;
    payBtnCaption?: string;
    onBack?: () => void;
    onPaymentSuccess?: (status: string) => void;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['scom-payment-widget--stripe-payment']: ScomPaymentWidgetStripePaymentElement;
        }
    }
}

@customElements('scom-payment-widget--stripe-payment')
export class StripePayment extends Module {
    private _payment: IPaymentInfo;
    private _baseStripeApi: string;
    private _urlStripeTracking: string;
    private stripe: any;
    private stripeElements: any;
    private btnCheckout: Button;
    private header: PaymentHeader;
    private mdAlert: Alert;
    private publishableKey: string;
    public onPaymentSuccess: (status: string) => void;
    public onBack: () => void;

    constructor(parent?: Container, options?: ScomPaymentWidgetStripePaymentElement) {
        super(parent, options);
    }

    set payment(data: IPaymentInfo) {
        this._payment = data;
        this.updateAmount();
    }

    get payment() {
        return this._payment;
    }

    get totalPrice() {
        return (this.payment.products?.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0) || 0) + this.totalShippingCost;
    }

    get totalShippingCost() {
        return this.payment.products?.reduce((sum, item) => sum + (Number(item.shippingCost || 0) * item.quantity), 0) || 0;
    }

    get baseStripeApi() {
        return this._baseStripeApi;
    }

    set baseStripeApi(value: string) {
        this._baseStripeApi = value;
    }

    get urlStripeTracking() {
        return this._urlStripeTracking;
    }

    set urlStripeTracking(value: string) {
        this._urlStripeTracking = value;
    }

    private get stripeCurrency() {
        const currency = this.payment.currency?.toLowerCase();
        const stripeCurrency = stripeCurrencies.find(v => v === currency) || 'usd';
        return stripeCurrency;
    }

    private updateAmount() {
        if (this.payment && this.header) {
            const { title, currency } = this.payment;
            this.header.setHeader(title, currency, this.totalPrice);
            this.initStripePayment();
        }
    }

    private convertToSmallestUnit(amount: number) {
        const currency = this.stripeCurrency.toLowerCase();
        if (stripeZeroDecimalCurrencies.includes(currency)) return Math.round(amount);
        if (stripeSpecialCurrencies.includes(currency)) return Math.round(amount) * 100;
        return Math.round(amount * 100);
    }

    private async initStripePayment() {
        if (!window.Stripe) {
            await loadStripe();
        }
        if (window.Stripe) {
            if (this.stripeElements) {
                this.stripeElements.update({
                    currency: this.stripeCurrency,
                    amount: this.convertToSmallestUnit(this.totalPrice)
                });
                return;
            }
            const apiUrl = this.baseStripeApi ?? '/stripe';
            if (!this.publishableKey) {
                this.publishableKey = await getStripeKey(`${apiUrl}/key`);
                if (!this.publishableKey) return;
            }
            this.stripe = window.Stripe(this.publishableKey);
            this.stripeElements = this.stripe.elements({
                mode: 'payment',
                currency: this.stripeCurrency,
                amount: this.convertToSmallestUnit(this.totalPrice)
            });
            const paymentElement = this.stripeElements.create('payment');
            paymentElement.mount('#pnlStripePaymentForm');
        }
    }

    private async createPaymentIntent(currency: string, amount: number): Promise<string> {
        const apiUrl = this.baseStripeApi ?? '/stripe';
        try {
            const response = await fetch(`${apiUrl}/payment-intent`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currency, amount })
            });
            if (response.ok) {
                const data = await response.json();
                if (data.clientSecret) {
                    const clientSecret = data.clientSecret;
                    return clientSecret;
                }
                return null;
            }
        } catch { }
        return null;
    }

    private async handleStripeCheckoutClick() {
        if (!this.stripe) return;
        this.showButtonIcon(true);
        const url = this.urlStripeTracking ?? `${window.location.origin}/#!/stripe-payment-status`;
        this.stripeElements.submit().then(async (result) => {
            if (result.error) {
                this.showButtonIcon(false);
                return;
            }
            const clientSecret = await this.createPaymentIntent(this.stripeCurrency, this.convertToSmallestUnit(this.totalPrice));
            if (!clientSecret) {
                this.showButtonIcon(false);
                this.showAlert('error', this.i18n.get('$payment_failed'), this.i18n.get('$cannot_get_payment_info'));
                return;
            };
            const { userInfo } = this.payment;
            const { error } = await this.stripe.confirmPayment({
                elements: this.stripeElements,
                confirmParams: {
                    return_url: url,
                    payment_method_data: {
                        billing_details: {
                            name: userInfo?.name || '',
                            email: userInfo?.email || ''
                        }
                    }
                },
                clientSecret
            })
            if (error) {
                this.showAlert('error', this.i18n.get('$payment_failed'), error.message);
            } else {
                this.showAlert('success', this.i18n.get('$payment_completed'), `${this.i18n.get('$check_payment_status')} <a href='${url}?payment_intent_client_secret=${clientSecret}' target='_blank'>${clientSecret}</a>`);
            }
            this.showButtonIcon(false);
        })
    }

    private showButtonIcon(value: boolean) {
        this.btnCheckout.rightIcon.spin = value;
        this.btnCheckout.rightIcon.visible = value;
    }

    private async showAlert(status: string, title: string, msg: string) {
        if (status === 'success') {
            this.mdAlert.onClose = () => {
                if (this.onPaymentSuccess) {
                    this.onPaymentSuccess('success');
                }
            };
        } else {
            this.mdAlert.onClose = () => { };
        }
        this.mdAlert.status = status;
        this.mdAlert.title = title;
        this.mdAlert.content = msg;
        this.mdAlert.showModal();
    }

    private handleBack() {
        if (this.onBack) this.onBack();
    }

    async init() {
        this.i18n.init({ ...translations });
        super.init();
        this.onPaymentSuccess = this.getAttribute('onPaymentSuccess', true) || this.onPaymentSuccess;
        this.onBack = this.getAttribute('onBack', true) || this.onBack;
        const payment = this.getAttribute('payment', true);
        if (payment) this.payment = payment;
        const baseStripeApi = this.getAttribute('baseStripeApi', true);
        if (baseStripeApi) this.baseStripeApi = baseStripeApi;
        const urlStripeTracking = this.getAttribute('urlStripeTracking', true);
        if (urlStripeTracking) this.urlStripeTracking = urlStripeTracking;
    }

    render() {
        return <i-stack direction="vertical" alignItems="center" width="100%">
            <scom-payment-widget--header id="header" margin={{ bottom: '1rem' }} display="flex" />
            <i-stack direction="vertical" gap="1rem" width="100%" height="100%" alignItems="center" padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}>
                <i-stack direction="vertical" id="pnlStripePaymentForm" background={{ color: '#fff' }} border={{ radius: 12 }} padding={{ top: '1rem', left: '1rem', bottom: '2rem', right: '1rem' }} />
                <i-stack direction="horizontal" width="100%" alignItems="center" justifyContent="center" margin={{ top: 'auto' }} gap="1rem" wrap="wrap-reverse">
                    <i-button
                        caption="$back"
                        background={{ color: Theme.colors.secondary.main }}
                        class={halfWidthButtonStyle}
                        onClick={this.handleBack}
                    />
                    <i-button
                        id="btnCheckout"
                        caption="$checkout"
                        background={{ color: Theme.colors.primary.main }}
                        class={halfWidthButtonStyle}
                        onClick={this.handleStripeCheckoutClick}
                    />
                </i-stack>
            </i-stack>
            <i-alert id="mdAlert" class={alertStyle} />
        </i-stack>
    }
}