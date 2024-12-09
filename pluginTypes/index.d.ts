/// <amd-module name="@scom/scom-payment-widget/interface.ts" />
declare module "@scom/scom-payment-widget/interface.ts" {
    export enum ProductType {
        Physical = "Physical",
        Digital = "Digital",
        Course = "Course",
        Ebook = "Ebook",
        Membership = "Membership",
        Bundle = "Bundle"
    }
    export interface IProduct {
        name: string;
        price: number | string;
        quantity: number;
        shippingCost?: number;
        images?: string[];
        productType: ProductType;
    }
    export interface IPaymentInfo {
        title: string;
        products: IProduct[];
        description?: string;
        paymentId?: string;
        currency?: string;
        payload?: string;
        address?: string;
        provider?: PaymentProvider;
        userInfo?: {
            name: string;
            email: string;
        };
    }
    export enum PaymentType {
        Fiat = "Fiat",
        Crypto = "Crypto"
    }
    export enum PaymentProvider {
        Stripe = "Stripe",
        Paypal = "Paypal",
        TonWallet = "Ton Wallet",
        Metamask = "Metamask"
    }
    export interface IPaymentStatus {
        status: 'pending' | 'complete' | 'failed';
        receipt: string;
        provider: PaymentProvider;
        ownerAddress: string;
    }
    export interface INetworkConfig {
        chainName?: string;
        chainId: number;
    }
}
/// <amd-module name="@scom/scom-payment-widget/store.ts" />
declare module "@scom/scom-payment-widget/store.ts" {
    import { INetwork, IRpcWallet, IClientWallet } from "@ijstech/eth-wallet";
    import { PaymentProvider, PaymentType } from "@scom/scom-payment-widget/interface.ts";
    export const STRIPE_LIB_URL = "https://js.stripe.com/v3";
    interface IExtendedNetwork extends INetwork {
        explorerName?: string;
        explorerTxUrl?: string;
        explorerAddressUrl?: string;
    }
    export class State {
        rpcWalletId: string;
        networkMap: {
            [key: number]: IExtendedNetwork;
        };
        infuraId: string;
        constructor(options: any);
        initRpcWallet(defaultChainId: number): string;
        getRpcWallet(): IRpcWallet;
        isRpcWalletConnected(): boolean;
        getNetworkInfo: (chainId: number) => IExtendedNetwork;
        getChainId(): number;
    }
    export function getClientWallet(): IClientWallet;
    export function isClientWalletConnected(): boolean;
    export function getStripeKey(apiUrl: string): Promise<string>;
    export const PaymentProviders: {
        provider: PaymentProvider;
        type: PaymentType;
        image: string;
    }[];
    export const stripeCurrencies: string[];
    export const stripeZeroDecimalCurrencies: string[];
    export const stripeSpecialCurrencies: string[];
}
/// <amd-module name="@scom/scom-payment-widget/defaultData.ts" />
declare module "@scom/scom-payment-widget/defaultData.ts" {
    const _default: {
        infuraId: string;
        defaultData: {
            baseStripeApi: string;
            urlStripeTracking: string;
            defaultChainId: number;
            networks: {
                chainId: number;
            }[];
            tokens: {
                chainId: number;
                name: string;
                address: string;
                symbol: string;
                decimals: number;
            }[];
            wallets: {
                name: string;
            }[];
        };
    };
    export default _default;
}
/// <amd-module name="@scom/scom-payment-widget/components/index.css.ts" />
declare module "@scom/scom-payment-widget/components/index.css.ts" {
    export const elementStyle: string;
    export const textCenterStyle: string;
    export const textUpperCaseStyle: string;
    export const loadingImageStyle: string;
    export const alertStyle: string;
    export const carouselSliderStyle: string;
    export const fullWidthButtonStyle: string;
    export const halfWidthButtonStyle: string;
}
/// <amd-module name="@scom/scom-payment-widget/translations.json.ts" />
declare module "@scom/scom-payment-widget/translations.json.ts" {
    const _default_1: {
        en: {
            pay: string;
            amount_to_pay: string;
            payment: string;
            continue: string;
            back: string;
            close: string;
            payment_id: string;
            price: string;
            quantity: string;
            fiat_currency: string;
            crypto_currency: string;
            select_payment_gateway: string;
            select_your_wallet: string;
            how_will_you_pay: string;
            success: string;
            failed: string;
            payment_completed: string;
            payment_pending: string;
            payment_failed: string;
            view_transaction: string;
            checkout: string;
            check_payment_status: string;
            cannot_get_payment_info: string;
            paid_to_address: string;
            connect_wallet: string;
            payment_received_success: string;
            payment_processing: string;
            something_went_wrong: string;
            invalid_payment_id: string;
            check_stripe_payment_status: string;
            check: string;
        };
        "zh-hant": {
            pay: string;
            amount_to_pay: string;
            payment: string;
            continue: string;
            back: string;
            close: string;
            payment_id: string;
            price: string;
            quantity: string;
            fiat_currency: string;
            crypto_currency: string;
            select_payment_gateway: string;
            select_your_wallet: string;
            how_will_you_pay: string;
            success: string;
            failed: string;
            payment_completed: string;
            payment_pending: string;
            payment_failed: string;
            view_transaction: string;
            checkout: string;
            check_payment_status: string;
            cannot_get_payment_info: string;
            paid_to_address: string;
            connect_wallet: string;
            payment_received_success: string;
            payment_processing: string;
            something_went_wrong: string;
            invalid_payment_id: string;
            check_stripe_payment_status: string;
            check: string;
        };
        vi: {
            pay: string;
            amount_to_pay: string;
            payment: string;
            continue: string;
            back: string;
            close: string;
            payment_id: string;
            price: string;
            quantity: string;
            fiat_currency: string;
            crypto_currency: string;
            select_payment_gateway: string;
            select_your_wallet: string;
            how_will_you_pay: string;
            success: string;
            failed: string;
            payment_completed: string;
            payment_pending: string;
            payment_failed: string;
            view_transaction: string;
            checkout: string;
            check_payment_status: string;
            cannot_get_payment_info: string;
            paid_to_address: string;
            connect_wallet: string;
            payment_received_success: string;
            payment_processing: string;
            something_went_wrong: string;
            invalid_payment_id: string;
            check_stripe_payment_status: string;
            check: string;
        };
    };
    export default _default_1;
}
/// <amd-module name="@scom/scom-payment-widget/components/invoiceCreation.tsx" />
declare module "@scom/scom-payment-widget/components/invoiceCreation.tsx" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import { IPaymentInfo } from "@scom/scom-payment-widget/interface.ts";
    interface ScomPaymentWidgetInvoiceCreationElement extends ControlElement {
        payment?: IPaymentInfo;
        onContinue?: () => void;
        onBack?: () => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['scom-payment-widget--invoice-creation']: ScomPaymentWidgetInvoiceCreationElement;
            }
        }
    }
    export class InvoiceCreation extends Module {
        private pnlItemInfo;
        private lbItem;
        private lbAmount;
        private pnlPaymentId;
        private lbPaymentId;
        private btnContinue;
        private btnBack;
        private carouselSlider;
        private _payment;
        onContinue: () => void;
        onBack: () => void;
        get payment(): IPaymentInfo;
        set payment(value: IPaymentInfo);
        get totalPrice(): number;
        get totalShippingCost(): number;
        constructor(parent?: Container, options?: ScomPaymentWidgetInvoiceCreationElement);
        private renderProducts;
        private updateInfo;
        private handleContinue;
        private handleBack;
        init(): Promise<void>;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-payment-widget/assets.ts" />
declare module "@scom/scom-payment-widget/assets.ts" {
    function fullPath(path: string): string;
    const _default_2: {
        fullPath: typeof fullPath;
    };
    export default _default_2;
}
/// <amd-module name="@scom/scom-payment-widget/components/common/header.tsx" />
declare module "@scom/scom-payment-widget/components/common/header.tsx" {
    import { Module, ControlElement } from "@ijstech/components";
    interface HeaderElement extends ControlElement {
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['scom-payment-widget--header']: HeaderElement;
            }
        }
    }
    export class PaymentHeader extends Module {
        private lbTitle;
        private lbAmount;
        setHeader(title: string, currency: string, amount: number): void;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-payment-widget/components/common/index.ts" />
declare module "@scom/scom-payment-widget/components/common/index.ts" {
    import { PaymentHeader } from "@scom/scom-payment-widget/components/common/header.tsx";
    export { PaymentHeader, };
}
/// <amd-module name="@scom/scom-payment-widget/components/paymentMethod.tsx" />
declare module "@scom/scom-payment-widget/components/paymentMethod.tsx" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import { IPaymentInfo, PaymentProvider } from "@scom/scom-payment-widget/interface.ts";
    interface ScomPaymentWidgetPaymentMethodElement extends ControlElement {
        payment?: IPaymentInfo;
        onSelectedPaymentProvider?: (paymentProvider: PaymentProvider) => void;
        onBack?: () => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['scom-payment-widget--payment-method']: ScomPaymentWidgetPaymentMethodElement;
            }
        }
    }
    export class PaymentMethod extends Module {
        private header;
        private lbPayMethod;
        private pnlPaymentType;
        private pnlPaymentMethod;
        private pnlMethodItems;
        private _payment;
        onSelectedPaymentProvider: (payment: IPaymentInfo, paymentProvider: PaymentProvider) => void;
        onBack: () => void;
        get payment(): IPaymentInfo;
        set payment(value: IPaymentInfo);
        get totalPrice(): number;
        get totalShippingCost(): number;
        constructor(parent?: Container, options?: ScomPaymentWidgetPaymentMethodElement);
        private updateAmount;
        private renderMethodItems;
        private handlePaymentType;
        private handlePaymentProvider;
        private handleBack;
        init(): Promise<void>;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-payment-widget/components/statusPayment.tsx" />
declare module "@scom/scom-payment-widget/components/statusPayment.tsx" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import { State } from "@scom/scom-payment-widget/store.ts";
    import { IPaymentStatus } from "@scom/scom-payment-widget/interface.ts";
    interface ScomPaymentWidgetStatusPaymentElement extends ControlElement {
        onClose?: () => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['scom-payment-widget--status-payment']: ScomPaymentWidgetStatusPaymentElement;
            }
        }
    }
    export class StatusPayment extends Module {
        private state;
        private receipt;
        private status;
        private provider;
        private lbHeaderStatus;
        private imgHeaderStatus;
        private lbStatus;
        private imgStatus;
        private lbAddress;
        private imgWallet;
        private btnClose;
        onClose: (status: string) => void;
        constructor(parent?: Container, options?: ScomPaymentWidgetStatusPaymentElement);
        private getStatusText;
        updateStatus(state: State, info: IPaymentStatus): void;
        private handleViewTransaction;
        private handleClose;
        init(): Promise<void>;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-payment-widget/utils.ts" />
declare module "@scom/scom-payment-widget/utils.ts" {
    export function loadStripe(): Promise<unknown>;
}
/// <amd-module name="@scom/scom-payment-widget/components/stripePayment.tsx" />
declare module "@scom/scom-payment-widget/components/stripePayment.tsx" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import { IPaymentInfo } from "@scom/scom-payment-widget/interface.ts";
    interface ScomPaymentWidgetStripePaymentElement extends ControlElement {
        payment?: IPaymentInfo;
        baseStripeApi?: string;
        payBtnCaption?: string;
        onBack?: () => void;
        onPaymentSuccess?: (status: string) => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['scom-payment-widget--stripe-payment']: ScomPaymentWidgetStripePaymentElement;
            }
        }
    }
    export class StripePayment extends Module {
        private _payment;
        private _baseStripeApi;
        private _urlStripeTracking;
        private stripe;
        private stripeElements;
        private btnCheckout;
        private header;
        private mdAlert;
        private publishableKey;
        onPaymentSuccess: (status: string) => void;
        onBack: () => void;
        constructor(parent?: Container, options?: ScomPaymentWidgetStripePaymentElement);
        set payment(data: IPaymentInfo);
        get payment(): IPaymentInfo;
        get totalPrice(): number;
        get totalShippingCost(): number;
        get baseStripeApi(): string;
        set baseStripeApi(value: string);
        get urlStripeTracking(): string;
        set urlStripeTracking(value: string);
        private get stripeCurrency();
        private updateAmount;
        private convertToSmallestUnit;
        private initStripePayment;
        private createPaymentIntent;
        private handleStripeCheckoutClick;
        private showButtonIcon;
        private showAlert;
        private handleBack;
        init(): Promise<void>;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-payment-widget/components/walletPayment.tsx" />
declare module "@scom/scom-payment-widget/components/walletPayment.tsx" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import { INetworkConfig, IPaymentInfo, IPaymentStatus } from "@scom/scom-payment-widget/interface.ts";
    import { ITokenObject } from '@scom/scom-token-list';
    import { State } from "@scom/scom-payment-widget/store.ts";
    import { IRpcWallet } from '@ijstech/eth-wallet';
    import { IWalletPlugin } from '@scom/scom-wallet-modal';
    import ScomDappContainer from '@scom/scom-dapp-container';
    interface ScomPaymentWidgetWalletPaymentElement extends ControlElement {
        wallets?: IWalletPlugin[];
        networks?: INetworkConfig[];
        tokens?: ITokenObject[];
        payment?: IPaymentInfo;
        onBack?: () => void;
        onPaid?: (paymentStatus: IPaymentStatus) => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['scom-payment-widget--wallet-payment']: ScomPaymentWidgetWalletPaymentElement;
            }
        }
    }
    export class WalletPayment extends Module {
        private pnlPayAmount;
        private header;
        private lbPayItem;
        private lbPayAmount;
        private imgPayToken;
        private btnTonWallet;
        private pnlNetwork;
        private pnlWallet;
        private pnlTokens;
        private pnlTokenItems;
        private pnlPayDetail;
        private imgToken;
        private lbToAddress;
        private lbAmountToPay;
        private lbUSD;
        private btnBack;
        private btnPay;
        private imgWallet;
        private lbWallet;
        private imgCurrentWallet;
        private lbCurrentAddress;
        private imgCurrentNetwork;
        private lbCurrentNetwork;
        private _dappContainer;
        private _payment;
        private _wallets;
        private _networks;
        private _tokens;
        private _state;
        private rpcWalletEvents;
        private isInitialized;
        private isWalletInitialized;
        private isToPay;
        private copyAddressTimer;
        private copyAmountTimer;
        private iconCopyAddress;
        private iconCopyAmount;
        private tonConnectUI;
        private tonWeb;
        private isTonWalletConnected;
        onBack: () => void;
        onPaid: (paymentStatus: IPaymentStatus) => void;
        constructor(parent?: Container, options?: ScomPaymentWidgetWalletPaymentElement);
        get dappContainer(): ScomDappContainer;
        set dappContainer(container: ScomDappContainer);
        get payment(): IPaymentInfo;
        set payment(value: IPaymentInfo);
        get totalPrice(): number;
        get totalShippingCost(): number;
        get state(): State;
        set state(value: State);
        get wallets(): IWalletPlugin[];
        set wallets(value: IWalletPlugin[]);
        get networks(): INetworkConfig[];
        set networks(value: INetworkConfig[]);
        get tokens(): ITokenObject[];
        set tokens(value: ITokenObject[]);
        get rpcWallet(): IRpcWallet;
        onStartPayment(payment: IPaymentInfo): Promise<void>;
        private showFirstScreen;
        private removeRpcWalletEvents;
        private resetRpcWallet;
        private initWallet;
        private initTonWallet;
        private connectTonWallet;
        private loadTonWeb;
        private loadTonConnectUI;
        private loadLib;
        private updateAmount;
        private checkWalletStatus;
        private updateTokenBalances;
        private renderErcTokens;
        private getTonBalance;
        private renderTonToken;
        private updateDappContainer;
        private handleConnectWallet;
        private handleShowNetworks;
        private handleSelectToken;
        private handleCopyAddress;
        private handleCopyAmount;
        private handlePay;
        private handleBack;
        init(): Promise<void>;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-payment-widget/components/paymentModule.tsx" />
declare module "@scom/scom-payment-widget/components/paymentModule.tsx" {
    import { Module, ControlElement } from '@ijstech/components';
    import { State } from "@scom/scom-payment-widget/store.ts";
    import { INetworkConfig, IPaymentInfo } from "@scom/scom-payment-widget/interface.ts";
    import { IWalletPlugin } from '@scom/scom-wallet-modal';
    import { ITokenObject } from '@scom/scom-token-list';
    import ScomDappContainer from '@scom/scom-dapp-container';
    interface ScomPaymentWidgetPaymentElement extends ControlElement {
        state?: State;
        wallets?: IWalletPlugin[];
        networks?: INetworkConfig[];
        tokens?: ITokenObject[];
        baseStripeApi?: string;
        urlStripeTracking?: string;
        onPaymentSuccess?: (status: string) => Promise<void>;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['scom-payment-widget--payment-module']: ScomPaymentWidgetPaymentElement;
            }
        }
    }
    export class PaymentModule extends Module {
        private invoiceCreation;
        private paymentMethod;
        private walletPayment;
        private stripePayment;
        private statusPayment;
        private _dappContainer;
        private _state;
        private _baseStripeApi;
        private _urlStripeTracking;
        private _wallets;
        private _networks;
        private _tokens;
        private isModal;
        onPaymentSuccess: (status: string) => Promise<void>;
        get dappContainer(): ScomDappContainer;
        set dappContainer(container: ScomDappContainer);
        get state(): State;
        set state(value: State);
        get baseStripeApi(): string;
        set baseStripeApi(value: string);
        get urlStripeTracking(): string;
        set urlStripeTracking(value: string);
        get wallets(): IWalletPlugin[];
        set wallets(value: IWalletPlugin[]);
        get networks(): INetworkConfig[];
        set networks(value: INetworkConfig[]);
        get tokens(): ITokenObject[];
        set tokens(value: ITokenObject[]);
        show(payment: IPaymentInfo, isModal?: boolean): void;
        init(): Promise<void>;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-payment-widget/components/stripePaymentTracking.tsx" />
declare module "@scom/scom-payment-widget/components/stripePaymentTracking.tsx" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    interface ScomPaymentWidgetStripePaymentTrackingElement extends ControlElement {
        baseStripeApi?: string;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['scom-payment-widget--stripe-payment-tracking']: ScomPaymentWidgetStripePaymentTrackingElement;
            }
        }
    }
    export class StatusPaymentTracking extends Module {
        private stripe;
        private inputClientSecret;
        private btnCheck;
        private imgStatus;
        private lbStatus;
        private publishableKey;
        private _baseStripeApi;
        get baseStripeApi(): string;
        set baseStripeApi(value: string);
        constructor(parent?: Container, options?: ScomPaymentWidgetStripePaymentTrackingElement);
        private checkPaymentStatus;
        private handleInputChanged;
        private handleSearch;
        private getParamsFromUrl;
        private updateURLParam;
        init(): Promise<void>;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-payment-widget/components/index.ts" />
declare module "@scom/scom-payment-widget/components/index.ts" {
    import { PaymentModule } from "@scom/scom-payment-widget/components/paymentModule.tsx";
    import { InvoiceCreation } from "@scom/scom-payment-widget/components/invoiceCreation.tsx";
    import { PaymentMethod } from "@scom/scom-payment-widget/components/paymentMethod.tsx";
    import { WalletPayment } from "@scom/scom-payment-widget/components/walletPayment.tsx";
    import { StatusPayment } from "@scom/scom-payment-widget/components/statusPayment.tsx";
    import { StripePayment } from "@scom/scom-payment-widget/components/stripePayment.tsx";
    import { StatusPaymentTracking } from "@scom/scom-payment-widget/components/stripePaymentTracking.tsx";
    export { PaymentModule, InvoiceCreation, PaymentMethod, WalletPayment, StripePayment, StatusPaymentTracking, StatusPayment };
}
/// <amd-module name="@scom/scom-payment-widget/index.css.ts" />
declare module "@scom/scom-payment-widget/index.css.ts" {
    export const dappContainerStyle: string;
}
/// <amd-module name="@scom/scom-payment-widget" />
declare module "@scom/scom-payment-widget" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import { INetworkConfig, IPaymentInfo, ProductType } from "@scom/scom-payment-widget/interface.ts";
    import { IWalletPlugin } from '@scom/scom-wallet-modal';
    import { ITokenObject } from "@scom/scom-token-list";
    import { IRpcWallet } from '@ijstech/eth-wallet';
    export { ProductType };
    type Mode = 'payment' | 'status';
    interface ScomPaymentWidgetElement extends ControlElement {
        lazyLoad?: boolean;
        payment?: IPaymentInfo;
        wallets?: IWalletPlugin[];
        networks?: INetworkConfig[];
        tokens?: ITokenObject[];
        showButtonPay?: boolean;
        payButtonCaption?: string;
        baseStripeApi?: string;
        urlStripeTracking?: string;
        mode?: Mode;
        onPaymentSuccess?: (status: string) => Promise<void>;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-payment-widget']: ScomPaymentWidgetElement;
            }
        }
    }
    export class ScomPaymentWidget extends Module {
        private containerDapp;
        private pnlWrapper;
        private btnPay;
        private statusPaymentTracking;
        private state;
        private paymentModule;
        private _payment;
        private _mode;
        private _baseStripeApi;
        private _urlStripeTracking;
        private _showButtonPay;
        private _payButtonCaption;
        private isUrl;
        private _wallets;
        private _networks;
        private _tokens;
        onPaymentSuccess: (status: string) => Promise<void>;
        constructor(parent?: Container, options?: ScomPaymentWidgetElement);
        get payment(): IPaymentInfo;
        set payment(value: IPaymentInfo);
        get mode(): Mode;
        set mode(value: Mode);
        get showButtonPay(): boolean;
        set showButtonPay(value: boolean);
        get payButtonCaption(): string;
        set payButtonCaption(value: string);
        get baseStripeApi(): string;
        set baseStripeApi(value: string);
        get urlStripeTracking(): string;
        set urlStripeTracking(value: string);
        get wallets(): IWalletPlugin[];
        set wallets(value: IWalletPlugin[]);
        get networks(): INetworkConfig[];
        set networks(value: INetworkConfig[]);
        get tokens(): ITokenObject[];
        set tokens(value: ITokenObject[]);
        get rpcWallet(): IRpcWallet;
        private updateTheme;
        private updateStyle;
        onStartPayment(payment?: IPaymentInfo): void;
        private openPaymentModal;
        private handlePay;
        private updateUIByMode;
        private handleWidgetUrl;
        init(): Promise<void>;
        render(): any;
    }
}
