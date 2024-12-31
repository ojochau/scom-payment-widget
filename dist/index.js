var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
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
    ;
});
define("@scom/scom-payment-widget/components/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.halfWidthButtonStyle = exports.fullWidthButtonStyle = exports.carouselSliderStyle = exports.alertStyle = exports.loadingImageStyle = exports.textUpperCaseStyle = exports.textCenterStyle = exports.elementStyle = void 0;
    const Theme = components_1.Styles.Theme.ThemeVars;
    const spinnerAnim = components_1.Styles.keyframes({
        "0%": {
            transform: 'rotate(0deg)'
        },
        "100%": {
            transform: 'rotate(360deg)'
        },
    });
    exports.elementStyle = components_1.Styles.style({
        display: 'flex',
        flexGrow: 1
    });
    exports.textCenterStyle = components_1.Styles.style({
        textAlign: 'center'
    });
    exports.textUpperCaseStyle = components_1.Styles.style({
        textTransform: 'uppercase'
    });
    exports.loadingImageStyle = components_1.Styles.style({
        animation: `${spinnerAnim} 2s linear infinite`,
        maxWidth: '4rem',
        maxHeight: '4rem'
    });
    exports.alertStyle = components_1.Styles.style({
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
    exports.carouselSliderStyle = components_1.Styles.style({
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
    exports.fullWidthButtonStyle = components_1.Styles.style({
        ...baseButtonStyle,
        width: '100%'
    });
    exports.halfWidthButtonStyle = components_1.Styles.style({
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
            "shipping_address": "Shipping address",
            "name": "Name",
            "address": "Address",
            "phone_number": "Phone Number",
            "email": "Email",
            "note": "Note",
            "continue": "Continue",
            "back": "Back",
            "close": "Close",
            "payment_id": "Payment ID",
            "price": "Price",
            "quantity": "Quantity",
            "fiat_currency": "Fiat currency",
            "cryptocurrency": "Cryptocurrency",
            "web3_wallet": "Web3 Wallet",
            "connect_web3_wallet": "Connect to Web3 Wallet",
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
            "connect": "Connect",
            "payment_received_success": "Success! Payment received.",
            "payment_processing": "Payment processing. We'll update you when payment is received.",
            "something_went_wrong": "Something went wrong!",
            "invalid_payment_id": "The payment ID is invalid!",
            "check_stripe_payment_status": "Check Stripe payment status",
            "check": "Check",
            "coming_soon": "Coming Soon!",
            "payment_coming_soon": "This payment method is coming soon!",
            "the_stall_owner_has_not_set_up_payments_yet": "The stall owner has not set up payments yet!",
            "switch_network": "Switch Network",
        },
        "zh-hant": {
            "pay": "付款",
            "amount_to_pay": "應付金額",
            "payment": "付款",
            "shipping_address": "收貨地址",
            "name": "名字",
            "address": "地址",
            "phone_number": "電話號碼",
            "email": "電子郵件",
            "note": "備註",
            "continue": "繼續",
            "back": "返回",
            "close": "關閉",
            "payment_id": "付款編號",
            "price": "價格",
            "quantity": "數量",
            "fiat_currency": "法幣",
            "cryptocurrency": "加密貨幣",
            "web3_wallet": "Web3 錢包",
            "connect_web3_wallet": "連接到 Web3 錢包",
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
            "connect": "連接",
            "payment_received_success": "成功！付款已收到",
            "payment_processing": "付款處理中。收到付款後，我們會更新狀態",
            "something_went_wrong": "出錯了！",
            "invalid_payment_id": "付款編號無效！",
            "check_stripe_payment_status": "查看 Stripe 付款狀態",
            "check": "檢查",
            "coming_soon": "快來了！",
            "payment_coming_soon": "這種付款方式即將推出！敬請期待！",
            "the_stall_owner_has_not_set_up_payments_yet": "攤位老闆還沒有設置付款方式！",
            "switch_network": "切換網絡",
        },
        "vi": {
            "pay": "Thanh toán",
            "amount_to_pay": "Số tiền cần trả",
            "payment": "Thanh toán",
            "shipping_address": "Địa chỉ giao hàng",
            "name": "Tên",
            "address": "Địa chỉ",
            "phone_number": "Số điện thoại",
            "email": "Email",
            "note": "Ghi chú",
            "continue": "Tiếp tục",
            "back": "Quay lại",
            "close": "Đóng",
            "payment_id": "Mã giao dịch",
            "price": "Giá",
            "quantity": "Số lượng",
            "fiat_currency": "Tiền pháp định",
            "cryptocurrency": "Tiền điện tử",
            "web3_wallet": "Ví Web3",
            "connect_web3_wallet": "Kết nối với Ví Web3",
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
            "connect": "Kết nối",
            "payment_received_success": "Thành công! Đã nhận được thanh toán",
            "payment_processing": "Đang xử lý thanh toán. Chúng tôi sẽ cập nhật cho bạn khi thanh toán được nhận",
            "something_went_wrong": "Đã có lỗi xảy ra!",
            "invalid_payment_id": "Mã giao dịch không hợp lệ!",
            "check_stripe_payment_status": "Kiểm tra trạng thái thanh toán Stripe",
            "check": "Kiểm tra",
            "coming_soon": "Sắp ra mắt!",
            "payment_coming_soon": "Phương thức thanh toán này sẽ có sớm!",
            "the_stall_owner_has_not_set_up_payments_yet": "Chủ quầy hàng chưa thiết lập phương thức thanh toán!",
            "switch_network": "Chuyển mạng",
        }
    };
});
define("@scom/scom-payment-widget/defaultData.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-payment-widget/defaultData.ts'/> 
    exports.default = {
        "infuraId": "adc596bf88b648e2a8902bc9093930c5",
        "defaultData": {
            "baseStripeApi": "",
            "returnUrl": "",
            "defaultChainId": 97,
            "networks": [
                {
                    "chainId": 97
                },
                {
                    "chainId": 43113
                }
            ],
            "wallets": [
                {
                    "name": "metamask"
                },
                {
                    "name": "walletconnect"
                }
            ]
        }
    };
});
define("@scom/scom-payment-widget/store.ts", ["require", "exports", "@scom/scom-payment-widget/interface.ts"], function (require, exports, interface_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stripeSpecialCurrencies = exports.stripeZeroDecimalCurrencies = exports.stripeCurrencies = exports.PaymentProviders = exports.getStripeKey = exports.STRIPE_LIB_URL = void 0;
    exports.STRIPE_LIB_URL = 'https://js.stripe.com/v3';
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
        if (!publishableKey) {
            console.log('initStripePayment', 'Cannot get the publishable key');
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
define("@scom/scom-payment-widget/wallets/tonProvider.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let moduleDir = components_2.application.currentModuleDir;
    function fullPath(path) {
        if (path.indexOf('://') > 0)
            return path;
        return `${moduleDir}/${path}`;
    }
    class TonWalletProvider {
        constructor(events, options) {
            this._isConnected = false;
            this._events = events;
            this._options = options;
            if (this._options) {
                if (this._options.name) {
                    this._name = this._options.name;
                }
                if (this._options.image) {
                    this._image = this._options.image;
                }
            }
        }
        ;
        get name() {
            return this._name;
        }
        ;
        get displayName() {
            return 'TON Wallet';
        }
        ;
        get image() {
            return '';
        }
        ;
        installed() {
            return true;
        }
        ;
        get events() {
            return this._events;
        }
        ;
        get options() {
            return this._options;
        }
        ;
        get selectedAddress() {
            return this._selectedAddress;
        }
        ;
        initEvents() {
            try {
                this.provider = window['TON_CONNECT_UI'];
                if (!this.tonConnectUI) {
                    this.tonConnectUI = new this.provider.TonConnectUI({
                        manifestUrl: 'https://ton.noto.fan/tonconnect/manifest.json',
                        buttonRootId: 'btnTonWallet'
                    });
                    this.tonConnectUI.connectionRestored.then(async (restored) => {
                        const account = this.tonConnectUI.account;
                        this._isConnected = this.tonConnectUI.connected;
                        this.onAccountChanged(account);
                    });
                    this.tonConnectUI.onStatusChange((walletAndwalletInfo) => {
                        const account = this.tonConnectUI.account;
                        this._isConnected = this.tonConnectUI.connected;
                        this.onAccountChanged(account);
                    });
                }
            }
            catch (err) {
                // alert(err)
                console.log(err);
            }
        }
        ;
        async connect(eventPayload) {
            if (this._events) {
                this.onAccountChanged = this._events.onAccountChanged;
                this.onConnect = this._events.onConnect;
                this.onDisconnect = this._events.onDisconnect;
            }
            this.initEvents();
            if (this.tonConnectUI.connected) {
                if (this.onAccountChanged)
                    this.onAccountChanged(this.tonConnectUI.account);
            }
            else {
                try {
                    await this.tonConnectUI.openModal();
                }
                catch (err) {
                    console.log(err);
                }
            }
        }
        ;
        async disconnect() {
            await this.tonConnectUI.disconnect();
            this._isConnected = false;
        }
        ;
        isConnected() {
            return this.tonConnectUI?.connected;
        }
        ;
        switchNetwork(chainId) {
            throw new Error('Method not implemented.');
        }
        ;
        encrypt(key) {
            throw new Error('Method not implemented.');
        }
        ;
        decrypt(data) {
            throw new Error('Method not implemented.');
        }
        ;
    }
    exports.default = TonWalletProvider;
});
define("@scom/scom-payment-widget/wallets/evmWallet.ts", ["require", "exports", "@scom/scom-wallet-modal", "@scom/scom-network-modal", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-network-list"], function (require, exports, scom_wallet_modal_1, scom_network_modal_1, components_3, eth_wallet_1, scom_network_list_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EVMWallet = void 0;
    class EventEmitter {
        constructor() {
            this.events = {};
        }
        on(event, listener) {
            if (!this.events[event]) {
                this.events[event] = [];
            }
            this.events[event].push(listener);
        }
        off(event, listener) {
            if (!this.events[event])
                return;
            this.events[event] = this.events[event].filter(l => l !== listener);
        }
        emit(event, data) {
            if (!this.events[event])
                return;
            this.events[event].forEach(listener => listener(data));
        }
    }
    class EVMWallet extends EventEmitter {
        get wallets() {
            return this._wallets ?? this.defaultWallets;
        }
        set wallets(value) {
            this._wallets = value;
        }
        get networks() {
            return this._networks;
        }
        set networks(value) {
            this._networks = value;
        }
        constructor() {
            super();
            this.rpcWalletEvents = [];
            this.rpcWalletId = '';
            this.defaultWallets = [
                {
                    "name": "metamask"
                },
                {
                    "name": "walletconnect"
                }
            ];
            this.removeRpcWalletEvents = () => {
                const rpcWallet = this.getRpcWallet();
                for (let event of this.rpcWalletEvents) {
                    rpcWallet.unregisterWalletEvent(event);
                }
                this.rpcWalletEvents = [];
            };
            const defaultNetworkList = (0, scom_network_list_1.default)();
            this.networkMap = defaultNetworkList.reduce((acc, cur) => {
                const explorerUrl = cur.blockExplorerUrls && cur.blockExplorerUrls.length ? cur.blockExplorerUrls[0] : "";
                acc[cur.chainId] = {
                    ...cur,
                    explorerTxUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}tx/` : "",
                    explorerAddressUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}address/` : ""
                };
                return acc;
            }, {});
        }
        setData(data) {
            const { wallets, networks, defaultChainId } = data;
            this.wallets = wallets;
            this.networks = networks;
            this.defaultChainId = defaultChainId || 0;
        }
        async initWallet() {
            try {
                await eth_wallet_1.Wallet.getClientInstance().init();
                await this.resetRpcWallet();
                const rpcWallet = this.getRpcWallet();
                await rpcWallet.init();
            }
            catch (err) {
                console.log(err);
            }
        }
        initRpcWallet(defaultChainId) {
            if (this.rpcWalletId) {
                return this.rpcWalletId;
            }
            const clientWallet = eth_wallet_1.Wallet.getClientInstance();
            const networkList = Object.values(components_3.application.store?.networkMap || this.networkMap || []);
            const instanceId = clientWallet.initRpcWallet({
                networks: networkList,
                defaultChainId,
                infuraId: components_3.application.store?.infuraId,
                multicalls: components_3.application.store?.multicalls
            });
            this.rpcWalletId = instanceId;
            if (clientWallet.address) {
                const rpcWallet = eth_wallet_1.Wallet.getRpcWalletInstance(instanceId);
                rpcWallet.address = clientWallet.address;
            }
            return instanceId;
        }
        async resetRpcWallet() {
            this.removeRpcWalletEvents();
            this.initRpcWallet(this.defaultChainId);
            const rpcWallet = this.getRpcWallet();
            const chainChangedEvent = rpcWallet.registerWalletEvent(this, eth_wallet_1.Constants.RpcWalletEvent.ChainChanged, async (chainId) => {
                this.emit("chainChanged");
            });
            const connectedEvent = rpcWallet.registerWalletEvent(this, eth_wallet_1.Constants.RpcWalletEvent.Connected, async (connected) => {
                this.emit("walletConnected");
            });
            this.rpcWalletEvents.push(chainChangedEvent, connectedEvent);
        }
        getWalletAddress() {
            const wallet = eth_wallet_1.Wallet.getClientInstance();
            return wallet.address;
        }
        getRpcWallet() {
            return this.rpcWalletId ? eth_wallet_1.Wallet.getRpcWalletInstance(this.rpcWalletId) : null;
        }
        async connectWallet(modalContainer) {
            if (!this.mdEVMWallet) {
                await components_3.application.loadPackage('@scom/scom-wallet-modal', '*');
                this.mdEVMWallet = new scom_wallet_modal_1.default(undefined, {
                    wallets: this.wallets,
                    networks: this.networks,
                    onCustomWalletSelected: async (wallet) => {
                        console.log('onCustomWalletSelected', wallet);
                    }
                });
                modalContainer.append(this.mdEVMWallet);
            }
            // await this.mdEVMWallet.setData({
            //     networks: this.networks,
            //     wallets: this.wallets
            // })
            this.mdEVMWallet.showModal();
        }
        async openNetworkModal(modalContainer) {
            if (!this.mdNetwork) {
                await components_3.application.loadPackage('@scom/scom-network-modal', '*');
                this.mdNetwork = new scom_network_modal_1.default(undefined, {
                    networks: this.networks,
                    rpcWalletId: this.rpcWalletId,
                    switchNetworkOnSelect: true
                });
                modalContainer.append(this.mdNetwork);
            }
            await this.mdNetwork.setData({
                selectedChainId: this.getRpcWallet()?.chainId
            });
            this.mdNetwork.showModal();
        }
        isWalletConnected() {
            const wallet = eth_wallet_1.Wallet.getClientInstance();
            return wallet.isConnected;
        }
        isNetworkConnected() {
            const wallet = this.getRpcWallet();
            return wallet?.isConnected;
        }
        async switchNetwork() {
            const rpcWallet = this.getRpcWallet();
            const wallet = eth_wallet_1.Wallet.getClientInstance();
            await wallet.switchNetwork(rpcWallet.chainId);
        }
        async disconnectWallet() {
            const wallet = eth_wallet_1.Wallet.getClientInstance();
            await wallet.disconnect();
        }
        getNetworkInfo(chainId) {
            if (!chainId) {
                chainId = this.getRpcWallet()?.chainId;
            }
            return this.networkMap[chainId];
        }
        viewExplorerByAddress(address) {
            const rpcWallet = this.getRpcWallet();
            let network = this.getNetworkInfo(rpcWallet.chainId);
            if (network && network.explorerAddressUrl) {
                let url = `${network.explorerAddressUrl}${address}`;
                window.open(url);
            }
        }
        viewExplorerByTransactionHash(hash) {
            const rpcWallet = this.getRpcWallet();
            let network = this.getNetworkInfo(rpcWallet.chainId);
            if (network && network.explorerTxUrl) {
                let url = `${network.explorerTxUrl}${hash}`;
                window.open(url);
            }
        }
        async transferToken(to, token, amount, callback, confirmationCallback) {
            const wallet = eth_wallet_1.Wallet.getClientInstance();
            const rpcWallet = this.getRpcWallet();
            if (wallet.chainId !== rpcWallet.chainId) {
                await wallet.switchNetwork(rpcWallet.chainId);
            }
            wallet.registerSendTxEvents({
                transactionHash: (error, receipt) => {
                    if (callback) {
                        callback(error, receipt);
                    }
                },
                confirmation: (receipt) => {
                    if (confirmationCallback) {
                        confirmationCallback(receipt);
                    }
                },
            });
            let receipt;
            if (!token.address) {
                receipt = await wallet.send(to, amount);
            }
            else {
                const erc20 = new eth_wallet_1.Contracts.ERC20(wallet, token.address);
                const decimals = token.decimals;
                receipt = await erc20.transfer({
                    to,
                    amount: eth_wallet_1.Utils.toDecimals(amount, decimals)
                });
            }
            return receipt?.transactionHash;
        }
    }
    exports.EVMWallet = EVMWallet;
});
define("@scom/scom-payment-widget/wallets/tonWallet.ts", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet"], function (require, exports, components_4, eth_wallet_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TonWallet = void 0;
    const JETTON_TRANSFER_OP = 0xf8a7ea5; // 32-bit
    class TonWallet {
        constructor(provider, moduleDir, onTonWalletStatusChanged) {
            this._isWalletConnected = false;
            this.provider = provider;
            this.loadLib(moduleDir);
            this._onTonWalletStatusChanged = onTonWalletStatusChanged;
        }
        isWalletConnected() {
            return this.provider.tonConnectUI.connected;
        }
        isNetworkConnected() {
            return this.provider.tonConnectUI.connected;
        }
        async loadLib(moduleDir) {
            let self = this;
            return new Promise((resolve, reject) => {
                components_4.RequireJS.config({
                    baseUrl: `${moduleDir}/lib`,
                    paths: {
                        'ton-core': 'ton-core',
                    }
                });
                components_4.RequireJS.require(['ton-core'], function (TonCore) {
                    self.toncore = TonCore;
                    resolve(self.toncore);
                });
            });
        }
        async connectWallet() {
            try {
                await this.provider.tonConnectUI.openModal();
            }
            catch (err) {
                alert(err);
            }
        }
        getNetworkInfo() {
            return null;
        }
        async openNetworkModal(modalContainer) {
        }
        async switchNetwork() {
        }
        async disconnectWallet() {
            await this.provider.disconnect();
        }
        async sendTransaction(txData) {
            return await this.provider.tonConnectUI.sendTransaction(txData);
        }
        constructPayloadForTokenTransfer(to, token, amount) {
            const recipientAddress = this.toncore.Address.parse(to);
            const jettonAmount = eth_wallet_2.Utils.toDecimals(amount, token.decimals);
            const bodyCell = this.toncore.beginCell()
                .storeUint(JETTON_TRANSFER_OP, 32) // function ID
                .storeUint(0, 64) // query_id (can be 0 or a custom value)
                .storeCoins(jettonAmount) // amount in nano-jettons
                .storeAddress(recipientAddress) // destination
                .storeAddress(null) // response_destination (set to NULL if you don't need callback)
                .storeMaybeRef(null) // custom_payload (None)
                .storeCoins(this.toncore.toNano('0.02')) // forward_ton_amount (some TON to forward, e.g. 0.02)
                .storeMaybeRef(null) // forward_payload (None)
                .endCell();
            return bodyCell.toBoc().toString('base64');
        }
        getWalletAddress() {
            return this.provider.tonConnectUI.account?.address;
        }
        viewExplorerByTransactionHash(hash) {
            window.open(`https://tonscan.org/transaction/${hash}`);
        }
        async getTonBalance() {
            try {
                const address = this.provider.tonConnectUI.account;
                const result = await fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${address}`, {
                    method: 'GET',
                });
                const data = await result.json();
                const balance = eth_wallet_2.Utils.fromDecimals(data.balance, 9);
                return balance;
            }
            catch (error) {
                console.error('Error fetching balance:', error);
                throw error;
            }
        }
        getJettonWalletAddress(jettonMasterAddress, userAddress) {
            const JETTON_WALLET_CODE_BASE64 = 'b5ee9c7201021301000385000114ff00f4a413f4bcf2c80b0102016202030202cb0405001ba0f605da89a1f401f481f481a9a30201ce06070201580a0b02f70831c02497c138007434c0c05c6c2544d7c0fc07783e903e900c7e800c5c75c87e800c7e800c1cea6d0000b4c7c076cf16cc8d0d0d09208403e29fa96ea68c1b088d978c4408fc06b809208405e351466ea6cc1b08978c840910c03c06f80dd6cda0841657c1ef2ea7c09c6c3cb4b01408eebcb8b1807c073817c160080900113e910c30003cb85360005c804ff833206e953080b1f833de206ef2d29ad0d30731d3ffd3fff404d307d430d0fa00fa00fa00fa00fa00fa00300008840ff2f00201580c0d020148111201f70174cfc0407e803e90087c007b51343e803e903e903534544da8548b31c17cb8b04ab0bffcb8b0950d109c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c032481c007e401d3232c084b281f2fff274013e903d010c7e800835d270803cb8b13220060072c15401f3c59c3e809dc072dae00e02f33b51343e803e903e90353442b4cfc0407e80145468017e903e9014d771c1551cdbdc150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c0325c007e401d3232c084b281f2fff2741403f1c147ac7cb8b0c33e801472a84a6d8206685401e8062849a49b1578c34975c2c070c00870802c200f1000aa13ccc88210178d4519580a02cb1fcb3f5007fa0222cf165006cf1625fa025003cf16c95005cc2391729171e25007a813a008aa005004a017a014bcf2e2c501c98040fb004300c85004fa0258cf1601cf16ccc9ed5400725269a018a1c882107362d09c2902cb1fcb3f5007fa025004cf165007cf16c9c8801001cb0527cf165004fa027101cb6a13ccc971fb0050421300748e23c8801001cb055006cf165005fa027001cb6a8210d53276db580502cb1fcb3fc972fb00925b33e24003c85004fa0258cf1601cf16ccc9ed5400eb3b51343e803e903e9035344174cfc0407e800870803cb8b0be903d01007434e7f440745458a8549631c17cb8b049b0bffcb8b0b220841ef765f7960100b2c7f2cfc07e8088f3c58073c584f2e7f27220060072c148f3c59c3e809c4072dab33260103ec01004f214013e809633c58073c5b3327b55200087200835c87b51343e803e903e9035344134c7c06103c8608405e351466e80a0841ef765f7ae84ac7cbd34cfc04c3e800c04e81408f214013e809633c58073c5b3327b5520';
            function base64ToUint8Array(base64) {
                const binaryString = atob(base64);
                const len = binaryString.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                return bytes;
            }
            const JETTON_WALLET_CODE = this.toncore.Cell.fromBoc(base64ToUint8Array(JETTON_WALLET_CODE_BASE64))[0];
            const JETTON_MASTER_ADDRESS = this.toncore.Address.parse(jettonMasterAddress);
            const USER_ADDRESS = this.toncore.Address.parse(userAddress);
            const jettonWalletStateInit = this.toncore.beginCell().store(this.toncore.storeStateInit({
                code: JETTON_WALLET_CODE,
                data: this.toncore.beginCell()
                    .storeCoins(0)
                    .storeAddress(USER_ADDRESS)
                    .storeAddress(JETTON_MASTER_ADDRESS)
                    .storeRef(JETTON_WALLET_CODE)
                    .endCell()
            }))
                .endCell();
            const userJettonWalletAddress = new this.toncore.Address(0, jettonWalletStateInit.hash());
            return userJettonWalletAddress.toString();
        }
        async transferToken(to, token, amount, callback, confirmationCallback) {
            let receipt;
            if (!token.address) {
                const transaction = {
                    validUntil: Math.floor(Date.now() / 1000) + 60,
                    messages: [
                        {
                            address: to,
                            amount: eth_wallet_2.Utils.toDecimals(amount, 9),
                            payload: ''
                        }
                    ]
                };
                receipt = await this.sendTransaction(transaction);
            }
            else {
                const payload = this.constructPayloadForTokenTransfer(to, token, amount);
                const jettonAddress = this.getJettonWalletAddress(token.address, to);
                console.log('Jetton address:', jettonAddress);
                const transaction = {
                    validUntil: Math.floor(Date.now() / 1000) + 60,
                    messages: [
                        {
                            address: jettonAddress,
                            amount: eth_wallet_2.Utils.toDecimals('0.1', 9),
                            payload: payload
                        }
                    ]
                };
                receipt = await this.sendTransaction(transaction);
            }
            return receipt;
        }
    }
    exports.TonWallet = TonWallet;
});
define("@scom/scom-payment-widget/wallets/index.ts", ["require", "exports", "@scom/scom-payment-widget/wallets/evmWallet.ts", "@scom/scom-payment-widget/wallets/tonWallet.ts"], function (require, exports, evmWallet_1, tonWallet_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-payment-widget/wallets/index.ts'/> 
    __exportStar(evmWallet_1, exports);
    __exportStar(tonWallet_1, exports);
});
define("@scom/scom-payment-widget/model.ts", ["require", "exports", "@scom/scom-payment-widget/interface.ts", "@scom/scom-payment-widget/defaultData.ts", "@scom/scom-payment-widget/store.ts", "@ijstech/components", "@scom/scom-wallet-modal", "@scom/scom-payment-widget/wallets/tonProvider.ts", "@scom/scom-payment-widget/wallets/index.ts"], function (require, exports, interface_2, defaultData_1, store_1, components_5, scom_wallet_modal_2, tonProvider_1, wallets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Model = void 0;
    class Model {
        constructor() {
            this._payment = { title: '', products: [] };
            this._wallets = [];
            this._networks = [];
            this._tokens = [];
            this.shippingInfo = {
                contact: {
                    nostr: ''
                }
            };
        }
        get walletModel() {
            return this._walletModel;
        }
        set walletModel(value) {
            this._walletModel = value;
        }
        get title() {
            return this.payment.title || '';
        }
        get paymentId() {
            return this.payment.paymentId || '';
        }
        get payment() {
            return this._payment;
        }
        set payment(value) {
            this._payment = value;
        }
        get products() {
            return this.payment.products || [];
        }
        get currency() {
            return this.payment.currency || 'USD';
        }
        get stripeCurrency() {
            const currency = this.payment.currency?.toLowerCase();
            const stripeCurrency = store_1.stripeCurrencies.find(v => v === currency) || 'usd';
            return stripeCurrency;
        }
        get totalPrice() {
            return this.products?.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0) || 0;
        }
        get totalShippingCost() {
            return 0; //TODO shipping cost
        }
        get totalAmount() {
            return this.totalPrice + this.totalShippingCost;
        }
        get stripeAmount() {
            const currency = this.stripeCurrency.toLowerCase();
            const amount = this.totalAmount;
            if (store_1.stripeZeroDecimalCurrencies.includes(currency))
                return Math.round(amount);
            if (store_1.stripeSpecialCurrencies.includes(currency))
                return Math.round(amount) * 100;
            return Math.round(amount * 100);
        }
        get totalQuantity() {
            return this.products?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        }
        get hasPhysicalProduct() {
            return this.products.some(v => v.productType === interface_2.ProductType.Physical);
        }
        get toAddress() {
            return this.payment?.address || '';
        }
        get cryptoPayoutOptions() {
            return this.payment?.cryptoPayoutOptions || [];
        }
        get stripeAccountId() {
            return this.payment?.stripeAccountId;
        }
        get hasPayment() {
            return this.cryptoPayoutOptions.length > 0 || !!this.stripeAccountId;
        }
        get isShippingInfoShown() {
            return this.hasPayment && this.hasPhysicalProduct;
        }
        get baseStripeApi() {
            return this._baseStripeApi ?? '/stripe';
        }
        set baseStripeApi(value) {
            this._baseStripeApi = value;
        }
        get returnUrl() {
            return this._returnUrl ?? `${window.location.origin}/#!/invoice-detail`;
        }
        set returnUrl(value) {
            this._returnUrl = value;
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
            return this._tokens;
        }
        set tokens(value) {
            this._tokens = value;
        }
        get referenceId() {
            return this._referenceId;
        }
        set referenceId(value) {
            this._referenceId = value;
        }
        get networkCode() {
            return this._networkCode || '';
        }
        set networkCode(value) {
            this._networkCode = value;
        }
        get paymentMethod() {
            return this._paymentMethod;
        }
        set paymentMethod(value) {
            this._paymentMethod = value;
        }
        get isCompleted() {
            return this._isCompleted;
        }
        set isCompleted(value) {
            this._isCompleted = value;
        }
        get placeOrder() {
            const { stallId, stallUri } = this.products[0];
            const merchantId = stallUri?.split(':')[1] || '';
            const shippingInfo = this.isShippingInfoShown ? this.shippingInfo : {
                contact: {
                    nostr: ''
                }
            };
            const order = {
                id: this.orderId,
                ...shippingInfo,
                currency: this.currency,
                totalAmount: this.totalAmount,
                items: this.products.map(v => {
                    return {
                        productName: v.name,
                        productId: v.id,
                        price: v.price,
                        quantity: v.quantity
                    };
                })
            };
            return {
                merchantId,
                stallId,
                order
            };
        }
        get paymentActivity() {
            const { merchantId, stallId } = this.placeOrder;
            return {
                id: components_5.IdUtils.generateUUID(),
                recipient: merchantId,
                amount: this.totalAmount.toString(),
                currencyCode: this.currency,
                networkCode: this.networkCode,
                stallId: stallId,
                orderId: this.orderId,
                referenceId: this.referenceId,
                paymentMethod: this.paymentMethod
            };
        }
        async handleWalletConnected() {
        }
        async handleWalletChainChanged() {
        }
        async connectWallet(moduleDir, modalContainer) {
            return new Promise(async (resolve, reject) => {
                if (!this.mdWallet) {
                    const tonWalletProvider = new tonProvider_1.default(null, { name: 'tonwallet' });
                    const tonWallet = new wallets_1.TonWallet(tonWalletProvider, moduleDir, this.handleWalletConnected.bind(this));
                    tonWalletProvider.onAccountChanged = (account) => {
                        this.mdWallet.hideModal();
                        this.walletModel = tonWallet;
                        this.handleWalletConnected();
                    };
                    const evmWallet = new wallets_1.EVMWallet();
                    evmWallet.on("chainChanged", () => {
                        this.walletModel = evmWallet;
                        this.handleWalletChainChanged();
                    });
                    evmWallet.on("walletConnected", () => {
                        this.walletModel = evmWallet;
                        this.handleWalletConnected();
                    });
                    evmWallet.setData({
                        wallets: this.wallets,
                        networks: this.networks,
                        defaultChainId: defaultData_1.default.defaultData.defaultChainId
                    });
                    evmWallet.initWallet();
                    const wallets = [
                        {
                            "name": "metamask"
                        },
                        {
                            "name": "walletconnect"
                        },
                        {
                            "name": "tonwallet",
                            provider: tonWalletProvider
                        }
                    ];
                    await components_5.application.loadPackage('@scom/scom-wallet-modal', '*');
                    this.mdWallet = new scom_wallet_modal_2.default(undefined, {
                        wallets: wallets,
                        networks: this.networks,
                        onCustomWalletSelected: async (provider) => {
                            console.log('onCustomWalletSelected', provider);
                            let paymentProvider;
                            if (provider.name === 'tonwallet') {
                                this.walletModel = tonWallet;
                                paymentProvider = interface_2.PaymentProvider.TonWallet;
                            }
                            else {
                                this.walletModel = evmWallet;
                                paymentProvider = interface_2.PaymentProvider.Metamask;
                            }
                            resolve(paymentProvider);
                        }
                    });
                    modalContainer.append(this.mdWallet);
                }
                this.mdWallet.showModal();
            });
        }
        async handlePlaceMarketplaceOrder() {
            if (this.placeMarketplaceOrder) {
                this.orderId = components_5.IdUtils.generateUUID();
                await this.placeMarketplaceOrder(this.placeOrder);
            }
        }
        async handlePaymentSuccess() {
            if (this.onPaymentSuccess) {
                await this.onPaymentSuccess(this.paymentActivity);
                this.isCompleted = true;
            }
        }
        processCompletedHandler() {
            if (this.isCompleted) {
                window.location.assign(`${this.returnUrl}/${this.paymentActivity.orderId || ''}`);
            }
        }
        updateShippingInfo(value) {
            this.shippingInfo = value;
        }
        async createPaymentIntent() {
            try {
                const response = await fetch(`${this.baseStripeApi}/payment-intent`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        currency: this.stripeCurrency,
                        amount: this.stripeAmount,
                        accountId: this.stripeAccountId
                    })
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
    }
    exports.Model = Model;
});
define("@scom/scom-payment-widget/components/invoiceCreation.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-payment-widget/components/index.css.ts", "@scom/scom-payment-widget/translations.json.ts"], function (require, exports, components_6, index_css_1, translations_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InvoiceCreation = void 0;
    const Theme = components_6.Styles.Theme.ThemeVars;
    let InvoiceCreation = class InvoiceCreation extends components_6.Module {
        get model() {
            return this._model;
        }
        set model(value) {
            this._model = value;
            this.updateInfo();
        }
        constructor(parent, options) {
            super(parent, options);
        }
        renderProducts() {
            if (this.model?.products.length) {
                const nodeItems = [];
                const { products, currency } = this.model;
                for (const product of products) {
                    const element = (this.$render("i-vstack", { gap: "1rem", width: "100%" },
                        product.images?.length ? this.$render("i-image", { url: product.images[0], width: "auto", maxWidth: "100%", height: 100, margin: { left: 'auto', right: 'auto' } }) : [],
                        this.$render("i-label", { caption: product.name, font: { bold: true } }),
                        this.$render("i-hstack", { gap: "0.5rem", verticalAlignment: "center", horizontalAlignment: "space-between", wrap: "wrap" },
                            this.$render("i-label", { caption: this.i18n.get('$price'), font: { color: Theme.text.hint } }),
                            this.$render("i-label", { caption: `${components_6.FormatUtils.formatNumber(product.price, { decimalFigures: 2 })} ${currency}`, font: { bold: true }, class: index_css_1.textUpperCaseStyle })),
                        this.$render("i-hstack", { gap: "0.5rem", verticalAlignment: "center", horizontalAlignment: "space-between", wrap: "wrap" },
                            this.$render("i-label", { caption: this.i18n.get('$quantity'), font: { color: Theme.text.hint } }),
                            this.$render("i-label", { caption: components_6.FormatUtils.formatNumber(product.quantity, { hasTrailingZero: false }), font: { bold: true } }))));
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
            const { totalAmount, currency, products, paymentId, title } = this.model;
            if (this.pnlItemInfo) {
                const hasTitle = !!title;
                const hasProduct = !!products?.length;
                this.pnlItemInfo.visible = hasTitle || hasProduct;
                this.lbItem.caption = title || '';
                this.lbItem.visible = hasTitle;
                this.renderProducts();
            }
            if (this.lbAmount) {
                this.lbAmount.caption = `${components_6.FormatUtils.formatNumber(totalAmount, { decimalFigures: 2 })} ${currency}`;
            }
            if (this.pnlPaymentId) {
                const _paymentId = paymentId || '';
                this.pnlPaymentId.visible = !!_paymentId;
                this.lbPaymentId.caption = _paymentId;
            }
        }
        handleContinue() {
            if (this.onContinue)
                this.onContinue();
        }
        async init() {
            this.i18n.init({ ...translations_json_1.default });
            super.init();
            this.onContinue = this.getAttribute('onContinue', true) || this.onContinue;
            const model = this.getAttribute('model', true);
            if (model) {
                this.model = model;
            }
        }
        render() {
            return this.$render("i-stack", { direction: "vertical", gap: "1rem", width: "100%", alignItems: "center", padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' } },
                this.$render("i-stack", { direction: "vertical", height: "100%", width: "100%" },
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
                this.$render("i-button", { caption: "$continue", background: { color: Theme.colors.primary.main }, class: index_css_1.fullWidthButtonStyle, onClick: this.handleContinue }));
        }
    };
    InvoiceCreation = __decorate([
        (0, components_6.customElements)('scom-payment-widget--invoice-creation')
    ], InvoiceCreation);
    exports.InvoiceCreation = InvoiceCreation;
});
define("@scom/scom-payment-widget/components/common/header.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-payment-widget/components/index.css.ts", "@scom/scom-payment-widget/translations.json.ts"], function (require, exports, components_7, index_css_2, translations_json_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PaymentHeader = void 0;
    const Theme = components_7.Styles.Theme.ThemeVars;
    let PaymentHeader = class PaymentHeader extends components_7.Module {
        setHeader(title, currency, amount) {
            if (this.lbTitle) {
                if (this.lbTitle.caption !== title)
                    this.lbTitle.caption = title || '';
                const formattedAmount = `${components_7.FormatUtils.formatNumber(amount, { decimalFigures: 2 })} ${currency?.toUpperCase() || 'USD'}`;
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
        (0, components_7.customElements)('scom-payment-widget--header')
    ], PaymentHeader);
    exports.PaymentHeader = PaymentHeader;
});
define("@scom/scom-payment-widget/components/common/styledInput.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-payment-widget/translations.json.ts"], function (require, exports, components_8, translations_json_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StyledInput = void 0;
    const Theme = components_8.Styles.Theme.ThemeVars;
    let StyledInput = class StyledInput extends components_8.Module {
        get value() {
            return this.styledInput.value;
        }
        set value(value) {
            this.styledInput.value = value;
        }
        get enabled() {
            return this.styledInput.enabled;
        }
        set enabled(value) {
            this.styledInput.enabled = value;
        }
        set inputBorder(value) {
            this.styledInput.border = value;
        }
        init() {
            this.i18n.init({ ...translations_json_3.default });
            super.init();
            this.lbCaption.caption = this.getAttribute('caption', true);
            this.lbRequired.visible = this.getAttribute('required', true, false);
            this.onChanged = this.getAttribute('onChanged', true);
        }
        render() {
            return (this.$render("i-hstack", { gap: "0.5rem", width: "100%", verticalAlignment: "center", wrap: "wrap", horizontalAlignment: "space-between" },
                this.$render("i-hstack", { gap: "0.15rem" },
                    this.$render("i-label", { id: "lbCaption" }),
                    this.$render("i-label", { id: "lbRequired", visible: false, caption: "*", font: { color: Theme.colors.error.main } })),
                this.$render("i-input", { id: "styledInput", width: "calc(100% - 116px)", minWidth: 150, height: 36, padding: { left: '0.5rem', right: '0.5rem' }, border: { radius: 5, width: 1, style: 'solid', color: 'transparent' }, onChanged: this.onChanged })));
        }
    };
    StyledInput = __decorate([
        (0, components_8.customElements)('scom-payment-widget--styled-input')
    ], StyledInput);
    exports.StyledInput = StyledInput;
});
define("@scom/scom-payment-widget/components/common/styledComboBox.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-payment-widget/translations.json.ts"], function (require, exports, components_9, translations_json_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StyledComboBox = void 0;
    const Theme = components_9.Styles.Theme.ThemeVars;
    let StyledComboBox = class StyledComboBox extends components_9.Module {
        get items() {
            return this.styledComboBox.items;
        }
        set items(value) {
            this.styledComboBox.items = value;
        }
        get selectedItem() {
            return this.styledComboBox.selectedItem;
        }
        set selectedItem(value) {
            this.styledComboBox.selectedItem = value;
        }
        get enabled() {
            return this.styledComboBox.enabled;
        }
        set enabled(value) {
            this.styledComboBox.enabled = value;
        }
        init() {
            this.i18n.init({ ...translations_json_4.default });
            super.init();
            this.lbCaption.caption = this.getAttribute('caption', true);
            this.lbRequired.visible = this.getAttribute('required', true, false);
            const items = this.getAttribute('items', true);
            if (items) {
                this.styledComboBox.items = this.getAttribute('items', true);
            }
            this.onChanged = this.getAttribute('onChanged', true);
        }
        clear() {
            this.styledComboBox.clear();
        }
        render() {
            return (this.$render("i-hstack", { gap: "0.5rem", width: "100%", verticalAlignment: "center", wrap: "wrap", horizontalAlignment: "space-between" },
                this.$render("i-hstack", { gap: "0.15rem" },
                    this.$render("i-label", { id: "lbCaption" }),
                    this.$render("i-label", { id: "lbRequired", visible: false, caption: "*", font: { color: Theme.colors.error.main } })),
                this.$render("i-combo-box", { id: "styledComboBox", width: "calc(100% - 116px)", minWidth: 150, height: 36, icon: { width: 14, height: 14, name: 'angle-down', fill: Theme.divider }, border: { width: 1, style: 'solid', color: Theme.divider, radius: 5 }, onChanged: this.onChanged })));
        }
    };
    StyledComboBox = __decorate([
        (0, components_9.customElements)('scom-payment-widget--styled-combo-box')
    ], StyledComboBox);
    exports.StyledComboBox = StyledComboBox;
});
define("@scom/scom-payment-widget/components/common/index.ts", ["require", "exports", "@scom/scom-payment-widget/components/common/header.tsx", "@scom/scom-payment-widget/components/common/styledInput.tsx", "@scom/scom-payment-widget/components/common/styledComboBox.tsx"], function (require, exports, header_1, styledInput_1, styledComboBox_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StyledComboBox = exports.StyledInput = exports.PaymentHeader = void 0;
    Object.defineProperty(exports, "PaymentHeader", { enumerable: true, get: function () { return header_1.PaymentHeader; } });
    Object.defineProperty(exports, "StyledInput", { enumerable: true, get: function () { return styledInput_1.StyledInput; } });
    Object.defineProperty(exports, "StyledComboBox", { enumerable: true, get: function () { return styledComboBox_1.StyledComboBox; } });
});
define("@scom/scom-payment-widget/components/shippingInfo.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-payment-widget/components/index.css.ts", "@scom/scom-payment-widget/translations.json.ts"], function (require, exports, components_10, index_css_3, translations_json_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ShippingInfo = void 0;
    const Theme = components_10.Styles.Theme.ThemeVars;
    let ShippingInfo = class ShippingInfo extends components_10.Module {
        get model() {
            return this._model;
        }
        set model(value) {
            this._model = value;
            this.updateHeader();
        }
        constructor(parent, options) {
            super(parent, options);
        }
        clear() {
            this.inputName.value = '';
            this.inputPhoneNumber.value = '';
            this.inputEmail.value = '';
            this.inputAddress.value = '';
            this.inputNote.value = '';
            this.btnContinue.enabled = false;
        }
        updateHeader() {
            if (this.model && this.header) {
                const { title, currency, totalAmount } = this.model;
                this.header.setHeader(title, currency, totalAmount);
            }
        }
        handleCheckInfo() {
            const isValid = !!(this.inputName.value && this.inputAddress.value && this.validateEmail(this.inputEmail.value));
            this.btnContinue.enabled = isValid;
        }
        handlePhoneNumber() {
            const value = this.inputPhoneNumber.value;
            this.inputPhoneNumber.value = value.replace(/[^0-9]/g, '');
            this.handleCheckInfo();
        }
        validateEmail(email) {
            if (!email)
                return true;
            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            return emailPattern.test(email);
        }
        handleEmail() {
            this.inputEmail.inputBorder = { radius: 5, width: 1, style: 'solid', color: this.validateEmail(this.inputEmail.value) ? 'transparent' : Theme.colors.error.dark };
            this.handleCheckInfo();
        }
        handleContinue() {
            this.model.updateShippingInfo({
                name: this.inputName.value || '',
                address: this.inputAddress.value || '',
                message: this.inputNote.value || '',
                contact: {
                    nostr: '',
                    phone: this.inputPhoneNumber.value || '',
                    email: this.inputEmail.value || ''
                },
                // shippingId: ''
            });
            if (this.onContinue)
                this.onContinue();
        }
        handleBack() {
            if (this.onBack)
                this.onBack();
        }
        async init() {
            this.i18n.init({ ...translations_json_5.default });
            super.init();
            this.onContinue = this.getAttribute('onContinue', true) || this.onContinue;
            this.onBack = this.getAttribute('onBack', true) || this.onBack;
            const model = this.getAttribute('model', true);
            if (model) {
                this.model = model;
            }
            this.updateHeader();
        }
        render() {
            return this.$render("i-stack", { direction: "vertical", gap: "1rem", width: "100%", alignItems: "center", padding: { bottom: '1rem' } },
                this.$render("scom-payment-widget--header", { id: "header" }),
                this.$render("i-stack", { gap: "1rem", direction: "vertical", height: "100%", width: "100%", padding: { left: '1rem', right: '1rem' } },
                    this.$render("i-label", { caption: "$shipping_address", class: index_css_3.textCenterStyle, font: { size: '1.25rem', color: Theme.colors.primary.main, bold: true } }),
                    this.$render("scom-payment-widget--styled-input", { id: "inputName", caption: "$name", required: true, onChanged: this.handleCheckInfo }),
                    this.$render("scom-payment-widget--styled-input", { id: "inputAddress", caption: "$address", required: true, onChanged: this.handleCheckInfo }),
                    this.$render("scom-payment-widget--styled-input", { id: "inputPhoneNumber", caption: "$phone_number", onChanged: this.handlePhoneNumber }),
                    this.$render("scom-payment-widget--styled-input", { id: "inputEmail", caption: "$email", onChanged: this.handleEmail }),
                    this.$render("i-hstack", { gap: "0.5rem", width: "100%", verticalAlignment: "center", wrap: "wrap", horizontalAlignment: "space-between" },
                        this.$render("i-label", { caption: "$note" }),
                        this.$render("i-input", { id: "inputNote", inputType: "textarea", width: "calc(100% - 116px)", minWidth: 150, height: "unset", rows: 3, padding: { left: '0.5rem', right: '0.5rem' }, border: { radius: 5 }, maxLength: 4000 }))),
                this.$render("i-stack", { direction: "horizontal", width: "100%", alignItems: "center", justifyContent: "center", margin: { top: 'auto' }, gap: "1rem", wrap: "wrap-reverse" },
                    this.$render("i-button", { caption: "$back", class: index_css_3.halfWidthButtonStyle, background: { color: Theme.colors.secondary.main }, onClick: this.handleBack }),
                    this.$render("i-button", { id: "btnContinue", enabled: false, caption: "$continue", background: { color: Theme.colors.primary.main }, class: index_css_3.halfWidthButtonStyle, onClick: this.handleContinue })));
        }
    };
    ShippingInfo = __decorate([
        (0, components_10.customElements)('scom-payment-widget--shipping-info')
    ], ShippingInfo);
    exports.ShippingInfo = ShippingInfo;
});
define("@scom/scom-payment-widget/assets.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const moduleDir = components_11.application.currentModuleDir;
    function fullPath(path) {
        return `${moduleDir}/${path}`;
    }
    ;
    exports.default = {
        fullPath
    };
});
define("@scom/scom-payment-widget/components/paymentMethod.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-payment-widget/interface.ts", "@scom/scom-payment-widget/assets.ts", "@scom/scom-payment-widget/store.ts", "@scom/scom-payment-widget/components/index.css.ts", "@scom/scom-payment-widget/translations.json.ts"], function (require, exports, components_12, interface_3, assets_1, store_2, index_css_4, translations_json_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PaymentMethod = void 0;
    const Theme = components_12.Styles.Theme.ThemeVars;
    let PaymentMethod = class PaymentMethod extends components_12.Module {
        get model() {
            return this._model;
        }
        set model(value) {
            this._model = value;
            this.updateAmount();
        }
        constructor(parent, options) {
            super(parent, options);
        }
        updateAmount() {
            if (this.header && this.model) {
                const { title, currency, totalAmount } = this.model;
                this.header.setHeader(title, currency, totalAmount);
            }
        }
        getPaymentProviders(type) {
            if (type === interface_3.PaymentType.Crypto) {
                const cryptoOptions = this.model.payment?.cryptoPayoutOptions || [];
                if (!cryptoOptions.length)
                    return [];
                const hasTonWallet = cryptoOptions.find(opt => opt.networkCode === "TON") != null;
                if (!hasTonWallet) {
                    return store_2.PaymentProviders.filter(v => v.type === type && v.provider !== interface_3.PaymentProvider.TonWallet);
                }
                else if (cryptoOptions.length === 1) {
                    return store_2.PaymentProviders.filter(v => v.provider === interface_3.PaymentProvider.TonWallet);
                }
            }
            return store_2.PaymentProviders.filter(v => v.type === type);
        }
        renderMethodItems(type) {
            this.lbPayMethod.caption = this.i18n.get(type === interface_3.PaymentType.Fiat ? '$select_payment_gateway' : '$select_your_wallet');
            const providers = this.getPaymentProviders(type);
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
        handlePaymentType(type) {
            if (type === interface_3.PaymentType.Fiat) {
                this.model.paymentMethod = 'Stripe';
                this.handlePaymentProvider(interface_3.PaymentProvider.Stripe);
            }
            else if (type) {
                this.model.paymentMethod = 'EVM';
                this.handlePaymentProvider(interface_3.PaymentProvider.Metamask);
                // this.renderMethodItems(type);
                // this.pnlPaymentType.visible = false;
                // this.pnlPaymentMethod.visible = true;
            }
        }
        handlePaymentProvider(provider) {
            if (this.onSelectedPaymentProvider)
                this.onSelectedPaymentProvider(provider);
        }
        handleBack() {
            if (this.pnlPaymentType.visible && this.onBack) {
                this.onBack();
                return;
            }
            this.updateUI();
        }
        updateUI() {
            this.pnlPaymentType.visible = true;
            this.pnlPaymentMethod.visible = false;
            const { cryptoPayoutOptions, stripeAccountId, hasPayment } = this.model;
            this.pnlCryptoPayment.visible = cryptoPayoutOptions.length > 0;
            this.pnlFiatPayment.visible = !!stripeAccountId;
            this.lbPayMethod.caption = this.i18n.get(hasPayment ? '$how_will_you_pay' : '$the_stall_owner_has_not_set_up_payments_yet');
        }
        async init() {
            this.i18n.init({ ...translations_json_6.default });
            super.init();
            this.getPaymentProviders = this.getPaymentProviders.bind(this);
            this.renderMethodItems = this.renderMethodItems.bind(this);
            this.onBack = this.getAttribute('onBack', true) || this.onBack;
            this.onSelectedPaymentProvider = this.getAttribute('onSelectedPaymentProvider', true) || this.onSelectedPaymentProvider;
            const model = this.getAttribute('model', true);
            if (model) {
                this.model = model;
            }
        }
        render() {
            return this.$render("i-stack", { direction: "vertical", alignItems: "center", width: "100%" },
                this.$render("scom-payment-widget--header", { id: "header", margin: { bottom: '1rem' } }),
                this.$render("i-stack", { direction: "vertical", gap: "1rem", width: "100%", height: "100%", alignItems: "center", padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' } },
                    this.$render("i-label", { id: "lbPayMethod", caption: "$how_will_you_pay", font: { size: '1rem', bold: true, color: Theme.colors.primary.main } }),
                    this.$render("i-stack", { id: "pnlPaymentType", direction: "vertical", gap: "1rem", width: "100%", height: "100%", alignItems: "center" },
                        this.$render("scom-payment-widget--payment-type", { id: "pnlFiatPayment", width: "100%", type: interface_3.PaymentType.Fiat, title: "$fiat_currency", iconName: "exchange-alt", onSelectPaymentType: this.handlePaymentType }),
                        this.$render("scom-payment-widget--payment-type", { id: "pnlCryptoPayment", width: "100%", type: interface_3.PaymentType.Crypto, title: "$web3_wallet", iconName: "wallet", visible: false, onSelectPaymentType: this.handlePaymentType })),
                    this.$render("i-stack", { id: "pnlPaymentMethod", visible: false, direction: "vertical", gap: "2rem", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" },
                        this.$render("i-stack", { id: "pnlMethodItems", direction: "vertical", gap: "1rem", width: "100%", height: "100%" })),
                    this.$render("i-button", { caption: "$back", class: index_css_4.fullWidthButtonStyle, background: { color: Theme.colors.secondary.main }, onClick: this.handleBack })),
                this.$render("i-alert", { id: "mdAlert", class: index_css_4.alertStyle }));
        }
    };
    PaymentMethod = __decorate([
        (0, components_12.customElements)('scom-payment-widget--payment-method')
    ], PaymentMethod);
    exports.PaymentMethod = PaymentMethod;
    let PaymentTypeModule = class PaymentTypeModule extends components_12.Module {
        get model() {
            return this._model;
        }
        set model(value) {
            this._model = value;
        }
        handlePaymentType() {
            if (this.onSelectPaymentType)
                this.onSelectPaymentType(this.type);
        }
        async init() {
            this.i18n.init({ ...translations_json_6.default });
            super.init();
            this.type = this.getAttribute('type', true);
            this.lblPaymentType.caption = this.getAttribute('title', true, "");
            this.iconPaymentType.name = this.getAttribute('iconName', true);
            const description = this.getAttribute('description', true);
            if (description) {
                this.lblDescription.caption = description;
                this.lblDescription.visible = true;
            }
        }
        render() {
            return (this.$render("i-stack", { direction: "horizontal", alignItems: "center", gap: "1rem", width: "100%", border: { width: 1, style: 'solid', color: Theme.divider, radius: 8 }, padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, cursor: "pointer", onClick: this.handlePaymentType },
                this.$render("i-stack", { direction: "vertical", gap: "0.75rem", width: "calc(100% - 30px)" },
                    this.$render("i-stack", { direction: "horizontal", gap: "0.5rem", alignItems: "center" },
                        this.$render("i-icon", { id: "iconPaymentType", width: 20, height: 20, fill: Theme.colors.primary.main }),
                        this.$render("i-label", { id: "lblPaymentType", font: { size: '1rem', bold: true, color: Theme.text.primary } })),
                    this.$render("i-label", { id: "lblDescription", font: { color: Theme.text.secondary }, visible: false })),
                this.$render("i-icon", { name: "arrow-right", width: 20, height: 20, fill: Theme.text.primary, margin: { left: 'auto', right: 'auto' } })));
        }
    };
    PaymentTypeModule = __decorate([
        (0, components_12.customElements)('scom-payment-widget--payment-type')
    ], PaymentTypeModule);
});
define("@scom/scom-payment-widget/components/statusPayment.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-payment-widget/components/index.css.ts", "@scom/scom-payment-widget/assets.ts", "@scom/scom-payment-widget/store.ts", "@scom/scom-payment-widget/translations.json.ts"], function (require, exports, components_13, index_css_5, assets_2, store_3, translations_json_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StatusPayment = void 0;
    const Theme = components_13.Styles.Theme.ThemeVars;
    let StatusPayment = class StatusPayment extends components_13.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        set model(data) {
            this._model = data;
        }
        get model() {
            return this._model;
        }
        getStatusText(status) {
            if (status === 'completed') {
                return this.i18n.get('$payment_completed');
            }
            if (status === 'failed') {
                return this.i18n.get('$payment_failed');
            }
            return this.i18n.get('$payment_pending');
        }
        updateStatus(info) {
            const { status, receipt, provider, ownerAddress } = info;
            this.receipt = receipt;
            this.status = status;
            this.provider = provider;
            const isPending = status === 'pending';
            const isCompleted = status === 'completed';
            this.pnlViewTransaction.visible = isPending || isCompleted;
            this.lbHeaderStatus.caption = this.i18n.get(isPending ? '$payment_pending' : isCompleted ? '$success' : '$failed');
            this.lbHeaderStatus.style.color = isPending ? Theme.colors.primary.main : isCompleted ? Theme.colors.success.main : Theme.colors.error.main;
            this.lbHeaderStatus.style.marginInline = isPending ? 'inherit' : 'auto';
            this.imgHeaderStatus.visible = isPending;
            this.lbStatus.caption = this.getStatusText(status);
            if (isPending) {
                this.imgStatus.classList.add(index_css_5.loadingImageStyle);
            }
            else {
                this.imgStatus.classList.remove(index_css_5.loadingImageStyle);
            }
            this.imgStatus.url = assets_2.default.fullPath(`img/${isPending ? 'loading.svg' : isCompleted ? 'success.svg' : 'error.png'}`);
            const currentProvider = store_3.PaymentProviders.find(v => v.provider === provider);
            this.imgWallet.url = assets_2.default.fullPath(`img/${currentProvider.image}`);
            this.lbAddress.caption = ownerAddress.substr(0, 6) + '...' + ownerAddress.substr(-4);
            this.btnClose.visible = !isPending;
        }
        handleViewTransaction() {
            this.model.walletModel.viewExplorerByTransactionHash(this.receipt);
        }
        handleClose() {
            if (this.onClose)
                this.onClose(this.status);
        }
        async init() {
            this.i18n.init({ ...translations_json_7.default });
            super.init();
            this.onClose = this.getAttribute('onClose', true) || this.onClose;
        }
        render() {
            return this.$render("i-stack", { direction: "vertical", gap: "1rem", width: "100%", alignItems: "center", padding: { top: '1rem', bottom: '1rem' } },
                this.$render("i-stack", { direction: "vertical", gap: "1rem", height: "100%", width: "100%" },
                    this.$render("i-stack", { direction: "horizontal", gap: "1rem", justifyContent: "space-between", alignItems: "center", width: "100%", minHeight: 40, padding: { left: '1rem', right: '1rem', bottom: '1rem' }, border: { bottom: { style: 'solid', width: 1, color: Theme.divider } } },
                        this.$render("i-label", { id: "lbHeaderStatus", font: { size: '0.875rem', color: Theme.colors.primary.main, transform: 'uppercase', bold: true } }),
                        this.$render("i-image", { id: "imgHeaderStatus", class: index_css_5.loadingImageStyle, url: assets_2.default.fullPath('img/loading.svg'), width: 20, height: 20, minWidth: 20 })),
                    this.$render("i-stack", { direction: "vertical", gap: "1rem", width: "100%", height: "100%", alignItems: "center", padding: { left: '1rem', right: '1rem' } },
                        this.$render("i-stack", { direction: "horizontal", justifyContent: "space-between", alignItems: "center", gap: "1rem", width: "100%", wrap: "wrap", margin: { bottom: '0.5rem' } },
                            this.$render("i-stack", { direction: "horizontal", gap: "0.5rem", alignItems: "center", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, border: { style: 'solid', width: 1, color: Theme.divider, radius: 8 } },
                                this.$render("i-image", { id: "imgWallet", width: 24, height: 24, minWidth: 24 }),
                                this.$render("i-label", { id: "lbAddress" })),
                            this.$render("i-stack", { id: "pnlViewTransaction", direction: "horizontal", gap: "0.5rem", alignItems: "center", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, border: { style: 'solid', width: 1, color: Theme.divider, radius: 8 }, cursor: "pointer", width: "fit-content", onClick: this.handleViewTransaction },
                                this.$render("i-label", { caption: "$view_transaction" }))),
                        this.$render("i-stack", { direction: "vertical", alignItems: "center", justifyContent: "center", gap: "1rem", width: "100%", height: "100%" },
                            this.$render("i-image", { id: "imgStatus", width: 64, height: 64 }),
                            this.$render("i-label", { id: "lbStatus", class: index_css_5.textCenterStyle, font: { size: '1rem', color: Theme.text.primary, bold: true } })))),
                this.$render("i-button", { id: "btnClose", visible: false, caption: "$close", background: { color: Theme.colors.primary.main }, class: index_css_5.fullWidthButtonStyle, onClick: this.handleClose }));
        }
    };
    StatusPayment = __decorate([
        (0, components_13.customElements)('scom-payment-widget--status-payment')
    ], StatusPayment);
    exports.StatusPayment = StatusPayment;
});
define("@scom/scom-payment-widget/utils.ts", ["require", "exports", "@scom/scom-payment-widget/store.ts"], function (require, exports, store_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.loadStripe = void 0;
    async function loadStripe() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = store_4.STRIPE_LIB_URL;
            script.async = true;
            script.onload = () => {
                resolve(true);
            };
            document.head.appendChild(script);
        });
    }
    exports.loadStripe = loadStripe;
});
define("@scom/scom-payment-widget/components/stripePayment.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-payment-widget/store.ts", "@scom/scom-payment-widget/components/index.css.ts", "@scom/scom-payment-widget/utils.ts", "@scom/scom-payment-widget/translations.json.ts"], function (require, exports, components_14, store_5, index_css_6, utils_1, translations_json_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StripePayment = void 0;
    const Theme = components_14.Styles.Theme.ThemeVars;
    let StripePayment = class StripePayment extends components_14.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        set model(data) {
            this._model = data;
            this.updateAmount();
        }
        get model() {
            return this._model;
        }
        onStartPayment() {
            this.updateAmount();
        }
        updateAmount() {
            if (this.model && this.header) {
                const { title, currency, totalAmount } = this.model;
                this.header.setHeader(title, currency, totalAmount);
                this.initStripePayment();
            }
        }
        async initStripePayment() {
            if (!this.stripeElements)
                this.pnlLoading.visible = true;
            if (!window.Stripe) {
                await (0, utils_1.loadStripe)();
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
                    this.publishableKey = await (0, store_5.getStripeKey)(`${baseStripeApi}/key`);
                    if (!this.publishableKey)
                        return;
                }
                this.stripe = window.Stripe(this.publishableKey);
                this.stripeElements = this.stripe.elements({
                    mode: 'payment',
                    currency: stripeCurrency,
                    amount: stripeAmount,
                    appearance: {
                        theme: 'night'
                    },
                });
                const paymentElement = this.stripeElements.create('payment');
                paymentElement.mount('#pnlStripePaymentForm');
            }
            if (this.pnlLoading.visible) {
                setTimeout(() => {
                    this.pnlLoading.visible = false;
                }, 500);
            }
        }
        async handleStripeCheckoutClick() {
            if (!this.stripe)
                return;
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
                }
                ;
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
                    });
                    if (error) {
                        this.showAlert('error', this.i18n.get('$payment_failed'), error.message);
                    }
                    else {
                        await this.model.handlePaymentSuccess();
                        this.showAlert('success', this.i18n.get('$payment_completed'), '');
                    }
                }
                catch (error) {
                    // mini app
                    const data = await this.stripe.retrievePaymentIntent(clientSecret);
                    const status = data?.paymentIntent.status;
                    if (status === 'succeeded' || status === 'processing') {
                        await this.model.handlePaymentSuccess();
                        this.showAlert('success', this.i18n.get('$payment_completed'), '');
                    }
                    else {
                        this.showAlert('error', this.i18n.get('$payment_failed'), status || error?.message || '');
                    }
                }
                this.showButtonIcon(false);
            });
        }
        showButtonIcon(value) {
            this.btnCheckout.rightIcon.spin = value;
            this.btnCheckout.rightIcon.visible = value;
            this.btnBack.enabled = !value;
        }
        showAlert(status, title, msg) {
            if (status === 'success') {
                this.mdAlert.onClose = () => {
                    if (this.onClose) {
                        this.onClose();
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
            this.i18n.init({ ...translations_json_8.default });
            super.init();
            this.onClose = this.getAttribute('onClose', true) || this.onClose;
            this.onBack = this.getAttribute('onBack', true) || this.onBack;
            const model = this.getAttribute('model', true);
            if (model)
                this.model = model;
        }
        render() {
            return this.$render("i-stack", { direction: "vertical", alignItems: "center", width: "100%" },
                this.$render("scom-payment-widget--header", { id: "header", margin: { bottom: '1rem' }, display: "flex" }),
                this.$render("i-stack", { direction: "vertical", width: "100%", height: "100%", alignItems: "center", padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, position: "relative" },
                    this.$render("i-vstack", { id: "pnlLoading", visible: false, width: "100%", minHeight: 315, position: "absolute", bottom: 0, zIndex: 899, background: { color: Theme.background.main }, class: "i-loading-overlay" },
                        this.$render("i-vstack", { horizontalAlignment: "center", verticalAlignment: "center", position: "absolute", top: "calc(50% - 0.75rem)", left: "calc(50% - 0.75rem)" },
                            this.$render("i-icon", { class: "i-loading-spinner_icon", name: "spinner", width: 24, height: 24, fill: Theme.colors.primary.main }))),
                    this.$render("i-stack", { direction: "vertical", id: "pnlStripePaymentForm", background: { color: '#30313d' }, border: { radius: 12 }, padding: { top: '1rem', left: '1rem', bottom: '2rem', right: '1rem' }, margin: { bottom: '1rem' } }),
                    this.$render("i-stack", { direction: "horizontal", width: "100%", alignItems: "center", justifyContent: "center", margin: { top: 'auto' }, gap: "1rem", wrap: "wrap-reverse" },
                        this.$render("i-button", { id: "btnBack", caption: "$back", background: { color: Theme.colors.secondary.main }, class: index_css_6.halfWidthButtonStyle, onClick: this.handleBack }),
                        this.$render("i-button", { id: "btnCheckout", caption: "$checkout", background: { color: Theme.colors.primary.main }, class: index_css_6.halfWidthButtonStyle, onClick: this.handleStripeCheckoutClick }))),
                this.$render("i-alert", { id: "mdAlert", class: index_css_6.alertStyle }));
        }
    };
    StripePayment = __decorate([
        (0, components_14.customElements)('scom-payment-widget--stripe-payment')
    ], StripePayment);
    exports.StripePayment = StripePayment;
});
define("@scom/scom-payment-widget/components/walletPayment.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-payment-widget/interface.ts", "@scom/scom-payment-widget/assets.ts", "@scom/scom-token-list", "@scom/scom-payment-widget/store.ts", "@ijstech/eth-wallet", "@scom/scom-payment-widget/components/index.css.ts", "@scom/scom-payment-widget/translations.json.ts", "@scom/scom-payment-widget/wallets/index.ts"], function (require, exports, components_15, interface_4, assets_3, scom_token_list_1, store_6, eth_wallet_3, index_css_7, translations_json_9, wallets_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WalletPayment = void 0;
    const path = components_15.application.currentModuleDir;
    const Theme = components_15.Styles.Theme.ThemeVars;
    let WalletPayment = class WalletPayment extends components_15.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        get model() {
            return this._model;
        }
        set model(value) {
            this._model = value;
            this.updateAmount();
        }
        get tokens() {
            return this.model.tokens;
        }
        get wallets() {
            return this.model.wallets;
        }
        get networks() {
            return this.model.networks;
        }
        get provider() {
            return this.model.walletModel instanceof wallets_2.TonWallet ? interface_4.PaymentProvider.TonWallet : interface_4.PaymentProvider.Metamask;
        }
        async onStartPayment() {
            if (!this.header)
                return;
            this.model.handleWalletConnected = this.handleWalletConnected.bind(this);
            this.model.handleWalletChainChanged = this.handleWalletChainChanged.bind(this);
            this.showFirstScreen();
            this.pnlWallet.visible = true;
        }
        handleWalletConnected() {
            this.checkWalletStatus();
        }
        handleWalletChainChanged() {
            this.showFirstScreen();
            this.checkWalletStatus();
        }
        showFirstScreen() {
            this.header.visible = true;
            this.pnlPayAmount.visible = false;
            this.pnlTokenItems.visible = true;
            this.pnlPayDetail.visible = false;
            this.pnlWallet.visible = false;
            this.pnlTokens.visible = false;
            this.btnPay.visible = false;
            this.btnBack.width = '100%';
            this.isToPay = false;
        }
        updateAmount() {
            if (this.header && this.model) {
                const { title, currency, totalAmount } = this.model;
                this.header.setHeader(title, currency, totalAmount);
                if (this.lbPayItem.caption !== title)
                    this.lbPayItem.caption = title;
                const formattedAmount = `${components_15.FormatUtils.formatNumber(totalAmount, { decimalFigures: 2 })} ${currency}`;
                if (this.lbPayAmount.caption !== formattedAmount)
                    this.lbPayAmount.caption = formattedAmount;
            }
        }
        async checkWalletStatus() {
            const paymentProvider = this.provider;
            let isConnected = this.model.walletModel.isWalletConnected();
            this.pnlWallet.visible = !isConnected;
            const provider = store_6.PaymentProviders.find(v => v.provider === paymentProvider);
            if (isConnected) {
                if (this.isToPay) {
                    this.updatePaymentButtonVisibility();
                }
                const address = this.model.walletModel.getWalletAddress();
                if (provider) {
                    this.imgCurrentWallet.url = assets_3.default.fullPath(`img/${provider.image}`);
                    this.lbCurrentAddress.caption = address.substr(0, 6) + '...' + address.substr(-4);
                    const network = this.model.walletModel.getNetworkInfo();
                    if (network) {
                        this.imgCurrentNetwork.url = network.image;
                        this.lbCurrentNetwork.caption = network.chainName;
                        this.pnlNetwork.visible = true;
                    }
                    else {
                        this.pnlNetwork.visible = false;
                    }
                }
                if (paymentProvider === interface_4.PaymentProvider.Metamask) {
                    await this.renderErcTokens();
                }
                else if (paymentProvider === interface_4.PaymentProvider.TonWallet) {
                    await this.renderTonToken();
                }
            }
            this.pnlTokens.visible = isConnected;
        }
        // private async updateTokenBalances(tokens?: ITokenObject[]) {
        //     const arr = (tokens || this.tokens).reduce((acc, token) => {
        //         const { chainId } = token;
        //         if (!acc[chainId]) {
        //             acc[chainId] = [];
        //         }
        //         acc[chainId].push(token);
        //         return acc;
        //     }, {});
        //     let promises: Promise<any>[] = [];
        //     for (const chainId in arr) {
        //         const tokens = arr[chainId];
        //         promises.push(tokenStore.updateTokenBalancesByChainId(Number(chainId), tokens));
        //     }
        //     await Promise.all(promises);
        // }
        async renderErcTokens() {
            const network = this.model.walletModel.getNetworkInfo();
            const chainId = network.chainId;
            const tokens = this.tokens.filter(v => v.chainId === chainId);
            // await this.updateTokenBalances(tokens);
            const nodeItems = [];
            for (const token of tokens) {
                // const balances = tokenStore.getTokenBalancesByChainId(chainId) || {};
                // const tokenBalance = balances[token.address?.toLowerCase() || token.symbol] || 0;
                // const formattedBalance = FormatUtils.formatNumber(tokenBalance, { decimalFigures: 2 });
                nodeItems.push(this.$render("i-stack", { direction: "horizontal", justifyContent: "space-between", alignItems: "center", wrap: "wrap", gap: "0.5rem", width: "100%", border: { width: 1, style: 'solid', color: Theme.divider, radius: 8 }, padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, cursor: "pointer", onClick: () => this.handleSelectToken(token) },
                    this.$render("i-stack", { direction: "horizontal", alignItems: "center", gap: "0.75rem" },
                        this.$render("i-image", { width: 20, height: 20, minWidth: 20, url: scom_token_list_1.assets.tokenPath(token, chainId) }),
                        this.$render("i-stack", { direction: "vertical", gap: "0.25rem" },
                            this.$render("i-label", { caption: token.name || token.symbol, font: { bold: true, color: Theme.text.primary } }),
                            this.$render("i-label", { caption: network.chainName || '', font: { size: '0.75rem', color: Theme.text.primary } })))));
            }
            this.pnlTokenItems.clearInnerHTML();
            this.pnlTokenItems.append(...nodeItems);
        }
        // private async getTonBalance() {
        //     const tonWallet = this.model.walletModel as TonWallet;
        //     const balance = await tonWallet.getTonBalance();
        //     return balance.toFixed();
        // }
        async renderTonToken() {
            const tonToken = {
                chainId: undefined,
                name: 'Toncoin',
                symbol: 'TON',
                decimals: 18
            };
            // const balance = await this.getTonBalance();
            // const formattedBalance = FormatUtils.formatNumber(balance, { decimalFigures: 2 });
            this.pnlTokenItems.clearInnerHTML();
            this.pnlTokenItems.appendChild(this.$render("i-stack", { direction: "horizontal", justifyContent: "space-between", alignItems: "center", wrap: "wrap", gap: "0.5rem", width: "100%", border: { width: 1, style: 'solid', color: Theme.divider, radius: 8 }, padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, cursor: "pointer", onClick: () => this.handleSelectToken(tonToken, true) },
                this.$render("i-stack", { direction: "horizontal", alignItems: "center", gap: "0.75rem" },
                    this.$render("i-image", { width: 20, height: 20, minWidth: 20, url: assets_3.default.fullPath('img/ton.png') }),
                    this.$render("i-stack", { direction: "vertical", gap: "0.25rem" },
                        this.$render("i-label", { caption: tonToken.name, font: { bold: true, color: Theme.text.primary } }),
                        this.$render("i-label", { caption: "Ton", font: { size: '0.75rem', color: Theme.text.primary } })))));
        }
        async handleConnectWallet() {
            const moduleDir = this['currentModuleDir'] || path;
            const provider = await this.model.connectWallet(moduleDir, this.pnlEVMWallet);
            // console.log('provider', provider);
            // this.provider = provider;
        }
        handleShowNetworks() {
            this.model.walletModel.openNetworkModal(this.pnlEVMWallet);
        }
        updatePaymentButtonVisibility() {
            if (this.model.walletModel.isNetworkConnected()) {
                this.btnPay.visible = true;
                this.btnSwitchNetwork.visible = false;
            }
            else {
                this.btnPay.visible = false;
                this.btnSwitchNetwork.visible = true;
            }
        }
        handleSelectToken(token, isTon) {
            this.header.visible = false;
            this.pnlTokenItems.visible = false;
            this.pnlPayAmount.visible = true;
            this.pnlPayDetail.visible = true;
            this.updatePaymentButtonVisibility();
            this.updateBtnPay(false);
            this.btnBack.width = 'calc(50% - 1rem)';
            this.isToPay = true;
            const tokenImg = isTon ? assets_3.default.fullPath('img/ton.png') : scom_token_list_1.assets.tokenPath(token, token.chainId);
            this.imgToken.url = tokenImg;
            const tokenAddress = token.address === eth_wallet_3.Utils.nullAddress ? undefined : token.address;
            this.model.payment.address = this.model.payment.cryptoPayoutOptions.find(option => {
                if (isTon)
                    return option.networkCode === "TON" && option.tokenAddress === tokenAddress;
                return option.chainId === token.chainId.toString() && option.tokenAddress == tokenAddress;
            })?.walletAddress || "";
            const { totalAmount, currency, toAddress } = this.model;
            this.lbToAddress.caption = toAddress.substr(0, 12) + '...' + toAddress.substr(-12);
            const formattedAmount = components_15.FormatUtils.formatNumber(totalAmount, { decimalFigures: 2 });
            this.lbAmountToPay.caption = `${formattedAmount} ${token.symbol}`;
            this.lbUSD.caption = `${formattedAmount} ${currency || 'USD'}`;
            this.lbUSD.visible = !isTon;
            this.imgPayToken.url = tokenImg;
            this.selectedToken = token;
        }
        async handleCopyAddress() {
            try {
                await components_15.application.copyToClipboard(this.model.toAddress);
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
        async handleDisconnectWallet() {
            await this.model.walletModel.disconnectWallet();
        }
        async handleCopyAmount() {
            try {
                await components_15.application.copyToClipboard(this.model.totalAmount.toString());
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
        updateBtnPay(value) {
            this.btnPay.rightIcon.spin = value;
            this.btnPay.rightIcon.visible = value;
        }
        async handleSwitchNetwork() {
            await this.model.walletModel.switchNetwork();
        }
        async handlePay() {
            if (this.onPaid) {
                this.updateBtnPay(true);
                let address = this.model.walletModel.getWalletAddress();
                if (this.provider === interface_4.PaymentProvider.Metamask) {
                    const wallet = eth_wallet_3.Wallet.getClientInstance();
                    this.model.networkCode = this.model.cryptoPayoutOptions.find(option => option.chainId === wallet.chainId.toString())?.networkCode;
                }
                else if (this.provider === interface_4.PaymentProvider.TonWallet) {
                    this.model.networkCode = 'TON';
                }
                await this.model.walletModel.transferToken(this.model.payment.address, this.selectedToken, this.model.totalAmount, async (error, receipt) => {
                    this.updateBtnPay(false);
                    if (error) {
                        this.onPaid({ status: 'failed', provider: this.provider, receipt: '', ownerAddress: address });
                        return;
                    }
                    await this.model.handlePlaceMarketplaceOrder();
                    this.model.referenceId = receipt;
                    this.onPaid({ status: 'pending', provider: this.provider, receipt, ownerAddress: address });
                }, async (receipt) => {
                    await this.model.handlePaymentSuccess();
                    this.onPaid({ status: 'completed', provider: this.provider, receipt: receipt.transactionHash, ownerAddress: address });
                    this.updateBtnPay(false);
                });
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
            this.i18n.init({ ...translations_json_9.default });
            super.init();
            this.onBack = this.getAttribute('onBack', true) || this.onBack;
            this.onPaid = this.getAttribute('onPaid', true) || this.onPaid;
            const model = this.getAttribute('model', true);
            if (model) {
                this.model = model;
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
                        this.$render("i-icon", { name: "wallet", width: 64, height: 64, fill: Theme.colors.primary.main }),
                        this.$render("i-label", { id: "lbWallet", font: { size: '0.825rem', bold: true }, caption: '$connect_web3_wallet' }),
                        this.$render("i-button", { caption: "$connect", background: { color: Theme.colors.primary.main }, class: index_css_7.fullWidthButtonStyle, onClick: this.handleConnectWallet }),
                        this.$render("i-button", { caption: "$back", background: { color: Theme.colors.secondary.main }, class: index_css_7.fullWidthButtonStyle, onClick: this.handleBack })),
                    this.$render("i-stack", { id: "pnlTokens", visible: false, direction: "vertical", gap: "1rem", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" },
                        this.$render("i-stack", { direction: "horizontal", justifyContent: "space-between", alignItems: "center", gap: "1rem", width: "100%", wrap: "wrap", margin: { bottom: '0.5rem' }, padding: { left: '1rem', right: '1rem' } },
                            this.$render("i-stack", { direction: "horizontal", gap: "0.5rem", alignItems: "center", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, border: { style: 'solid', width: 1, color: Theme.divider, radius: 8 } },
                                this.$render("i-image", { id: "imgCurrentWallet", width: 24, height: 24, minWidth: 24 }),
                                this.$render("i-label", { id: "lbCurrentAddress" }),
                                this.$render("i-stack", { direction: "horizontal", padding: { top: '0.25rem', bottom: '0.25rem', left: '0.25rem', right: '0.25rem' }, gap: "0.375rem", cursor: "pointer", onClick: this.handleDisconnectWallet },
                                    this.$render("i-icon", { name: "power-off", width: 16, height: 16 }))),
                            this.$render("i-stack", { id: "pnlNetwork", direction: "horizontal", gap: "0.5rem", alignItems: "center", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, border: { style: 'solid', width: 1, color: Theme.divider, radius: 8 }, cursor: "pointer", width: "fit-content", onClick: this.handleShowNetworks },
                                this.$render("i-image", { id: "imgCurrentNetwork", width: 24, height: 24, minWidth: 24 }),
                                this.$render("i-label", { id: "lbCurrentNetwork" }))),
                        this.$render("i-stack", { id: "pnlTokenItems", direction: "vertical", gap: "1rem", width: "100%", height: "100%", minHeight: 100, maxHeight: 240, overflow: "auto", padding: { left: '1rem', right: '1rem' } }),
                        this.$render("i-stack", { id: "pnlPayDetail", visible: false, direction: "vertical", gap: "0.25rem", width: "100%", height: "100%", alignItems: "center", padding: { left: '1rem', right: '1rem' } },
                            this.$render("i-label", { caption: "$paid_to_address" }),
                            this.$render("i-stack", { direction: "horizontal", alignItems: "stretch", width: "100%", margin: { bottom: '1rem' }, border: { radius: 8 }, background: { color: Theme.input.background }, overflow: "hidden" },
                                this.$render("i-stack", { direction: "horizontal", gap: "0.5rem", alignItems: "center", width: "100%", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' } },
                                    this.$render("i-image", { id: "imgToken", width: 16, height: 16, minWidth: 16, display: "flex" }),
                                    this.$render("i-label", { id: "lbToAddress", wordBreak: "break-all", font: { color: Theme.input.fontColor } })),
                                this.$render("i-stack", { direction: "horizontal", width: 32, minWidth: 32, alignItems: "center", justifyContent: "center", cursor: "pointer", margin: { left: 'auto' }, background: { color: Theme.colors.primary.main }, onClick: this.handleCopyAddress },
                                    this.$render("i-icon", { id: "iconCopyAddress", name: "copy", width: 16, height: 16, cursor: "pointer", fill: Theme.text.primary }))),
                            this.$render("i-stack", { direction: "horizontal", alignItems: "stretch", width: "100%", border: { radius: 8 }, background: { color: Theme.input.background }, overflow: "hidden" },
                                this.$render("i-stack", { direction: "vertical", gap: "0.5rem", justifyContent: "center", alignItems: "center", width: "100%", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' } },
                                    this.$render("i-label", { caption: "Amount to pay", font: { size: '0.75rem', transform: 'uppercase', color: Theme.input.fontColor } }),
                                    this.$render("i-label", { id: "lbAmountToPay", wordBreak: "break-all", font: { size: '0.875rem', color: Theme.colors.primary.main, bold: true } }),
                                    this.$render("i-label", { id: "lbUSD", wordBreak: "break-all", font: { size: '0.75rem', color: Theme.colors.primary.main } })),
                                this.$render("i-stack", { direction: "horizontal", width: 32, minWidth: 32, alignItems: "center", justifyContent: "center", cursor: "pointer", margin: { left: 'auto' }, background: { color: Theme.colors.primary.main }, onClick: this.handleCopyAmount },
                                    this.$render("i-icon", { id: "iconCopyAmount", name: "copy", width: 16, height: 16, fill: Theme.text.primary })))),
                        this.$render("i-stack", { direction: "horizontal", width: "100%", alignItems: "center", justifyContent: "center", gap: "1rem", wrap: "wrap-reverse", padding: { left: '1rem', right: '1rem' } },
                            this.$render("i-button", { id: "btnBack", caption: "$back", minWidth: 90, background: { color: Theme.colors.secondary.main }, class: index_css_7.fullWidthButtonStyle, onClick: this.handleBack }),
                            this.$render("i-button", { id: "btnSwitchNetwork", visible: false, caption: "$switch_network", background: { color: Theme.colors.primary.main }, class: index_css_7.halfWidthButtonStyle, onClick: this.handleSwitchNetwork }),
                            this.$render("i-button", { id: "btnPay", visible: false, caption: "$pay", background: { color: Theme.colors.primary.main }, class: index_css_7.halfWidthButtonStyle, onClick: this.handlePay })))),
                this.$render("i-button", { id: "btnTonWallet", visible: false }),
                this.$render("i-panel", { id: "pnlEVMWallet" }));
        }
    };
    WalletPayment = __decorate([
        (0, components_15.customElements)('scom-payment-widget--wallet-payment')
    ], WalletPayment);
    exports.WalletPayment = WalletPayment;
});
define("@scom/scom-payment-widget/components/paymentModule.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-payment-widget/interface.ts", "@scom/scom-payment-widget/components/stripePayment.tsx", "@scom/scom-payment-widget/components/walletPayment.tsx", "@scom/scom-payment-widget/components/index.css.ts"], function (require, exports, components_16, interface_5, stripePayment_1, walletPayment_1, index_css_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PaymentModule = void 0;
    let PaymentModule = class PaymentModule extends components_16.Module {
        get model() {
            return this._model;
        }
        set model(value) {
            this._model = value;
        }
        show(isModal = true) {
            this.invoiceCreation.model = this.model;
            this.invoiceCreation.visible = true;
            this.shippingInfo.model = this.model;
            this.shippingInfo.visible = false;
            this.paymentMethod.model = this.model;
            this.paymentMethod.visible = false;
            this.statusPayment.model = this.model;
            this.statusPayment.visible = false;
            if (this.walletPayment)
                this.walletPayment.visible = false;
            if (this.stripePayment)
                this.stripePayment.visible = false;
            this.isModal = isModal;
            this.model.isCompleted = false;
        }
        processCompletedHandler() {
            if (this.isModal) {
                this.closeModal();
            }
            else {
                this.model.processCompletedHandler();
            }
        }
        async init() {
            await super.init();
            const model = this.getAttribute('model', true);
            if (model)
                this.model = model;
            this.invoiceCreation.onContinue = () => {
                const isShippingInfoShown = this.model.isShippingInfoShown;
                this.invoiceCreation.visible = false;
                this.shippingInfo.visible = isShippingInfoShown;
                this.paymentMethod.visible = !isShippingInfoShown;
                this.paymentMethod.updateUI();
            };
            this.shippingInfo.onContinue = () => {
                this.shippingInfo.visible = false;
                this.paymentMethod.visible = true;
                this.paymentMethod.updateUI();
            };
            this.shippingInfo.onBack = () => {
                this.invoiceCreation.visible = true;
                this.shippingInfo.visible = false;
            };
            this.paymentMethod.onSelectedPaymentProvider = async (paymentProvider) => {
                if (paymentProvider === interface_5.PaymentProvider.Metamask || paymentProvider === interface_5.PaymentProvider.TonWallet) {
                    if (!this.walletPayment) {
                        this.walletPayment = new walletPayment_1.WalletPayment(undefined, { visible: false, class: index_css_8.elementStyle });
                        this.walletPayment.model = this.model;
                        this.walletPayment.onPaid = (paymentStatus) => {
                            this.walletPayment.visible = false;
                            this.statusPayment.visible = true;
                            this.statusPayment.updateStatus(paymentStatus);
                        };
                        this.walletPayment.onBack = () => {
                            this.paymentMethod.visible = true;
                            this.walletPayment.visible = false;
                        };
                        this.statusPayment.onClose = this.processCompletedHandler.bind(this);
                        this.pnlPaymentModule.append(this.walletPayment);
                    }
                    await this.walletPayment.onStartPayment();
                    this.paymentMethod.visible = false;
                    this.walletPayment.visible = true;
                }
                else {
                    if (!this.stripePayment) {
                        this.stripePayment = new stripePayment_1.StripePayment(undefined, { visible: false, class: index_css_8.elementStyle });
                        this.stripePayment.model = this.model;
                        this.stripePayment.onBack = () => {
                            this.paymentMethod.visible = true;
                            this.stripePayment.visible = false;
                        };
                        this.stripePayment.onClose = this.processCompletedHandler.bind(this);
                        this.pnlPaymentModule.append(this.stripePayment);
                    }
                    this.stripePayment.onStartPayment();
                    this.paymentMethod.visible = false;
                    this.stripePayment.visible = true;
                }
            };
            this.paymentMethod.onBack = () => {
                const isShippingInfoShown = this.model.isShippingInfoShown;
                this.paymentMethod.visible = false;
                this.invoiceCreation.visible = !isShippingInfoShown;
                this.shippingInfo.visible = isShippingInfoShown;
            };
        }
        render() {
            return (this.$render("i-stack", { id: "pnlPaymentModule", margin: { top: '1rem' }, direction: "vertical", width: "100%", minHeight: 480, border: { radius: 12, style: 'solid', width: 1, color: '#ffffff4d' }, overflow: "hidden" },
                this.$render("scom-payment-widget--invoice-creation", { id: "invoiceCreation", visible: false, class: index_css_8.elementStyle }),
                this.$render("scom-payment-widget--shipping-info", { id: "shippingInfo", visible: false, class: index_css_8.elementStyle }),
                this.$render("scom-payment-widget--payment-method", { id: "paymentMethod", visible: false, class: index_css_8.elementStyle }),
                this.$render("scom-payment-widget--status-payment", { id: "statusPayment", visible: false, class: index_css_8.elementStyle })));
        }
    };
    PaymentModule = __decorate([
        (0, components_16.customElements)('scom-payment-widget--payment-module')
    ], PaymentModule);
    exports.PaymentModule = PaymentModule;
});
define("@scom/scom-payment-widget/components/stripePaymentTracking.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-payment-widget/components/index.css.ts", "@scom/scom-payment-widget/assets.ts", "@scom/scom-payment-widget/store.ts", "@scom/scom-payment-widget/utils.ts", "@scom/scom-payment-widget/translations.json.ts"], function (require, exports, components_17, index_css_9, assets_4, store_7, utils_2, translations_json_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StatusPaymentTracking = void 0;
    const Theme = components_17.Styles.Theme.ThemeVars;
    let StatusPaymentTracking = class StatusPaymentTracking extends components_17.Module {
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
            this.imgStatus.classList.add(index_css_9.loadingImageStyle);
            this.lbStatus.caption = '';
            if (!window.Stripe) {
                await (0, utils_2.loadStripe)();
            }
            const apiUrl = this.baseStripeApi ?? '/stripe';
            if (!this.publishableKey) {
                this.publishableKey = await (0, store_7.getStripeKey)(`${apiUrl}/key`);
                if (!this.publishableKey)
                    return;
            }
            if (window.Stripe && !this.stripe) {
                this.stripe = window.Stripe(this.publishableKey);
            }
            const clientSecret = this.inputClientSecret.value;
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
                this.imgStatus.classList.remove(index_css_9.loadingImageStyle);
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
                this.imgStatus.classList.remove(index_css_9.loadingImageStyle);
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
            const clientSecret = this.inputClientSecret.value;
            this.updateURLParam('payment_intent_client_secret', clientSecret);
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
            this.i18n.init({ ...translations_json_10.default });
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
                this.$render("i-label", { caption: "$check_stripe_payment_status", font: { size: '1rem' }, class: index_css_9.textCenterStyle }),
                this.$render("i-stack", { direction: "horizontal", gap: "0.5rem", width: "100%", alignItems: "center", justifyContent: "center", wrap: "wrap" },
                    this.$render("i-input", { id: "inputClientSecret", width: "calc(100% - 108px)", minWidth: 200, height: 40, padding: { left: '0.5rem', right: '0.5rem' }, placeholder: "pi_3QUKKrP7pMwOSpCL0U0P7KEt_secret_MXHCPx7kKqxdsUipvjJYL842r", border: { radius: 4 }, onChanged: this.handleInputChanged }),
                    this.$render("i-button", { id: "btnCheck", enabled: false, caption: "$check", width: 100, padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, font: { color: Theme.colors.primary.contrastText }, background: { color: Theme.colors.primary.main }, border: { radius: 12 }, onClick: this.handleSearch })),
                this.$render("i-stack", { direction: "vertical", gap: "1rem", width: "100%", alignItems: "center", margin: { top: '2rem' } },
                    this.$render("i-image", { id: "imgStatus", width: 128, height: 128 }),
                    this.$render("i-label", { id: "lbStatus", class: index_css_9.textCenterStyle, font: { size: '1rem', color: Theme.text.primary, bold: true } })));
        }
    };
    StatusPaymentTracking = __decorate([
        (0, components_17.customElements)('scom-payment-widget--stripe-payment-tracking')
    ], StatusPaymentTracking);
    exports.StatusPaymentTracking = StatusPaymentTracking;
});
define("@scom/scom-payment-widget/components/index.ts", ["require", "exports", "@scom/scom-payment-widget/components/paymentModule.tsx", "@scom/scom-payment-widget/components/shippingInfo.tsx", "@scom/scom-payment-widget/components/invoiceCreation.tsx", "@scom/scom-payment-widget/components/paymentMethod.tsx", "@scom/scom-payment-widget/components/walletPayment.tsx", "@scom/scom-payment-widget/components/statusPayment.tsx", "@scom/scom-payment-widget/components/stripePayment.tsx", "@scom/scom-payment-widget/components/stripePaymentTracking.tsx"], function (require, exports, paymentModule_1, shippingInfo_1, invoiceCreation_1, paymentMethod_1, walletPayment_2, statusPayment_1, stripePayment_2, stripePaymentTracking_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StatusPayment = exports.StatusPaymentTracking = exports.StripePayment = exports.WalletPayment = exports.PaymentMethod = exports.InvoiceCreation = exports.ShippingInfo = exports.PaymentModule = void 0;
    Object.defineProperty(exports, "PaymentModule", { enumerable: true, get: function () { return paymentModule_1.PaymentModule; } });
    Object.defineProperty(exports, "ShippingInfo", { enumerable: true, get: function () { return shippingInfo_1.ShippingInfo; } });
    Object.defineProperty(exports, "InvoiceCreation", { enumerable: true, get: function () { return invoiceCreation_1.InvoiceCreation; } });
    Object.defineProperty(exports, "PaymentMethod", { enumerable: true, get: function () { return paymentMethod_1.PaymentMethod; } });
    Object.defineProperty(exports, "WalletPayment", { enumerable: true, get: function () { return walletPayment_2.WalletPayment; } });
    Object.defineProperty(exports, "StatusPayment", { enumerable: true, get: function () { return statusPayment_1.StatusPayment; } });
    Object.defineProperty(exports, "StripePayment", { enumerable: true, get: function () { return stripePayment_2.StripePayment; } });
    Object.defineProperty(exports, "StatusPaymentTracking", { enumerable: true, get: function () { return stripePaymentTracking_1.StatusPaymentTracking; } });
});
define("@scom/scom-payment-widget", ["require", "exports", "@ijstech/components", "@scom/scom-payment-widget/components/index.ts", "@scom/scom-payment-widget/interface.ts", "@scom/scom-payment-widget/defaultData.ts", "@scom/scom-payment-widget/translations.json.ts", "@scom/scom-payment-widget/model.ts"], function (require, exports, components_18, components_19, interface_6, defaultData_2, translations_json_11, model_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomPaymentWidget = exports.ProductType = void 0;
    Object.defineProperty(exports, "ProductType", { enumerable: true, get: function () { return interface_6.ProductType; } });
    const Theme = components_18.Styles.Theme.ThemeVars;
    let ScomPaymentWidget = class ScomPaymentWidget extends components_18.Module {
        constructor(parent, options) {
            super(parent, options);
            this.initModel();
        }
        get payment() {
            return this.model.payment;
        }
        set payment(value) {
            this.model.payment = value;
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
            return this.model.baseStripeApi;
        }
        set baseStripeApi(value) {
            this.model.baseStripeApi = value;
            if (this.statusPaymentTracking)
                this.statusPaymentTracking.baseStripeApi = value;
        }
        get returnUrl() {
            return this.model.returnUrl;
        }
        set returnUrl(value) {
            this.model.returnUrl = value;
        }
        get wallets() {
            return this.model.wallets;
        }
        set wallets(value) {
            this.model.wallets = value;
        }
        get networks() {
            return this.model.networks;
        }
        set networks(value) {
            this.model.networks = value;
        }
        get tokens() {
            return this.model.tokens;
        }
        set tokens(value) {
            this.model.tokens = value;
        }
        onStartPayment(payment) {
            this.initModel();
            if (payment)
                this.payment = payment;
            this.openPaymentModal();
        }
        async openPaymentModal() {
            if (!this.paymentModule) {
                this.paymentModule = new components_19.PaymentModule();
                this.paymentModule.model = this.model;
                if (this.isUrl) {
                    this.paymentModule.width = '100%';
                    this.paymentModule.maxWidth = 480;
                    this.pnlWrapper.appendChild(this.paymentModule);
                }
            }
            if (this.isUrl) {
                await this.paymentModule.ready();
                this.paymentModule.show(false);
                return;
            }
            const modal = this.paymentModule.openModal({
                title: this.i18n.get('$payment'),
                closeOnBackdropClick: false,
                closeIcon: { name: 'times', fill: Theme.colors.primary.main },
                width: 480,
                maxWidth: '100%',
                padding: { left: '1rem', right: '1rem', top: '0.75rem', bottom: '0.75rem' },
                border: { radius: '1rem' }
            });
            await this.paymentModule.ready();
            this.paymentModule.show();
            modal.refresh();
            modal.onClose = () => this.model.processCompletedHandler();
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
        initModel() {
            if (!this.model) {
                this.model = new model_1.Model();
            }
            if (this.placeMarketplaceOrder) {
                this.model.placeMarketplaceOrder = this.placeMarketplaceOrder.bind(this);
            }
            if (this.onPaymentSuccess) {
                this.model.onPaymentSuccess = this.onPaymentSuccess.bind(this);
            }
        }
        async init() {
            this.i18n.init({ ...translations_json_11.default });
            super.init();
            this.openPaymentModal = this.openPaymentModal.bind(this);
            this.placeMarketplaceOrder = this.getAttribute('placeMarketplaceOrder', true) || this.placeMarketplaceOrder;
            this.onPaymentSuccess = this.getAttribute('onPaymentSuccess', true) || this.onPaymentSuccess;
            this.initModel();
            this.handleWidgetUrl();
            const lazyLoad = this.getAttribute('lazyLoad', true, false);
            if (!lazyLoad) {
                const payment = this.getAttribute('payment', true);
                this.mode = this.getAttribute('mode', true, 'payment');
                this.baseStripeApi = this.getAttribute('baseStripeApi', true, this.baseStripeApi);
                this.returnUrl = this.getAttribute('returnUrl', true, this.returnUrl);
                this.showButtonPay = this.getAttribute('showButtonPay', true, false);
                this.payButtonCaption = this.getAttribute('payButtonCaption', true, this.i18n.get('$pay'));
                this.networks = this.getAttribute('networks', true, defaultData_2.default.defaultData.networks);
                this.tokens = this.getAttribute('tokens', true);
                this.wallets = this.getAttribute('wallets', true, defaultData_2.default.defaultData.wallets);
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
            return this.$render("i-panel", { width: '100%' },
                this.$render("i-stack", { id: "pnlWrapper", direction: "vertical", alignItems: "center", width: "100%", height: "100%" },
                    this.$render("i-button", { id: "btnPay", visible: false, enabled: false, caption: "$pay", width: "100%", minWidth: 60, maxWidth: 180, padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, font: { size: '1rem', color: Theme.colors.primary.contrastText, bold: true }, background: { color: Theme.colors.primary.main }, border: { radius: 12 }, onClick: this.handlePay }),
                    this.$render("scom-payment-widget--stripe-payment-tracking", { id: "statusPaymentTracking", visible: false, width: "100%", height: "100%" })));
        }
    };
    ScomPaymentWidget = __decorate([
        (0, components_18.customElements)('i-scom-payment-widget')
    ], ScomPaymentWidget);
    exports.ScomPaymentWidget = ScomPaymentWidget;
});
