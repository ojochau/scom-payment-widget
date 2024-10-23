var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-payment-widget", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomPaymentWidget = void 0;
    const CONFIG = {
        STRIPE_PUBLISHABLE_KEY: 'pk_test_51Q60lAP7pMwOSpCLJJQliRgIVHlmPlpkrstk43VlRG2vutqIPZKhoSv8XVzK3nbxawr2ru5cWQ1SFfkayFu5m25o00RHU1gBhl',
        STRIPE_SECRET_KEY: 'sk_test_51Q60lAP7pMwOSpCLNlbVBSZOIUOaqYVFVWihoOpqVOjOag6hUtOktCBYFudiXkVLiYKRlgZODmILVnr271jm9yQc00ANkHT99O'
    };
    const Theme = components_1.Styles.Theme.ThemeVars;
    let ScomPaymentWidget = class ScomPaymentWidget extends components_1.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        static async create(options, parent) {
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
            if (window.Stripe !== undefined) {
                this.stripe = window.Stripe(CONFIG.STRIPE_PUBLISHABLE_KEY);
                this.stripeElements = this.stripe.elements({
                    mode: 'payment',
                    currency: 'usd',
                    amount: 1099,
                });
                var paymentElement = this.stripeElements.create('payment');
                paymentElement.mount('#pnlStripePaymentForm');
            }
        }
        set invoiceData(data) {
            this._invoiceData = data;
            this.updateInvoiceUI();
        }
        get invoiceData() {
            return this._invoiceData;
        }
        set payBtnCaption(value) {
            this._payBtnCaption = value;
            // this.btnPayNow.caption = value || 'Pay';
        }
        get payBtnCaption() {
            return this._payBtnCaption;
        }
        get font() {
            return this.btnPayNow.font;
        }
        set font(value) {
            this.btnPayNow.font = value;
        }
        updateInvoiceUI() {
            console.log('updateInvoiceUI', this._invoiceData);
            this.lbAmount.caption = `${this._invoiceData.amount / 100} ${this._invoiceData.currency.toUpperCase()}`;
        }
        async getInvoiceLink() {
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
                else
                    return '';
            }
        }
        async handlePayClick() {
            const telegram = window.Telegram;
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
        async handlePayWithStripeClick() {
            this.updateStripeDetailUI();
            await this.initStripePayment();
        }
        updateStripeDetailUI() {
            this.pnlPaymentOptions.visible = false;
            this.pnlStripe.visible = true;
            this.lbStripeDetailProductName.caption = this._invoiceData.title;
            this.lbStripeDetailProductAmount.caption = `${this._invoiceData.amount / 100} ${this._invoiceData.currency}`;
            if (this._invoiceData.photoUrl) {
                this.imgStripeDetailProductImage.url = this._invoiceData.photoUrl;
            }
        }
        async handleStripeCheckoutClick() {
            if (!this.stripe)
                return;
            this.stripeElements.submit().then((result) => {
                console.log('stripe result', result);
            });
        }
        render() {
            return (this.$render("i-stack", { direction: "vertical", width: '100%', height: '100%' },
                this.$render("i-stack", { direction: "vertical", gap: 5 },
                    this.$render("i-label", { caption: "AMOUNT TO PAY", font: { size: '14px' } }),
                    this.$render("i-label", { id: "lbAmount", font: { size: '20px' } })),
                this.$render("i-stack", { direction: "vertical", id: "pnlPaymentOptions" },
                    this.$render("i-button", { id: "btnPayWithStripe", onClick: this.handlePayWithStripeClick, caption: 'Pay with stripe', padding: { top: 10, bottom: 10, left: 10, right: 10 }, width: '100%' })),
                this.$render("i-stack", { direction: "vertical", id: "pnlStripe", visible: false },
                    this.$render("i-stack", { direction: "horizontal", width: '100%', height: '100%', border: { right: { width: 1, style: 'solid', color: Theme.divider } } },
                        this.$render("i-stack", { direction: "vertical", gap: 10, padding: { top: 20, bottom: 20, left: 20, right: 20 }, width: '50%' },
                            this.$render("i-label", { id: "lbStripeDetailProductName", font: { color: Theme.text.secondary } }),
                            this.$render("i-label", { id: "lbStripeDetailProductAmount", font: { color: Theme.text.primary, size: '18px' } }),
                            this.$render("i-image", { id: "imgStripeDetailProductImage", maxWidth: '100%' })),
                        this.$render("i-stack", { direction: "vertical", background: { color: 'white' }, width: '50%', padding: { top: 20, bottom: 20, left: 20, right: 20 }, gap: 10 },
                            this.$render("i-stack", { direction: "vertical", id: "pnlStripePaymentForm" }),
                            this.$render("i-stack", { direction: "horizontal" },
                                this.$render("i-button", { width: '100%', padding: { top: 5, left: 5, right: 5, bottom: 5 }, caption: "Checkout", onClick: this.handleStripeCheckoutClick })))))));
        }
    };
    ScomPaymentWidget = __decorate([
        (0, components_1.customElements)('i-scom-payment-widget')
    ], ScomPaymentWidget);
    exports.ScomPaymentWidget = ScomPaymentWidget;
});
