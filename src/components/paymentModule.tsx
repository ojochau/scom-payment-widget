import { Module, customElements, ControlElement } from '@ijstech/components';
import { State } from '../store';
import { IPaymentStatus, PaymentProvider } from '../interface';
import { InvoiceCreation } from './invoiceCreation';
import { ShippingInfo } from './shippingInfo';
import { PaymentMethod } from './paymentMethod';
import { StatusPayment } from './statusPayment';
import { StripePayment } from './stripePayment';
import { WalletPayment } from './walletPayment';
import ScomDappContainer from '@scom/scom-dapp-container';
import { elementStyle } from './index.css';
import { Model } from '../model';

interface ScomPaymentWidgetPaymentElement extends ControlElement {
    model?: Model;
    state?: State;
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
    private shippingInfo: ShippingInfo;
    private paymentMethod: PaymentMethod;
    private walletPayment: WalletPayment;
    private stripePayment: StripePayment;
    private statusPayment: StatusPayment;
    private _dappContainer: ScomDappContainer;
    private _state: State;
    private _model: Model;
    private isModal: boolean;

    get model() {
        return this._model;
    }

    set model(value: Model) {
        this._model = value;
    }

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

    show(isModal: boolean = true) {
        this.invoiceCreation.model = this.model;
        this.invoiceCreation.visible = true;
        this.shippingInfo.model = this.model;
        this.shippingInfo.visible = false;
        this.paymentMethod.model = this.model;
        this.paymentMethod.visible = false;
        this.walletPayment.visible = false;
        this.walletPayment.model = this.model;
        this.walletPayment.state = this.state;
        this.walletPayment.dappContainer = this.dappContainer;
        this.stripePayment.model = this.model;
        this.stripePayment.visible = false;
        this.statusPayment.visible = false;
        this.isModal = isModal;
    }

    async init() {
        await super.init();
        const state = this.getAttribute('state', true);
        const model = this.getAttribute('model', true);
        if (state) this.state = state;
        if (model) this.model = model;
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
        this.paymentMethod.onSelectedPaymentProvider = (paymentProvider: PaymentProvider) => {
            this.paymentMethod.visible = false;
            if (paymentProvider === PaymentProvider.Metamask || paymentProvider === PaymentProvider.TonWallet) {
                this.paymentMethod.visible = false;
                this.walletPayment.onStartPayment(paymentProvider);
                this.walletPayment.visible = true;
            } else {
                this.stripePayment.visible = true;
            }
        };
        this.paymentMethod.onBack = () => {
            const isShippingInfoShown = this.model.isShippingInfoShown;
            this.paymentMethod.visible = false;
            this.invoiceCreation.visible = !isShippingInfoShown;
            this.shippingInfo.visible = isShippingInfoShown;
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
        this.stripePayment.onClose = () => {
            if (this.isModal) this.closeModal();
            window.location.assign(`${this.model.returnUrl}/${this.model.paymentActivity.orderId || ''}`)
        }
        this.statusPayment.onClose = () => {
            if (this.isModal) this.closeModal();
            window.location.assign(`${this.model.returnUrl}/${this.model.paymentActivity.orderId || ''}`);
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
                <scom-payment-widget--shipping-info id="shippingInfo" visible={false} class={elementStyle} />
                <scom-payment-widget--payment-method id="paymentMethod" visible={false} class={elementStyle} />
                <scom-payment-widget--wallet-payment id="walletPayment" visible={false} class={elementStyle} />
                <scom-payment-widget--stripe-payment id="stripePayment" visible={false} class={elementStyle} />
                <scom-payment-widget--status-payment id="statusPayment" visible={false} class={elementStyle} />
            </i-stack>
        )
    }
}