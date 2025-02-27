import {
    Module,
    customElements,
    ControlElement,
    Styles,
    StackLayout,
    Label,
    Icon,
    application,
    Button,
    FormatUtils,
} from '@ijstech/components';
import { PaymentHeader } from './common/index';
import { Model } from '../model';
import { halfWidthButtonStyle } from './index.css';
import translations from '../translations.json';
import { IPaymentStatus, IRewardsPointsOption } from '../interface';
import { RewardsPointsList } from './rewardsPointsList';

const Theme = Styles.Theme.ThemeVars;

enum Step {
    SelectRewardsPoint,
    Pay
}

interface ScomPaymentWidgetRewardsPointsPaymentElement extends ControlElement {
    model?: Model;
    onBack?: () => void;
    onPaid?: (paymentStatus: IPaymentStatus) => void;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['scom-payment-widget--rewards-points-payment']: ScomPaymentWidgetRewardsPointsPaymentElement;
        }
    }
}

@customElements('scom-payment-widget--rewards-points-payment')
export class RewardsPointsPayment extends Module {
    private header: PaymentHeader;
    private pnlRewardsPoints: StackLayout;
    private rewardsPointsList: RewardsPointsList;
    private pnlPayDetail: StackLayout;
    private lblCommunity: Label;
    private lblCommunityCreator: Label;
    private lblPointBalance: Label;
    private lbAmountToPay: Label;
    private lblExchangeRate: Label;
    private lbError: Label;
    private btnBack: Button;
    private btnPay: Button;
    private _model: Model;
    private currentStep: Step = Step.SelectRewardsPoint;
    private selectedRewardsPoint: IRewardsPointsOption;
    public onBack: () => void;
    public onPaid: (paymentStatus: IPaymentStatus) => void;

    get model() {
        return this._model;
    }

    set model(value: Model) {
        this._model = value;
    }

    onStartPayment() {
        this.lbError.caption = '';
        this.goToStep(Step.SelectRewardsPoint);
        this.updateAmount();
    }

    private updateAmount() {
        if (this.model && this.header) {
            const { title, currency, totalAmount } = this.model;
            this.header.setHeader(title, currency, totalAmount);
        }
    }

    private goToStep(step: Step) {
        if (step === Step.SelectRewardsPoint) {
            this.pnlRewardsPoints.visible = true;
            this.pnlPayDetail.visible = false;
            this.btnPay.visible = false;
            this.btnBack.width = '100%';
            this.currentStep = Step.SelectRewardsPoint;
        } else if (step === Step.Pay) {
            this.pnlRewardsPoints.visible = false;
            this.pnlPayDetail.visible = true;
            this.btnPay.visible = true;
            this.btnBack.width = 'calc(50% - 1rem)';
            this.currentStep = Step.Pay;
        }
    }

    private async handleSelectRewardsPoint(rewardsPoint: IRewardsPointsOption) {
        this.selectedRewardsPoint = rewardsPoint;
        const totalAmount = Math.ceil(this.model.totalAmount * rewardsPoint.exchangeRate);
        const formattedAmount = FormatUtils.formatNumber(totalAmount, { decimalFigures: 6, hasTrailingZero: false });
        this.lblCommunity.caption = rewardsPoint.communityId;
        this.lblCommunityCreator.caption = rewardsPoint.creatorId;
        this.lblPointBalance.caption = '';
        this.lbAmountToPay.caption = `${formattedAmount} POINTS`;
        this.lblExchangeRate.caption = `${rewardsPoint.exchangeRate} point(s) = 1 ${this.model.currency}${rewardsPoint.upperBoundary ? ', upper boundary: ' + rewardsPoint.upperBoundary : ''}`;
        this.goToStep(Step.Pay);
        this.btnPay.enabled = false;
        const balance = await this.model.fetchRewardsPointBalance(rewardsPoint.creatorId, rewardsPoint.communityId);
        this.lblPointBalance.caption = balance.toFixed();
        if (totalAmount > balance) {
            this.btnPay.enabled = false;
            this.lbError.caption = '$insufficient_balance';
        } else {
            this.btnPay.enabled = true;
            this.lbError.caption = '';
        }
    }

    private handleBack() {
        if (this.currentStep === Step.Pay) {
            this.goToStep(Step.SelectRewardsPoint);
            return;
        }
        if (this.onBack) this.onBack();
    }

