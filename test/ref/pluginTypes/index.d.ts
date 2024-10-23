/// <amd-module name="@scom/scom-payment-widget" />
declare module "@scom/scom-payment-widget" {
    import { Module, ControlElement, Container, IFont } from '@ijstech/components';
    type CreateInvoiceBody = {
        title: string;
        description?: string;
        currency?: string;
        photoUrl?: string;
        payload?: string;
        prices?: {
            label: string;
            amount: number | string;
        }[];
        amount: number;
    };
    interface ScomPaymentWidgetElement extends ControlElement {
        data?: CreateInvoiceBody;
        botAPIEndpoint: string;
        onPaymentSuccess: (status: string) => Promise<void>;
        payBtnCaption?: string;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-payment-widget']: ScomPaymentWidgetElement;
            }
        }
    }
    export class ScomPaymentWidget extends Module {
        private _invoiceData;
        private botAPIEndpoint;
        private onPaymentSuccess;
        private _payBtnCaption;
        private btnPayNow;
        private pnlStripe;
        private pnlStripePaymentForm;
        private pnlPaymentOptions;
        private stripe;
        private stripeElements;
        private lbAmount;
        private lbStripeDetailProductName;
        private lbStripeDetailProductAmount;
        private imgStripeDetailProductImage;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomPaymentWidgetElement, parent?: Container): Promise<ScomPaymentWidget>;
        clear(): void;
        init(): void;
        initStripePayment(): Promise<void>;
        set invoiceData(data: CreateInvoiceBody);
        get invoiceData(): CreateInvoiceBody;
        set payBtnCaption(value: string);
        get payBtnCaption(): string;
        get font(): IFont;
        set font(value: IFont);
        private updateInvoiceUI;
        private getInvoiceLink;
        private handlePayClick;
        private handlePayWithStripeClick;
        private updateStripeDetailUI;
        private handleStripeCheckoutClick;
        render(): any;
    }
}
