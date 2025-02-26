import {
    Module,
    customElements,
    ControlElement,
    Styles,
    StackLayout,
    Label,
    Checkbox,
    Input,
} from '@ijstech/components';
import { Model } from '../model';
import { IRewardsPointsOption } from '../interface';
import translations from '../translations.json';
import { RewardsPointsList } from './rewardsPointsList';

const Theme = Styles.Theme.ThemeVars;

interface ScomPaymentWidgetRewardsPointsElement extends ControlElement {
    model?: Model;
}


declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['scom-payment-widget--rewards-points-module']: ScomPaymentWidgetRewardsPointsElement;
        }
    }
}

@customElements('scom-payment-widget--rewards-points-module')
export class RewardsPointsModule extends Module {
    private pnlRewardsPointsList: StackLayout;
    private rewardsPointsList: RewardsPointsList;
    private chkPayWithPoints: Checkbox;
    private pnlRewardsPoints: StackLayout;
    private lblCommunity: Label;
    private lblCommunityCreator: Label;
    private pnlInput: StackLayout;
    private edtPoints: Input;
    private lblExchangeRate: Label;
    private _model: Model;
    private selectedRewardsPoint: IRewardsPointsOption;
    private balance: number;

    get model() {
        return this._model;
    }

    set model(value: Model) {
        this._model = value;
    }

    async setData(rewardsPoint: IRewardsPointsOption) {
        this.selectedRewardsPoint = rewardsPoint;
        this.lblCommunity.caption = rewardsPoint.communityId;
        this.lblCommunityCreator.caption = rewardsPoint.creatorId;
        this.pnlInput.visible = true;
        this.edtPoints.value = "";
        this.lblExchangeRate.caption = `${rewardsPoint.exchangeRate} point(s) = 1 ${this.model.currency}${rewardsPoint.upperBoundary ? ', upper boundary: ' + rewardsPoint.upperBoundary : ''}`;
        this.balance = await this.model.fetchRewardsPointBalance(rewardsPoint.creatorId, rewardsPoint.communityId);
        this.edtPoints.enabled = this.balance > 0;
    }

    getData() {
        return {
            payWithPoints: this.chkPayWithPoints.checked,
            ...this.selectedRewardsPoint,
            points: Number(this.edtPoints.value)
        }
    }

    clear() {
        this.pnlRewardsPointsList.visible = false;
        this.chkPayWithPoints.checked = false;
        this.pnlRewardsPoints.visible = false;
        this.lblCommunity.caption = this.i18n.get("$select_rewards_point");
        this.lblCommunityCreator.caption = "";
        this.pnlInput.visible = false;
        this.edtPoints.enabled = false;
        this.edtPoints.value = "";
        this.lblExchangeRate.caption = "";
        this.selectedRewardsPoint = undefined;
    }

    private handleSelectRewardsPoint(rewardsPoint: IRewardsPointsOption) {
        this.chkPayWithPoints.visible = true;
        this.pnlRewardsPoints.visible = true;
        this.pnlRewardsPointsList.visible = false;
        this.setData(rewardsPoint);
    }

    private handleRewardsPointClick() {
        this.chkPayWithPoints.visible = false;
        this.pnlRewardsPoints.visible = false;
        this.pnlRewardsPointsList.visible = true;
    }

    private handleCheckboxChanged() {
        this.pnlRewardsPoints.visible = this.chkPayWithPoints.checked;
    }

    init() {
        this.i18n.init({ ...translations });
        super.init();
        const model = this.getAttribute('model', true);
        if (model) this.model = model;
        this.rewardsPointsList.setData(this.model.rewardsPointsOptions);
    }

    render() {
        <i-stack direction="vertical" width="100%" height="100%" gap="0.25rem">
            <i-stack id="pnlRewardsPointsList" direction="vertical" width="100%" gap="1rem" visible={false}>
                <i-label font={{ size: '1rem', color: Theme.text.primary, bold: true }} caption='$select_rewards_point' />
                <scom-payment-widget--rewards-points-list id="rewardsPointsList" width="100%" onSelectedRewardsPoint={this.handleSelectRewardsPoint} />
            </i-stack>
            <i-checkbox id="chkPayWithPoints" height="auto" caption="$pay_with_rewards_points" onChanged={this.handleCheckboxChanged}></i-checkbox>
            <i-stack id="pnlRewardsPoints" direction="vertical" width="100%" height="100%" margin={{ top: '0.25rem' }} gap="0.25rem" visible={false}>
                <i-stack
                    direction="vertical"
                    width="100%"
                    border={{ width: 1, style: 'solid', color: Theme.divider, radius: 8 }}
                    padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}
                    gap="0.25rem"
                    cursor="pointer"
                    onClick={this.handleRewardsPointClick}
                >
                    <i-label id="lblCommunity" caption="$select_rewards_point" font={{ bold: true, color: Theme.text.primary }} />
                    <i-label id="lblCommunityCreator" font={{ size: '0.75rem', color: Theme.text.primary }} textOverflow="ellipsis" />
                </i-stack>
                <i-stack id="pnlInput" direction="vertical" width="100%" margin={{ top: '0.25rem' }} gap="0.25rem">
                    <i-label caption="$points"></i-label>
                    <i-input
                        id="edtPoints"
                        width="100%"
                        height={36}
                        padding={{ left: '0.5rem', right: '0.5rem' }}
                        border={{ radius: 5, width: 1, style: 'solid', color: 'transparent' }}
                        inputType="number"
                        enabled={false}
                    ></i-input>
                    <i-label id="lblExchangeRate" font={{ size: '0.875rem', color: Theme.text.secondary }}></i-label>
                </i-stack>
            </i-stack>
        </i-stack>
    }
}