import { Module, Container, customElements, ControlElement, Styles, Label, FormatUtils, Button, Checkbox } from '@ijstech/components';
import { checkboxTextStyle, textCenterStyle } from './index.css';
import { IPaymentInfo } from '../interface';
const Theme = Styles.Theme.ThemeVars;

interface ScomPaymentWidgetInvoiceCreationElement extends ControlElement {
    payment?: IPaymentInfo;
    onContinue?: () => void;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['scom-payment-widget--invoice-creation']: ScomPaymentWidgetInvoiceCreationElement;
        }
    }
}

@customElements('scom-payment-widget--invoice-creation')
export class InvoiceCreation extends Module {
    private lbAmount: Label;
    private pnlPaymentId: Label;
    private lbPaymentId: Label;
    private checkboxAgree: Checkbox;
    private btnContinue: Button;
    private _payment: IPaymentInfo = { title: '', paymentId: '', amount: 0 };
    public onContinue: () => void;

    get payment() {
        return this._payment;
    }

    set payment(value: IPaymentInfo) {
        this._payment = value;
        this.updateInfo();
    }

    constructor(parent?: Container, options?: ScomPaymentWidgetInvoiceCreationElement) {
        super(parent, options);
    }

    private updateInfo() {
        const { paymentId, amount, currency } = this.payment;
        if (this.lbAmount) {
            this.lbAmount.caption = `${FormatUtils.formatNumber(amount || 0, { decimalFigures: 2 })} ${currency || 'USD'}`;
        }
        if (this.pnlPaymentId) {
            const _paymentId = paymentId || ''; 
            this.pnlPaymentId.visible = !!_paymentId;
            this.lbPaymentId.caption = _paymentId;
        }   
        if (this.checkboxAgree.checked) {
            this.checkboxAgree.checked = false;
            this.btnContinue.enabled = false;
        }
    }

    private handleCheckboxChanged() {
        const checked = this.checkboxAgree.checked;
        this.btnContinue.enabled = checked;
    }

    private handleContinue() {
        if (this.onContinue) this.onContinue();
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
        return <i-stack direction="vertical" gap="1rem" height="100%" alignItems="center" padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}>
            <i-stack direction="vertical" gap="1rem" height="100%">
                <i-stack direction="vertical" gap="1rem" alignItems="center" width="100%">
                    <i-stack direction="vertical" gap="0.5rem" alignItems="center">
                        <i-label caption="Amount to pay" font={{ color: Theme.text.primary, bold: true, transform: 'uppercase' }} />
                        <i-label id="lbAmount" class={textCenterStyle} font={{ size: '1.25rem', color: Theme.colors.primary.main, bold: true }} />
                    </i-stack>
                    <i-stack id="pnlPaymentId" visible={false} direction="vertical" gap="0.25rem" alignItems="center">
                        <i-label caption="Payment ID" font={{ color: Theme.text.primary, bold: true, transform: 'uppercase' }} />
                        <i-label id="lbPaymentId" class={textCenterStyle} font={{ color: Theme.text.primary, bold: true, transform: 'uppercase' }} />
                    </i-stack>
                    <i-panel width="80%" height={1} background={{ color: Theme.divider }} />
                </i-stack>
                <i-stack direction="vertical" gap="1rem" alignItems="center" margin={{ top: '1rem' }}>
                    <i-label
                        caption="We just need your email to inform you of payment details and possible refunds."
                        font={{ size: '0.75rem', color: Theme.colors.primary.main }}
                        class={textCenterStyle}
                    />
                    <i-stack
                        direction="vertical"
                        gap="0.25rem"
                        width="100%"
                        background={{ color: Theme.input.background }}
                        padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}
                        border={{ radius: 8 }}
                    >
                        <i-label caption="Your email" font={{ size: '0.75rem', color: Theme.input.fontColor }} />
                        <i-input background={{ color: 'transparent' }} padding={{ left: '0.25rem', right: '0.25rem' }} border={{ radius: 4, width: 1, style: 'solid', color: Theme.divider }} height={32} width="100%" />
                    </i-stack>
                </i-stack>
                <i-stack direction="horizontal" gap="0.25rem">
                    <i-checkbox id="checkboxAgree" onChanged={this.handleCheckboxChanged} />
                    <i-label
                        caption="I have read and accept the <a href='' target='_blank'>Terms of Service</a> and <a href='' target='_blank'>Privacy Policy</a>"
                        class={checkboxTextStyle}
                    />
                </i-stack>
            </i-stack>
            <i-button
                id="btnContinue"
                enabled={false}
                width="100%"
                maxWidth={180}
                caption="Continue"
                padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
                font={{ size: '1rem', color: Theme.colors.primary.contrastText }}
                background={{ color: Theme.colors.primary.main }}
                border={{ radius: 12 }}
                rightIcon={{ name: 'arrow-right', visible: true }}
                onClick={this.handleContinue}
            />
        </i-stack>
    }
}