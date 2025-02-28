import { Module, Container, customElements, ControlElement, Styles, Alert, Button, VStack, StackLayout, Accordion, AccordionItem } from '@ijstech/components';
import { getStripeKey, stripeSpecialCurrencies, stripeZeroDecimalCurrencies } from '../store';
import { accordionStyle, alertStyle, halfWidthButtonStyle } from './index.css';
import { loadStripe } from '../utils';
import { PaymentHeader } from './common/index';
import translations from '../translations.json';
import { Model } from '../model';
import { RewardsPointsModule } from './rewardsPointsModule';
const Theme = Styles.Theme.ThemeVars;
declare const window: any;

interface ScomPaymentWidgetStripePaymentElement extends ControlElement {
    model?: Model;
    onBack?: () => void;
    onClose?: () => void;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['scom-payment-widget--stripe-payment']: ScomPaymentWidgetStripePaymentElement;
        }
    }
}

@customElements('scom-payment-widget--stripe-payment')
export class StripePayment extends Module {
    private _model: Model;
    private stripe: any;
    private stripeElements: any;
    private btnCheckout: Button;
    private btnBack: Button;
    private header: PaymentHeader;
    private accStripePayment: Accordion;
    private accItemPaymentForm: AccordionItem;
    private accItemRewardsPoints: AccordionItem;
    private rewardsPointsModule: RewardsPointsModule;
    private mdAlert: Alert;
    private pnlLoading: VStack;
    private publishableKey: string;
    public onClose: () => void;
    public onBack: () => void;

    constructor(parent?: Container, options?: ScomPaymentWidgetStripePaymentElement) {
        super(parent, options);
    }

    set model(data: Model) {
        this._model = data;
        this.updateAmount();
    }

    get model() {
        return this._model;
    }

    private get amountToPay() {
        const rewardsPointData = this.rewardsPointsModule.getData();
        if (!rewardsPointData?.payWithPoints) return this.model.totalAmount;
        return Math.max(this.model.totalAmount - rewardsPointData.points / rewardsPointData.exchangeRate, 0);
    }

    get stripeAmount() {
        const currency = this.model.stripeCurrency.toLowerCase();
        const amount = this.amountToPay;
        if (stripeZeroDecimalCurrencies.includes(currency)) return Math.round(amount);
        if (stripeSpecialCurrencies.includes(currency)) return Math.round(amount) * 100;
        return Math.round(amount * 100);
    }

    onStartPayment() {
        this.showButtonIcon(false);
        this.model.rewardsPoint = undefined;
        this.rewardsPointsModule.clear();
        this.accItemPaymentForm.visible = true;
        this.btnCheckout.enabled = true;
        this.updateAmount();
        this.accItemRewardsPoints.visible = this.model.rewardsPointsOptions.length > 0;
    }

    private updateAmount() {
        if (this.model && this.header) {
            const { title, currency, totalAmount } = this.model;
            this.header.setHeader(title, currency, totalAmount);
            this.initStripePayment();
        }
    }

    private handleBeforeSelectRewardsPoint() {
        this.accItemPaymentForm.visible = false;
    }

    private handleSelectedRewardsPoint() {
        this.accItemPaymentForm.visible = true;
    }

    private handleRewardsPointsChanged(isValid: boolean) {
        this.btnCheckout.enabled = isValid;
    }

    private async initStripePayment() {
        if (!this.stripeElements) this.pnlLoading.visible = true;
        if (!window.Stripe) {
            await loadStripe();
        }
        if (window.Stripe) {
            const { stripeCurrency, baseStripeApi } = this.model;
            if (this.stripeElements) {
                this.stripeElements.update({
                    currency: stripeCurrency,
                    amount: this.stripeAmount
                });
                return;
            }
            if (!this.publishableKey) {
                this.publishableKey = await getStripeKey(`${baseStripeApi}/key`);
                if (!this.publishableKey) return;
            }
            this.stripe = window.Stripe(this.publishableKey);
            this.stripeElements = this.stripe.elements({
                mode: 'payment',
                currency: stripeCurrency,
                amount: this.stripeAmount,
                appearance: {
                    theme: 'night'
                },
            });
            const paymentElement = this.stripeElements.create('payment');
            paymentElement.mount('#pnlStripePaymentForm');
        }
        if (this.pnlLoading.visible) {
            setTimeout(() => {
                this.pnlLoading.visible = false;
            }, 500)
        }
    }

