var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-payment-widget", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomTelegramPayWidget = void 0;
    const Theme = components_1.Styles.Theme.ThemeVars;
    let ScomTelegramPayWidget = class ScomTelegramPayWidget extends components_1.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        get enabled() {
            return super.enabled;
        }
        set enabled(value) {
            super.enabled = value;
            this.btnPayNow.enabled = value;
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
        }
        set invoiceData(data) {
            this._invoiceData = data;
        }
        get invoiceData() {
            return this._invoiceData;
        }
        set payBtnCaption(value) {
            this._payBtnCaption = value;
            this.btnPayNow.caption = value || 'Pay';
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
        render() {
            return (this.$render("i-stack", { direction: "vertical" },
                this.$render("i-button", { id: "btnPayNow", onClick: this.handlePayClick, caption: this._payBtnCaption || 'Pay', padding: { top: 10, bottom: 10, left: 10, right: 10 }, width: '100%' })));
        }
    };
    ScomTelegramPayWidget = __decorate([
        (0, components_1.customElements)('i-scom-telegram-pay-widget')
    ], ScomTelegramPayWidget);
    exports.ScomTelegramPayWidget = ScomTelegramPayWidget;
});
