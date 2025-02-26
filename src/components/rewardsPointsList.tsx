import {
    Module,
    customElements,
    ControlElement,
    Styles,
    StackLayout,
} from '@ijstech/components';
import { IRewardsPointsOption } from '../interface';
import translations from '../translations.json';

const Theme = Styles.Theme.ThemeVars;

interface ScomPaymentWidgetRewardsPointsListElement extends ControlElement {
    data?: IRewardsPointsOption[];
    onSelectedRewardsPoint?: (rewardsPoint: IRewardsPointsOption) => void;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['scom-payment-widget--rewards-points-list']: ScomPaymentWidgetRewardsPointsListElement;
        }
    }
}

@customElements('scom-payment-widget--rewards-points-list')
export class RewardsPointsList extends Module {
    private pnlOptions: StackLayout;
    public onSelectedRewardsPoint: (rewardsPoint: IRewardsPointsOption) => void;

    setData(rewardsPoints: IRewardsPointsOption[]) {
        this.renderRewardsPoints(rewardsPoints);
    }

    private renderRewardsPoints(rewardsPoints: IRewardsPointsOption[]) {
        const nodeItems: StackLayout[] = [];
        for (const option of rewardsPoints) {
            nodeItems.push(
                <i-stack
                    direction="vertical"
                    width="100%"
                    border={{ width: 1, style: 'solid', color: Theme.divider, radius: 8 }}
                    padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}
                    gap="0.25rem"
                    cursor="pointer"
                    onClick={() => this.handleSelectRewardsPoint(option)}
                >
                    <i-label caption={option.communityId} font={{ bold: true, color: Theme.text.primary }} />
                    <i-label caption={option.creatorId} font={{ size: '0.75rem', color: Theme.text.primary }} textOverflow="ellipsis" />
                </i-stack>
            )
        }
        this.pnlOptions.clearInnerHTML();
        this.pnlOptions.append(...nodeItems);
    }

    private handleSelectRewardsPoint(rewardsPoint: IRewardsPointsOption) {
        if (this.onSelectedRewardsPoint) this.onSelectedRewardsPoint(rewardsPoint);
    }

    init() {
        this.i18n.init({ ...translations });
        super.init();
        const data = this.getAttribute('data', true);
        if (data) this.setData(data);
    }

    render() {
        return (
            <i-stack id="pnlOptions" direction="vertical" gap="1rem" width="100%" height="100%" minHeight={100} maxHeight={300} overflow="auto">
            </i-stack>
        )
    }
}