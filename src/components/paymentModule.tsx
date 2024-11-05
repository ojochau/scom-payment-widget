import { Module, customElements, ControlElement, Styles } from '@ijstech/components';
import { State } from '../store';
import configData from '../data';
import { INetworkConfig, IPaymentInfo, IPaymentStatus, PaymentProvider } from '../interface';
import { InvoiceCreation } from './invoiceCreation';
import { PaymentMethod } from './paymentMethod';
import { StatusPayment } from './statusPayment';
import { StripePayment } from './stripePayment';
import { WalletPayment } from './walletPayment';
import { IWalletPlugin } from '@scom/scom-wallet-modal';
import { ITokenObject } from '@scom/scom-token-list';
import ScomDappContainer from '@scom/scom-dapp-container';
import { elementStyle } from './index.css';
const Theme = Styles.Theme.ThemeVars;

interface ScomPaymentWidgetPaymentElement extends ControlElement {
    state?: State;
    wallets?: IWalletPlugin[];
    networks?: INetworkConfig[];
    tokens?: ITokenObject[];
    baseStripeApi?: string;
    urlStripeTracking?: string;
    onPaymentSuccess?: (status: string) => Promise<void>;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['scom-payment-widget--payment-module']: ScomPaymentWidgetPaymentElement;
        }
    }
}

@customElements('scom-payment-widget--payment-module')
export class PaymentModule extends Module {
    private invoiceCreation: InvoiceCreation;
    private paymentMethod: PaymentMethod;
    private walletPayment: WalletPayment;
    private stripePayment: StripePayment;
    private statusPayment: StatusPayment;
    private _dappContainer: ScomDappContainer;
    private _state: State;
    private _baseStripeApi: string;
    private _urlStripeTracking: string;
    private _wallets: IWalletPlugin[] = [];
    private _networks: INetworkConfig[] = [];
    private _tokens: ITokenObject[] = [];
    public onPaymentSuccess: (status: string) => Promise<void>;

    get dappContainer() {
        return this._dappContainer;
    }

    set dappContainer(container: ScomDappContainer) {
        this._dappContainer = container;
    }

    get state() {
        return this._state;
    }

    set state(value: State) {
        this._state = value;
    }

    get baseStripeApi() {
        return this._baseStripeApi;
    }

    set baseStripeApi(value: string) {
        this._baseStripeApi = value;
        if (this.stripePayment) this.stripePayment.baseStripeApi = value;
    }

    get urlStripeTracking() {
        return this._urlStripeTracking;
    }

    set urlStripeTracking(value: string) {
        this._urlStripeTracking = value;
        if (this.stripePayment) this.stripePayment.urlStripeTracking = value;
    }

    get wallets() {
        return this._wallets ?? configData.defaultData.wallets;
    }

    set wallets(value: IWalletPlugin[]) {
        this._wallets = value;
    }

    get networks() {
        return this._networks ?? configData.defaultData.networks;
    }

    set networks(value: INetworkConfig[]) {
        this._networks = value;
    }

    get tokens() {
        return this._tokens ?? configData.defaultData.tokens;
    }

    set tokens(value: ITokenObject[]) {
        this._tokens = value;
    }

    show(payment: IPaymentInfo) {
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
    }

    async init() {
        await super.init();
        const state = this.getAttribute('state', true);
        if (state) this.state = state;
        const baseStripeApi = this.getAttribute('baseStripeApi', true);
        if (baseStripeApi) this.baseStripeApi = baseStripeApi;
        const urlStripeTracking = this.getAttribute('urlStripeTracking', true);
        if (urlStripeTracking) this.urlStripeTracking = urlStripeTracking;
        this.invoiceCreation.onContinue = () => {
            this.invoiceCreation.visible = false;
            this.paymentMethod.visible = true;
        };
        this.paymentMethod.onSelectedPaymentProvider = (payment: IPaymentInfo, paymentProvider: PaymentProvider) => {
            this.paymentMethod.visible = false;
            if (paymentProvider === PaymentProvider.Metamask || paymentProvider === PaymentProvider.TonWallet) {
                this.paymentMethod.visible = false;
                this.walletPayment.wallets = this.wallets;
                this.walletPayment.networks = this.networks;
                this.walletPayment.tokens = this.tokens;
                this.walletPayment.onStartPayment({
                    ...payment,
                    provider: paymentProvider
                })
                this.walletPayment.visible = true;
            } else {
                this.stripePayment.visible = true;
            }
        };
        this.paymentMethod.onBack = () => {
            this.paymentMethod.visible = false;
            this.invoiceCreation.visible = true;
        };
        this.walletPayment.onPaid = (paymentStatus: IPaymentStatus) => {
            this.walletPayment.visible = false;
            this.statusPayment.visible = true;
            this.statusPayment.updateStatus(this.state, paymentStatus);
        }
        this.walletPayment.onBack = () => {
            this.paymentMethod.visible = true;
            this.walletPayment.visible = false;
        };
        this.stripePayment.onBack = () => {
            this.paymentMethod.visible = true;
            this.stripePayment.visible = false;
        }
        this.stripePayment.onPaymentSuccess = (status: string) => {
            if (this.onPaymentSuccess) this.onPaymentSuccess(status);
        }
        this.stripePayment.baseStripeApi = this.baseStripeApi;
        this.stripePayment.urlStripeTracking = this.urlStripeTracking;
        this.statusPayment.onClose = (status: string) => {
            if (this.onPaymentSuccess) this.onPaymentSuccess(status);
        }
    }

    render() {
        return (
            <i-stack
                margin={{ top: '1rem' }}
                direction="vertical"
                width="100%"
                minHeight={480}
                border={{ radius: 12, style: 'solid', width: 1, color: '#ffffff4d' }}
                overflow="hidden"
            >
                <scom-payment-widget--invoice-creation id="invoiceCreation" visible={false} class={elementStyle} />
                <scom-payment-widget--payment-method id="paymentMethod" visible={false} class={elementStyle} />
                <scom-payment-widget--wallet-payment id="walletPayment" visible={false} class={elementStyle} />
                <scom-payment-widget--stripe-payment id="stripePayment" visible={false} class={elementStyle} />
                <scom-payment-widget--status-payment id="statusPayment" visible={false} class={elementStyle} />
            </i-stack>
        )
    }
}