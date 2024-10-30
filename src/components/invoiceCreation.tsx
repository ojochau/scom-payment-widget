import { Module, Container, customElements, ControlElement, Styles, Label, FormatUtils, Button, Checkbox, StackLayout, Image } from '@ijstech/components';
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
    private pnlItemInfo: StackLayout;
    private lbItem: Label;
    private imgItem: Image;
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
        const { paymentId, amount, currency, title, photoUrl } = this.payment;
        if (this.pnlItemInfo) {
            const hasTitle = !!title;
            const hasImg = !!photoUrl;
            this.pnlItemInfo.visible = hasTitle || hasImg;
            this.lbItem.caption = title || '';
            this.lbItem.visible = hasTitle;
            this.imgItem.url = photoUrl || '';
            this.imgItem.visible = hasImg;
        }
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
            <i-stack direction="vertical" height="100%">
                <i-stack id="pnlItemInfo" visible={false} direction="vertical" gap="1rem" alignItems="center" width="100%" margin={{ bottom: '1rem' }}>
                    <i-label id="lbItem" class={textCenterStyle} font={{ size: '1.25rem', color: Theme.colors.primary.main, bold: true, transform: 'uppercase' }} />
                    <i-image id="imgItem" width="auto" maxWidth="80%" height={80} />
                    <i-panel height={1} width="80%" background={{ color: Theme.divider }} />
                </i-stack>
                <i-stack direction="vertical" gap="1rem" alignItems="center" width="100%" margin={{ bottom: '1.5rem' }}>
                    <i-stack direction="vertical" gap="0.5rem" alignItems="center">
                        <i-label caption="Amount to pay" font={{ color: Theme.text.primary, bold: true, transform: 'uppercase' }} />
                        <i-label id="lbAmount" class={textCenterStyle} font={{ size: '1.25rem', color: Theme.colors.primary.main, bold: true }} />
                    </i-stack>
                    <i-stack id="pnlPaymentId" visible={false} direction="vertical" gap="0.25rem" alignItems="center">
                        <i-label caption="Payment ID" font={{ color: Theme.text.primary, bold: true, transform: 'uppercase' }} />
                        <i-label id="lbPaymentId" class={textCenterStyle} font={{ color: Theme.text.primary, bold: true, transform: 'uppercase' }} />
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