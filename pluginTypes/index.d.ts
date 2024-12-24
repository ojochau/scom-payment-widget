/// <reference path="@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-network-modal/@ijstech/eth-wallet/index.d.ts" />
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
        id: string;
        name: string;
        description?: string;
        price: number | string;
        quantity: number;
        currency?: string;
        images?: string[];
        productType?: ProductType;
        stallId?: string;
        stallUri?: string;
        shipping?: IStallShipping[];
        communityUri?: string;
    }
    interface IStallShipping {
        id: string;
        name?: string;
        cost: number;
        regions?: string[];
        amountWithOthers?: number;
    }
    export interface ICryptoPayoutOption {
        chainId?: string;
        cryptoCode: string;
        networkCode: string;
        tokenAddress?: string;
        walletAddress: string;
    }
    export interface IPaymentInfo {
        title: string;
        products: IProduct[];
        description?: string;
        paymentId?: string;
        currency?: string;
        payload?: string;
        address?: string;
        cryptoPayoutOptions?: ICryptoPayoutOption[];
        stripeAccountId?: string;
    }
    interface IOrderItem {
        productId: string;
        productName?: string;
        quantity: number;
        price?: number;
    }
    export interface IShippingInfo {
        name?: string;
        address?: string;
        message?: string;
        contact: {
            nostr: string;
            phone?: string;
            email?: string;
        };
        shippingId?: string;
        shippingCost?: number;
    }
    export interface IOrder extends IShippingInfo {
        id: string;
        currency?: string;
        totalAmount?: number;
        items: IOrderItem[];
    }
    export interface IPlaceOrder {
        merchantId: string;
        stallId: string;
        order: IOrder;
    }
    export interface IPaymentActivity {
        id: string;
        recipient: string;
        amount: string;
        currencyCode: string;
        networkCode?: string;
        stallId?: string;
        stallName?: string;
        orderId?: string;
        referenceId?: string;
        paymentMethod?: 'Stripe' | 'EVM';
        createdAt?: number;
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
    const _default: {
        en: {
            pay: string;
            amount_to_pay: string;
            payment: string;
            shipping_address: string;
            name: string;
            address: string;
            phone_number: string;
            email: string;
            note: string;
            continue: string;
            back: string;
            close: string;
            payment_id: string;
            price: string;
            quantity: string;
            fiat_currency: string;
            cryptocurrency: string;
            web3_wallet: string;
            connect_web3_wallet: string;
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
            connect: string;
            payment_received_success: string;
            payment_processing: string;
            something_went_wrong: string;
            invalid_payment_id: string;
            check_stripe_payment_status: string;
            check: string;
            coming_soon: string;
            payment_coming_soon: string;
            the_stall_owner_has_not_set_up_payments_yet: string;
        };
        "zh-hant": {
            pay: string;
            amount_to_pay: string;
            payment: string;
            shipping_address: string;
            name: string;
            address: string;
            phone_number: string;
            email: string;
            note: string;
            continue: string;
            back: string;
            close: string;
            payment_id: string;
            price: string;
            quantity: string;
            fiat_currency: string;
            cryptocurrency: string;
            web3_wallet: string;
            connect_web3_wallet: string;
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
            connect: string;
            payment_received_success: string;
            payment_processing: string;
            something_went_wrong: string;
            invalid_payment_id: string;
            check_stripe_payment_status: string;
            check: string;
            coming_soon: string;
            payment_coming_soon: string;
            the_stall_owner_has_not_set_up_payments_yet: string;
        };
        vi: {
            pay: string;
            amount_to_pay: string;
            payment: string;
            shipping_address: string;
            name: string;
            address: string;
            phone_number: string;
            email: string;
            note: string;
            continue: string;
            back: string;
            close: string;
            payment_id: string;
            price: string;
            quantity: string;
            fiat_currency: string;
            cryptocurrency: string;
            web3_wallet: string;
            connect_web3_wallet: string;
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
            connect: string;
            payment_received_success: string;
            payment_processing: string;
            something_went_wrong: string;
            invalid_payment_id: string;
            check_stripe_payment_status: string;
            check: string;
            coming_soon: string;
            payment_coming_soon: string;
            the_stall_owner_has_not_set_up_payments_yet: string;
        };
    };
    export default _default;
}
/// <amd-module name="@scom/scom-payment-widget/defaultData.ts" />
declare module "@scom/scom-payment-widget/defaultData.ts" {
    const _default_1: {
        infuraId: string;
        defaultData: {
            baseStripeApi: string;
            returnUrl: string;
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
    export default _default_1;
}
/// <amd-module name="@scom/scom-payment-widget/store.ts" />
declare module "@scom/scom-payment-widget/store.ts" {
    import { PaymentProvider, PaymentType } from "@scom/scom-payment-widget/interface.ts";
    export const STRIPE_LIB_URL = "https://js.stripe.com/v3";
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
/// <amd-module name="@scom/scom-payment-widget/model.ts" />
declare module "@scom/scom-payment-widget/model.ts" {
    import { INetworkConfig, IPaymentActivity, IPaymentInfo, IPlaceOrder, IShippingInfo } from "@scom/scom-payment-widget/interface.ts";
    import { ITokenObject } from '@scom/scom-token-list';
    import { Component } from '@ijstech/components';
    export interface IWalletModel {
        initWallet(): Promise<void>;
        isWalletConnected(): boolean;
        connectWallet(modalContainer?: Component): Promise<void>;
        disconnectWallet(): Promise<void>;
        getWalletAddress(): string;
        viewExplorerByTransactionHash(hash: string): void;
        transferToken(to: string, token: ITokenObject, amount: number, callback?: (error: Error, receipt?: string) => Promise<void>, confirmationCallback?: (receipt: any) => Promise<void>): Promise<any>;
    }
    export class Model {
        private _payment;
        private _baseStripeApi;
        private _returnUrl;
        private _wallets;
        private _networks;
        private _tokens;
        private _referenceId;
        private _networkCode;
        private _paymentMethod;
        private orderId;
        private shippingInfo;
        onPaymentSuccess: (data: IPaymentActivity) => Promise<void>;
        placeMarketplaceOrder: (data: IPlaceOrder) => Promise<void>;
        private _walletModel;
        constructor();
        get walletModel(): IWalletModel;
        set walletModel(value: IWalletModel);
        get title(): string;
        get paymentId(): string;
        get payment(): IPaymentInfo;
        set payment(value: IPaymentInfo);
        get products(): import("@scom/scom-payment-widget/interface.ts").IProduct[];
        get currency(): string;
        get stripeCurrency(): string;
        get totalPrice(): number;
        get totalShippingCost(): number;
        get totalAmount(): number;
        get stripeAmount(): number;
        get totalQuantity(): number;
        get hasPhysicalProduct(): boolean;
        get walletAddress(): string;
        get cryptoPayoutOptions(): import("@scom/scom-payment-widget/interface.ts").ICryptoPayoutOption[];
        get stripeAccountId(): string;
        get hasPayment(): boolean;
        get isShippingInfoShown(): boolean;
        get baseStripeApi(): string;
        set baseStripeApi(value: string);
        get returnUrl(): string;
        set returnUrl(value: string);
        get wallets(): any[];
        set wallets(value: any[]);
        get networks(): INetworkConfig[];
        set networks(value: INetworkConfig[]);
        get tokens(): ITokenObject[];
        set tokens(value: ITokenObject[]);
        get referenceId(): string;
        set referenceId(value: string);
        get networkCode(): string;
        set networkCode(value: string);
        get paymentMethod(): 'Stripe' | 'EVM';
        set paymentMethod(value: 'Stripe' | 'EVM');
        get placeOrder(): IPlaceOrder;
        get paymentActivity(): IPaymentActivity;
        handlePlaceMarketplaceOrder(): Promise<void>;
        handlePaymentSuccess(): Promise<void>;
        updateShippingInfo(value: IShippingInfo): void;
        createPaymentIntent(): Promise<string>;
    }
}
/// <amd-module name="@scom/scom-payment-widget/components/invoiceCreation.tsx" />
declare module "@scom/scom-payment-widget/components/invoiceCreation.tsx" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import { Model } from "@scom/scom-payment-widget/model.ts";
    interface ScomPaymentWidgetInvoiceCreationElement extends ControlElement {
        model?: Model;
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
        private lbAmount;
        private pnlPaymentId;
        private lbPaymentId;
        private carouselSlider;
        private _model;
        onContinue: () => void;
        get model(): Model;
        set model(value: Model);
        constructor(parent?: Container, options?: ScomPaymentWidgetInvoiceCreationElement);
        private renderProducts;
        private updateInfo;
        private handleContinue;
        init(): Promise<void>;
        render(): any;
    }
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
/// <amd-module name="@scom/scom-payment-widget/components/common/styledInput.tsx" />
declare module "@scom/scom-payment-widget/components/common/styledInput.tsx" {
    import { Module, ControlElement, IBorder } from "@ijstech/components";
    interface StyledInputElement extends ControlElement {
        caption: string;
        required?: boolean;
        onChanged: () => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['scom-payment-widget--styled-input']: StyledInputElement;
            }
        }
    }
    export class StyledInput extends Module {
        private styledInput;
        private lbCaption;
        private lbRequired;
        private onChanged;
        get value(): string;
        set value(value: string);
        get enabled(): boolean;
        set enabled(value: boolean);
        set inputBorder(value: IBorder);
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-payment-widget/components/common/styledComboBox.tsx" />
declare module "@scom/scom-payment-widget/components/common/styledComboBox.tsx" {
    import { Module, ControlElement, IComboItem } from "@ijstech/components";
    interface StyledComboBoxElement extends ControlElement {
        caption: string;
        required?: boolean;
        items?: IComboItem[];
        onChanged: () => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['scom-payment-widget--styled-combo-box']: StyledComboBoxElement;
            }
        }
    }
    export class StyledComboBox extends Module {
        private styledComboBox;
        private lbCaption;
        private lbRequired;
        private onChanged;
        get items(): IComboItem[];
        set items(value: IComboItem[]);
        get selectedItem(): IComboItem;
        set selectedItem(value: IComboItem);
        get enabled(): boolean;
        set enabled(value: boolean);
        init(): void;
        clear(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-payment-widget/components/common/index.ts" />
declare module "@scom/scom-payment-widget/components/common/index.ts" {
    import { PaymentHeader } from "@scom/scom-payment-widget/components/common/header.tsx";
    import { StyledInput } from "@scom/scom-payment-widget/components/common/styledInput.tsx";
    import { StyledComboBox } from "@scom/scom-payment-widget/components/common/styledComboBox.tsx";
    export { PaymentHeader, StyledInput, StyledComboBox, };
}
/// <amd-module name="@scom/scom-payment-widget/components/shippingInfo.tsx" />
declare module "@scom/scom-payment-widget/components/shippingInfo.tsx" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import { Model } from "@scom/scom-payment-widget/model.ts";
    interface ScomPaymentWidgetShippingInfoElement extends ControlElement {
        model?: Model;
        onContinue?: () => void;
        onBack?: () => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['scom-payment-widget--shipping-info']: ScomPaymentWidgetShippingInfoElement;
            }
        }
    }
    export class ShippingInfo extends Module {
        private header;
        private inputName;
        private inputAddress;
        private inputPhoneNumber;
        private inputEmail;
        private inputNote;
        private btnContinue;
        private _model;
        onContinue: () => void;
        onBack: () => void;
        get model(): Model;
        set model(value: Model);
        constructor(parent?: Container, options?: ScomPaymentWidgetShippingInfoElement);
        clear(): void;
        updateHeader(): void;
        private handleCheckInfo;
        private handlePhoneNumber;
        private validateEmail;
        private handleEmail;
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
/// <amd-module name="@scom/scom-payment-widget/components/paymentMethod.tsx" />
declare module "@scom/scom-payment-widget/components/paymentMethod.tsx" {
    import { Module, Container, ControlElement, IconName } from '@ijstech/components';
    import { PaymentProvider, PaymentType } from "@scom/scom-payment-widget/interface.ts";
    import { Model } from "@scom/scom-payment-widget/model.ts";
    interface ScomPaymentWidgetPaymentMethodElement extends ControlElement {
        model?: Model;
        onSelectedPaymentProvider?: (paymentProvider: PaymentProvider) => void;
        onBack?: () => void;
    }
    interface ScomPaymentWidgetPaymentTypeElement extends ControlElement {
        type: PaymentType;
        title: string;
        description?: string;
        iconName: IconName;
        onSelectPaymentType?: (type: PaymentType) => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['scom-payment-widget--payment-method']: ScomPaymentWidgetPaymentMethodElement;
                ['scom-payment-widget--payment-type']: ScomPaymentWidgetPaymentTypeElement;
            }
        }
    }
    export class PaymentMethod extends Module {
        private header;
        private lbPayMethod;
        private pnlPaymentType;
        private pnlFiatPayment;
        private pnlCryptoPayment;
        private pnlPaymentMethod;
        private pnlMethodItems;
        private mdAlert;
        private _model;
        onSelectedPaymentProvider: (paymentProvider: PaymentProvider) => void;
        onBack: () => void;
        get model(): Model;
        set model(value: Model);
        constructor(parent?: Container, options?: ScomPaymentWidgetPaymentMethodElement);
        private updateAmount;
        private getPaymentProviders;
        private renderMethodItems;
        private handlePaymentType;
        private handlePaymentProvider;
        private handleBack;
        updateUI(): void;
        init(): Promise<void>;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-payment-widget/wallets/evmWallet.ts" />
declare module "@scom/scom-payment-widget/wallets/evmWallet.ts" {
    import { Component } from "@ijstech/components";
    import { IClientSideProvider, INetwork } from "@ijstech/eth-wallet";
    import { ITokenObject } from "@scom/scom-token-list";
    export interface IExtendedNetwork extends INetwork {
        explorerTxUrl?: string;
        explorerAddressUrl?: string;
    }
    export interface IWalletPlugin {
        name: string;
        packageName?: string;
        provider?: IClientSideProvider;
    }
    export interface INetworkConfig {
        chainName?: string;
        chainId: number;
    }
    class EventEmitter {
        private events;
        on(event: string, listener: Function): void;
        off(event: string, listener: Function): void;
        emit(event: string, data?: any): void;
    }
    export class EVMWallet extends EventEmitter {
        private mdEVMWallet;
        private mdNetwork;
        private _wallets;
        private _networks;
        private rpcWalletEvents;
        private rpcWalletId;
        private defaultChainId;
        private defaultWallets;
        private networkMap;
        get wallets(): IWalletPlugin[];
        set wallets(value: IWalletPlugin[]);
        get networks(): INetworkConfig[];
        set networks(value: INetworkConfig[]);
        constructor();
        setData(data: {
            wallets: IWalletPlugin[];
            networks: INetworkConfig[];
            defaultChainId: number;
        }): void;
        initWallet(): Promise<void>;
        private removeRpcWalletEvents;
        private initRpcWallet;
        resetRpcWallet(): Promise<void>;
        getWalletAddress(): string;
        getRpcWallet(): import("@ijstech/eth-wallet").IRpcWallet;
        connectWallet(modalContainer: Component): Promise<void>;
        openNetworkModal(modalContainer: Component): Promise<void>;
        isWalletConnected(): boolean;
        isNetworkConnected(): boolean;
        switchNetwork(): Promise<void>;
        disconnectWallet(): Promise<void>;
        getNetworkInfo(chainId?: number): IExtendedNetwork;
        viewExplorerByAddress(address: string): void;
        viewExplorerByTransactionHash(hash: string): void;
        transferToken(to: string, token: ITokenObject, amount: number, callback?: (error: Error, receipt?: string) => Promise<void>, confirmationCallback?: (receipt: any) => Promise<void>): Promise<string>;
    }
}
/// <amd-module name="@scom/scom-payment-widget/wallets/tonWallet.ts" />
declare module "@scom/scom-payment-widget/wallets/tonWallet.ts" {
    import { ITokenObject } from "@scom/scom-token-list";
    export class TonWallet {
        private toncore;
        private tonConnectUI;
        private _isWalletConnected;
        private _onTonWalletStatusChanged;
        constructor(moduleDir: string, onTonWalletStatusChanged: (isConnected: boolean) => void);
        isWalletConnected(): boolean;
        loadLib(moduleDir: string): Promise<unknown>;
        initWallet(): Promise<void>;
        connectWallet(): Promise<void>;
        disconnectWallet(): Promise<void>;
        sendTransaction(txData: any): Promise<any>;
        constructPayloadForTokenTransfer(to: string, token: ITokenObject, amount: number): any;
        getWalletAddress(): any;
        viewExplorerByTransactionHash(hash: string): void;
        getTonBalance(): Promise<import("@ijstech/eth-wallet").BigNumber>;
        transferToken(to: string, token: ITokenObject, amount: number, callback?: (error: Error, receipt?: string) => Promise<void>, confirmationCallback?: (receipt: any) => Promise<void>): Promise<any>;
    }
}
/// <amd-module name="@scom/scom-payment-widget/wallets/index.ts" />
declare module "@scom/scom-payment-widget/wallets/index.ts" {
    export * from "@scom/scom-payment-widget/wallets/evmWallet.ts";
    export * from "@scom/scom-payment-widget/wallets/tonWallet.ts";
}
/// <amd-module name="@scom/scom-payment-widget/components/statusPayment.tsx" />
declare module "@scom/scom-payment-widget/components/statusPayment.tsx" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import { IPaymentStatus } from "@scom/scom-payment-widget/interface.ts";
    import { Model } from "@scom/scom-payment-widget/model.ts";
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
        private _model;
        onClose: (status: string) => void;
        constructor(parent?: Container, options?: ScomPaymentWidgetStatusPaymentElement);
        set model(data: Model);
        get model(): Model;
        private getStatusText;
        updateStatus(info: IPaymentStatus): void;
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
    import { Model } from "@scom/scom-payment-widget/model.ts";
    interface ScomPaymentWidgetStripePaymentElement extends ControlElement {
        model?: Model;
        onBack?: () => void;
        onClose?: () => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['scom-payment-widget--stripe-payment']: ScomPaymentWidgetStripePaymentElement;
            }
        }
    }
    export class StripePayment extends Module {
        private _model;
        private stripe;
        private stripeElements;
        private btnCheckout;
        private btnBack;
        private header;
        private mdAlert;
        private publishableKey;
        onClose: () => void;
        onBack: () => void;
        constructor(parent?: Container, options?: ScomPaymentWidgetStripePaymentElement);
        set model(data: Model);
        get model(): Model;
        private updateAmount;
        private initStripePayment;
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
    import { IPaymentStatus, PaymentProvider } from "@scom/scom-payment-widget/interface.ts";
    import { ITokenObject } from '@scom/scom-token-list';
    import { Model } from "@scom/scom-payment-widget/model.ts";
    interface ScomPaymentWidgetWalletPaymentElement extends ControlElement {
        model?: Model;
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
        private lbWallet;
        private imgCurrentWallet;
        private lbCurrentAddress;
        private imgCurrentNetwork;
        private lbCurrentNetwork;
        private _model;
        private isToPay;
        private copyAddressTimer;
        private copyAmountTimer;
        private iconCopyAddress;
        private iconCopyAmount;
        private provider;
        private pnlEVMWallet;
        private selectedToken;
        onBack: () => void;
        onPaid: (paymentStatus: IPaymentStatus) => void;
        constructor(parent?: Container, options?: ScomPaymentWidgetWalletPaymentElement);
        get model(): Model;
        set model(value: Model);
        get tokens(): ITokenObject[];
        get wallets(): any[];
        get networks(): import("@scom/scom-payment-widget/interface.ts").INetworkConfig[];
        onStartPayment(provider: PaymentProvider): Promise<void>;
        private handleTonWalletStatusChanged;
        private handleEVMWalletConnected;
        private handleEVMWalletChainChanged;
        private showFirstScreen;
        private updateAmount;
        private checkWalletStatus;
        private renderErcTokens;
        private renderTonToken;
        private handleConnectWallet;
        private handleShowNetworks;
        private handleSelectToken;
        private handleCopyAddress;
        private handleDisconnectWallet;
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
    import { Model } from "@scom/scom-payment-widget/model.ts";
    interface ScomPaymentWidgetPaymentElement extends ControlElement {
        model?: Model;
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
        private shippingInfo;
        private paymentMethod;
        private walletPayment;
        private stripePayment;
        private statusPayment;
        private _model;
        private isModal;
        get model(): Model;
        set model(value: Model);
        show(isModal?: boolean): void;
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
    import { ShippingInfo } from "@scom/scom-payment-widget/components/shippingInfo.tsx";
    import { InvoiceCreation } from "@scom/scom-payment-widget/components/invoiceCreation.tsx";
    import { PaymentMethod } from "@scom/scom-payment-widget/components/paymentMethod.tsx";
    import { WalletPayment } from "@scom/scom-payment-widget/components/walletPayment.tsx";
    import { StatusPayment } from "@scom/scom-payment-widget/components/statusPayment.tsx";
    import { StripePayment } from "@scom/scom-payment-widget/components/stripePayment.tsx";
    import { StatusPaymentTracking } from "@scom/scom-payment-widget/components/stripePaymentTracking.tsx";
    export { PaymentModule, ShippingInfo, InvoiceCreation, PaymentMethod, WalletPayment, StripePayment, StatusPaymentTracking, StatusPayment };
}
/// <amd-module name="@scom/scom-payment-widget" />
declare module "@scom/scom-payment-widget" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import { INetworkConfig, IPaymentActivity, IPaymentInfo, IPlaceOrder, ProductType, IProduct } from "@scom/scom-payment-widget/interface.ts";
    import { ITokenObject } from "@scom/scom-token-list";
    import { IWalletPlugin } from '@scom/scom-wallet-modal';
    export { IProduct, ProductType, IPlaceOrder, IPaymentActivity };
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
        returnUrl?: string;
        mode?: Mode;
        placeMarketplaceOrder?: (data: IPlaceOrder) => Promise<void>;
        onPaymentSuccess?: (data: IPaymentActivity) => Promise<void>;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-payment-widget']: ScomPaymentWidgetElement;
            }
        }
    }
    export class ScomPaymentWidget extends Module {
        private model;
        private pnlWrapper;
        private btnPay;
        private statusPaymentTracking;
        private paymentModule;
        private _mode;
        private _showButtonPay;
        private _payButtonCaption;
        private isUrl;
        placeMarketplaceOrder: (data: IPlaceOrder) => Promise<void>;
        onPaymentSuccess: (data: IPaymentActivity) => Promise<void>;
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
        get returnUrl(): string;
        set returnUrl(value: string);
        get wallets(): IWalletPlugin[];
        set wallets(value: IWalletPlugin[]);
        get networks(): INetworkConfig[];
        set networks(value: INetworkConfig[]);
        get tokens(): ITokenObject[];
        set tokens(value: ITokenObject[]);
        onStartPayment(payment?: IPaymentInfo): void;
        private openPaymentModal;
        private handlePay;
        private updateUIByMode;
        private handleWidgetUrl;
        private initModel;
        init(): Promise<void>;
        render(): any;
    }
}
