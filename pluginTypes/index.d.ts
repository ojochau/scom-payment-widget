/// <amd-module name="@scom/scom-payment-widget" />
declare module "@scom/scom-payment-widget" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    type CreateInvoiceBody = {
        title: string;
        description: string;
        currency: string;
        photoUrl: string;
        payload: string;
        prices: {
            label: string;
            amount: number;
        }[];
    };
    interface ScomTelegramPayWidgetElement extends ControlElement {
        data?: CreateInvoiceBody;
        botAPIEndpoint: string;
        onPaymentSuccess: () => Promise<void>;
        payBtnCaption?: string;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-telegram-pay-widget']: ScomTelegramPayWidgetElement;
            }
        }
    }
    export class ScomTelegramPayWidget extends Module {
        private _invoiceData;
        private botAPIEndpoint;
        private onPaymentSuccess;
        private payBtnCaption;
        private btnPayNow;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomTelegramPayWidgetElement, parent?: Container): Promise<ScomTelegramPayWidget>;
        clear(): void;
        init(): void;
        set invoiceData(data: CreateInvoiceBody);
        get invoiceData(): CreateInvoiceBody;
        private getInvoiceLink;
        private handlePayClick;
        render(): any;
    }
}
