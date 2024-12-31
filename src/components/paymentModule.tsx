import { Module, customElements, ControlElement, StackLayout } from '@ijstech/components';
import { IPaymentStatus, PaymentProvider } from '../interface';
import { InvoiceCreation } from './invoiceCreation';
import { ShippingInfo } from './shippingInfo';
import { PaymentMethod } from './paymentMethod';
import { StatusPayment } from './statusPayment';
import { StripePayment } from './stripePayment';
import { WalletPayment } from './walletPayment';
import { elementStyle } from './index.css';
import { Model } from '../model';

interface ScomPaymentWidgetPaymentElement extends ControlElement {
    model?: Model;
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
    private pnlPaymentModule: StackLayout;
    private invoiceCreation: InvoiceCreation;
    private shippingInfo: ShippingInfo;
    private paymentMethod: PaymentMethod;
    private walletPayment: WalletPayment;
    private stripePayment: StripePayment;
    private statusPayment: StatusPayment;
    private _model: Model;
    private isModal: boolean;

    get model() {
        return this._model;
    }

    set model(value: Model) {
        this._model = value;
    }

    show(isModal: boolean = true) {
        this.invoiceCreation.model = this.model;
        this.invoiceCreation.visible = true;
        this.shippingInfo.model = this.model;
        this.shippingInfo.visible = false;
        this.paymentMethod.model = this.model;
        this.paymentMethod.visible = false;
        this.statusPayment.model = this.model;
        this.statusPayment.visible = false;
        if (this.walletPayment) this.walletPayment.visible = false;
        if (this.stripePayment) this.stripePayment.visible = false;
        this.isModal = isModal;
        this.model.isCompleted = false;
    }

    private processCompletedHandler() {
        if (this.isModal) {
            this.closeModal();
        } else {
            this.model.processCompletedHandler();
        }
    }

    async init() {
        await super.init();
        const model = this.getAttribute('model', true);
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
        this.paymentMethod.onSelectedPaymentProvider = async (paymentProvider: PaymentProvider) => {
            if (paymentProvider === PaymentProvider.Metamask || paymentProvider === PaymentProvider.TonWallet) {
                if (!this.walletPayment) {
                    this.walletPayment = new WalletPayment(undefined, { visible: false, class: elementStyle });
                    this.walletPayment.model = this.model;
                    this.walletPayment.onPaid = (paymentStatus: IPaymentStatus) => {
                        this.walletPayment.visible = false;
                        this.statusPayment.visible = true;
                        this.statusPayment.updateStatus(paymentStatus);
                    }
                    this.walletPayment.onBack = () => {
                        this.paymentMethod.visible = true;
                        this.walletPayment.visible = false;
                    };
                    this.statusPayment.onClose = this.processCompletedHandler.bind(this);
                    this.pnlPaymentModule.append(this.walletPayment);
                }
                await this.walletPayment.onStartPayment(paymentProvider);
                this.paymentMethod.visible = false;
                this.walletPayment.visible = true;
                
            } 
            else {
                if (!this.stripePayment) {
                    this.stripePayment = new StripePayment(undefined, { visible: false, class: elementStyle });
                    this.stripePayment.model = this.model;
                    this.stripePayment.onBack = () => {
                        this.paymentMethod.visible = true;
                        this.stripePayment.visible = false;
                    }
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
        return (
            <i-stack
                id="pnlPaymentModule"
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
                <scom-payment-widget--status-payment id="statusPayment" visible={false} class={elementStyle} />
            </i-stack>
        )
    }
}