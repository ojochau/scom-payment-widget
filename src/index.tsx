import {
    Module,
    Styles,
    customElements,
    ControlElement,
    Container,
    Button,
    StackLayout,
    IFont,
    Label,
    Image
} from '@ijstech/components';

const CONFIG = {
    STRIPE_PUBLISHABLE_KEY: 'pk_test_51Q60lAP7pMwOSpCLJJQliRgIVHlmPlpkrstk43VlRG2vutqIPZKhoSv8XVzK3nbxawr2ru5cWQ1SFfkayFu5m25o00RHU1gBhl',
    STRIPE_SECRET_KEY: 'sk_test_51Q60lAP7pMwOSpCLNlbVBSZOIUOaqYVFVWihoOpqVOjOag6hUtOktCBYFudiXkVLiYKRlgZODmILVnr271jm9yQc00ANkHT99O'
};

const Theme = Styles.Theme.ThemeVars;

type CreateInvoiceBody = {
    title: string;
    description?: string;
    currency?: string;
    photoUrl?: string;
    payload?: string;
    prices?: { label: string; amount: number | string }[];
    amount: number;
}

interface ScomPaymentWidgetElement extends ControlElement {
    data?: CreateInvoiceBody;
    botAPIEndpoint: string;
    onPaymentSuccess: (status: string) => Promise<void>;
    payBtnCaption?: string;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-payment-widget']: ScomPaymentWidgetElement;
        }
    }
}

@customElements('i-scom-payment-widget')
export class ScomPaymentWidget extends Module {

    private _invoiceData: CreateInvoiceBody;
    private botAPIEndpoint: string;
    private onPaymentSuccess: (status: string) => Promise<void>;
    private _payBtnCaption: string;
    private btnPayNow: Button;
    private pnlStripe: StackLayout;
    private pnlStripePaymentForm: StackLayout;
    private pnlPaymentOptions: StackLayout;
    private stripe: any;
    private stripeElements: any;
    private lbAmount: Label;
    private lbStripeDetailProductName: Label;
    private lbStripeDetailProductAmount: Label;
    private imgStripeDetailProductImage: Image;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    get enabled(): boolean {
        return super.enabled;
    }
    set enabled(value: boolean) {
        super.enabled = value;
        this.btnPayNow.enabled = value;
    }

    static async create(options?: ScomPaymentWidgetElement, parent?: Container) {
        let self = new this(parent, options);
        await self.ready();
        return self;
    }

    clear() {

    }

    init() {
        super.init();
        const data = this.getAttribute('data', true);
        const botAPIEndpoint = this.getAttribute('botAPIEndpoint', true);
        const onPaymentSuccess = this.getAttribute('onPaymentSuccess', true);
        const payBtnCaption = this.getAttribute('payBtnCaption', true);
        this._invoiceData = data;
        this.botAPIEndpoint = botAPIEndpoint;
        this.onPaymentSuccess = onPaymentSuccess;
        this.payBtnCaption = payBtnCaption;
        this.updateInvoiceUI();
    }

    async initStripePayment() {
        if ((window as any).Stripe !== undefined) {
            this.stripe = (window as any).Stripe(CONFIG.STRIPE_PUBLISHABLE_KEY);
            this.stripeElements = this.stripe.elements({
                mode: 'payment',
                currency: 'usd',
                amount: 1099,
            });
            var paymentElement = this.stripeElements.create('payment');
            paymentElement.mount('#pnlStripePaymentForm');
        }
    }

    set invoiceData(data: CreateInvoiceBody) {
        this._invoiceData = data;
        this.updateInvoiceUI();
    }

    get invoiceData() {
        return this._invoiceData;
    }

    set payBtnCaption(value: string) {
        this._payBtnCaption = value;
        // this.btnPayNow.caption = value || 'Pay';
    }

    get payBtnCaption() {
        return this._payBtnCaption;
    }

    get font(): IFont {
        return this.btnPayNow.font;
    }

    set font(value: IFont) {
        this.btnPayNow.font = value;
    }

    private updateInvoiceUI() {
        console.log('updateInvoiceUI', this._invoiceData);
        this.lbAmount.caption = `${this._invoiceData.amount / 100} ${this._invoiceData.currency.toUpperCase()}`;
    }

    private async getInvoiceLink() {
        if (!this._invoiceData) {
            console.error('Invoice data is empty.');
            return;
        }
        const response = await fetch(`${this.botAPIEndpoint}/invoice`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...this._invoiceData,
                prices: JSON.stringify(this._invoiceData.prices)
            })
        });
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                return data.data.invoiceLink;
            }
            else return '';
        }
    }

    private async handlePayClick() {
        const telegram = (window as any).Telegram;
        if (telegram) {
            const app = telegram.WebApp;
            if (app) {
                const invoiceLink = await this.getInvoiceLink();
                if (invoiceLink) {
                    app.openInvoice(invoiceLink, this.onPaymentSuccess);
                }
            }
        }
    }

    private async handlePayWithStripeClick() {
        this.updateStripeDetailUI();
        await this.initStripePayment();
    }

    private updateStripeDetailUI() {
        this.pnlPaymentOptions.visible = false;
        this.pnlStripe.visible = true;
        this.lbStripeDetailProductName.caption = this._invoiceData.title;
        this.lbStripeDetailProductAmount.caption = `${this._invoiceData.amount / 100} ${this._invoiceData.currency}`;
        if (this._invoiceData.photoUrl) {
            this.imgStripeDetailProductImage.url = this._invoiceData.photoUrl;
        }
    }

    private async handleStripeCheckoutClick() {
        if (!this.stripe) return;
        this.stripeElements.submit().then((result) => {
            console.log('stripe result', result);
        })
    }

    render() {
        return (
            <i-stack direction="vertical" width={'100%'} height={'100%'}>
                <i-stack direction="vertical" gap={5}>
                    <i-label caption="AMOUNT TO PAY" font={{ size: '14px' }} />
                    <i-label id="lbAmount" font={{ size: '20px' }} />
                </i-stack>
                <i-stack direction="vertical" id="pnlPaymentOptions">
                    <i-button id="btnPayWithStripe" onClick={this.handlePayWithStripeClick} caption={'Pay with stripe'} padding={{ top: 10, bottom: 10, left: 10, right: 10 }} width={'100%'} />
                </i-stack>
                <i-stack direction="vertical" id="pnlStripe" visible={false}>
                    <i-stack direction="horizontal" width={'100%'} height={'100%'} border={{ right: { width: 1, style: 'solid', color: Theme.divider } }}>
                        <i-stack direction="vertical" gap={10} padding={{ top: 20, bottom: 20, left: 20, right: 20 }} width={'50%'}>
                            <i-label id="lbStripeDetailProductName" font={{ color: Theme.text.secondary }} />
                            <i-label id="lbStripeDetailProductAmount" font={{ color: Theme.text.primary, size: '18px' }} />
                            <i-image id="imgStripeDetailProductImage" maxWidth={'100%'} />
                        </i-stack>
                        <i-stack direction="vertical" background={{ color: 'white' }} width={'50%'} padding={{ top: 20, bottom: 20, left: 20, right: 20 }} gap={10}>
                            <i-stack direction="vertical" id="pnlStripePaymentForm"></i-stack>
                            <i-stack direction="horizontal">
                                <i-button width={'100%'} padding={{ top: 5, left: 5, right: 5, bottom: 5 }} caption="Checkout" onClick={this.handleStripeCheckoutClick} />
                            </i-stack>
                        </i-stack>
                    </i-stack>

                </i-stack>

            </i-stack>
        );
    }
}