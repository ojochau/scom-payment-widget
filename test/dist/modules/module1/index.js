var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@modules/module1", ["require", "exports", "@ijstech/components", "@scom/scom-multicall", "@scom/scom-network-list"], function (require, exports, components_1, scom_multicall_1, scom_network_list_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let Module1 = class Module1 extends components_1.Module {
        constructor(parent, options) {
            super(parent, options);
            this.getNetworkMap = (infuraId) => {
                const networkMap = {};
                const defaultNetworkList = (0, scom_network_list_1.default)();
                const defaultNetworkMap = defaultNetworkList.reduce((acc, cur) => {
                    acc[cur.chainId] = cur;
                    return acc;
                }, {});
                for (const chainId in defaultNetworkMap) {
                    const networkInfo = defaultNetworkMap[chainId];
                    const explorerUrl = networkInfo.blockExplorerUrls && networkInfo.blockExplorerUrls.length ? networkInfo.blockExplorerUrls[0] : "";
                    if (infuraId && networkInfo.rpcUrls && networkInfo.rpcUrls.length > 0) {
                        for (let i = 0; i < networkInfo.rpcUrls.length; i++) {
                            networkInfo.rpcUrls[i] = networkInfo.rpcUrls[i].replace(/{INFURA_ID}/g, infuraId);
                        }
                    }
                    networkMap[networkInfo.chainId] = {
                        ...networkInfo,
                        symbol: networkInfo.nativeCurrency?.symbol || "",
                        explorerTxUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}tx/` : "",
                        explorerAddressUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}address/` : ""
                    };
                }
                return networkMap;
            };
            const multicalls = (0, scom_multicall_1.getMulticallInfoList)();
            const networkMap = this.getNetworkMap(options.infuraId);
            components_1.application.store = {
                infuraId: options.infuraId,
                multicalls,
                networkMap
            };
        }
        async init() {
            super.init();
            // this.scomPaymentWidget.onStartPayment({
            //   amount: 1000,
            //   paymentId: '262951AA-D913-40A5-9468-7EB8B92706E3',
            //   address: '0xA81961100920df22CF98703155029822f2F7f033'
            // });
        }
        onSubmit(content, medias) {
            console.log(content);
        }
        async handlePaymentSuccess() {
        }
        render() {
            return this.$render("i-panel", { width: "100%" },
                this.$render("i-hstack", { id: "mainStack", margin: { top: '1rem', left: '1rem' }, gap: "2rem", width: "100%", padding: { top: '1rem', bottom: '1rem' } },
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
