import { Module, Container, customElements, ControlElement, Styles, Label, Button, Image, Input } from '@ijstech/components';
import { loadingImageStyle, textCenterStyle } from './index.css';
import assets from '../assets';
import { STRIPE_PUBLISHABLE_KEY } from '../store';
import { loadStripe } from '../utils';
import translations from '../translations.json';
const Theme = Styles.Theme.ThemeVars;
declare const window: any;

interface ScomPaymentWidgetStripePaymentTrackingElement extends ControlElement {
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['scom-payment-widget--stripe-payment-tracking']: ScomPaymentWidgetStripePaymentTrackingElement;
        }
    }
}

@customElements('scom-payment-widget--stripe-payment-tracking')
export class StatusPaymentTracking extends Module {
    private stripe: any;
    private inputClientSecret: Input;
    private btnCheck: Button;
    private imgStatus: Image;
    private lbStatus: Label;

    constructor(parent?: Container, options?: ScomPaymentWidgetStripePaymentTrackingElement) {
        super(parent, options);
    }

    private async checkPaymentStatus() {
        this.btnCheck.enabled = false;
        this.btnCheck.rightIcon.spin = true;
        this.btnCheck.rightIcon.visible = true;
        this.inputClientSecret.enabled = false;
        this.imgStatus.visible = true;
        this.imgStatus.url = assets.fullPath('/img/loading.svg');
        this.imgStatus.classList.add(loadingImageStyle);
        this.lbStatus.caption = '';
        if (!window.Stripe) {
            await loadStripe();
        }
        if (window.Stripe && !this.stripe) {
            this.stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);
        }
        const clientSecret = this.inputClientSecret.value;
        this.updateURLParam('payment_intent_client_secret', clientSecret);
        try {
            const data = await this.stripe.retrievePaymentIntent(clientSecret);
            let img = '';
            let msg = '';
            switch (data?.paymentIntent.status) {
                case 'succeeded':
                    img = assets.fullPath('img/success.svg');
                    msg = this.i18n.get('$payment_received_success');
                    break;
                case 'processing':
                    msg = this.i18n.get('$payment_processing');
                    break;
                case 'requires_payment_method':
                    msg = this.i18n.get('$payment_failed');
                    img = assets.fullPath('img/error.png');
                    break;
                default:
                    msg = this.i18n.get('$something_went_wrong');
                    img = assets.fullPath('img/error.png');
                    break;
            }
            this.imgStatus.classList.remove(loadingImageStyle);
            if (img) {
                this.imgStatus.url = img;
            } else {
                this.imgStatus.visible = false;
            }
            this.lbStatus.caption = msg;
        } catch {
            this.lbStatus.caption = this.i18n.get('$invalid_payment_id');
            this.imgStatus.classList.remove(loadingImageStyle);
            this.imgStatus.url = assets.fullPath('img/error.png');
        }
        this.btnCheck.rightIcon.spin = false;
        this.btnCheck.rightIcon.visible = false;
        this.btnCheck.enabled = true;
        this.inputClientSecret.enabled = true;
    }

    private handleInputChanged() {
        this.btnCheck.enabled = !!this.inputClientSecret.value;
    }

    private handleSearch() {
        this.checkPaymentStatus();
    }

    private getParamsFromUrl() {
        return [...new URLSearchParams(window.location.href.split('?')[1])].reduce(
            (a, [k, v]) => ((a[k] = v), a),
            {}
        );
    }

    private updateURLParam(param: string, newValue: string) {
        const hash = window.location.hash;
        const [path, queryString] = hash.split('?');
        const params = new URLSearchParams(queryString);
        params.set(param, newValue);
        const newHash = `${path}?${params.toString()}`;
        window.history.replaceState({}, '', window.location.origin + window.location.pathname + newHash);
    }

    async init() {
        this.i18n.init({ ...translations });
        super.init();
        const params: any = this.getParamsFromUrl();
        if (params?.payment_intent_client_secret) {
            this.inputClientSecret.value = params.payment_intent_client_secret;
            this.checkPaymentStatus();
        }
    }

    render() {
        return <i-stack direction="vertical" gap="1rem" height="100%" width="100%" alignItems="center" padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}>
            <i-label caption="$check_stripe_payment_status" font={{ size: '1rem' }} class={textCenterStyle} />
            <i-stack direction="horizontal" gap="0.5rem" width="100%" alignItems="center" justifyContent="center" wrap="wrap">
                <i-input
                    id="inputClientSecret"
                    width="calc(100% - 108px)"
                    minWidth={200}
                    height={40}
                    padding={{ left: '0.5rem', right: '0.5rem' }}
                    placeholder="pi_3QHe3EP7pMwOSpCL0edx9jiF_secret_tGkZptJLmJsHp8hO2RtINuGgs"
                    border={{ radius: 4 }}
                    onChanged={this.handleInputChanged}
                />
                <i-button
                    id="btnCheck"
                    enabled={false}
                    caption="$check"
                    width={100}
                    padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
                    font={{ color: Theme.colors.primary.contrastText }}
                    background={{ color: Theme.colors.primary.main }}
                    border={{ radius: 12 }}
                    onClick={this.handleSearch}
                />
            </i-stack>
            <i-stack direction="vertical" gap="1rem" width="100%" alignItems="center" margin={{ top: '2rem' }}>
                <i-image id="imgStatus" width={128} height={128} />
                <i-label id="lbStatus" class={textCenterStyle} font={{ size: '1rem', color: Theme.text.primary, bold: true }} />
            </i-stack>
        </i-stack>
    }
}