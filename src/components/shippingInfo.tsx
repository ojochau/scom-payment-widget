import { Module, Container, customElements, ControlElement, Styles, Button, Input } from '@ijstech/components';
import { halfWidthButtonStyle, textCenterStyle } from './index.css';
import { StyledInput, PaymentHeader } from './common/index';
import translations from '../translations.json';
import { Model } from '../model';
const Theme = Styles.Theme.ThemeVars;

interface ScomPaymentWidgetShippingInfoElement extends ControlElement {
    model?: Model;
    onContinue?: () => void;
    onBack?: () => void;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['scom-payment-widget--shipping-info']: ScomPaymentWidgetShippingInfoElement;
        }
    }
}

@customElements('scom-payment-widget--shipping-info')
export class ShippingInfo extends Module {
    private header: PaymentHeader;
    private inputName: StyledInput;
    private inputAddress: StyledInput;
    private inputPhoneNumber: StyledInput;
    private inputEmail: StyledInput;
    private inputNote: Input;

    private btnContinue: Button;
    private _model: Model;
    public onContinue: () => void;
    public onBack: () => void;

    get model() {
        return this._model;
    }

    set model(value: Model) {
        this._model = value;
        this.updateHeader();
    }

    constructor(parent?: Container, options?: ScomPaymentWidgetShippingInfoElement) {
        super(parent, options);
    }

    clear() {
        this.inputName.value = '';
        this.inputPhoneNumber.value = '';
        this.inputEmail.value = '';
        this.inputAddress.value = '';
        this.inputNote.value = '';
        this.btnContinue.enabled = false;
    }

    updateHeader() {
        if (this.model && this.header) {
            const { title, currency, totalAmount } = this.model;
            this.header.setHeader(title, currency, totalAmount);
        }
    }

    private handleCheckInfo() {
        const isValid = !!(this.inputName.value && this.inputAddress.value && this.validateEmail(this.inputEmail.value));
        this.btnContinue.enabled = isValid;
    }

    private handlePhoneNumber() {
        const value = this.inputPhoneNumber.value;
        this.inputPhoneNumber.value = value.replace(/[^0-9]/g, '');
        this.handleCheckInfo();
    }

    private validateEmail(email: string) {
        if (!email) return true;
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailPattern.test(email);
    }

    private handleEmail() {
        this.inputEmail.inputBorder = { radius: 5, width: 1, style: 'solid', color: this.validateEmail(this.inputEmail.value) ? 'transparent' : Theme.colors.error.dark };
        this.handleCheckInfo();
    }

    private handleContinue() {
        this.model.updateShippingInfo({
            name: this.inputName.value || '',
            address: this.inputAddress.value || '',
            message: this.inputNote.value || '',
            contact: {
                nostr: '',
                phone: this.inputPhoneNumber.value || '',
                email: this.inputEmail.value || ''
            },
            // shippingId: ''
        })
        if (this.onContinue) this.onContinue();
    }

    private handleBack() {
        if (this.onBack) this.onBack();
    }

    async init() {
        this.i18n.init({ ...translations });
        super.init();
        this.onContinue = this.getAttribute('onContinue', true) || this.onContinue;
        this.onBack = this.getAttribute('onBack', true) || this.onBack;
        const model = this.getAttribute('model', true);
        if (model) {
            this.model = model;
        }
        this.updateHeader();
    }

    render() {
        return <i-stack direction="vertical" gap="1rem" width="100%" alignItems="center" padding={{ bottom: '1rem' }}>
            <scom-payment-widget--header id="header" />
            <i-stack gap="1rem" direction="vertical" height="100%" width="100%" padding={{ left: '1rem', right: '1rem' }}>
                <i-label caption="$shipping_address" class={textCenterStyle} font={{ size: '1.25rem', color: Theme.colors.primary.main, bold: true }} />
                <scom-payment-widget--styled-input
                    id="inputName"
                    caption="$name"
                    required={true}
                    onChanged={this.handleCheckInfo}
                />
                <scom-payment-widget--styled-input
                    id="inputAddress"
                    caption="$address"
                    required={true}
                    onChanged={this.handleCheckInfo}
                />
                <scom-payment-widget--styled-input
                    id="inputPhoneNumber"
                    caption="$phone_number"
                    onChanged={this.handlePhoneNumber}
                />
                <scom-payment-widget--styled-input
                    id="inputEmail"
                    caption="$email"
                    onChanged={this.handleEmail}
                />
                <i-hstack gap="0.5rem" width="100%" verticalAlignment="center" wrap="wrap" horizontalAlignment="space-between">
                    <i-label caption="$note" />
                    <i-input
                        id="inputNote"
                        inputType="textarea"
                        width="calc(100% - 116px)"
                        minWidth={150}
                        height="unset"
                        rows={3}
                        padding={{ left: '0.5rem', right: '0.5rem' }}
                        border={{ radius: 5 }}
                        maxLength={4000}
                    />
                </i-hstack>
            </i-stack>
            <i-stack direction="horizontal" width="100%" alignItems="center" justifyContent="center" margin={{ top: 'auto' }} gap="1rem" wrap="wrap-reverse">
                <i-button
                    caption="$back"
                    class={halfWidthButtonStyle}
                    background={{ color: Theme.colors.secondary.main }}
                    onClick={this.handleBack}
                />
                <i-button
                    id="btnContinue"
                    enabled={false}
                    caption="$continue"
                    background={{ color: Theme.colors.primary.main }}
                    class={halfWidthButtonStyle}
                    onClick={this.handleContinue}
                />
            </i-stack>
        </i-stack>
    }
}