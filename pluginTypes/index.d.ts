/// <amd-module name="@scom/scom-payment-widget/interface.ts" />
declare module "@scom/scom-payment-widget/interface.ts" {
    export interface IPaymentInfo {
        title: string;
        description?: string;
        paymentId?: string;
        amount: number;
        currency?: string;
        photoUrl?: string;
        payload?: string;
        prices?: {
            label: string;
            amount: number | string;
        }[];
        address?: string;
        provider?: PaymentProvider;
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
    export const STRIPE_PUBLISHABLE_KEY = "pk_test_51Q60lAP7pMwOSpCLJJQliRgIVHlmPlpkrstk43VlRG2vutqIPZKhoSv8XVzK3nbxawr2ru5cWQ1SFfkayFu5m25o00RHU1gBhl";
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
    export const PaymentProviders: {
        provider: PaymentProvider;
        type: PaymentType;
        image: string;
    }[];
    export const stripeCurrencies: string[];
}
/// <amd-module name="@scom/scom-payment-widget/data.ts" />
declare module "@scom/scom-payment-widget/data.ts" {
    const _default: {
        infuraId: string;
        defaultData: {
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
    export const checkboxTextStyle: string;
    export const loadingImageStyle: string;
    export const alertStyle: string;
}
/// <amd-module name="@scom/scom-payment-widget/components/invoiceCreation.tsx" />
declare module "@scom/scom-payment-widget/components/invoiceCreation.tsx" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import { IPaymentInfo } from "@scom/scom-payment-widget/interface.ts";
    interface ScomPaymentWidgetInvoiceCreationElement extends ControlElement {
        payment?: IPaymentInfo;
        onContinue?: () => void;
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
        private imgItem;
        private lbAmount;
        private pnlPaymentId;
        private lbPaymentId;
        private checkboxAgree;
        private btnContinue;
        private _payment;
        onContinue: () => void;
        get payment(): IPaymentInfo;
        set payment(value: IPaymentInfo);
        constructor(parent?: Container, options?: ScomPaymentWidgetInvoiceCreationElement);
        private updateInfo;
        private handleCheckboxChanged;
        private handleContinue;
        init(): Promise<void>;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-payment-widget/assets.ts" />
declare module "@scom/scom-payment-widget/assets.ts" {
    function fullPath(path: string): string;
    const _default_1: {
        fullPath: typeof fullPath;
    };
    export default _default_1;
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
        private lbItem;
        private lbAmount;
        private lbPayMethod;
        private pnlPaymentType;
        private pnlPaymentMethod;
        private pnlMethodItems;
        private _payment;
        onSelectedPaymentProvider: (payment: IPaymentInfo, paymentProvider: PaymentProvider) => void;
        onBack: () => void;
        get payment(): IPaymentInfo;
        set payment(value: IPaymentInfo);
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
        private clientSecret;
        private lbItem;
        private lbAmount;
        private mdAlert;
        onPaymentSuccess: (status: string) => void;
        onBack: () => void;
        constructor(parent?: Container, options?: ScomPaymentWidgetStripePaymentElement);
        set payment(data: IPaymentInfo);
        get payment(): IPaymentInfo;
        get baseStripeApi(): string;
        set baseStripeApi(value: string);
        get urlStripeTracking(): string;
        set urlStripeTracking(value: string);
        private updateAmount;
        private initStripePayment;
        private createPaymentIntent;
        private handleStripeCheckoutClick;
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
        private pnlAmount;
        private pnlPayAmount;
        private lbItem;
        private lbAmount;
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
        show(payment: IPaymentInfo): void;
        init(): Promise<void>;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-payment-widget/components/stripePaymentTracking.tsx" />
declare module "@scom/scom-payment-widget/components/stripePaymentTracking.tsx" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    interface ScomPaymentWidgetStripePaymentTrackingElement extends ControlElement {
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
    import { INetworkConfig, IPaymentInfo } from "@scom/scom-payment-widget/interface.ts";
    import { IWalletPlugin } from '@scom/scom-wallet-modal';
    import { ITokenObject } from "@scom/scom-token-list";
    import { IRpcWallet } from '@ijstech/eth-wallet';
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
        init(): Promise<void>;
        render(): any;
    }
}
