import {
    Module,
    Styles,
    customElements,
    ControlElement,
    Container,
    Button,
} from '@ijstech/components';

const Theme = Styles.Theme.ThemeVars;

type CreateInvoiceBody = {
    title: string;
    description: string;
    currency: string;
    photoUrl: string;
    payload: string;
    prices: { label: string; amount: number }[];
}

interface ScomTelegramPayWidgetElement extends ControlElement {
    data: CreateInvoiceBody;
    botAPIEndpoint: string;
    onPaymentSuccess: () => Promise<void>;
    payBtnCaption?: string;
}


declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-telegram-pay-widget']: ScomTelegramPayWidgetElement;
        }
    }
}

@customElements('i-scom-telegram-pay-widget')
export class ScomTelegramPayWidget extends Module {

    private _invoiceData: CreateInvoiceBody;
    private botAPIEndpoint: string;
    private onPaymentSuccess: () => Promise<void>;
    private payBtnCaption: string;
    private btnPayNow: Button;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    static async create(options?: ScomTelegramPayWidgetElement, parent?: Container) {
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
        this.btnPayNow.caption = payBtnCaption;
    }

    set invoiceData(data: CreateInvoiceBody) {
        this._invoiceData = data;
    }

    get invoiceData() {
        return this._invoiceData;
    }

    private async getInvoiceLink() {
        if(!this._invoiceData) {
            console.error('Invoice data is empty.');
            return;
        }
        const response = await fetch(`${this.botAPIEndpoint}/invoice`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this._invoiceData)
        });
        if(response.ok) {
            const data = await response.json();
            if(data.success) {
                return data.data.invoiceLink;
            }
            else return '';
        }
    }

    private async handlePayClick() {
        const telegram = (window as any).Telegram;
        if(telegram) {
            const app = telegram.WebApp;
            if(app) {
                const invoiceLink = await this.getInvoiceLink();
                if(invoiceLink) {
                    app.openInvoice(invoiceLink, this.onPaymentSuccess);
                }
            }
        }
    }

    render() {
        return (
            <i-stack direction="vertical">
                <i-button id="btnPayNow" onClick={this.handlePayClick} caption={this.payBtnCaption || 'Pay'} padding={{top: 10, bottom: 10, left: 10, right: 10}} width={'100%'}/>
            </i-stack>
        );
    }
}
