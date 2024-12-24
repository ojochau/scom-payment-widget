import { Module, Container, customElements, ControlElement, Styles, Alert, Button } from '@ijstech/components';
import { getStripeKey } from '../store';
import { alertStyle, halfWidthButtonStyle } from './index.css';
import { loadStripe } from '../utils';
import { PaymentHeader } from './common/index';
import translations from '../translations.json';
import { Model } from '../model';
const Theme = Styles.Theme.ThemeVars;
declare const window: any;

interface ScomPaymentWidgetStripePaymentElement extends ControlElement {
    model?: Model;
    onBack?: () => void;
    onClose?: () => void;
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
    private _model: Model;
    private stripe: any;
    private stripeElements: any;
    private btnCheckout: Button;
    private btnBack: Button;
    private header: PaymentHeader;
    private mdAlert: Alert;
    private publishableKey: string;
    public onClose: () => void;
    public onBack: () => void;

    constructor(parent?: Container, options?: ScomPaymentWidgetStripePaymentElement) {
        super(parent, options);
    }

    set model(data: Model) {
        this._model = data;
        this.updateAmount();
    }

    get model() {
        return this._model;
    }

    private updateAmount() {
        if (this.model && this.header) {
            const { title, currency, totalAmount } = this.model;
            this.header.setHeader(title, currency, totalAmount);
            this.initStripePayment();
        }
    }

    private async initStripePayment() {
        if (!window.Stripe) {
            await loadStripe();
        }
        if (window.Stripe) {
            const { stripeAmount, stripeCurrency, baseStripeApi } = this.model;
            if (this.stripeElements) {
                this.stripeElements.update({
                    currency: stripeCurrency,
                    amount: stripeAmount
                });
                return;
            }
            if (!this.publishableKey) {
                this.publishableKey = await getStripeKey(`${baseStripeApi}/key`);
                if (!this.publishableKey) return;
            }
            this.stripe = window.Stripe(this.publishableKey);
            this.stripeElements = this.stripe.elements({
                mode: 'payment',
                currency: stripeCurrency,
                amount: stripeAmount
            });
            const paymentElement = this.stripeElements.create('payment');
            paymentElement.mount('#pnlStripePaymentForm');
        }
    }

    private async handleStripeCheckoutClick() {
        if (!this.stripe) return;
        this.showButtonIcon(true);
        this.stripeElements.submit().then(async (result) => {
            if (result.error) {
                this.showButtonIcon(false);
                return;
            }
            const clientSecret = await this.model.createPaymentIntent();
            if (!clientSecret) {
                this.showButtonIcon(false);
                this.showAlert('error', this.i18n.get('$payment_failed'), this.i18n.get('$cannot_get_payment_info'));
                return;
            };
            await this.model.handlePlaceMarketplaceOrder();
            this.model.referenceId = clientSecret;
            this.model.networkCode = '';
            const { returnUrl, paymentActivity } = this.model;
            const orderId = paymentActivity.orderId;
            const url = `${returnUrl}/${orderId}`;
            const jsonString = JSON.stringify(paymentActivity);
            const encodedData = btoa(jsonString);
            try {
                const { error } = await this.stripe.confirmPayment({
                    elements: this.stripeElements,
                    confirmParams: {
                        return_url: `${url}?data=${encodedData}`
                    },
                    clientSecret
                })
                if (error) {
                    this.showAlert('error', this.i18n.get('$payment_failed'), error.message);
                } else {
                    await this.model.handlePaymentSuccess();
                    this.showAlert('success', this.i18n.get('$payment_completed'), '');
                }
            } catch (error) {
                // mini app
                const data = await this.stripe.retrievePaymentIntent(clientSecret);
                const status = data?.paymentIntent.status;
                if (status === 'succeeded' || status === 'processing') {
                    await this.model.handlePaymentSuccess();
                    this.showAlert('success', this.i18n.get('$payment_completed'), '');
                } else {
                    this.showAlert('error', this.i18n.get('$payment_failed'), status || error?.message || '');
                }
            }
            this.showButtonIcon(false);
        })
    }

    private showButtonIcon(value: boolean) {
        this.btnCheckout.rightIcon.spin = value;
        this.btnCheckout.rightIcon.visible = value;
        this.btnBack.enabled = !value;
    }

    private showAlert(status: string, title: string, msg: string) {
        if (status === 'success') {
            this.mdAlert.onClose = () => {
                if (this.onClose) {
                    this.onClose();
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
        this.onClose = this.getAttribute('onClose', true) || this.onClose;
        this.onBack = this.getAttribute('onBack', true) || this.onBack;
        const model = this.getAttribute('model', true);
        if (model) this.model = model;
    }

    render() {
        return <i-stack direction="vertical" alignItems="center" width="100%">
            <scom-payment-widget--header id="header" margin={{ bottom: '1rem' }} display="flex" />
            <i-stack direction="vertical" gap="1rem" width="100%" height="100%" alignItems="center" padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}>
                <i-stack direction="vertical" id="pnlStripePaymentForm" background={{ color: '#fff' }} border={{ radius: 12 }} padding={{ top: '1rem', left: '1rem', bottom: '2rem', right: '1rem' }} />
                <i-stack direction="horizontal" width="100%" alignItems="center" justifyContent="center" margin={{ top: 'auto' }} gap="1rem" wrap="wrap-reverse">
                    <i-button
                        id="btnBack"
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