var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-payment-widget/components/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.loadingImageStyle = exports.checkboxTextStyle = exports.textCenterStyle = void 0;
    const Theme = components_1.Styles.Theme.ThemeVars;
    const spinnerAnim = components_1.Styles.keyframes({
        "0%": {
            transform: 'rotate(0deg)'
        },
        "100%": {
            transform: 'rotate(360deg)'
        },
    });
    exports.textCenterStyle = components_1.Styles.style({
        textAlign: 'center'
    });
    exports.checkboxTextStyle = components_1.Styles.style({
        $nest: {
            'span': {
                display: 'inline'
            },
            'a': {
                display: 'inline',
                color: Theme.colors.info.main
            }
        }
    });
    exports.loadingImageStyle = components_1.Styles.style({
        animation: `${spinnerAnim} 2s linear infinite`
    });
});
define("@scom/scom-payment-widget/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PaymentProvider = exports.PaymentType = void 0;
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
define("@scom/scom-payment-widget/components/invoiceCreation.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-payment-widget/components/index.css.ts"], function (require, exports, components_2, index_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InvoiceCreation = void 0;
    const Theme = components_2.Styles.Theme.ThemeVars;
    let InvoiceCreation = class InvoiceCreation extends components_2.Module {
        get payment() {
            return this._payment;
        }
        set payment(value) {
            this._payment = value;
            this.updateInfo();
        }
        constructor(parent, options) {
            super(parent, options);
            this._payment = { paymentId: '', amount: 0 };
        }
        updateInfo() {
            const { amount, paymentId } = this.payment;
            if (this.lbAmount) {
                this.lbAmount.caption = `${components_2.FormatUtils.formatNumber(amount || 0, { decimalFigures: 2 })} USD`;
            }
            if (this.lbPaymentId) {
                this.lbPaymentId.caption = paymentId || '';
            }
        }
        handleCheckboxChanged() {
            const checked = this.checkboxAgree.checked;
            this.btnContinue.enabled = checked;
        }
        handleContinue() {
            if (this.onContinue)
                this.onContinue();
        }
        async init() {
            super.init();
            this.onContinue = this.getAttribute('onContinue', true) || this.onContinue;
            const payment = this.getAttribute('payment', true);
            if (payment) {
                this.payment = payment;
            }
        }
        render() {
            return this.$render("i-stack", { direction: "vertical", gap: "1rem", height: "100%", alignItems: "center", padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' } },
                this.$render("i-stack", { direction: "vertical", gap: "1rem", height: "100%" },
                    this.$render("i-stack", { direction: "vertical", gap: "1rem", alignItems: "center", width: "100%" },
                        this.$render("i-stack", { direction: "vertical", gap: "0.5rem", alignItems: "center" },
                            this.$render("i-label", { caption: "Amount to pay", font: { color: Theme.text.secondary, bold: true, transform: 'uppercase' } }),
                            this.$render("i-label", { id: "lbAmount", class: index_css_1.textCenterStyle, font: { size: '1.25rem', color: Theme.colors.primary.main, bold: true } })),
                        this.$render("i-stack", { direction: "vertical", gap: "0.25rem", alignItems: "center" },
                            this.$render("i-label", { caption: "Payment ID", font: { color: Theme.text.secondary, bold: true, transform: 'uppercase' } }),
                            this.$render("i-label", { id: "lbPaymentId", class: index_css_1.textCenterStyle, font: { color: Theme.text.secondary, bold: true, transform: 'uppercase' } })),
                        this.$render("i-panel", { width: "80%", height: 1, background: { color: Theme.divider } })),
                    this.$render("i-stack", { direction: "vertical", gap: "1rem", alignItems: "center", margin: { top: '1rem' } },
                        this.$render("i-label", { caption: "We just need your email to inform you of payment details and possible refunds.", font: { size: '0.75rem', color: Theme.colors.primary.main }, class: index_css_1.textCenterStyle }),
                        this.$render("i-stack", { direction: "vertical", gap: "0.25rem", width: "100%", background: { color: Theme.input.background }, padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, border: { radius: 8 } },
                            this.$render("i-label", { caption: "Your email", font: { size: '0.75rem', color: Theme.input.fontColor } }),
                            this.$render("i-input", { background: { color: 'transparent' }, border: { radius: 4, width: 1, style: 'solid', color: Theme.divider }, height: 32, width: "100%" }))),
                    this.$render("i-stack", { direction: "horizontal", gap: "0.25rem" },
                        this.$render("i-checkbox", { id: "checkboxAgree", onChanged: this.handleCheckboxChanged }),
                        this.$render("i-label", { caption: "I have read and accept the <a href='' target='_blank'>Terms of Service</a> and <a href='' target='_blank'>Privacy Policy</a>", class: index_css_1.checkboxTextStyle }))),
                this.$render("i-button", { id: "btnContinue", enabled: false, width: "100%", maxWidth: 180, caption: "Continue", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, font: { size: '1rem', color: Theme.colors.primary.contrastText }, background: { color: Theme.colors.primary.main }, border: { radius: 12 }, rightIcon: { name: 'arrow-right', visible: true }, onClick: this.handleContinue }));
        }
    };
    InvoiceCreation = __decorate([
        (0, components_2.customElements)('scom-payment-widget--invoice-creation')
    ], InvoiceCreation);
    exports.InvoiceCreation = InvoiceCreation;
});
define("@scom/scom-payment-widget/assets.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const moduleDir = components_3.application.currentModuleDir;
    function fullPath(path) {
        return `${moduleDir}/${path}`;
    }
    ;
    exports.default = {
        fullPath
    };
});
define("@scom/scom-payment-widget/store.ts", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-network-list", "@scom/scom-payment-widget/interface.ts"], function (require, exports, components_4, eth_wallet_1, scom_network_list_1, interface_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PaymentProviders = exports.isClientWalletConnected = exports.getClientWallet = exports.State = void 0;
    const infuraId = 'adc596bf88b648e2a8902bc9093930c5';
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
            const networkList = Object.values(components_4.application.store?.networkMap || []);
            const instanceId = clientWallet.initRpcWallet({
                networks: networkList,
                defaultChainId,
                infuraId: components_4.application.store?.infuraId,
                multicalls: components_4.application.store?.multicalls
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
    exports.PaymentProviders = [
        {
            provider: interface_1.PaymentProvider.Stripe,
            type: interface_1.PaymentType.Fiat,
            image: 'stripe.png'
        },
        {
            provider: interface_1.PaymentProvider.Paypal,
            type: interface_1.PaymentType.Fiat,
            image: 'paypal.png'
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
});
define("@scom/scom-payment-widget/components/paymentMethod.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-payment-widget/interface.ts", "@scom/scom-payment-widget/assets.ts", "@scom/scom-payment-widget/store.ts"], function (require, exports, components_5, interface_2, assets_1, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PaymentMethod = void 0;
    const Theme = components_5.Styles.Theme.ThemeVars;
    const paymentTypes = [
        {
            type: interface_2.PaymentType.Fiat,
            title: 'Fiat currency',
            description: 'Stripe, Paypal, Payme,...etc',
            iconName: 'exchange-alt',
            providerImages: ['stripe.png', 'paypal.png']
        },
        {
            type: interface_2.PaymentType.Crypto,
            title: 'Crypto currency',
            description: 'Metamask, Ton Wallet,...etc',
            iconName: 'wallet',
            providerImages: ['metamask.png', 'ton.png']
        }
    ];
    let PaymentMethod = class PaymentMethod extends components_5.Module {
        get payment() {
            return this._payment;
        }
        set payment(value) {
            this._payment = value;
            this.updateAmount();
        }
        constructor(parent, options) {
            super(parent, options);
        }
        updateAmount() {
            if (this.lbAmount) {
                const amount = components_5.FormatUtils.formatNumber(this.payment?.amount || 0, { decimalFigures: 2 });
                this.lbAmount.caption = `${amount} USD`;
            }
        }
        renderMethodItems(type) {
            this.lbPayMethod.caption = type === interface_2.PaymentType.Fiat ? 'Select a payment gateway' : 'Select your wallet';
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
            if (type) {
                this.renderMethodItems(type);
                this.pnlPaymentType.visible = false;
                this.pnlPaymentMethod.visible = true;
            }
        }
        handlePaymentProvider(provider) {
            if (provider === interface_2.PaymentProvider.Metamask) {
                if (this.onSelectedPaymentProvider)
                    this.onSelectedPaymentProvider(this.payment, provider);
            }
        }
        handleBack() {
            this.lbPayMethod.caption = 'How will you pay?';
            this.pnlPaymentType.visible = true;
            this.pnlPaymentMethod.visible = false;
        }
        async init() {
            super.init();
            this.onBack = this.getAttribute('onBack', true) || this.onBack;
            this.onSelectedPaymentProvider = this.getAttribute('onSelectedPaymentProvider', true) || this.onSelectedPaymentProvider;
            const payment = this.getAttribute('payment', true);
            if (payment) {
                this.payment = payment;
            }
        }
        render() {
            return this.$render("i-stack", { direction: "vertical", gap: "1rem", alignItems: "center", height: "100%" },
                this.$render("i-stack", { direction: "vertical", gap: "0.5rem", justifyContent: "center", alignItems: "center", width: "100%", height: 60, padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, background: { color: Theme.colors.primary.main } },
                    this.$render("i-label", { caption: "Amount to pay", font: { size: '0.675rem', bold: true, transform: 'uppercase', color: Theme.text.primary }, opacity: 0.8 }),
                    this.$render("i-label", { id: "lbAmount", font: { size: '0.875rem', color: Theme.text.primary, bold: true } })),
                this.$render("i-stack", { direction: "vertical", gap: "1rem", width: "100%", height: "100%", alignItems: "center", padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' } },
                    this.$render("i-label", { id: "lbPayMethod", caption: "How will you pay?", font: { size: '1rem', bold: true, color: Theme.colors.primary.main } }),
                    this.$render("i-stack", { id: "pnlPaymentType", direction: "vertical", gap: "1rem", width: "100%", height: "100%", alignItems: "center" }, paymentTypes.map(v => this.$render("i-stack", { id: v.type, direction: "horizontal", alignItems: "center", gap: "1rem", width: "100%", border: { width: 1, style: 'solid', color: Theme.divider, radius: 8 }, padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, cursor: "pointer", onClick: this.handlePaymentType },
                        this.$render("i-stack", { direction: "vertical", gap: "0.75rem", width: "calc(100% - 30px)" },
                            this.$render("i-stack", { direction: "horizontal", gap: "0.5rem", alignItems: "center" },
                                this.$render("i-icon", { name: v.iconName, width: 20, height: 20, fill: Theme.colors.primary.main }),
                                this.$render("i-label", { caption: v.title, font: { size: '1rem', bold: true, color: Theme.text.primary } })),
                            this.$render("i-label", { caption: v.description, font: { color: Theme.text.secondary } }),
                            this.$render("i-stack", { direction: "horizontal", gap: "0.25rem" }, v.providerImages.map(image => this.$render("i-image", { width: 20, height: 20, url: assets_1.default.fullPath(`img/${image}`) })))),
                        this.$render("i-icon", { name: "arrow-right", width: 20, height: 20, fill: Theme.text.primary, margin: { left: 'auto', right: 'auto' } })))),
                    this.$render("i-stack", { id: "pnlPaymentMethod", visible: false, direction: "vertical", gap: "2rem", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" },
                        this.$render("i-stack", { id: "pnlMethodItems", direction: "vertical", gap: "1rem", width: "100%", height: "100%" }),
                        this.$render("i-button", { width: "100%", maxWidth: 180, caption: "Back", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, font: { size: '1rem', color: Theme.colors.secondary.contrastText }, background: { color: Theme.colors.secondary.main }, border: { radius: 12 }, onClick: this.handleBack }))));
        }
    };
    PaymentMethod = __decorate([
        (0, components_5.customElements)('scom-payment-widget--payment-method')
    ], PaymentMethod);
    exports.PaymentMethod = PaymentMethod;
});
define("@scom/scom-payment-widget/data.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-payment-widget/data.ts'/> 
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
define("@scom/scom-payment-widget/components/walletPayment.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-payment-widget/interface.ts", "@scom/scom-payment-widget/assets.ts", "@scom/scom-payment-widget/data.ts", "@scom/scom-token-list", "@scom/scom-payment-widget/store.ts", "@ijstech/eth-wallet"], function (require, exports, components_6, interface_3, assets_2, data_1, scom_token_list_1, store_2, eth_wallet_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WalletPayment = void 0;
    const Theme = components_6.Styles.Theme.ThemeVars;
    let WalletPayment = class WalletPayment extends components_6.Module {
        constructor(parent, options) {
            super(parent, options);
            this._wallets = [];
            this._networks = [];
            this._tokens = [];
        }
        get state() {
            return this._state;
        }
        set state(value) {
            this._state = value;
        }
        get wallets() {
            return this._wallets ?? data_1.default.defaultData.wallets;
        }
        set wallets(value) {
            this._wallets = value;
        }
        get networks() {
            return this._networks ?? data_1.default.defaultData.networks;
        }
        set networks(value) {
            this._networks = value;
        }
        get tokens() {
            return this._tokens ?? data_1.default.defaultData.tokens;
        }
        set tokens(value) {
            this._tokens = value;
        }
        async onStartPayment(payment) {
            this.payment = payment;
            if (!this.pnlAmount)
                return;
            this.isInitialized = true;
            if (this.payment.provider === interface_3.PaymentProvider.Metamask) {
                // TODO
            }
            else if (this.payment.provider === interface_3.PaymentProvider.TonWallet) {
                // TODO
            }
            this.showFirstScreen();
            this.updateAmount();
            this.checkWalletStatus();
        }
        showFirstScreen() {
            this.pnlAmount.visible = true;
            this.pnlPayAmount.visible = false;
            this.pnlTokenItems.visible = true;
            this.pnlPayDetail.visible = false;
            this.btnPay.visible = false;
            this.btnBack.width = '100%';
            this.isToPay = false;
        }
        updateAmount() {
            if (this.lbAmount) {
                const amount = components_6.FormatUtils.formatNumber(this.payment?.amount || 0, { decimalFigures: 2 });
                this.lbAmount.caption = `${amount} USD`;
                this.lbPayAmount.caption = `${amount} USD`;
            }
        }
        async checkWalletStatus() {
            const paymentProvider = this.payment.provider;
            let isConnected = this.isWalletConnected;
            if (paymentProvider === interface_3.PaymentProvider.Metamask) {
                // TODO
            }
            else if (paymentProvider === interface_3.PaymentProvider.TonWallet) {
                // TODO
            }
            this.pnlWallet.visible = !isConnected;
            const provider = store_2.PaymentProviders.find(v => v.provider === this.payment.provider);
            if (isConnected) {
                if (paymentProvider === interface_3.PaymentProvider.Metamask) {
                    const address = '0xA81961100920df22CF98703155029822f2F7f033';
                    const chainId = 97;
                    const network = {
                        image: '/libs/@scom/scom-network-list/img/bscMainnet.svg',
                        chainName: 'BNB Chain Testnet'
                    };
                    if (provider) {
                        this.imgCurrentWallet.url = assets_2.default.fullPath(`img/${provider.image}`);
                        this.lbCurrentAddress.caption = address.substr(0, 6) + '...' + address.substr(-4);
                        this.imgCurrentNetwork.url = network.image;
                        this.lbCurrentNetwork.caption = network.chainName;
                        this.pnlNetwork.visible = true;
                    }
                    await this.renderTokens(chainId);
                }
                else if (paymentProvider === interface_3.PaymentProvider.TonWallet) {
                    // TODO
                }
            }
            else if (provider) {
                this.imgWallet.url = assets_2.default.fullPath(`img/${provider.image}`);
                this.lbWallet.caption = `Connect to ${provider.provider}`;
            }
            this.pnlTokens.visible = isConnected;
        }
        async renderTokens(chainId) {
            const tokens = this.tokens.filter(v => v.chainId === chainId);
            const network = {
                image: '/libs/@scom/scom-network-list/img/bscMainnet.svg',
                chainName: 'BNB Chain Testnet'
            };
            const nodeItems = [];
            for (const token of tokens) {
                const balances = scom_token_list_1.tokenStore.getTokenBalancesByChainId(chainId) || {};
                const tokenBalance = balances[token.address?.toLowerCase() || token.symbol] || 0;
                const formattedBalance = components_6.FormatUtils.formatNumber(tokenBalance, { decimalFigures: 2 });
                nodeItems.push(this.$render("i-stack", { direction: "horizontal", justifyContent: "space-between", alignItems: "center", wrap: "wrap", gap: "0.5rem", width: "100%", minHeight: 40, border: { width: 1, style: 'solid', color: Theme.divider, radius: 8 }, padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, cursor: "pointer", onClick: () => this.handleSelectToken(token) },
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
        handleConnectWallet() {
            this.isWalletConnected = true;
            this.checkWalletStatus();
        }
        handleShowNetworks() {
        }
        handleSelectToken(token) {
            this.pnlAmount.visible = false;
            this.pnlTokenItems.visible = false;
            this.pnlPayAmount.visible = true;
            this.pnlPayDetail.visible = true;
            this.btnPay.visible = true;
            this.btnBack.width = 'calc(50% - 1rem)';
            this.isToPay = true;
            this.imgToken.url = scom_token_list_1.assets.tokenPath(token, token.chainId);
            const address = this.payment.address || '';
            this.lbToAddress.caption = address.substr(0, 12) + '...' + address.substr(-12);
            const amount = components_6.FormatUtils.formatNumber(this.payment.amount || 0, { decimalFigures: 2 });
            this.lbAmountToPay.caption = `${amount} ${token.symbol}`;
            this.lbUSD.caption = `${amount} USD`;
            this.imgPayToken.url = scom_token_list_1.assets.tokenPath(token, token.chainId);
        }
        async handleCopyAddress() {
            try {
                await components_6.application.copyToClipboard(this.payment.address);
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
                await components_6.application.copyToClipboard(this.payment.amount.toString());
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
                const wallet = eth_wallet_2.Wallet.getClientInstance();
                const address = wallet.address;
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
            super.init();
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
            return this.$render("i-stack", { direction: "vertical", alignItems: "center", height: "100%" },
                this.$render("i-stack", { direction: "vertical", alignItems: "center", width: "100%", minHeight: 60, margin: { bottom: '1rem' } },
                    this.$render("i-stack", { id: "pnlAmount", direction: "vertical", gap: "0.5rem", justifyContent: "center", alignItems: "center", width: "100%", minHeight: 60, padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, background: { color: Theme.colors.primary.main } },
                        this.$render("i-label", { caption: "Amount to pay", font: { size: '0.675rem', bold: true, transform: 'uppercase', color: Theme.text.primary }, opacity: 0.8 }),
                        this.$render("i-label", { id: "lbAmount", font: { size: '0.875rem', color: Theme.text.primary, bold: true } })),
                    this.$render("i-stack", { id: "pnlPayAmount", visible: false, direction: "horizontal", gap: "0.25rem", alignItems: "center", width: "100%", minHeight: 60, padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, border: { bottom: { style: 'solid', width: 1, color: Theme.divider } } },
                        this.$render("i-image", { id: "imgPayToken", width: 20, height: 20, minWidth: 20, display: "flex" }),
                        this.$render("i-label", { id: "lbPayAmount", font: { size: '1rem', color: Theme.text.primary, bold: true } }))),
                this.$render("i-stack", { direction: "vertical", gap: "1.5rem", width: "100%", height: "100%", alignItems: "center", padding: { top: '1rem', bottom: '1rem' } },
                    this.$render("i-stack", { id: "pnlWallet", visible: false, direction: "vertical", gap: "2rem", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", padding: { left: '1rem', right: '1rem' } },
                        this.$render("i-image", { id: "imgWallet", width: 64, height: 64 }),
                        this.$render("i-label", { id: "lbWallet", font: { size: '0.825rem', bold: true } }),
                        this.$render("i-button", { caption: "Connect Wallet", width: "100%", maxWidth: 180, padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, font: { size: '1rem', color: Theme.colors.primary.contrastText }, background: { color: Theme.colors.primary.main }, border: { radius: 12 }, onClick: this.handleConnectWallet }),
                        this.$render("i-button", { caption: "Back", width: "100%", maxWidth: 180, padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, font: { size: '1rem', color: Theme.colors.secondary.contrastText }, background: { color: Theme.colors.secondary.main }, border: { radius: 12 }, onClick: this.handleBack })),
                    this.$render("i-stack", { id: "pnlTokens", visible: false, direction: "vertical", gap: "1rem", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" },
                        this.$render("i-stack", { direction: "horizontal", justifyContent: "space-between", alignItems: "center", gap: "1rem", width: "100%", wrap: "wrap", margin: { bottom: '0.5rem' }, padding: { left: '1rem', right: '1rem' } },
                            this.$render("i-stack", { direction: "horizontal", gap: "0.5rem", alignItems: "center", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, border: { style: 'solid', width: 1, color: Theme.divider, radius: 8 } },
                                this.$render("i-image", { id: "imgCurrentWallet", width: 24, height: 24, minWidth: 24 }),
                                this.$render("i-label", { id: "lbCurrentAddress" })),
                            this.$render("i-stack", { id: "pnlNetwork", direction: "horizontal", gap: "0.5rem", alignItems: "center", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, border: { style: 'solid', width: 1, color: Theme.divider, radius: 8 }, cursor: "pointer", width: "fit-content", onClick: this.handleShowNetworks },
                                this.$render("i-image", { id: "imgCurrentNetwork", width: 24, height: 24, minWidth: 24 }),
                                this.$render("i-label", { id: "lbCurrentNetwork" }))),
                        this.$render("i-stack", { id: "pnlTokenItems", direction: "vertical", gap: "1rem", width: "100%", height: "100%", minHeight: 200, maxHeight: "calc(100vh - 305px)", overflow: "auto", padding: { left: '1rem', right: '1rem' } }),
                        this.$render("i-stack", { id: "pnlPayDetail", visible: false, direction: "vertical", gap: "0.25rem", width: "100%", height: "100%", alignItems: "center", padding: { left: '1rem', right: '1rem' } },
                            this.$render("i-label", { caption: "Paid to address" }),
                            this.$render("i-stack", { direction: "horizontal", alignItems: "center", width: "100%", margin: { bottom: '1rem' }, border: { radius: 8 }, background: { color: Theme.input.background }, overflow: "hidden" },
                                this.$render("i-stack", { direction: "horizontal", gap: "0.5rem", alignItems: "center", width: "100%", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' } },
                                    this.$render("i-image", { id: "imgToken", width: 16, height: 16, minWidth: 16, display: "flex" }),
                                    this.$render("i-label", { id: "lbToAddress", wordBreak: "break-all", font: { color: Theme.input.fontColor } })),
                                this.$render("i-stack", { direction: "horizontal", width: 32, minWidth: 32, height: "100%", alignItems: "center", justifyContent: "center", cursor: "pointer", margin: { left: 'auto' }, background: { color: Theme.colors.primary.main }, onClick: this.handleCopyAddress },
                                    this.$render("i-icon", { id: "iconCopyAddress", name: "copy", width: 16, height: 16, cursor: "pointer", fill: Theme.text.primary }))),
                            this.$render("i-stack", { direction: "horizontal", alignItems: "center", width: "100%", border: { radius: 8 }, background: { color: Theme.input.background }, overflow: "hidden" },
                                this.$render("i-stack", { direction: "vertical", gap: "0.5rem", justifyContent: "center", alignItems: "center", width: "100%", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' } },
                                    this.$render("i-label", { caption: "Amount to pay", font: { size: '0.75rem', transform: 'uppercase', color: Theme.input.fontColor }, opacity: 0.8 }),
                                    this.$render("i-label", { id: "lbAmountToPay", wordBreak: "break-all", font: { size: '0.875rem', color: Theme.colors.primary.main, bold: true } }),
                                    this.$render("i-label", { id: "lbUSD", wordBreak: "break-all", font: { size: '0.75rem', color: Theme.colors.primary.main } })),
                                this.$render("i-stack", { direction: "horizontal", width: 32, minWidth: 32, height: "100%", alignItems: "center", justifyContent: "center", cursor: "pointer", margin: { left: 'auto' }, background: { color: Theme.colors.primary.main }, onClick: this.handleCopyAmount },
                                    this.$render("i-icon", { id: "iconCopyAmount", name: "copy", width: 16, height: 16, fill: Theme.text.primary })))),
                        this.$render("i-stack", { direction: "horizontal", width: "100%", alignItems: "center", justifyContent: "center", gap: "2rem", wrap: "wrap", padding: { left: '1rem', right: '1rem' } },
                            this.$render("i-button", { id: "btnBack", caption: "Back", width: "100%", maxWidth: 180, minWidth: 90, padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, font: { size: '1rem', color: Theme.colors.secondary.contrastText }, background: { color: Theme.colors.secondary.main }, border: { radius: 12 }, onClick: this.handleBack }),
                            this.$render("i-button", { id: "btnPay", visible: false, caption: "Pay", width: "calc(50% - 1rem)", maxWidth: 180, minWidth: 90, padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, font: { size: '1rem', color: Theme.colors.primary.contrastText }, background: { color: Theme.colors.primary.main }, border: { radius: 12 }, onClick: this.handlePay })))));
        }
    };
    WalletPayment = __decorate([
        (0, components_6.customElements)('scom-payment-widget--wallet-payment')
    ], WalletPayment);
    exports.WalletPayment = WalletPayment;
});
define("@scom/scom-payment-widget/components/statusPayment.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-payment-widget/components/index.css.ts", "@scom/scom-payment-widget/assets.ts", "@scom/scom-payment-widget/store.ts"], function (require, exports, components_7, index_css_2, assets_3, store_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StatusPayment = void 0;
    const Theme = components_7.Styles.Theme.ThemeVars;
    let StatusPayment = class StatusPayment extends components_7.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        updateStatus(state, info) {
            this.state = state;
            const { status, receipt, provider, ownerAddress } = info;
            this.receipt = receipt;
            const isPending = status === 'pending';
            const isCompleted = status === 'complete';
            this.lbHeaderStatus.caption = isPending ? 'Payment Pending' : isCompleted ? 'Success' : 'Failed';
            this.lbHeaderStatus.style.color = isPending ? Theme.colors.primary.main : isCompleted ? Theme.colors.success.main : Theme.colors.error.main;
            this.lbHeaderStatus.style.marginInline = isPending ? 'inherit' : 'auto';
            this.imgHeaderStatus.visible = isPending;
            this.lbStatus.caption = `Payment ${status}`;
            if (isPending) {
                this.imgStatus.classList.add(index_css_2.loadingImageStyle);
            }
            else {
                this.imgStatus.classList.remove(index_css_2.loadingImageStyle);
            }
            this.imgStatus.url = assets_3.default.fullPath(`img/${isPending ? 'loading.svg' : isCompleted ? 'success.svg' : 'error.png'}`);
            const currentProvider = store_3.PaymentProviders.find(v => v.provider === provider);
            this.imgWallet.url = assets_3.default.fullPath(`img/${currentProvider.image}`);
            this.lbAddress.caption = ownerAddress.substr(0, 6) + '...' + ownerAddress.substr(-4);
            this.btnClose.visible = !isPending;
        }
        handleViewTransaction() {
            const network = this.state.getNetworkInfo(this.state.getChainId());
            if (network && network.explorerTxUrl) {
                const url = `${network.explorerTxUrl}${this.receipt}`;
                window.open(url);
            }
        }
        handleClose() {
            if (this.onClose)
                this.onClose();
        }
        async init() {
            super.init();
            this.onClose = this.getAttribute('onClose', true) || this.onClose;
        }
        render() {
            return this.$render("i-stack", { direction: "vertical", gap: "1rem", height: "100%", width: "100%", alignItems: "center", padding: { top: '1rem', bottom: '1rem' } },
                this.$render("i-stack", { direction: "vertical", gap: "1rem", height: "100%", width: "100%" },
                    this.$render("i-stack", { direction: "horizontal", gap: "1rem", justifyContent: "space-between", alignItems: "center", width: "100%", minHeight: 40, padding: { left: '1rem', right: '1rem', bottom: '1rem' }, border: { bottom: { style: 'solid', width: 1, color: Theme.divider } } },
                        this.$render("i-label", { id: "lbHeaderStatus", font: { size: '0.875rem', color: Theme.colors.primary.main, transform: 'uppercase', bold: true } }),
                        this.$render("i-image", { id: "imgHeaderStatus", class: index_css_2.loadingImageStyle, url: assets_3.default.fullPath('img/loading.svg'), width: 20, height: 20, minWidth: 20 })),
                    this.$render("i-stack", { direction: "vertical", gap: "1rem", width: "100%", height: "100%", alignItems: "center", padding: { left: '1rem', right: '1rem' } },
                        this.$render("i-stack", { direction: "horizontal", justifyContent: "space-between", alignItems: "center", gap: "1rem", width: "100%", wrap: "wrap", margin: { bottom: '0.5rem' } },
                            this.$render("i-stack", { direction: "horizontal", gap: "0.5rem", alignItems: "center", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, border: { style: 'solid', width: 1, color: Theme.divider, radius: 8 } },
                                this.$render("i-image", { id: "imgWallet", width: 24, height: 24, minWidth: 24 }),
                                this.$render("i-label", { id: "lbAddress" })),
                            this.$render("i-stack", { direction: "horizontal", gap: "0.5rem", alignItems: "center", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, border: { style: 'solid', width: 1, color: Theme.divider, radius: 8 }, cursor: "pointer", width: "fit-content", onClick: this.handleViewTransaction },
                                this.$render("i-label", { caption: "View transaction" }))),
                        this.$render("i-stack", { direction: "vertical", alignItems: "center", justifyContent: "center", gap: "1rem", width: "100%", height: "100%" },
                            this.$render("i-image", { id: "imgStatus", width: 64, height: 64 }),
                            this.$render("i-label", { id: "lbStatus", class: index_css_2.textCenterStyle, font: { size: '1rem', color: Theme.text.primary, bold: true } })))),
                this.$render("i-button", { id: "btnClose", visible: false, width: "100%", maxWidth: 180, caption: "Close", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, font: { size: '1rem', color: Theme.colors.primary.contrastText }, background: { color: Theme.colors.primary.main }, border: { radius: 12 }, onClick: this.handleClose }));
        }
    };
    StatusPayment = __decorate([
        (0, components_7.customElements)('scom-payment-widget--status-payment')
    ], StatusPayment);
    exports.StatusPayment = StatusPayment;
});
define("@scom/scom-payment-widget/components/index.ts", ["require", "exports", "@scom/scom-payment-widget/components/invoiceCreation.tsx", "@scom/scom-payment-widget/components/paymentMethod.tsx", "@scom/scom-payment-widget/components/walletPayment.tsx", "@scom/scom-payment-widget/components/statusPayment.tsx"], function (require, exports, invoiceCreation_1, paymentMethod_1, walletPayment_1, statusPayment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StatusPayment = exports.WalletPayment = exports.PaymentMethod = exports.InvoiceCreation = void 0;
    Object.defineProperty(exports, "InvoiceCreation", { enumerable: true, get: function () { return invoiceCreation_1.InvoiceCreation; } });
    Object.defineProperty(exports, "PaymentMethod", { enumerable: true, get: function () { return paymentMethod_1.PaymentMethod; } });
    Object.defineProperty(exports, "WalletPayment", { enumerable: true, get: function () { return walletPayment_1.WalletPayment; } });
    Object.defineProperty(exports, "StatusPayment", { enumerable: true, get: function () { return statusPayment_1.StatusPayment; } });
});
define("@scom/scom-payment-widget/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dappContainerStyle = void 0;
    exports.dappContainerStyle = components_8.Styles.style({
        $nest: {
            '&>:first-child': {
                borderRadius: 12
            },
            '#pnlModule': {
                height: '100%'
            },
            'dapp-container-header': {
                width: 0,
                height: 0,
                overflow: 'hidden'
            },
            'dapp-container-footer': {
                display: 'none'
            }
        }
    });
});
define("@scom/scom-payment-widget/telegramPayWidget.tsx", ["require", "exports", "@ijstech/components"], function (require, exports, components_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomTelegramPayWidget = void 0;
    const Theme = components_9.Styles.Theme.ThemeVars;
    let ScomTelegramPayWidget = class ScomTelegramPayWidget extends components_9.Module {
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
        (0, components_9.customElements)('i-scom-telegram-pay-widget')
    ], ScomTelegramPayWidget);
    exports.ScomTelegramPayWidget = ScomTelegramPayWidget;
});
define("@scom/scom-payment-widget", ["require", "exports", "@ijstech/components", "@scom/scom-payment-widget/store.ts", "@scom/scom-payment-widget/data.ts", "@scom/scom-payment-widget/index.css.ts", "@scom/scom-payment-widget/telegramPayWidget.tsx", "@scom/scom-dapp-container"], function (require, exports, components_10, store_4, data_2, index_css_3, telegramPayWidget_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomPaymentWidget = exports.ScomTelegramPayWidget = void 0;
    Object.defineProperty(exports, "ScomTelegramPayWidget", { enumerable: true, get: function () { return telegramPayWidget_1.ScomTelegramPayWidget; } });
    let ScomPaymentWidget = class ScomPaymentWidget extends components_10.Module {
        constructor(parent, options) {
            super(parent, options);
            this._wallets = [];
            this._networks = [];
            this._tokens = [];
        }
        get wallets() {
            return this._wallets ?? data_2.default.defaultData.wallets;
        }
        set wallets(value) {
            this._wallets = value;
        }
        get networks() {
            return this._networks ?? data_2.default.defaultData.networks;
        }
        set networks(value) {
            this._networks = value;
        }
        get tokens() {
            return this._tokens ?? data_2.default.defaultData.tokens;
        }
        set tokens(value) {
            this._tokens = value;
        }
        get rpcWallet() {
            return this.state.getRpcWallet();
        }
        onStartPayment(payment) {
            this.payment = payment;
            if (!this.invoiceCreation)
                return;
            this.isInitialized = true;
            this.invoiceCreation.payment = payment;
            this.invoiceCreation.visible = true;
            this.paymentMethod.payment = payment;
            this.paymentMethod.visible = false;
            this.walletPayment.visible = false;
            this.walletPayment.state = this.state;
            this.statusPayment.visible = false;
        }
        async init() {
            if (!this.state) {
                this.state = new store_4.State(data_2.default);
            }
            super.init();
            this.invoiceCreation.onContinue = () => {
                this.invoiceCreation.visible = false;
                this.paymentMethod.visible = true;
                this.walletPayment.visible = false;
                this.statusPayment.visible = false;
            };
            this.paymentMethod.onSelectedPaymentProvider = (payment, paymentProvider) => {
                this.paymentMethod.visible = false;
                this.walletPayment.wallets = this.wallets;
                this.walletPayment.networks = this.networks;
                this.walletPayment.tokens = this.tokens;
                this.walletPayment.onStartPayment({
                    ...payment,
                    provider: paymentProvider
                });
                this.walletPayment.visible = true;
            };
            this.walletPayment.onPaid = (paymentStatus) => {
                this.walletPayment.visible = false;
                this.statusPayment.visible = true;
                this.statusPayment.updateStatus(this.state, paymentStatus);
            };
            this.walletPayment.onBack = () => {
                this.paymentMethod.visible = true;
                this.walletPayment.visible = false;
                this.statusPayment.visible = false;
            };
            this.statusPayment.onClose = () => {
                this.onStartPayment(this.payment);
            };
            const lazyLoad = this.getAttribute('lazyLoad', true, false);
            if (!lazyLoad) {
                this.networks = this.getAttribute('networks', true, data_2.default.defaultData.networks);
                this.tokens = this.getAttribute('tokens', true, data_2.default.defaultData.tokens);
                this.wallets = this.getAttribute('wallets', true, data_2.default.defaultData.wallets);
            }
            if (this.payment && !this.isInitialized) {
                this.onStartPayment(this.payment);
            }
            this.executeReadyCallback();
        }
        render() {
            return this.$render("i-scom-dapp-container", { id: "containerDapp", showHeader: true, showFooter: false, class: index_css_3.dappContainerStyle },
                this.$render("i-stack", { direction: "vertical", width: 360, height: "100%", maxWidth: "100%", minHeight: 480, border: { radius: 12 } },
                    this.$render("scom-payment-widget--invoice-creation", { id: "invoiceCreation", visible: false, height: "100%" }),
                    this.$render("scom-payment-widget--payment-method", { id: "paymentMethod", visible: false, height: "100%" }),
                    this.$render("scom-payment-widget--wallet-payment", { id: "walletPayment", visible: false, height: "100%" }),
                    this.$render("scom-payment-widget--status-payment", { id: "statusPayment", visible: false, height: "100%" })));
        }
    };
    ScomPaymentWidget = __decorate([
        (0, components_10.customElements)('i-scom-payment-widget')
    ], ScomPaymentWidget);
    exports.ScomPaymentWidget = ScomPaymentWidget;
});
