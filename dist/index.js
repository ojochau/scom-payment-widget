var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-payment-widget/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PaymentProvider = exports.PaymentType = exports.ProductType = void 0;
    ///<amd-module name='@scom/scom-payment-widget/interface.ts'/> 
    var ProductType;
    (function (ProductType) {
        ProductType["Physical"] = "Physical";
        ProductType["Digital"] = "Digital";
        ProductType["Course"] = "Course";
        ProductType["Ebook"] = "Ebook";
        ProductType["Membership"] = "Membership";
        ProductType["Bundle"] = "Bundle";
    })(ProductType = exports.ProductType || (exports.ProductType = {}));
    var PaymentType;
    (function (PaymentType) {
        PaymentType["Fiat"] = "Fiat";
        PaymentType["Crypto"] = "Crypto";
    })(PaymentType = exports.PaymentType || (exports.PaymentType = {}));
    var PaymentProvider;
    (function (PaymentProvider) {
        PaymentProvider["Stripe"] = "Stripe";
        PaymentProvider["Paypal"] = "Paypal";
        PaymentProvider["TonWallet"] = "Ton Wallet";
        PaymentProvider["Metamask"] = "Metamask";
    })(PaymentProvider = exports.PaymentProvider || (exports.PaymentProvider = {}));
});
define("@scom/scom-payment-widget/store.ts", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-network-list", "@scom/scom-payment-widget/interface.ts"], function (require, exports, components_1, eth_wallet_1, scom_network_list_1, interface_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stripeSpecialCurrencies = exports.stripeZeroDecimalCurrencies = exports.stripeCurrencies = exports.PaymentProviders = exports.getStripeKey = exports.isClientWalletConnected = exports.getClientWallet = exports.State = exports.STRIPE_LIB_URL = void 0;
    const infuraId = 'adc596bf88b648e2a8902bc9093930c5';
    exports.STRIPE_LIB_URL = 'https://js.stripe.com/v3';
    class State {
        constructor(options) {
            this.rpcWalletId = '';
            this.networkMap = {};
            this.infuraId = '';
            this.getNetworkInfo = (chainId) => {
                return this.networkMap[chainId];
            };
            if (options.infuraId) {
                this.infuraId = options.infuraId;
            }
        }
        initRpcWallet(defaultChainId) {
            if (this.rpcWalletId) {
                return this.rpcWalletId;
            }
            const clientWallet = eth_wallet_1.Wallet.getClientInstance();
            const networkList = Object.values(components_1.application.store?.networkMap || []);
            const instanceId = clientWallet.initRpcWallet({
                networks: networkList,
                defaultChainId,
                infuraId: components_1.application.store?.infuraId,
                multicalls: components_1.application.store?.multicalls
            });
            this.rpcWalletId = instanceId;
            if (clientWallet.address) {
                const rpcWallet = eth_wallet_1.Wallet.getRpcWalletInstance(instanceId);
                rpcWallet.address = clientWallet.address;
            }
            const defaultNetworkList = (0, scom_network_list_1.default)();
            const defaultNetworkMap = defaultNetworkList.reduce((acc, cur) => {
                acc[cur.chainId] = cur;
                return acc;
            }, {});
            for (let network of networkList) {
                const networkInfo = defaultNetworkMap[network.chainId];
                if (!networkInfo)
                    continue;
                if (infuraId && network.rpcUrls && network.rpcUrls.length > 0) {
                    for (let i = 0; i < network.rpcUrls.length; i++) {
                        network.rpcUrls[i] = network.rpcUrls[i].replace(/{InfuraId}/g, infuraId);
                    }
                }
                this.networkMap[network.chainId] = {
                    ...networkInfo,
                    ...network
                };
            }
            return instanceId;
        }
        getRpcWallet() {
            return this.rpcWalletId ? eth_wallet_1.Wallet.getRpcWalletInstance(this.rpcWalletId) : null;
        }
        isRpcWalletConnected() {
            const wallet = this.getRpcWallet();
            return wallet?.isConnected;
        }
        getChainId() {
            const rpcWallet = this.getRpcWallet();
            return rpcWallet?.chainId;
        }
    }
    exports.State = State;
    function getClientWallet() {
        return eth_wallet_1.Wallet.getClientInstance();
    }
    exports.getClientWallet = getClientWallet;
    function isClientWalletConnected() {
        const wallet = eth_wallet_1.Wallet.getClientInstance();
        return wallet.isConnected;
    }
    exports.isClientWalletConnected = isClientWalletConnected;
    async function getStripeKey(apiUrl) {
        let publishableKey;
        try {
            const response = await fetch(apiUrl);
            if (response.ok) {
                const data = await response.json();
                if (data.publishableKey) {
                    publishableKey = data.publishableKey;
                }
            }
        }
        catch (error) {
            console.log(error);
        }
        if (publishableKey) {
            console.log('initStripePayment', 'Cannot get the publishableKey');
        }
        return publishableKey;
    }
    exports.getStripeKey = getStripeKey;
    exports.PaymentProviders = [
        {
            provider: interface_1.PaymentProvider.Stripe,
            type: interface_1.PaymentType.Fiat,
            image: 'stripe.png'
        },
        {
            provider: interface_1.PaymentProvider.TonWallet,
            type: interface_1.PaymentType.Crypto,
            image: 'ton.png'
        },
        {
            provider: interface_1.PaymentProvider.Metamask,
            type: interface_1.PaymentType.Crypto,
            image: 'metamask.png'
        }
    ];
    exports.stripeCurrencies = [
        "aed", "afn", "all", "amd", "ang", "aoa", "ars", "aud", "awg", "azn",
        "bam", "bbd", "bdt", "bgn", "bhd", "bif", "bmd", "bnd", "bob", "brl",
        "bsd", "btn", "bwp", "byn", "byr", "bzd", "cad", "cdf", "chf", "clf",
        "clp", "cny", "cop", "crc", "cuc", "cup", "cve", "czk", "djf", "dkk",
        "dop", "dzd", "egp", "ern", "etb", "eur", "fjd", "fkp", "gbp", "gel",
        "ghs", "gip", "gmd", "gnf", "gtq", "gyd", "hkd", "hnl", "htg", "huf",
        "idr", "ils", "inr", "iqd", "irr", "isk", "jmd", "jod", "jpy", "kes",
        "kgs", "khr", "kmf", "kpw", "krw", "kwd", "kyd", "kzt", "lak", "lbp",
        "lkr", "lrd", "lsl", "ltl", "lvl", "lyd", "mad", "mdl", "mga", "mkd",
        "mmk", "mnt", "mop", "mro", "mur", "mvr", "mwk", "mxn", "myr", "mzn",
        "nad", "ngn", "nio", "nok", "npr", "nzd", "omr", "pab", "pen", "pgk",
        "php", "pkr", "pln", "pyg", "qar", "ron", "rsd", "rub", "rwf", "sar",
        "sbd", "scr", "sdg", "sek", "sgd", "shp", "skk", "sll", "sos", "srd",
        "ssp", "std", "svc", "syp", "szl", "thb", "tjs", "tmt", "tnd", "top",
        "try", "ttd", "twd", "tzs", "uah", "ugx", "usd", "uyu", "uzs", "vef",
        "vnd", "vuv", "wst", "xaf", "xag", "xau", "xcd", "xdr", "xof", "xpf",
        "yer", "zar", "zmk", "zmw", "btc", "jep", "eek", "ghc", "mtl", "tmm",
        "yen", "zwd", "zwl", "zwn", "zwr"
    ];
    exports.stripeZeroDecimalCurrencies = [
        "bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga",
        "pyg", "rwf", "ugx", "vnd", "vuv", "xaf", "xof", "xpf"
    ];
    exports.stripeSpecialCurrencies = [
        'isk', 'huf', 'twd', 'ugx'
    ];
});
define("@scom/scom-payment-widget/defaultData.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-payment-widget/defaultData.ts'/> 
    const Tokens_BSC_Testnet = [
        {
            "name": "USDT",
            "address": "0x29386B60e0A9A1a30e1488ADA47256577ca2C385",
            "symbol": "USDT",
            "decimals": 6,
        }
    ];
    const Tokens_Fuji = [
        {
            "name": "Tether USD",
            "address": "0xb9C31Ea1D475c25E58a1bE1a46221db55E5A7C6e",
            "symbol": "USDT.e",
            "decimals": 6
        }
    ];
    exports.default = {
        "infuraId": "adc596bf88b648e2a8902bc9093930c5",
        "defaultData": {
            "baseStripeApi": "",
            "urlStripeTracking": "",
            "defaultChainId": 97,
            "networks": [
                {
                    "chainId": 97
                },
                {
                    "chainId": 43113
                }
            ],
            "tokens": [
                ...Tokens_BSC_Testnet.map(v => { return { ...v, chainId: 97 }; }),
                ...Tokens_Fuji.map(v => { return { ...v, chainId: 43113 }; })
            ],
            "wallets": [
                {
                    "name": "metamask"
                }
            ]
        }
    };
});
define("@scom/scom-payment-widget/components/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.halfWidthButtonStyle = exports.fullWidthButtonStyle = exports.carouselSliderStyle = exports.alertStyle = exports.loadingImageStyle = exports.textUpperCaseStyle = exports.textCenterStyle = exports.elementStyle = void 0;
    const Theme = components_2.Styles.Theme.ThemeVars;
    const spinnerAnim = components_2.Styles.keyframes({
        "0%": {
            transform: 'rotate(0deg)'
        },
        "100%": {
            transform: 'rotate(360deg)'
        },
    });
    exports.elementStyle = components_2.Styles.style({
        display: 'flex',
        flexGrow: 1
    });
    exports.textCenterStyle = components_2.Styles.style({
        textAlign: 'center'
    });
    exports.textUpperCaseStyle = components_2.Styles.style({
        textTransform: 'uppercase'
    });
    exports.loadingImageStyle = components_2.Styles.style({
        animation: `${spinnerAnim} 2s linear infinite`
    });
    exports.alertStyle = components_2.Styles.style({
        $nest: {
            'i-vstack i-label': {
                textAlign: 'center'
            },
            'span': {
                display: 'inline'
            },
            'a': {
                display: 'inline',
                color: Theme.colors.info.main
            }
        }
    });
    exports.carouselSliderStyle = components_2.Styles.style({
        position: 'relative',
        $nest: {
            '.wrapper-slider': {
                $nest: {
                    '.slider-arrow:first-child': {
                        left: '-30px'
                    },
                    '.slider-arrow:last-child': {
                        right: '-30px'
                    }
                }
            },
            '.slider-arrow': {
                position: 'absolute'
            }
        }
    });
    const baseButtonStyle = {
        padding: '0.5rem 0.75rem',
        fontSize: '1rem',
        color: Theme.colors.secondary.contrastText,
        borderRadius: 12,
        maxWidth: 180
    };
    exports.fullWidthButtonStyle = components_2.Styles.style({
        ...baseButtonStyle,
        width: '100%'
    });
    exports.halfWidthButtonStyle = components_2.Styles.style({
        ...baseButtonStyle,
        width: 'calc(50% - 0.5rem)',
        minWidth: 90
    });
});
define("@scom/scom-payment-widget/translations.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-payment-widget/translations.json.ts'/> 
    exports.default = {
        "en": {
            "pay": "Pay",
            "amount_to_pay": "Amount to pay",
            "payment": "Payment",
            "continue": "Continue",
            "back": "Back",
            "close": "Close",
            "payment_id": "Payment ID",
            "price": "Price",
            "quantity": "Quantity",
            "fiat_currency": "Fiat currency",
            "crypto_currency": "Crypto currency",
            "select_payment_gateway": "Select a payment gateway",
            "select_your_wallet": "Select your wallet",
            "how_will_you_pay": "How will you pay?",
            "success": "Success",
            "failed": "Failed",
            "payment_completed": "Payment completed",
            "payment_pending": "Payment pending",
            "payment_failed": "Payment failed",
            "view_transaction": "View transaction",
            "checkout": "Checkout",
            "check_payment_status": "Check your payment status here",
            "cannot_get_payment_info": "Cannot get payment info",
            "paid_to_address": "Paid to address",
            "connect_wallet": "Connect Wallet",
            "payment_received_success": "Success! Payment received.",
            "payment_processing": "Payment processing. We'll update you when payment is received.",
            "something_went_wrong": "Something went wrong!",
            "invalid_payment_id": "The payment ID is invalid!",
            "check_stripe_payment_status": "Check Stripe payment status",
            "check": "Check"
        },
        "zh-hant": {
            "pay": "付款",
            "amount_to_pay": "應付金額",
            "payment": "付款",
            "continue": "繼續",
            "back": "返回",
            "close": "關閉",
            "payment_id": "付款編號",
            "price": "價格",
            "quantity": "數量",
            "fiat_currency": "法幣",
            "crypto_currency": "加密貨幣",
            "select_payment_gateway": "選擇支付閘道",
            "select_your_wallet": "選擇你的錢包",
            "how_will_you_pay": "你將如何付款？",
            "success": "成功",
            "failed": "失敗",
            "payment_completed": "付款完成",
            "payment_pending": "付款待處理",
            "payment_failed": "付款失敗",
            "view_transaction": "查看交易",
            "checkout": "結帳",
            "check_payment_status": "在這裡查看您的付款狀態",
            "cannot_get_payment_info": "無法獲取付款信息",
            "paid_to_address": "付款至地址",
            "connect_wallet": "連接錢包",
            "payment_received_success": "成功！付款已收到",
            "payment_processing": "付款處理中。收到付款後，我們會更新狀態",
            "something_went_wrong": "出錯了！",
            "invalid_payment_id": "付款編號無效！",
            "check_stripe_payment_status": "查看 Stripe 付款狀態",
            "check": "檢查"
        },
        "vi": {
            "pay": "Thanh toán",
            "amount_to_pay": "Số tiền cần trả",
            "payment": "Thanh toán",
            "continue": "Tiếp tục",
            "back": "Quay lại",
            "close": "Đóng",
            "payment_id": "Mã giao dịch",
            "price": "Giá",
            "quantity": "Số lượng",
            "fiat_currency": "Tiền pháp định",
            "crypto_currency": "Tiền điện tử",
            "select_payment_gateway": "Chọn cổng thanh toán",
            "select_your_wallet": "Chọn ví của bạn",
            "how_will_you_pay": "Bạn sẽ thanh toán như thế nào?",
            "success": "Thành công",
            "failed": "Thất bại",
            "payment_completed": "Thanh toán hoàn tất",
            "payment_pending": "Thanh toán đang chờ xử lý",
            "payment_failed": "Thanh toán thất bại",
            "view_transaction": "Xem giao dịch",
            "checkout": "Thanh toán",
            "check_payment_status": "Kiểm tra trạng thái thanh toán của bạn tại đây",
            "cannot_get_payment_info": "Không thể lấy thông tin thanh toán",
            "paid_to_address": "Thanh toán đến địa chỉ",
            "connect_wallet": "Kết nối ví",
            "payment_received_success": "Thành công! Đã nhận được thanh toán",
            "payment_processing": "Đang xử lý thanh toán. Chúng tôi sẽ cập nhật cho bạn khi thanh toán được nhận",
            "something_went_wrong": "Đã có lỗi xảy ra!",
            "invalid_payment_id": "Mã giao dịch không hợp lệ!",
            "check_stripe_payment_status": "Kiểm tra trạng thái thanh toán Stripe",
            "check": "Kiểm tra"
        }
    };
});
define("@scom/scom-payment-widget/components/invoiceCreation.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-payment-widget/components/index.css.ts", "@scom/scom-payment-widget/interface.ts", "@scom/scom-payment-widget/translations.json.ts"], function (require, exports, components_3, index_css_1, interface_2, translations_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InvoiceCreation = void 0;
    const Theme = components_3.Styles.Theme.ThemeVars;
    let InvoiceCreation = class InvoiceCreation extends components_3.Module {
        get payment() {
            return this._payment;
        }
        set payment(value) {
            this._payment = value;
            this.updateInfo();
        }
        get totalPrice() {
            return (this.payment.products?.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0) || 0) + this.totalShippingCost;
        }
        get totalShippingCost() {
            return this.payment.products?.reduce((sum, item) => sum + (Number(item.shippingCost || 0) * item.quantity), 0) || 0;
        }
        constructor(parent, options) {
            super(parent, options);
            this._payment = { title: '', paymentId: '', products: [] };
        }
        renderProducts() {
            if (this.payment?.products.length) {
                const nodeItems = [];
                for (const product of this.payment.products) {
                    const element = (this.$render("i-vstack", { gap: "1rem", width: "100%" },
                        product.images?.length ? this.$render("i-image", { url: product.images[0], width: "auto", maxWidth: "100%", height: 100, margin: { left: 'auto', right: 'auto' } }) : [],
                        this.$render("i-label", { caption: product.name, font: { bold: true } }),
                        this.$render("i-hstack", { gap: "0.5rem", verticalAlignment: "center", horizontalAlignment: "space-between", wrap: "wrap" },
                            this.$render("i-label", { caption: this.i18n.get('$price'), font: { color: Theme.text.hint } }),
                            this.$render("i-label", { caption: `${components_3.FormatUtils.formatNumber(product.price, { decimalFigures: 2 })} ${this.payment.currency || 'USD'}`, font: { bold: true }, class: index_css_1.textUpperCaseStyle })),
                        this.$render("i-hstack", { gap: "0.5rem", verticalAlignment: "center", horizontalAlignment: "space-between", wrap: "wrap" },
                            this.$render("i-label", { caption: this.i18n.get('$quantity'), font: { color: Theme.text.hint } }),
                            this.$render("i-label", { caption: components_3.FormatUtils.formatNumber(product.quantity, { hasTrailingZero: false }), font: { bold: true } }))));
                    nodeItems.push(element);
                }
                this.carouselSlider.items = nodeItems.map((item, idx) => {
                    return {
                        name: `Product ${idx}`,
                        controls: [item]
                    };
                });
                this.carouselSlider.refresh();
                this.carouselSlider.visible = true;
            }
            else {
                this.carouselSlider.visible = false;
            }
        }
        updateInfo() {
            const { paymentId, currency, title, products } = this.payment;
            if (this.pnlItemInfo) {
                const hasTitle = !!title;
                const hasProduct = !!products?.length;
                this.pnlItemInfo.visible = hasTitle || hasProduct;
                this.lbItem.caption = title || '';
                this.lbItem.visible = hasTitle;
                this.renderProducts();
            }
            if (this.lbAmount) {
                this.lbAmount.caption = `${components_3.FormatUtils.formatNumber(this.totalPrice, { decimalFigures: 2 })} ${currency || 'USD'}`;
            }
            if (this.pnlPaymentId) {
                const _paymentId = paymentId || '';
                this.pnlPaymentId.visible = !!_paymentId;
                this.lbPaymentId.caption = _paymentId;
            }
            if (this.btnBack) {
                const hasPhysicalProduct = products.some(v => v.productType === interface_2.ProductType.Physical);
                this.btnBack.visible = hasPhysicalProduct;
                this.btnContinue.width = hasPhysicalProduct ? 'calc(50% - 1rem)' : '100%';
            }
        }
        handleContinue() {
            if (this.onContinue)
                this.onContinue();
        }
        handleBack() {
            if (this.onBack)
                this.onBack();
        }
        async init() {
            this.i18n.init({ ...translations_json_1.default });
            super.init();
            this.onContinue = this.getAttribute('onContinue', true) || this.onContinue;
            this.onBack = this.getAttribute('onBack', true) || this.onBack;
            const payment = this.getAttribute('payment', true);
            if (payment) {
                this.payment = payment;
            }
        }
        render() {
            return this.$render("i-stack", { direction: "vertical", gap: "1rem", width: "100%", alignItems: "center", padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' } },
                this.$render("i-stack", { direction: "vertical", height: "100%" },
                    this.$render("i-stack", { id: "pnlItemInfo", visible: false, direction: "vertical", gap: "1rem", alignItems: "center", width: "100%", margin: { bottom: '1rem' } },
                        this.$render("i-label", { id: "lbItem", class: index_css_1.textCenterStyle, font: { size: '1.25rem', color: Theme.colors.primary.main, bold: true, transform: 'uppercase' } }),
                        this.$render("i-carousel-slider", { id: "carouselSlider", width: "calc(100% - 60px)", maxWidth: 280, height: "100%", overflow: "inherit", minHeight: 80, slidesToShow: 1, transitionSpeed: 300, autoplay: true, autoplaySpeed: 6000, items: [], type: "arrow", class: index_css_1.carouselSliderStyle }),
                        this.$render("i-panel", { height: 1, width: "80%", background: { color: Theme.divider } })),
                    this.$render("i-stack", { direction: "vertical", gap: "1rem", alignItems: "center", width: "100%", margin: { bottom: '1.5rem' } },
                        this.$render("i-stack", { direction: "vertical", gap: "0.5rem", alignItems: "center" },
                            this.$render("i-label", { caption: "$amount_to_pay", font: { color: Theme.text.primary, bold: true, transform: 'uppercase' } }),
                            this.$render("i-label", { id: "lbAmount", class: index_css_1.textCenterStyle, font: { size: '1.25rem', color: Theme.colors.primary.main, bold: true } })),
                        this.$render("i-stack", { id: "pnlPaymentId", visible: false, direction: "vertical", gap: "0.25rem", alignItems: "center" },
                            this.$render("i-label", { caption: "$payment_id", font: { color: Theme.text.primary, bold: true, transform: 'uppercase' } }),
                            this.$render("i-label", { id: "lbPaymentId", class: index_css_1.textCenterStyle, font: { color: Theme.text.primary, bold: true, transform: 'uppercase' } })))),
                this.$render("i-stack", { direction: "horizontal", width: "100%", alignItems: "center", justifyContent: "center", margin: { top: 'auto' }, gap: "1rem", wrap: "wrap-reverse" },
                    this.$render("i-button", { id: "btnBack", caption: "$back", visible: false, class: index_css_1.halfWidthButtonStyle, background: { color: Theme.colors.secondary.main }, onClick: this.handleBack }),
                    this.$render("i-button", { id: "btnContinue", caption: "$continue", background: { color: Theme.colors.primary.main }, class: index_css_1.fullWidthButtonStyle, onClick: this.handleContinue })));
        }
    };
    InvoiceCreation = __decorate([
        (0, components_3.customElements)('scom-payment-widget--invoice-creation')
    ], InvoiceCreation);
    exports.InvoiceCreation = InvoiceCreation;
});
define("@scom/scom-payment-widget/assets.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const moduleDir = components_4.application.currentModuleDir;
    function fullPath(path) {
        return `${moduleDir}/${path}`;
    }
    ;
    exports.default = {
        fullPath
    };
});
define("@scom/scom-payment-widget/components/common/header.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-payment-widget/components/index.css.ts", "@scom/scom-payment-widget/translations.json.ts"], function (require, exports, components_5, index_css_2, translations_json_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PaymentHeader = void 0;
    const Theme = components_5.Styles.Theme.ThemeVars;
    let PaymentHeader = class PaymentHeader extends components_5.Module {
        setHeader(title, currency, amount) {
            if (this.lbTitle) {
                if (this.lbTitle.caption !== title)
                    this.lbTitle.caption = title || '';
                const formattedAmount = `${components_5.FormatUtils.formatNumber(amount, { decimalFigures: 2 })} ${currency?.toUpperCase() || 'USD'}`;
                if (this.lbAmount.caption !== formattedAmount)
                    this.lbAmount.caption = formattedAmount;
            }
        }
        init() {
            this.i18n.init({ ...translations_json_2.default });
            super.init();
            this.width = '100%';
        }
        render() {
            return (this.$render("i-stack", { direction: "vertical", gap: "0.5rem", justifyContent: "center", alignItems: "center", width: "100%", minHeight: 85, padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, background: { color: Theme.colors.primary.main } },
                this.$render("i-label", { id: "lbTitle", class: index_css_2.textCenterStyle, font: { size: '0.875rem', color: Theme.text.primary, bold: true }, wordBreak: "break-word" }),
                this.$render("i-label", { caption: "$amount_to_pay", font: { size: '0.675rem', bold: true, transform: 'uppercase', color: Theme.text.primary } }),
                this.$render("i-label", { id: "lbAmount", font: { size: '0.875rem', color: Theme.text.primary, bold: true } })));
        }
    };
    PaymentHeader = __decorate([
        (0, components_5.customElements)('scom-payment-widget--header')
    ], PaymentHeader);
    exports.PaymentHeader = PaymentHeader;
});
define("@scom/scom-payment-widget/components/common/index.ts", ["require", "exports", "@scom/scom-payment-widget/components/common/header.tsx"], function (require, exports, header_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PaymentHeader = void 0;
    Object.defineProperty(exports, "PaymentHeader", { enumerable: true, get: function () { return header_1.PaymentHeader; } });
});
define("@scom/scom-payment-widget/components/paymentMethod.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-payment-widget/interface.ts", "@scom/scom-payment-widget/assets.ts", "@scom/scom-payment-widget/store.ts", "@scom/scom-payment-widget/components/index.css.ts", "@scom/scom-payment-widget/translations.json.ts"], function (require, exports, components_6, interface_3, assets_1, store_1, index_css_3, translations_json_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PaymentMethod = void 0;
    const Theme = components_6.Styles.Theme.ThemeVars;
    const paymentTypes = [
        {
            type: interface_3.PaymentType.Fiat,
            title: '$fiat_currency',
            // description: 'Stripe, Paypal, Payme,...etc',
            iconName: 'exchange-alt',
            // providerImages: ['stripe.png', 'paypal.png']
        },
        {
            type: interface_3.PaymentType.Crypto,
            title: '$crypto_currency',
            description: 'Metamask, Ton Wallet,...etc',
            iconName: 'wallet',
            providerImages: ['metamask.png', 'ton.png']
        }
    ];
    let PaymentMethod = class PaymentMethod extends components_6.Module {
        get payment() {
            return this._payment;
        }
        set payment(value) {
            this._payment = value;
            this.updateAmount();
        }
        get totalPrice() {
            return (this.payment.products?.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0) || 0) + this.totalShippingCost;
        }
        get totalShippingCost() {
            return this.payment.products?.reduce((sum, item) => sum + (Number(item.shippingCost || 0) * item.quantity), 0) || 0;
        }
        constructor(parent, options) {
            super(parent, options);
        }
        updateAmount() {
            if (this.header && this.payment) {
                const { title, currency } = this.payment;
                this.header.setHeader(title, currency, this.totalPrice);
            }
        }
        renderMethodItems(type) {
            this.lbPayMethod.caption = this.i18n.get(type === interface_3.PaymentType.Fiat ? '$select_payment_gateway' : '$select_your_wallet');
            const providers = store_1.PaymentProviders.filter(v => v.type === type);
            const nodeItems = [];
            for (const item of providers) {
                nodeItems.push(this.$render("i-stack", { direction: "horizontal", justifyContent: "center", gap: "0.5rem", width: "100%", minHeight: 40, border: { width: 1, style: 'solid', color: Theme.divider, radius: 8 }, padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, cursor: "pointer", onClick: () => this.handlePaymentProvider(item.provider) },
                    this.$render("i-stack", { direction: "horizontal", alignItems: "center", gap: "0.75rem", width: "calc(100% - 30px)" },
                        this.$render("i-image", { width: 20, height: 20, url: assets_1.default.fullPath(`img/${item.image}`) }),
                        this.$render("i-label", { caption: item.provider, font: { size: '1rem', bold: true, color: Theme.text.primary } })),
                    this.$render("i-icon", { name: "arrow-right", width: 20, height: 20, fill: Theme.text.primary, margin: { left: 'auto', right: 'auto' } })));
            }
            this.pnlMethodItems.clearInnerHTML();
            this.pnlMethodItems.append(...nodeItems);
        }
        handlePaymentType(target) {
            const type = target.id;
            if (type === interface_3.PaymentType.Fiat) {
                this.handlePaymentProvider(interface_3.PaymentProvider.Stripe);
            }
            else if (type) {
                this.renderMethodItems(type);
                this.pnlPaymentType.visible = false;
                this.pnlPaymentMethod.visible = true;
            }
        }
        handlePaymentProvider(provider) {
            if (this.onSelectedPaymentProvider)
                this.onSelectedPaymentProvider(this.payment, provider);
        }
        handleBack() {
            if (this.pnlPaymentType.visible && this.onBack) {
                this.onBack();
                return;
            }
            this.lbPayMethod.caption = this.i18n.get('$how_will_you_pay');
            this.pnlPaymentType.visible = true;
            this.pnlPaymentMethod.visible = false;
        }
        async init() {
            this.i18n.init({ ...translations_json_3.default });
            super.init();
            this.onBack = this.getAttribute('onBack', true) || this.onBack;
            this.onSelectedPaymentProvider = this.getAttribute('onSelectedPaymentProvider', true) || this.onSelectedPaymentProvider;
            const payment = this.getAttribute('payment', true);
            if (payment) {
                this.payment = payment;
            }
        }
        render() {
            return this.$render("i-stack", { direction: "vertical", gap: "1rem", alignItems: "center", width: "100%" },
                this.$render("scom-payment-widget--header", { id: "header" }),
                this.$render("i-stack", { direction: "vertical", gap: "1rem", width: "100%", height: "100%", alignItems: "center", padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' } },
                    this.$render("i-label", { id: "lbPayMethod", caption: "$how_will_you_pay", font: { size: '1rem', bold: true, color: Theme.colors.primary.main } }),
                    this.$render("i-stack", { id: "pnlPaymentType", direction: "vertical", gap: "1rem", width: "100%", height: "100%", alignItems: "center" }, paymentTypes.map(v => this.$render("i-stack", { id: v.type, direction: "horizontal", alignItems: "center", gap: "1rem", width: "100%", border: { width: 1, style: 'solid', color: Theme.divider, radius: 8 }, padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, cursor: "pointer", onClick: this.handlePaymentType },
                        this.$render("i-stack", { direction: "vertical", gap: "0.75rem", width: "calc(100% - 30px)" },
                            this.$render("i-stack", { direction: "horizontal", gap: "0.5rem", alignItems: "center" },
                                this.$render("i-icon", { name: v.iconName, width: 20, height: 20, fill: Theme.colors.primary.main }),
                                this.$render("i-label", { caption: v.title, font: { size: '1rem', bold: true, color: Theme.text.primary } })),
                            v.description ? this.$render("i-label", { caption: v.description, font: { color: Theme.text.secondary } }) : [],
                            v.providerImages?.length ? this.$render("i-stack", { direction: "horizontal", gap: "0.25rem" }, v.providerImages.map(image => this.$render("i-image", { width: 20, height: 20, url: assets_1.default.fullPath(`img/${image}`) }))) : []),
                        this.$render("i-icon", { name: "arrow-right", width: 20, height: 20, fill: Theme.text.primary, margin: { left: 'auto', right: 'auto' } })))),
                    this.$render("i-stack", { id: "pnlPaymentMethod", visible: false, direction: "vertical", gap: "2rem", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" },
                        this.$render("i-stack", { id: "pnlMethodItems", direction: "vertical", gap: "1rem", width: "100%", height: "100%" })),
                    this.$render("i-button", { caption: "$back", class: index_css_3.fullWidthButtonStyle, background: { color: Theme.colors.secondary.main }, onClick: this.handleBack })));
        }
    };
    PaymentMethod = __decorate([
        (0, components_6.customElements)('scom-payment-widget--payment-method')
    ], PaymentMethod);
    exports.PaymentMethod = PaymentMethod;
});
define("@scom/scom-payment-widget/components/statusPayment.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-payment-widget/components/index.css.ts", "@scom/scom-payment-widget/assets.ts", "@scom/scom-payment-widget/store.ts", "@scom/scom-payment-widget/interface.ts", "@scom/scom-payment-widget/translations.json.ts"], function (require, exports, components_7, index_css_4, assets_2, store_2, interface_4, translations_json_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StatusPayment = void 0;
    const Theme = components_7.Styles.Theme.ThemeVars;
    let StatusPayment = class StatusPayment extends components_7.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        getStatusText(status) {
            if (status === 'complete') {
                return this.i18n.get('$payment_completed');
            }
            if (status === 'failed') {
                return this.i18n.get('$payment_failed');
            }
            return this.i18n.get('$payment_pending');
        }
        updateStatus(state, info) {
            this.state = state;
            const { status, receipt, provider, ownerAddress } = info;
            this.receipt = receipt;
            this.status = status;
            this.provider = provider;
            const isPending = status === 'pending';
            const isCompleted = status === 'complete';
            this.lbHeaderStatus.caption = this.i18n.get(isPending ? '$payment_pending' : isCompleted ? '$success' : '$failed');
            this.lbHeaderStatus.style.color = isPending ? Theme.colors.primary.main : isCompleted ? Theme.colors.success.main : Theme.colors.error.main;
            this.lbHeaderStatus.style.marginInline = isPending ? 'inherit' : 'auto';
            this.imgHeaderStatus.visible = isPending;
            this.lbStatus.caption = this.getStatusText(status);
            if (isPending) {
                this.imgStatus.classList.add(index_css_4.loadingImageStyle);
            }
            else {
                this.imgStatus.classList.remove(index_css_4.loadingImageStyle);
            }
            this.imgStatus.url = assets_2.default.fullPath(`img/${isPending ? 'loading.svg' : isCompleted ? 'success.svg' : 'error.png'}`);
            const currentProvider = store_2.PaymentProviders.find(v => v.provider === provider);
            this.imgWallet.url = assets_2.default.fullPath(`img/${currentProvider.image}`);
            this.lbAddress.caption = ownerAddress.substr(0, 6) + '...' + ownerAddress.substr(-4);
            this.btnClose.visible = !isPending;
        }
        handleViewTransaction() {
            if (this.provider === interface_4.PaymentProvider.Metamask) {
                const network = this.state.getNetworkInfo(this.state.getChainId());
                if (network && network.explorerTxUrl) {
                    const url = `${network.explorerTxUrl}${this.receipt}`;
                    window.open(url);
                }
            }
            else if (this.provider === interface_4.PaymentProvider.TonWallet) {
                window.open(`https://tonscan.org/transaction/${this.receipt}`);
            }
        }
        handleClose() {
            if (this.onClose)
                this.onClose(this.status);
        }
        async init() {
            this.i18n.init({ ...translations_json_4.default });
            super.init();
            this.onClose = this.getAttribute('onClose', true) || this.onClose;
        }
        render() {
            return this.$render("i-stack", { direction: "vertical", gap: "1rem", width: "100%", alignItems: "center", padding: { top: '1rem', bottom: '1rem' } },
                this.$render("i-stack", { direction: "vertical", gap: "1rem", height: "100%", width: "100%" },
                    this.$render("i-stack", { direction: "horizontal", gap: "1rem", justifyContent: "space-between", alignItems: "center", width: "100%", minHeight: 40, padding: { left: '1rem', right: '1rem', bottom: '1rem' }, border: { bottom: { style: 'solid', width: 1, color: Theme.divider } } },
                        this.$render("i-label", { id: "lbHeaderStatus", font: { size: '0.875rem', color: Theme.colors.primary.main, transform: 'uppercase', bold: true } }),
                        this.$render("i-image", { id: "imgHeaderStatus", class: index_css_4.loadingImageStyle, url: assets_2.default.fullPath('img/loading.svg'), width: 20, height: 20, minWidth: 20 })),
                    this.$render("i-stack", { direction: "vertical", gap: "1rem", width: "100%", height: "100%", alignItems: "center", padding: { left: '1rem', right: '1rem' } },
                        this.$render("i-stack", { direction: "horizontal", justifyContent: "space-between", alignItems: "center", gap: "1rem", width: "100%", wrap: "wrap", margin: { bottom: '0.5rem' } },
                            this.$render("i-stack", { direction: "horizontal", gap: "0.5rem", alignItems: "center", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, border: { style: 'solid', width: 1, color: Theme.divider, radius: 8 } },
                                this.$render("i-image", { id: "imgWallet", width: 24, height: 24, minWidth: 24 }),
                                this.$render("i-label", { id: "lbAddress" })),
                            this.$render("i-stack", { direction: "horizontal", gap: "0.5rem", alignItems: "center", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, border: { style: 'solid', width: 1, color: Theme.divider, radius: 8 }, cursor: "pointer", width: "fit-content", onClick: this.handleViewTransaction },
                                this.$render("i-label", { caption: "$view_transaction" }))),
                        this.$render("i-stack", { direction: "vertical", alignItems: "center", justifyContent: "center", gap: "1rem", width: "100%", height: "100%" },
                            this.$render("i-image", { id: "imgStatus", width: 64, height: 64 }),
                            this.$render("i-label", { id: "lbStatus", class: index_css_4.textCenterStyle, font: { size: '1rem', color: Theme.text.primary, bold: true } })))),
                this.$render("i-button", { id: "btnClose", visible: false, caption: "$close", background: { color: Theme.colors.primary.main }, class: index_css_4.fullWidthButtonStyle, onClick: this.handleClose }));
        }
    };
    StatusPayment = __decorate([
        (0, components_7.customElements)('scom-payment-widget--status-payment')
    ], StatusPayment);
    exports.StatusPayment = StatusPayment;
});
define("@scom/scom-payment-widget/utils.ts", ["require", "exports", "@scom/scom-payment-widget/store.ts"], function (require, exports, store_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.loadStripe = void 0;
    async function loadStripe() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = store_3.STRIPE_LIB_URL;
            script.async = true;
            script.onload = () => {
                resolve(true);
            };
            document.head.appendChild(script);
        });
    }
    exports.loadStripe = loadStripe;
});
define("@scom/scom-payment-widget/components/stripePayment.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-payment-widget/store.ts", "@scom/scom-payment-widget/components/index.css.ts", "@scom/scom-payment-widget/utils.ts", "@scom/scom-payment-widget/translations.json.ts"], function (require, exports, components_8, store_4, index_css_5, utils_1, translations_json_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StripePayment = void 0;
    const Theme = components_8.Styles.Theme.ThemeVars;
    let StripePayment = class StripePayment extends components_8.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        set payment(data) {
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
        set baseStripeApi(value) {
            this._baseStripeApi = value;
        }
        get urlStripeTracking() {
            return this._urlStripeTracking;
        }
        set urlStripeTracking(value) {
            this._urlStripeTracking = value;
        }
        get stripeCurrency() {
            const currency = this.payment.currency?.toLowerCase();
            const stripeCurrency = store_4.stripeCurrencies.find(v => v === currency) || 'usd';
            return stripeCurrency;
        }
        updateAmount() {
            if (this.payment && this.header) {
                const { title, currency } = this.payment;
                this.header.setHeader(title, currency, this.totalPrice);
                this.initStripePayment();
            }
        }
        convertToSmallestUnit(amount) {
            const currency = this.stripeCurrency.toLowerCase();
            if (store_4.stripeZeroDecimalCurrencies.includes(currency))
                return Math.round(amount);
            if (store_4.stripeSpecialCurrencies.includes(currency))
                return Math.round(amount) * 100;
            return Math.round(amount * 100);
        }
        async initStripePayment() {
            if (!window.Stripe) {
                await (0, utils_1.loadStripe)();
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
                    this.publishableKey = await (0, store_4.getStripeKey)(`${apiUrl}/key`);
                    if (!this.publishableKey)
                        return;
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
        async createPaymentIntent(currency, amount) {
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
            }
            catch { }
            return null;
        }
        async handleStripeCheckoutClick() {
            if (!this.stripe)
                return;
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
                }
                ;
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
                });
                if (error) {
                    this.showAlert('error', this.i18n.get('$payment_failed'), error.message);
                }
                else {
                    this.showAlert('success', this.i18n.get('$payment_completed'), `${this.i18n.get('$check_payment_status')} <a href='${url}?payment_intent_client_secret=${clientSecret}' target='_blank'>${clientSecret}</a>`);
                }
                this.showButtonIcon(false);
            });
        }
        showButtonIcon(value) {
            this.btnCheckout.rightIcon.spin = value;
            this.btnCheckout.rightIcon.visible = value;
        }
        async showAlert(status, title, msg) {
            if (status === 'success') {
                this.mdAlert.onClose = () => {
                    if (this.onPaymentSuccess) {
                        this.onPaymentSuccess('success');
                    }
                };
            }
            else {
                this.mdAlert.onClose = () => { };
            }
            this.mdAlert.status = status;
            this.mdAlert.title = title;
            this.mdAlert.content = msg;
            this.mdAlert.showModal();
        }
        handleBack() {
            if (this.onBack)
                this.onBack();
        }
        async init() {
            this.i18n.init({ ...translations_json_5.default });
            super.init();
            this.onPaymentSuccess = this.getAttribute('onPaymentSuccess', true) || this.onPaymentSuccess;
            this.onBack = this.getAttribute('onBack', true) || this.onBack;
            const payment = this.getAttribute('payment', true);
            if (payment)
                this.payment = payment;
            const baseStripeApi = this.getAttribute('baseStripeApi', true);
            if (baseStripeApi)
                this.baseStripeApi = baseStripeApi;
            const urlStripeTracking = this.getAttribute('urlStripeTracking', true);
            if (urlStripeTracking)
                this.urlStripeTracking = urlStripeTracking;
        }
        render() {
            return this.$render("i-stack", { direction: "vertical", alignItems: "center", width: "100%" },
                this.$render("scom-payment-widget--header", { id: "header", margin: { bottom: '1rem' }, display: "flex" }),
                this.$render("i-stack", { direction: "vertical", gap: "1rem", width: "100%", height: "100%", alignItems: "center", padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' } },
                    this.$render("i-stack", { direction: "vertical", id: "pnlStripePaymentForm", background: { color: '#fff' }, border: { radius: 12 }, padding: { top: '1rem', left: '1rem', bottom: '2rem', right: '1rem' } }),
                    this.$render("i-stack", { direction: "horizontal", width: "100%", alignItems: "center", justifyContent: "center", margin: { top: 'auto' }, gap: "1rem", wrap: "wrap-reverse" },
                        this.$render("i-button", { caption: "$back", background: { color: Theme.colors.secondary.main }, class: index_css_5.halfWidthButtonStyle, onClick: this.handleBack }),
                        this.$render("i-button", { id: "btnCheckout", caption: "$checkout", background: { color: Theme.colors.primary.main }, class: index_css_5.halfWidthButtonStyle, onClick: this.handleStripeCheckoutClick }))),
                this.$render("i-alert", { id: "mdAlert", class: index_css_5.alertStyle }));
        }
    };
    StripePayment = __decorate([
        (0, components_8.customElements)('scom-payment-widget--stripe-payment')
    ], StripePayment);
    exports.StripePayment = StripePayment;
});
define("@scom/scom-payment-widget/components/walletPayment.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-payment-widget/interface.ts", "@scom/scom-payment-widget/assets.ts", "@scom/scom-payment-widget/defaultData.ts", "@scom/scom-token-list", "@scom/scom-payment-widget/store.ts", "@ijstech/eth-wallet", "@scom/scom-payment-widget/components/index.css.ts", "@scom/scom-payment-widget/translations.json.ts"], function (require, exports, components_9, interface_5, assets_3, defaultData_1, scom_token_list_1, store_5, eth_wallet_2, index_css_6, translations_json_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WalletPayment = void 0;
    const path = components_9.application.currentModuleDir;
    const Theme = components_9.Styles.Theme.ThemeVars;
    let WalletPayment = class WalletPayment extends components_9.Module {
        constructor(parent, options) {
            super(parent, options);
            this._wallets = [];
            this._networks = [];
            this._tokens = [];
            this.rpcWalletEvents = [];
        }
        get dappContainer() {
            return this._dappContainer;
        }
        set dappContainer(container) {
            this._dappContainer = container;
        }
        get payment() {
            return this._payment;
        }
        set payment(value) {
            this._payment = value;
            this.updateAmount();
        }
        get totalPrice() {
            return (this.payment.products?.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0) || 0) + this.totalShippingCost;
        }
        get totalShippingCost() {
            return this.payment.products?.reduce((sum, item) => sum + (Number(item.shippingCost || 0) * item.quantity), 0) || 0;
        }
        get state() {
            return this._state;
        }
        set state(value) {
            this._state = value;
        }
        get wallets() {
            return this._wallets ?? defaultData_1.default.defaultData.wallets;
        }
        set wallets(value) {
            this._wallets = value;
        }
        get networks() {
            return this._networks ?? defaultData_1.default.defaultData.networks;
        }
        set networks(value) {
            this._networks = value;
        }
        get tokens() {
            return this._tokens ?? defaultData_1.default.defaultData.tokens;
        }
        set tokens(value) {
            this._tokens = value;
        }
        get rpcWallet() {
            return this.state.getRpcWallet();
        }
        async onStartPayment(payment) {
            this.payment = payment;
            if (!this.header)
                return;
            this.isInitialized = true;
            if (this.payment.provider === interface_5.PaymentProvider.Metamask) {
                await this.initWallet();
            }
            else if (this.payment.provider === interface_5.PaymentProvider.TonWallet) {
                this.initTonWallet();
            }
            this.showFirstScreen();
            this.updateAmount();
            this.checkWalletStatus();
        }
        showFirstScreen() {
            this.header.visible = true;
            this.pnlPayAmount.visible = false;
            this.pnlTokenItems.visible = true;
            this.pnlPayDetail.visible = false;
            this.btnPay.visible = false;
            this.btnBack.width = '100%';
            this.isToPay = false;
        }
        removeRpcWalletEvents() {
            const rpcWallet = this.rpcWallet;
            for (let event of this.rpcWalletEvents) {
                rpcWallet.unregisterWalletEvent(event);
            }
            this.rpcWalletEvents = [];
        }
        async resetRpcWallet() {
            this.removeRpcWalletEvents();
            await this.state.initRpcWallet(defaultData_1.default.defaultData.defaultChainId);
            const rpcWallet = this.rpcWallet;
            const chainChangedEvent = rpcWallet.registerWalletEvent(this, eth_wallet_2.Constants.RpcWalletEvent.ChainChanged, async (chainId) => {
                this.showFirstScreen();
                this.checkWalletStatus();
            });
            const connectedEvent = rpcWallet.registerWalletEvent(this, eth_wallet_2.Constants.RpcWalletEvent.Connected, async (connected) => {
                this.checkWalletStatus();
            });
            this.rpcWalletEvents.push(chainChangedEvent, connectedEvent);
            this.updateDappContainer();
        }
        async initWallet() {
            if (this.isWalletInitialized)
                return;
            try {
                await eth_wallet_2.Wallet.getClientInstance().init();
                await this.resetRpcWallet();
                await this.rpcWallet.init();
                this.isWalletInitialized = true;
            }
            catch (err) {
                console.log(err);
            }
        }
        initTonWallet() {
            try {
                if (this.tonConnectUI)
                    return;
                let UI = window['TON_CONNECT_UI'];
                this.tonConnectUI = new UI.TonConnectUI({
                    manifestUrl: 'https://ton.noto.fan/tonconnect/manifest.json',
                    buttonRootId: 'btnTonWallet'
                });
                this.tonConnectUI.connectionRestored.then(async (restored) => {
                    this.isTonWalletConnected = this.tonConnectUI.connected;
                    this.checkWalletStatus();
                });
                this.tonConnectUI.onStatusChange((walletAndwalletInfo) => {
                    this.isTonWalletConnected = !!walletAndwalletInfo;
                    this.checkWalletStatus();
                });
            }
            catch (err) {
                console.log(err);
            }
        }
        async connectTonWallet() {
            try {
                await this.tonConnectUI.openModal();
            }
            catch (err) {
                console.log(err);
            }
        }
        async loadTonWeb() {
            if (this.tonWeb)
                return;
            const self = this;
            const moduleDir = this['currentModuleDir'] || path;
            return new Promise((resolve, reject) => {
                components_9.RequireJS.config({
                    baseUrl: `${moduleDir}/lib`,
                    paths: {
                        'tonweb': 'tonweb'
                    }
                });
                components_9.RequireJS.require(['tonweb'], function (TonWeb) {
                    // self.tonWeb = new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC'));
                    self.tonWeb = new TonWeb();
                    resolve();
                });
            });
        }
        async loadTonConnectUI() {
            if (window['TON_CONNECT_UI'])
                return;
            const moduleDir = this['currentModuleDir'] || path;
            return new Promise((resolve, reject) => {
                components_9.RequireJS.config({
                    baseUrl: `${moduleDir}/lib`,
                    paths: {
                        'tonconnect-ui': 'tonconnect-ui'
                    }
                });
                components_9.RequireJS.require(['tonconnect-ui'], function (TonConnectUI) {
                    window['TON_CONNECT_UI'] = TonConnectUI;
                    resolve();
                });
            });
        }
        async loadLib() {
            const promises = [];
            promises.push(this.loadTonConnectUI());
            promises.push(this.loadTonWeb());
            await Promise.all(promises);
        }
        updateAmount() {
            if (this.header && this.payment) {
                const currency = this.payment.currency || 'USD';
                const title = this.payment.title || '';
                this.header.setHeader(title, currency, this.totalPrice);
                if (this.lbPayItem.caption !== title)
                    this.lbPayItem.caption = title;
                const formattedAmount = `${components_9.FormatUtils.formatNumber(this.totalPrice, { decimalFigures: 2 })} ${currency || 'USD'}`;
                if (this.lbPayAmount.caption !== formattedAmount)
                    this.lbPayAmount.caption = formattedAmount;
            }
        }
        async checkWalletStatus() {
            const paymentProvider = this.payment.provider;
            let isConnected;
            if (paymentProvider === interface_5.PaymentProvider.Metamask) {
                isConnected = (0, store_5.isClientWalletConnected)();
            }
            else if (paymentProvider === interface_5.PaymentProvider.TonWallet) {
                isConnected = this.isTonWalletConnected;
            }
            this.pnlWallet.visible = !isConnected;
            const provider = store_5.PaymentProviders.find(v => v.provider === this.payment.provider);
            if (isConnected) {
                if (paymentProvider === interface_5.PaymentProvider.Metamask) {
                    const wallet = this.state.getRpcWallet();
                    const address = wallet.address;
                    const chainId = wallet.chainId;
                    const network = this.state.getNetworkInfo(chainId);
                    if (provider) {
                        this.imgCurrentWallet.url = assets_3.default.fullPath(`img/${provider.image}`);
                        this.lbCurrentAddress.caption = address.substr(0, 6) + '...' + address.substr(-4);
                        this.imgCurrentNetwork.url = network.image;
                        this.lbCurrentNetwork.caption = network.chainName;
                        this.pnlNetwork.visible = true;
                    }
                    await this.renderErcTokens(chainId);
                }
                else if (paymentProvider === interface_5.PaymentProvider.TonWallet) {
                    const account = this.tonConnectUI.account;
                    const address = account.address;
                    this.pnlNetwork.visible = false;
                    if (provider) {
                        this.imgCurrentWallet.url = assets_3.default.fullPath(`img/${provider.image}`);
                        this.lbCurrentAddress.caption = address.substr(0, 6) + '...' + address.substr(-4);
                    }
                    await this.renderTonToken();
                }
            }
            else if (provider) {
                this.imgWallet.url = assets_3.default.fullPath(`img/${provider.image}`);
                this.lbWallet.caption = `Connect to ${provider.provider}`;
            }
            this.pnlTokens.visible = isConnected;
        }
        async updateTokenBalances(tokens) {
            const arr = (tokens || this.tokens).reduce((acc, token) => {
                const { chainId } = token;
                if (!acc[chainId]) {
                    acc[chainId] = [];
                }
                acc[chainId].push(token);
                return acc;
            }, {});
            let promises = [];
            for (const chainId in arr) {
                const tokens = arr[chainId];
                promises.push(scom_token_list_1.tokenStore.updateTokenBalancesByChainId(Number(chainId), tokens));
            }
            await Promise.all(promises);
        }
        async renderErcTokens(chainId) {
            const tokens = this.tokens.filter(v => v.chainId === chainId);
            await this.updateTokenBalances(tokens);
            const network = this.state.getNetworkInfo(chainId);
            const nodeItems = [];
            for (const token of tokens) {
                const balances = scom_token_list_1.tokenStore.getTokenBalancesByChainId(chainId) || {};
                const tokenBalance = balances[token.address?.toLowerCase() || token.symbol] || 0;
                const formattedBalance = components_9.FormatUtils.formatNumber(tokenBalance, { decimalFigures: 2 });
                nodeItems.push(this.$render("i-stack", { direction: "horizontal", justifyContent: "space-between", alignItems: "center", wrap: "wrap", gap: "0.5rem", width: "100%", border: { width: 1, style: 'solid', color: Theme.divider, radius: 8 }, padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, cursor: "pointer", onClick: () => this.handleSelectToken(token) },
                    this.$render("i-stack", { direction: "horizontal", alignItems: "center", gap: "0.75rem" },
                        this.$render("i-image", { width: 20, height: 20, minWidth: 20, url: scom_token_list_1.assets.tokenPath(token, chainId) }),
                        this.$render("i-stack", { direction: "vertical", gap: "0.25rem" },
                            this.$render("i-label", { caption: token.name || token.symbol, font: { bold: true, color: Theme.text.primary } }),
                            this.$render("i-label", { caption: network.chainName || '', font: { size: '0.75rem', color: Theme.text.primary } }))),
                    this.$render("i-stack", { direction: "vertical", gap: "0.25rem" },
                        this.$render("i-label", { caption: `${formattedBalance} ${token.symbol}`, font: { bold: true, color: Theme.text.primary } }))));
            }
            this.pnlTokenItems.clearInnerHTML();
            this.pnlTokenItems.append(...nodeItems);
        }
        async getTonBalance() {
            const account = this.tonConnectUI.account;
            const balance = await this.tonWeb.getBalance(account.address);
            return this.tonWeb.utils.fromNano(balance);
        }
        async renderTonToken() {
            const tonToken = {
                chainId: undefined,
                name: 'Toncoin',
                symbol: 'TON',
                decimals: 18
            };
            const balance = await this.getTonBalance();
            const formattedBalance = components_9.FormatUtils.formatNumber(balance, { decimalFigures: 2 });
            this.pnlTokenItems.clearInnerHTML();
            this.pnlTokenItems.appendChild(this.$render("i-stack", { direction: "horizontal", justifyContent: "space-between", alignItems: "center", wrap: "wrap", gap: "0.5rem", width: "100%", border: { width: 1, style: 'solid', color: Theme.divider, radius: 8 }, padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, cursor: "pointer", onClick: () => this.handleSelectToken(tonToken, true) },
                this.$render("i-stack", { direction: "horizontal", alignItems: "center", gap: "0.75rem" },
                    this.$render("i-image", { width: 20, height: 20, minWidth: 20, url: assets_3.default.fullPath('img/ton.png') }),
                    this.$render("i-stack", { direction: "vertical", gap: "0.25rem" },
                        this.$render("i-label", { caption: tonToken.name, font: { bold: true, color: Theme.text.primary } }),
                        this.$render("i-label", { caption: "Ton", font: { size: '0.75rem', color: Theme.text.primary } }))),
                this.$render("i-stack", { direction: "vertical", gap: "0.25rem" },
                    this.$render("i-label", { caption: `${formattedBalance} ${tonToken.symbol}`, font: { bold: true, color: Theme.text.primary } }))));
        }
        updateDappContainer() {
            const containerData = {
                wallets: this.wallets,
                networks: this.networks,
                showHeader: true,
                rpcWalletId: this.state.getRpcWallet()?.instanceId
            };
            this.dappContainer.setData(containerData);
        }
        handleConnectWallet() {
            if (this.payment.provider === interface_5.PaymentProvider.Metamask) {
                const header = this.dappContainer.querySelector('dapp-container-header');
                header?.openConnectModal();
            }
            else if (this.payment.provider === interface_5.PaymentProvider.TonWallet) {
                this.connectTonWallet();
            }
        }
        handleShowNetworks() {
            const header = this.dappContainer.querySelector('dapp-container-header');
            header?.openNetworkModal();
        }
        handleSelectToken(token, isTon) {
            this.header.visible = false;
            this.pnlTokenItems.visible = false;
            this.pnlPayAmount.visible = true;
            this.pnlPayDetail.visible = true;
            this.btnPay.visible = true;
            this.btnBack.width = 'calc(50% - 1rem)';
            this.isToPay = true;
            const tokenImg = isTon ? assets_3.default.fullPath('img/ton.png') : scom_token_list_1.assets.tokenPath(token, token.chainId);
            this.imgToken.url = tokenImg;
            const { address, currency } = this.payment;
            const toAddress = address || '';
            this.lbToAddress.caption = toAddress.substr(0, 12) + '...' + toAddress.substr(-12);
            const formattedAmount = components_9.FormatUtils.formatNumber(this.totalPrice || 0, { decimalFigures: 2 });
            this.lbAmountToPay.caption = `${formattedAmount} ${token.symbol}`;
            this.lbUSD.caption = `${formattedAmount} ${currency || 'USD'}`;
            this.lbUSD.visible = !isTon;
            this.imgPayToken.url = tokenImg;
        }
        async handleCopyAddress() {
            try {
                await components_9.application.copyToClipboard(this.payment.address);
                this.iconCopyAddress.name = 'check';
                this.iconCopyAddress.fill = Theme.colors.success.main;
                if (this.copyAddressTimer)
                    clearTimeout(this.copyAddressTimer);
                this.copyAddressTimer = setTimeout(() => {
                    this.iconCopyAddress.name = 'copy';
                    this.iconCopyAddress.fill = Theme.text.primary;
                }, 500);
            }
            catch { }
        }
        async handleCopyAmount() {
            try {
                await components_9.application.copyToClipboard(this.totalPrice.toString());
                this.iconCopyAmount.name = 'check';
                this.iconCopyAmount.fill = Theme.colors.success.main;
                if (this.copyAmountTimer)
                    clearTimeout(this.copyAmountTimer);
                this.copyAmountTimer = setTimeout(() => {
                    this.iconCopyAmount.name = 'copy';
                    this.iconCopyAmount.fill = Theme.text.primary;
                }, 500);
            }
            catch { }
        }
        handlePay() {
            if (this.onPaid) {
                let address = '';
                if (this.payment.provider === interface_5.PaymentProvider.Metamask) {
                    const wallet = eth_wallet_2.Wallet.getClientInstance();
                    address = wallet.address;
                }
                else if (this.payment.provider === interface_5.PaymentProvider.TonWallet) {
                    const account = this.tonConnectUI.account;
                    address = account.address;
                }
                this.onPaid({ status: 'pending', provider: this.payment.provider, receipt: '0x00000000000000000000000000000', ownerAddress: address });
                setTimeout(() => {
                    this.onPaid({ status: 'complete', provider: this.payment.provider, receipt: '0x00000000000000000000000000000', ownerAddress: address });
                }, 3000);
            }
        }
        handleBack() {
            if (this.isToPay) {
                this.showFirstScreen();
                return;
            }
            if (this.onBack)
                this.onBack();
        }
        async init() {
            this.i18n.init({ ...translations_json_6.default });
            super.init();
            this.loadLib();
            this.onBack = this.getAttribute('onBack', true) || this.onBack;
            this.onPaid = this.getAttribute('onPaid', true) || this.onPaid;
            const state = this.getAttribute('state', true);
            if (state) {
                this.state = state;
            }
            const payment = this.getAttribute('payment', true);
            if (payment) {
                this.payment = payment;
            }
            const tokens = this.getAttribute('tokens', true);
            if (tokens) {
                this.tokens = tokens;
            }
            if (this.payment && !this.isInitialized) {
                this.onStartPayment(this.payment);
            }
        }
        render() {
            return this.$render("i-stack", { direction: "vertical", alignItems: "center", width: "100%" },
                this.$render("i-stack", { direction: "vertical", alignItems: "center", width: "100%", minHeight: 60, margin: { bottom: '1rem' } },
                    this.$render("scom-payment-widget--header", { id: "header" }),
                    this.$render("i-stack", { id: "pnlPayAmount", visible: false, direction: "vertical", gap: "0.5rem", width: "100%", minHeight: 85, padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, border: { bottom: { style: 'solid', width: 1, color: Theme.divider } } },
                        this.$render("i-label", { id: "lbPayItem", font: { size: '1rem', color: Theme.text.primary, bold: true }, wordBreak: "break-word" }),
                        this.$render("i-stack", { direction: "horizontal", gap: "0.25rem", alignItems: "center", width: "100%" },
                            this.$render("i-image", { id: "imgPayToken", width: 20, height: 20, minWidth: 20, display: "flex" }),
                            this.$render("i-label", { id: "lbPayAmount", font: { size: '1rem', color: Theme.text.primary, bold: true } })))),
                this.$render("i-stack", { direction: "vertical", gap: "1.5rem", width: "100%", height: "100%", alignItems: "center", padding: { top: '1rem', bottom: '1rem' } },
                    this.$render("i-stack", { id: "pnlWallet", visible: false, direction: "vertical", gap: "2rem", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", padding: { left: '1rem', right: '1rem' } },
                        this.$render("i-image", { id: "imgWallet", width: 64, height: 64 }),
                        this.$render("i-label", { id: "lbWallet", font: { size: '0.825rem', bold: true } }),
                        this.$render("i-button", { caption: "$connect_wallet", background: { color: Theme.colors.primary.main }, class: index_css_6.fullWidthButtonStyle, onClick: this.handleConnectWallet }),
                        this.$render("i-button", { caption: "$back", background: { color: Theme.colors.secondary.main }, class: index_css_6.fullWidthButtonStyle, onClick: this.handleBack })),
                    this.$render("i-stack", { id: "pnlTokens", visible: false, direction: "vertical", gap: "1rem", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" },
                        this.$render("i-stack", { direction: "horizontal", justifyContent: "space-between", alignItems: "center", gap: "1rem", width: "100%", wrap: "wrap", margin: { bottom: '0.5rem' }, padding: { left: '1rem', right: '1rem' } },
                            this.$render("i-stack", { direction: "horizontal", gap: "0.5rem", alignItems: "center", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, border: { style: 'solid', width: 1, color: Theme.divider, radius: 8 } },
                                this.$render("i-image", { id: "imgCurrentWallet", width: 24, height: 24, minWidth: 24 }),
                                this.$render("i-label", { id: "lbCurrentAddress" })),
                            this.$render("i-stack", { id: "pnlNetwork", direction: "horizontal", gap: "0.5rem", alignItems: "center", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, border: { style: 'solid', width: 1, color: Theme.divider, radius: 8 }, cursor: "pointer", width: "fit-content", onClick: this.handleShowNetworks },
                                this.$render("i-image", { id: "imgCurrentNetwork", width: 24, height: 24, minWidth: 24 }),
                                this.$render("i-label", { id: "lbCurrentNetwork" }))),
                        this.$render("i-stack", { id: "pnlTokenItems", direction: "vertical", gap: "1rem", width: "100%", height: "100%", minHeight: 100, maxHeight: 240, overflow: "auto", padding: { left: '1rem', right: '1rem' } }),
                        this.$render("i-stack", { id: "pnlPayDetail", visible: false, direction: "vertical", gap: "0.25rem", width: "100%", height: "100%", alignItems: "center", padding: { left: '1rem', right: '1rem' } },
                            this.$render("i-label", { caption: "$paid_to_address" }),
                            this.$render("i-stack", { direction: "horizontal", alignItems: "center", width: "100%", margin: { bottom: '1rem' }, border: { radius: 8 }, background: { color: Theme.input.background }, overflow: "hidden" },
                                this.$render("i-stack", { direction: "horizontal", gap: "0.5rem", alignItems: "center", width: "100%", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' } },
                                    this.$render("i-image", { id: "imgToken", width: 16, height: 16, minWidth: 16, display: "flex" }),
                                    this.$render("i-label", { id: "lbToAddress", wordBreak: "break-all", font: { color: Theme.input.fontColor } })),
                                this.$render("i-stack", { direction: "horizontal", width: 32, minWidth: 32, height: "100%", alignItems: "center", justifyContent: "center", cursor: "pointer", margin: { left: 'auto' }, background: { color: Theme.colors.primary.main }, onClick: this.handleCopyAddress },
                                    this.$render("i-icon", { id: "iconCopyAddress", name: "copy", width: 16, height: 16, cursor: "pointer", fill: Theme.text.primary }))),
                            this.$render("i-stack", { direction: "horizontal", alignItems: "center", width: "100%", border: { radius: 8 }, background: { color: Theme.input.background }, overflow: "hidden" },
                                this.$render("i-stack", { direction: "vertical", gap: "0.5rem", justifyContent: "center", alignItems: "center", width: "100%", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' } },
                                    this.$render("i-label", { caption: "Amount to pay", font: { size: '0.75rem', transform: 'uppercase', color: Theme.input.fontColor } }),
                                    this.$render("i-label", { id: "lbAmountToPay", wordBreak: "break-all", font: { size: '0.875rem', color: Theme.colors.primary.main, bold: true } }),
                                    this.$render("i-label", { id: "lbUSD", wordBreak: "break-all", font: { size: '0.75rem', color: Theme.colors.primary.main } })),
                                this.$render("i-stack", { direction: "horizontal", width: 32, minWidth: 32, height: "100%", alignItems: "center", justifyContent: "center", cursor: "pointer", margin: { left: 'auto' }, background: { color: Theme.colors.primary.main }, onClick: this.handleCopyAmount },
                                    this.$render("i-icon", { id: "iconCopyAmount", name: "copy", width: 16, height: 16, fill: Theme.text.primary })))),
                        this.$render("i-stack", { direction: "horizontal", width: "100%", alignItems: "center", justifyContent: "center", gap: "1rem", wrap: "wrap-reverse", padding: { left: '1rem', right: '1rem' } },
                            this.$render("i-button", { id: "btnBack", caption: "$back", minWidth: 90, background: { color: Theme.colors.secondary.main }, class: index_css_6.fullWidthButtonStyle, onClick: this.handleBack }),
                            this.$render("i-button", { id: "btnPay", visible: false, caption: "$pay", background: { color: Theme.colors.primary.main }, class: index_css_6.halfWidthButtonStyle, onClick: this.handlePay })))),
                this.$render("i-button", { id: "btnTonWallet", visible: false }));
        }
    };
    WalletPayment = __decorate([
        (0, components_9.customElements)('scom-payment-widget--wallet-payment')
    ], WalletPayment);
    exports.WalletPayment = WalletPayment;
});
define("@scom/scom-payment-widget/components/paymentModule.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-payment-widget/defaultData.ts", "@scom/scom-payment-widget/interface.ts", "@scom/scom-payment-widget/components/index.css.ts"], function (require, exports, components_10, defaultData_2, interface_6, index_css_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PaymentModule = void 0;
    let PaymentModule = class PaymentModule extends components_10.Module {
        constructor() {
            super(...arguments);
            this._wallets = [];
            this._networks = [];
            this._tokens = [];
        }
        get dappContainer() {
            return this._dappContainer;
        }
        set dappContainer(container) {
            this._dappContainer = container;
        }
        get state() {
            return this._state;
        }
        set state(value) {
            this._state = value;
        }
        get baseStripeApi() {
            return this._baseStripeApi;
        }
        set baseStripeApi(value) {
            this._baseStripeApi = value;
            if (this.stripePayment)
                this.stripePayment.baseStripeApi = value;
        }
        get urlStripeTracking() {
            return this._urlStripeTracking;
        }
        set urlStripeTracking(value) {
            this._urlStripeTracking = value;
            if (this.stripePayment)
                this.stripePayment.urlStripeTracking = value;
        }
        get wallets() {
            return this._wallets ?? defaultData_2.default.defaultData.wallets;
        }
        set wallets(value) {
            this._wallets = value;
        }
        get networks() {
            return this._networks ?? defaultData_2.default.defaultData.networks;
        }
        set networks(value) {
            this._networks = value;
        }
        get tokens() {
            return this._tokens ?? defaultData_2.default.defaultData.tokens;
        }
        set tokens(value) {
            this._tokens = value;
        }
        show(payment, isModal = true) {
            this.invoiceCreation.payment = payment;
            this.invoiceCreation.visible = true;
            this.paymentMethod.payment = payment;
            this.paymentMethod.visible = false;
            this.walletPayment.visible = false;
            this.walletPayment.state = this.state;
            this.walletPayment.dappContainer = this.dappContainer;
            this.stripePayment.payment = payment;
            this.stripePayment.visible = false;
            this.statusPayment.visible = false;
            this.isModal = isModal;
        }
        async init() {
            await super.init();
            const state = this.getAttribute('state', true);
            if (state)
                this.state = state;
            const baseStripeApi = this.getAttribute('baseStripeApi', true);
            if (baseStripeApi)
                this.baseStripeApi = baseStripeApi;
            const urlStripeTracking = this.getAttribute('urlStripeTracking', true);
            if (urlStripeTracking)
                this.urlStripeTracking = urlStripeTracking;
            this.invoiceCreation.onContinue = () => {
                this.invoiceCreation.visible = false;
                this.paymentMethod.visible = true;
            };
            this.paymentMethod.onSelectedPaymentProvider = (payment, paymentProvider) => {
                this.paymentMethod.visible = false;
                if (paymentProvider === interface_6.PaymentProvider.Metamask || paymentProvider === interface_6.PaymentProvider.TonWallet) {
                    this.paymentMethod.visible = false;
                    this.walletPayment.wallets = this.wallets;
                    this.walletPayment.networks = this.networks;
                    this.walletPayment.tokens = this.tokens;
                    this.walletPayment.onStartPayment({
                        ...payment,
                        provider: paymentProvider
                    });
                    this.walletPayment.visible = true;
                }
                else {
                    this.stripePayment.visible = true;
                }
            };
            this.paymentMethod.onBack = () => {
                this.paymentMethod.visible = false;
                this.invoiceCreation.visible = true;
            };
            this.walletPayment.onPaid = (paymentStatus) => {
                this.walletPayment.visible = false;
                this.statusPayment.visible = true;
                this.statusPayment.updateStatus(this.state, paymentStatus);
            };
            this.walletPayment.onBack = () => {
                this.paymentMethod.visible = true;
                this.walletPayment.visible = false;
            };
            this.stripePayment.onBack = () => {
                this.paymentMethod.visible = true;
                this.stripePayment.visible = false;
            };
            this.stripePayment.onPaymentSuccess = (status) => {
                if (this.isModal)
                    this.closeModal();
                if (this.onPaymentSuccess)
                    this.onPaymentSuccess(status);
            };
            this.stripePayment.baseStripeApi = this.baseStripeApi;
            this.stripePayment.urlStripeTracking = this.urlStripeTracking;
            this.statusPayment.onClose = (status) => {
                if (this.isModal)
                    this.closeModal();
                if (this.onPaymentSuccess)
                    this.onPaymentSuccess(status);
            };
        }
        render() {
            return (this.$render("i-stack", { margin: { top: '1rem' }, direction: "vertical", width: "100%", minHeight: 480, border: { radius: 12, style: 'solid', width: 1, color: '#ffffff4d' }, overflow: "hidden" },
                this.$render("scom-payment-widget--invoice-creation", { id: "invoiceCreation", visible: false, class: index_css_7.elementStyle }),
                this.$render("scom-payment-widget--payment-method", { id: "paymentMethod", visible: false, class: index_css_7.elementStyle }),
                this.$render("scom-payment-widget--wallet-payment", { id: "walletPayment", visible: false, class: index_css_7.elementStyle }),
                this.$render("scom-payment-widget--stripe-payment", { id: "stripePayment", visible: false, class: index_css_7.elementStyle }),
                this.$render("scom-payment-widget--status-payment", { id: "statusPayment", visible: false, class: index_css_7.elementStyle })));
        }
    };
    PaymentModule = __decorate([
        (0, components_10.customElements)('scom-payment-widget--payment-module')
    ], PaymentModule);
    exports.PaymentModule = PaymentModule;
});
define("@scom/scom-payment-widget/components/stripePaymentTracking.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-payment-widget/components/index.css.ts", "@scom/scom-payment-widget/assets.ts", "@scom/scom-payment-widget/store.ts", "@scom/scom-payment-widget/utils.ts", "@scom/scom-payment-widget/translations.json.ts"], function (require, exports, components_11, index_css_8, assets_4, store_6, utils_2, translations_json_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StatusPaymentTracking = void 0;
    const Theme = components_11.Styles.Theme.ThemeVars;
    let StatusPaymentTracking = class StatusPaymentTracking extends components_11.Module {
        get baseStripeApi() {
            return this._baseStripeApi;
        }
        set baseStripeApi(value) {
            this._baseStripeApi = value;
        }
        constructor(parent, options) {
            super(parent, options);
        }
        async checkPaymentStatus() {
            this.btnCheck.enabled = false;
            this.btnCheck.rightIcon.spin = true;
            this.btnCheck.rightIcon.visible = true;
            this.inputClientSecret.enabled = false;
            this.imgStatus.visible = true;
            this.imgStatus.url = assets_4.default.fullPath('/img/loading.svg');
            this.imgStatus.classList.add(index_css_8.loadingImageStyle);
            this.lbStatus.caption = '';
            if (!window.Stripe) {
                await (0, utils_2.loadStripe)();
            }
            const apiUrl = this.baseStripeApi ?? '/stripe';
            if (!this.publishableKey) {
                this.publishableKey = await (0, store_6.getStripeKey)(`${apiUrl}/key`);
                if (!this.publishableKey)
                    return;
            }
            if (window.Stripe && !this.stripe) {
                this.stripe = window.Stripe(this.publishableKey);
            }
            const clientSecret = this.inputClientSecret.value;
            this.updateURLParam('payment_intent_client_secret', clientSecret);
            try {
                const data = await this.stripe.retrievePaymentIntent(clientSecret);
                let img = '';
                let msg = '';
                switch (data?.paymentIntent.status) {
                    case 'succeeded':
                        img = assets_4.default.fullPath('img/success.svg');
                        msg = this.i18n.get('$payment_received_success');
                        break;
                    case 'processing':
                        msg = this.i18n.get('$payment_processing');
                        break;
                    case 'requires_payment_method':
                        msg = this.i18n.get('$payment_failed');
                        img = assets_4.default.fullPath('img/error.png');
                        break;
                    default:
                        msg = this.i18n.get('$something_went_wrong');
                        img = assets_4.default.fullPath('img/error.png');
                        break;
                }
                this.imgStatus.classList.remove(index_css_8.loadingImageStyle);
                if (img) {
                    this.imgStatus.url = img;
                }
                else {
                    this.imgStatus.visible = false;
                }
                this.lbStatus.caption = msg;
            }
            catch {
                this.lbStatus.caption = this.i18n.get('$invalid_payment_id');
                this.imgStatus.classList.remove(index_css_8.loadingImageStyle);
                this.imgStatus.url = assets_4.default.fullPath('img/error.png');
            }
            this.btnCheck.rightIcon.spin = false;
            this.btnCheck.rightIcon.visible = false;
            this.btnCheck.enabled = true;
            this.inputClientSecret.enabled = true;
        }
        handleInputChanged() {
            this.btnCheck.enabled = !!this.inputClientSecret.value;
        }
        handleSearch() {
            this.checkPaymentStatus();
        }
        getParamsFromUrl() {
            return [...new URLSearchParams(window.location.href.split('?')[1])].reduce((a, [k, v]) => ((a[k] = v), a), {});
        }
        updateURLParam(param, newValue) {
            const hash = window.location.hash;
            const [path, queryString] = hash.split('?');
            const params = new URLSearchParams(queryString);
            params.set(param, newValue);
            const newHash = `${path}?${params.toString()}`;
            window.history.replaceState({}, '', window.location.origin + window.location.pathname + newHash);
        }
        async init() {
            this.i18n.init({ ...translations_json_7.default });
            super.init();
            const baseStripeApi = this.getAttribute('baseStripeApi', true);
            if (baseStripeApi)
                this.baseStripeApi = baseStripeApi;
            const params = this.getParamsFromUrl();
            if (params?.payment_intent_client_secret) {
                this.inputClientSecret.value = params.payment_intent_client_secret;
                this.checkPaymentStatus();
            }
        }
        render() {
            return this.$render("i-stack", { direction: "vertical", gap: "1rem", height: "100%", width: "100%", alignItems: "center", padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' } },
                this.$render("i-label", { caption: "$check_stripe_payment_status", font: { size: '1rem' }, class: index_css_8.textCenterStyle }),
                this.$render("i-stack", { direction: "horizontal", gap: "0.5rem", width: "100%", alignItems: "center", justifyContent: "center", wrap: "wrap" },
                    this.$render("i-input", { id: "inputClientSecret", width: "calc(100% - 108px)", minWidth: 200, height: 40, padding: { left: '0.5rem', right: '0.5rem' }, placeholder: "pi_3QHe3EP7pMwOSpCL0edx9jiF_secret_tGkZptJLmJsHp8hO2RtINuGgs", border: { radius: 4 }, onChanged: this.handleInputChanged }),
                    this.$render("i-button", { id: "btnCheck", enabled: false, caption: "$check", width: 100, padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, font: { color: Theme.colors.primary.contrastText }, background: { color: Theme.colors.primary.main }, border: { radius: 12 }, onClick: this.handleSearch })),
                this.$render("i-stack", { direction: "vertical", gap: "1rem", width: "100%", alignItems: "center", margin: { top: '2rem' } },
                    this.$render("i-image", { id: "imgStatus", width: 128, height: 128 }),
                    this.$render("i-label", { id: "lbStatus", class: index_css_8.textCenterStyle, font: { size: '1rem', color: Theme.text.primary, bold: true } })));
        }
    };
    StatusPaymentTracking = __decorate([
        (0, components_11.customElements)('scom-payment-widget--stripe-payment-tracking')
    ], StatusPaymentTracking);
    exports.StatusPaymentTracking = StatusPaymentTracking;
});
define("@scom/scom-payment-widget/components/index.ts", ["require", "exports", "@scom/scom-payment-widget/components/paymentModule.tsx", "@scom/scom-payment-widget/components/invoiceCreation.tsx", "@scom/scom-payment-widget/components/paymentMethod.tsx", "@scom/scom-payment-widget/components/walletPayment.tsx", "@scom/scom-payment-widget/components/statusPayment.tsx", "@scom/scom-payment-widget/components/stripePayment.tsx", "@scom/scom-payment-widget/components/stripePaymentTracking.tsx"], function (require, exports, paymentModule_1, invoiceCreation_1, paymentMethod_1, walletPayment_1, statusPayment_1, stripePayment_1, stripePaymentTracking_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StatusPayment = exports.StatusPaymentTracking = exports.StripePayment = exports.WalletPayment = exports.PaymentMethod = exports.InvoiceCreation = exports.PaymentModule = void 0;
    Object.defineProperty(exports, "PaymentModule", { enumerable: true, get: function () { return paymentModule_1.PaymentModule; } });
    Object.defineProperty(exports, "InvoiceCreation", { enumerable: true, get: function () { return invoiceCreation_1.InvoiceCreation; } });
    Object.defineProperty(exports, "PaymentMethod", { enumerable: true, get: function () { return paymentMethod_1.PaymentMethod; } });
    Object.defineProperty(exports, "WalletPayment", { enumerable: true, get: function () { return walletPayment_1.WalletPayment; } });
    Object.defineProperty(exports, "StatusPayment", { enumerable: true, get: function () { return statusPayment_1.StatusPayment; } });
    Object.defineProperty(exports, "StripePayment", { enumerable: true, get: function () { return stripePayment_1.StripePayment; } });
    Object.defineProperty(exports, "StatusPaymentTracking", { enumerable: true, get: function () { return stripePaymentTracking_1.StatusPaymentTracking; } });
});
define("@scom/scom-payment-widget/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dappContainerStyle = void 0;
    exports.dappContainerStyle = components_12.Styles.style({
        $nest: {
            '&>:first-child': {
                borderRadius: 12,
                background: 'transparent'
            },
            '#pnlModule': {
                height: '100%'
            },
            'dapp-container-header': {
                width: 0,
                height: 0,
                overflow: 'hidden',
                $nest: {
                    'i-modal .modal-overlay': {
                        zIndex: 999
                    },
                    'i-modal .modal-wrapper': {
                        zIndex: 999
                    }
                }
            },
            'dapp-container-footer': {
                display: 'none'
            }
        }
    });
});
define("@scom/scom-payment-widget", ["require", "exports", "@ijstech/components", "@scom/scom-payment-widget/components/index.ts", "@scom/scom-payment-widget/interface.ts", "@scom/scom-payment-widget/store.ts", "@scom/scom-payment-widget/defaultData.ts", "@scom/scom-payment-widget/index.css.ts", "@scom/scom-payment-widget/translations.json.ts"], function (require, exports, components_13, components_14, interface_7, store_7, defaultData_3, index_css_9, translations_json_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomPaymentWidget = exports.ProductType = void 0;
    Object.defineProperty(exports, "ProductType", { enumerable: true, get: function () { return interface_7.ProductType; } });
    const Theme = components_13.Styles.Theme.ThemeVars;
    let ScomPaymentWidget = class ScomPaymentWidget extends components_13.Module {
        constructor(parent, options) {
            super(parent, options);
            this._wallets = [];
            this._networks = [];
            this._tokens = [];
        }
        get payment() {
            return this._payment;
        }
        set payment(value) {
            this._payment = value;
            if (this.btnPay)
                this.btnPay.enabled = !!value;
        }
        get mode() {
            return this._mode || 'payment';
        }
        set mode(value) {
            this._mode = value;
            this.updateUIByMode();
        }
        get showButtonPay() {
            return this._showButtonPay;
        }
        set showButtonPay(value) {
            this._showButtonPay = value;
            if (this.btnPay)
                this.btnPay.visible = !this.isUrl && value;
        }
        get payButtonCaption() {
            return this._payButtonCaption || this.i18n.get('$pay');
        }
        set payButtonCaption(value) {
            this._payButtonCaption = value;
            if (this.btnPay)
                this.btnPay.caption = value;
        }
        get baseStripeApi() {
            return this._baseStripeApi;
        }
        set baseStripeApi(value) {
            this._baseStripeApi = value;
            if (this.statusPaymentTracking)
                this.statusPaymentTracking.baseStripeApi = value;
        }
        get urlStripeTracking() {
            return this._urlStripeTracking;
        }
        set urlStripeTracking(value) {
            this._urlStripeTracking = value;
        }
        get wallets() {
            return this._wallets ?? defaultData_3.default.defaultData.wallets;
        }
        set wallets(value) {
            this._wallets = value;
        }
        get networks() {
            return this._networks ?? defaultData_3.default.defaultData.networks;
        }
        set networks(value) {
            this._networks = value;
        }
        get tokens() {
            return this._tokens ?? defaultData_3.default.defaultData.tokens;
        }
        set tokens(value) {
            this._tokens = value;
        }
        get rpcWallet() {
            return this.state.getRpcWallet();
        }
        async updateTheme() {
            const themeVar = this.containerDapp?.theme || 'dark';
            this.updateStyle('--divider', '#fff');
            const theme = {
                [themeVar]: {
                    inputFontColor: '#fff',
                    secondaryColor: '#444444',
                    modalColor: '#000'
                }
            };
            await this.containerDapp.ready();
            this.containerDapp.setTag(theme);
        }
        updateStyle(name, value) {
            if (value) {
                this.style.setProperty(name, value);
            }
            else {
                this.style.removeProperty(name);
            }
        }
        onStartPayment(payment) {
            if (payment)
                this._payment = payment;
            this.openPaymentModal();
        }
        async openPaymentModal() {
            if (!this.paymentModule) {
                this.paymentModule = new components_14.PaymentModule();
                this.paymentModule.state = this.state;
                this.paymentModule.dappContainer = this.containerDapp;
                if (this.isUrl) {
                    this.paymentModule.width = '100%';
                    this.paymentModule.maxWidth = 480;
                    this.pnlWrapper.appendChild(this.paymentModule);
                }
            }
            this.paymentModule.wallets = this.wallets;
            this.paymentModule.networks = this.networks;
            this.paymentModule.tokens = this.tokens;
            this.paymentModule.baseStripeApi = this.baseStripeApi;
            this.paymentModule.urlStripeTracking = this.urlStripeTracking;
            this.paymentModule.onPaymentSuccess = this.onPaymentSuccess;
            if (this.isUrl) {
                await this.paymentModule.ready();
                this.paymentModule.show(this._payment, false);
                return;
            }
            const modal = this.paymentModule.openModal({
                title: this.i18n.get('$payment'),
                closeIcon: { name: 'times', fill: Theme.colors.primary.main },
                width: 480,
                maxWidth: '100%',
                padding: { left: '1rem', right: '1rem', top: '0.75rem', bottom: '0.75rem' },
                border: { radius: '1rem' }
            });
            await this.paymentModule.ready();
            this.paymentModule.show(this._payment);
            modal.refresh();
        }
        handlePay() {
            if (this.payment) {
                this.onStartPayment(this.payment);
            }
        }
        updateUIByMode() {
            if (!this.statusPaymentTracking)
                return;
            this.statusPaymentTracking.baseStripeApi = this.baseStripeApi;
            this.statusPaymentTracking.visible = this.mode === 'status';
            this.btnPay.visible = !this.isUrl && this.mode === 'payment' && this.showButtonPay;
        }
        handleWidgetUrl() {
            try {
                const paths = window.location.hash.split('/');
                const dataBase64 = decodeURIComponent(paths[paths.length - 1]);
                const params = JSON.parse(atob(dataBase64));
                if (params?.isUrl) {
                    this.isUrl = true;
                    const { payment, baseStripeApi } = params;
                    if (baseStripeApi)
                        this.baseStripeApi = baseStripeApi;
                    this.width = '100%';
                    this.maxWidth = 480;
                    this.padding = { left: '1rem', right: '1rem', top: '1rem', bottom: '1rem' };
                    this.onStartPayment(payment);
                }
            }
            catch { }
        }
        async init() {
            if (!this.state) {
                this.state = new store_7.State(defaultData_3.default);
            }
            this.i18n.init({ ...translations_json_8.default });
            super.init();
            this.updateTheme();
            this.openPaymentModal = this.openPaymentModal.bind(this);
            this.onPaymentSuccess = this.getAttribute('onPaymentSuccess', true) || this.onPaymentSuccess;
            this.handleWidgetUrl();
            const lazyLoad = this.getAttribute('lazyLoad', true, false);
            if (!lazyLoad) {
                const payment = this.getAttribute('payment', true);
                this.mode = this.getAttribute('mode', true, 'payment');
                this.baseStripeApi = this.getAttribute('baseStripeApi', true);
                this.urlStripeTracking = this.getAttribute('urlStripeTracking', true);
                this.showButtonPay = this.getAttribute('showButtonPay', true, false);
                this.payButtonCaption = this.getAttribute('payButtonCaption', true, this.i18n.get('$pay'));
                this.networks = this.getAttribute('networks', true, defaultData_3.default.defaultData.networks);
                this.tokens = this.getAttribute('tokens', true, defaultData_3.default.defaultData.tokens);
                this.wallets = this.getAttribute('wallets', true, defaultData_3.default.defaultData.wallets);
                if (payment)
                    this.payment = payment;
            }
            this.btnPay.visible = !this.isUrl && this.showButtonPay;
            this.btnPay.enabled = !!this.payment;
            this.btnPay.caption = this.payButtonCaption;
            this.updateUIByMode();
            this.executeReadyCallback();
        }
        render() {
            return this.$render("i-scom-dapp-container", { id: "containerDapp", showHeader: true, showFooter: false, class: index_css_9.dappContainerStyle },
                this.$render("i-stack", { id: "pnlWrapper", direction: "vertical", alignItems: "center", width: "100%", height: "100%" },
                    this.$render("i-button", { id: "btnPay", visible: false, enabled: false, caption: "$pay", width: "100%", minWidth: 60, maxWidth: 180, padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, font: { size: '1rem', color: Theme.colors.primary.contrastText, bold: true }, background: { color: Theme.colors.primary.main }, border: { radius: 12 }, onClick: this.handlePay }),
                    this.$render("scom-payment-widget--stripe-payment-tracking", { id: "statusPaymentTracking", visible: false, width: "100%", height: "100%" })));
        }
    };
    ScomPaymentWidget = __decorate([
        (0, components_13.customElements)('i-scom-payment-widget')
    ], ScomPaymentWidget);
    exports.ScomPaymentWidget = ScomPaymentWidget;
});
