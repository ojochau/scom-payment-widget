var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@modules/module1", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let Module1 = class Module1 extends components_1.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        async init() {
            super.init();
        }
        onSubmit(content, medias) {
            console.log(content);
        }
        async handlePaymentSuccess() {
        }
        render() {
            return this.$render("i-stack", { width: '100%', height: '100%', alignItems: "center", justifyContent: 'center' },
                this.$render("i-stack", { id: "mainStack", margin: { top: '1rem', left: '1rem' }, gap: "2rem", width: 800, height: 1200 },
                    this.$render("i-scom-payment-widget", { onPaymentSuccess: this.handlePaymentSuccess, botAPIEndpoint: 'http://localhost:3000', data: {
                            title: 'Invoice title',
                            // description: 'Invoice description',
                            currency: 'USD',
                            amount: 100000,
                            // prices: [{label: 'Item 1', amount: 10000}],
                            // payload: 'payload',
                            photoUrl: 'https://cdn.corporatefinanceinstitute.com/assets/product-mix3.jpeg'
                        } })));
        }
    };
    Module1 = __decorate([
        components_1.customModule
    ], Module1);
    exports.default = Module1;
});