    private updateBtnPay(value: boolean) {
        this.btnPay.rightIcon.spin = value;
        this.btnPay.rightIcon.visible = value;
        this.btnBack.enabled = !value;
    }

    private async handlePay() {
        this.updateBtnPay(true);
        try {
            this.model.referenceId = '';
            this.model.networkCode = '';
            const totalAmount = Math.ceil(this.model.totalAmount * this.selectedRewardsPoint.exchangeRate);
            this.model.rewardsPoint = {
                creatorId: this.selectedRewardsPoint.creatorId,
                communityId: this.selectedRewardsPoint.communityId,
                points: totalAmount
            };
            await this.model.handlePlaceMarketplaceOrder();
            await this.model.handlePaymentSuccess();
            if (this.onPaid) this.onPaid({ status: 'completed' });
            this.updateBtnPay(false);
        } catch {
            this.updateBtnPay(false);
        }
    }

    init() {
        this.i18n.init({ ...translations });
        super.init();
        this.onBack = this.getAttribute('onBack', true) || this.onBack;
        this.onPaid = this.getAttribute('onPaid', true) || this.onPaid;
    }

    render() {
        return (
            <i-stack direction="vertical" alignItems="center" width="100%">
                <scom-payment-widget--header id="header" margin={{ bottom: '1rem' }} display="flex" />
                <i-stack direction="vertical" width="100%" height="100%" alignItems="center" padding={{ top: '1rem', bottom: '1rem' }} gap="1rem">
                    <i-stack id="pnlRewardsPoints" direction="vertical" width="100%" height="100%" padding={{ left: '1rem', right: '1rem' }} gap="1rem">
                        <i-label font={{ size: '1rem', color: Theme.text.primary, bold: true }} caption='$select_rewards_point' />
                        <scom-payment-widget--rewards-points-list id="rewardsPointsList" width="100%" data={this.model.oneOffRewardsPointsOptions} onSelectedRewardsPoint={this.handleSelectRewardsPoint} />
                    </i-stack>
                    <i-stack id="pnlPayDetail" direction="vertical" gap="0.25rem" width="100%" height="100%" padding={{ left: '1rem', right: '1rem' }} visible={false}>
                        <i-stack
                            direction="vertical"
                            width="100%"
                            border={{ width: 1, style: 'solid', color: Theme.divider, radius: 8 }}
                            padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}
                            margin={{ bottom: '1rem' }}
                            gap="0.25rem"
                        >
                            <i-label id="lblCommunity" font={{ bold: true, color: Theme.text.primary }} />
                            <i-label id="lblCommunityCreator" font={{ size: '0.75rem', color: Theme.text.primary }} textOverflow="ellipsis" />
                        </i-stack>
                        <i-label caption="$available_points"></i-label>
                        <i-stack
                            direction="horizontal"
                            alignItems="stretch"
                            width="100%"
                            minHeight={36}
                            padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}
                            border={{ radius: 8 }}
                            background={{ color: Theme.input.background }}
                            overflow="hidden"
                        >
                            <i-label id="lblPointBalance"></i-label>
                        </i-stack>
                        <i-label id="lblExchangeRate" margin={{ bottom: '1rem' }} font={{ size: '0.875rem', color: Theme.text.secondary }}></i-label>
                        <i-label caption="$amount_to_pay" />
                        <i-stack
                            direction="horizontal"
                            alignItems="stretch"
                            width="100%"
                            minHeight={36}
                            padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}
                            border={{ radius: 8 }}
                            background={{ color: Theme.input.background }}
                            overflow="hidden"
                        >
                            <i-label id="lbAmountToPay" wordBreak="break-all" font={{ color: Theme.input.fontColor }} />
                        </i-stack>
                        <i-label id="lbError" font={{ color: Theme.colors.error.main }} />
                    </i-stack>
                    <i-stack direction="horizontal" width="100%" alignItems="center" justifyContent="center" margin={{ top: 'auto' }} gap="1rem" wrap="wrap-reverse">
                        <i-button
                            id="btnBack"
                            caption="$back"
                            background={{ color: Theme.colors.secondary.main }}
                            class={halfWidthButtonStyle}
                            onClick={this.handleBack}
                        />
                        <i-button
                            id="btnPay"
                            visible={false}
                            caption="$pay"
                            background={{ color: Theme.colors.primary.main }}
                            class={halfWidthButtonStyle}
                            onClick={this.handlePay}
                        />
                    </i-stack>
                </i-stack>
            </i-stack>
        )
    }
}