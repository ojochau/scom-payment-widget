import { Module, Container, customElements, ControlElement, Styles, Label, FormatUtils, Alert } from '@ijstech/components';
import { IPaymentInfo } from '../interface';
import { STRIPE_PUBLISHABLE_KEY, stripeCurrencies } from '../store';
import { alertStyle, textCenterStyle } from './index.css';
import { loadStripe } from '../utils';
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
    private clientSecret: string;
    private lbItem: Label;
    private lbAmount: Label;
    private mdAlert: Alert;
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

    private updateAmount() {
        if (this.payment && this.lbAmount) {
            const { title, amount, currency } = this.payment;
            this.lbItem.caption = title || '';
            this.lbAmount.caption = `${FormatUtils.formatNumber(amount, { decimalFigures: 2 })} ${currency?.toUpperCase()}`;
            this.initStripePayment();
        }
    }

    private async initStripePayment() {
        if (!window.Stripe) {
            await loadStripe();
        }
        if (window.Stripe) {
            const currency = this.payment.currency?.toLowerCase();
            const stripeCurrency = stripeCurrencies.find(v => v === currency) || 'usd';
            const clientSecret = await this.createPaymentIntent(stripeCurrency, this.payment.amount);
            if (!clientSecret) return;
            this.clientSecret = clientSecret;
            if (this.stripeElements) {
                this.stripeElements.update({
                    currency: stripeCurrency,
                    amount: this.payment.amount,
                });
                return;
            }
            this.stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);
            this.stripeElements = this.stripe.elements({
                mode: 'payment',
                currency: stripeCurrency,
                amount: this.payment.amount,
            });
            const paymentElement = this.stripeElements.create('payment');
            paymentElement.mount('#pnlStripePaymentForm');
        }
    }

    private async createPaymentIntent(currency: string, amount: number): Promise<string> {
        const apiUrl = this.baseStripeApi ?? '/stripe';
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
        return null;
    }

    private async handleStripeCheckoutClick() {
        if (!this.stripe) return;
        const url = this.urlStripeTracking ?? `${window.location.origin}/#!/stripe-payment-status`;
        this.stripeElements.submit().then(async (result) => {
            const { error } = await this.stripe.confirmPayment({
                elements: this.stripeElements,
                confirmParams: {
                    return_url: url,
                    payment_method_data: {
                        billing_details: {
                            name: 'Anna Sings',
                            email: 'johnny@example.com'
                        }
                    }
                },
                clientSecret: this.clientSecret
            })
            if (error) {
                this.showAlert('error', 'Payment failed', error.message);
            } else {
                this.showAlert('success', 'Payment successfully', `Check your payment status here <a href='${url}?payment_intent_client_secret=${this.clientSecret}' target='_blank'>${this.clientSecret}</a>`);
            }
        })
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
            <i-stack
                direction="vertical"
                gap="0.5rem"
                justifyContent="center"
                alignItems="center"
                width="100%"
                minHeight={85}
                margin={{ bottom: '1rem' }}
                padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}
                background={{ color: Theme.colors.primary.main }}
            >
                <i-label id="lbItem" class={textCenterStyle} font={{ size: '0.875rem', color: Theme.text.primary, bold: true }} wordBreak="break-word" />
                <i-label caption="Amount to pay" font={{ size: '0.675rem', bold: true, transform: 'uppercase', color: Theme.text.primary }} />
                <i-label id="lbAmount" font={{ size: '0.875rem', color: Theme.text.primary, bold: true }} />
            </i-stack>
            <i-stack direction="vertical" gap="1rem" width="100%" height="100%" alignItems="center" padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}>
                <i-stack direction="vertical" id="pnlStripePaymentForm" background={{ color: '#fff' }} border={{ radius: 12 }} padding={{ top: '1rem', left: '1rem', bottom: '2rem', right: '1rem' }} />
                <i-stack direction="horizontal" width="100%" alignItems="center" justifyContent="center" margin={{ top: 'auto' }} gap="1rem" wrap="wrap-reverse">
                    <i-button
                        caption="Back"
                        width="calc(50% - 0.5rem)"
                        maxWidth={180}
                        minWidth={90}
                        padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
                        font={{ size: '1rem', color: Theme.colors.secondary.contrastText }}
                        background={{ color: Theme.colors.secondary.main }}
                        border={{ radius: 12 }}
                        onClick={this.handleBack}
                    />
                    <i-button
                        caption="Checkout"
                        width="calc(50% - 0.5rem)"
                        maxWidth={180}
                        minWidth={90}
                        padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
                        font={{ size: '1rem', color: Theme.colors.primary.contrastText }}
                        background={{ color: Theme.colors.primary.main }}
                        border={{ radius: 12 }}
                        onClick={this.handleStripeCheckoutClick}
                    />
                </i-stack>
            </i-stack>
            <i-alert id="mdAlert" class={alertStyle} />
        </i-stack>
    }
}