    private async handleStripeCheckoutClick() {
        if (!this.stripe) return;
        const rewardsPointData = this.rewardsPointsModule.getData();
        const payWithPoints = rewardsPointData.payWithPoints && rewardsPointData.points > 0;
        if (payWithPoints) {
            const balance = await this.model.fetchRewardsPointBalance(rewardsPointData.creatorId, rewardsPointData.communityId);
            if (rewardsPointData.points > balance || rewardsPointData.points > rewardsPointData.upperBoundary) {
                return;
            }
        }
        this.showButtonIcon(true);
        this.stripeElements.submit().then(async (result) => {
            if (result.error) {
                this.showButtonIcon(false);
                return;
            }
            const clientSecret = await this.model.createPaymentIntent(this.stripeAmount);
            if (!clientSecret) {
                this.showButtonIcon(false);
                this.showAlert('error', this.i18n.get('$payment_failed'), this.i18n.get('$cannot_get_payment_info'));
                return;
            };
            if (payWithPoints) {
                this.model.rewardsPoint = {
                    creatorId: rewardsPointData.creatorId,
                    communityId: rewardsPointData.communityId,
                    points: rewardsPointData.points
                };
            } else {
                this.model.rewardsPoint = undefined;
            }
            await this.model.handlePlaceMarketplaceOrder();
            this.model.referenceId = clientSecret;
            this.model.networkCode = '';
            const { returnUrl, paymentActivity } = this.model;
            const orderId = paymentActivity.orderId;
            const url = `${returnUrl}/${orderId}`;
            const jsonString = JSON.stringify(paymentActivity);
            const encodedData = btoa(jsonString);
            try {
                const { error } = await this.stripe.confirmPayment({
                    elements: this.stripeElements,
                    confirmParams: {
                        return_url: `${url}?data=${encodedData}`
                    },
                    clientSecret
                })
                if (error) {
                    this.showAlert('error', this.i18n.get('$payment_failed'), error.message);
                } else {
                    await this.model.handlePaymentSuccess();
                    this.showAlert('success', this.i18n.get('$payment_completed'), '');
                }
            } catch (error) {
                // mini app
                const data = await this.stripe.retrievePaymentIntent(clientSecret);
                const status = data?.paymentIntent.status;
                if (status === 'succeeded' || status === 'processing') {
                    await this.model.handlePaymentSuccess();
                    this.showAlert('success', this.i18n.get('$payment_completed'), '');
                } else {
                    this.showAlert('error', this.i18n.get('$payment_failed'), status || error?.message || '');
                }
            }
            this.showButtonIcon(false);
        }).catch((e) => this.showButtonIcon(false));
    }

    private showButtonIcon(value: boolean) {
        this.btnCheckout.rightIcon.spin = value;
        this.btnCheckout.rightIcon.visible = value;
        this.btnBack.enabled = !value;
    }

    private showAlert(status: string, title: string, msg: string) {
        if (status === 'success') {
            this.mdAlert.onClose = () => {
                if (this.onClose) {
                    this.onClose();
                }
            };
        } else {
            this.mdAlert.onClose = () => { };
        }
        this.mdAlert.status = status;
        this.mdAlert.title = title;
        this.mdAlert.content = msg;
        this.mdAlert.showModal();
    }

    private handleBack() {
        if (!this.accItemPaymentForm.visible) {
            this.rewardsPointsModule.cancelSelectRewardsPoint();
            this.accItemPaymentForm.visible = true;
            return;
        }
        if (this.onBack) this.onBack();
    }

    async init() {
        this.i18n.init({ ...translations });
        super.init();
        this.accStripePayment.updateLocale(this.i18n);
        this.onClose = this.getAttribute('onClose', true) || this.onClose;
        this.onBack = this.getAttribute('onBack', true) || this.onBack;
        const model = this.getAttribute('model', true);
        if (model) this.model = model;
    }

    render() {
        return <i-stack direction="vertical" alignItems="center" width="100%">
            <scom-payment-widget--header id="header" margin={{ bottom: '1rem' }} display="flex" />
            <i-stack direction="vertical" width="100%" height="100%" alignItems="center" padding={{ bottom: '1rem', left: '1rem', right: '1rem' }} position="relative">
                <i-vstack
                    id="pnlLoading"
                    visible={false}
                    width="100%"
                    minHeight={315}
                    position="absolute"
                    bottom={0}
                    zIndex={899}
                    background={{ color: Theme.background.main }}
                    class="i-loading-overlay"
                >
                    <i-vstack
                        horizontalAlignment="center"
                        verticalAlignment="center"
                        position="absolute"
                        top="calc(50% - 0.75rem)"
                        left="calc(50% - 0.75rem)"
                    >
                        <i-icon
                            class="i-loading-spinner_icon"
                            name="spinner"
                            width={24}
                            height={24}
                            fill={Theme.colors.primary.main}
                        />
                    </i-vstack>
                </i-vstack>
                <i-accordion id="accStripePayment" class={accordionStyle} width="100%" margin={{ bottom: '1rem' }}>
                    <i-accordion-item id="accItemPaymentForm" name="$payment" defaultExpanded={true} font={{ size: '1rem', weight: 600 }}>
                        <i-stack direction="vertical" id="pnlStripePaymentForm" background={{ color: '#30313d' }} border={{ radius: 12 }} padding={{ top: '1rem', left: '1rem', bottom: '2rem', right: '1rem' }} />
                    </i-accordion-item>
                    <i-accordion-item id="accItemRewardsPoints" name="$rewards_points" font={{ size: '1rem', weight: 600 }} visible={false}>
                        <scom-payment-widget--rewards-points-module
                            id="rewardsPointsModule"
                            padding={{ left: '1rem', right: '1rem' }}
                            model={this.model}
                            onBeforeSelect={this.handleBeforeSelectRewardsPoint}
                            onSelected={this.handleSelectedRewardsPoint}
                            onPointsChanged={this.handleRewardsPointsChanged}
                        ></scom-payment-widget--rewards-points-module>
                    </i-accordion-item>
                </i-accordion>
                <i-stack direction="horizontal" width="100%" alignItems="center" justifyContent="center" margin={{ top: 'auto' }} gap="1rem" wrap="wrap-reverse">
                    <i-button
                        id="btnBack"
                        caption="$back"
                        background={{ color: Theme.colors.secondary.main }}
                        class={halfWidthButtonStyle}
                        onClick={this.handleBack}
                    />
                    <i-button
                        id="btnCheckout"
                        caption="$checkout"
                        background={{ color: Theme.colors.primary.main }}
                        class={halfWidthButtonStyle}
                        onClick={this.handleStripeCheckoutClick}
                    />
                </i-stack>
            </i-stack>
            <i-alert id="mdAlert" class={alertStyle} />
        </i-stack>
    }
}