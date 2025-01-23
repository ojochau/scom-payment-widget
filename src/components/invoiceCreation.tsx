import { Module, Container, customElements, ControlElement, Styles, Label, FormatUtils, StackLayout, CarouselSlider, moment } from '@ijstech/components';
import { carouselSliderStyle, textCenterStyle, textUpperCaseStyle, fullWidthButtonStyle, textEllipsis } from './index.css';
import translations from '../translations.json';
import { Model } from '../model';
const Theme = Styles.Theme.ThemeVars;

interface ScomPaymentWidgetInvoiceCreationElement extends ControlElement {
    model?: Model;
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
    private lbAmount: Label;
    private pnlPaymentId: Label;
    private lbPaymentId: Label;
    private carouselSlider: CarouselSlider;
    private _model: Model;
    public onContinue: () => void;

    get model() {
        return this._model;
    }

    set model(value: Model) {
        this._model = value;
        this.updateInfo();
    }

    constructor(parent?: Container, options?: ScomPaymentWidgetInvoiceCreationElement) {
        super(parent, options);
    }

    private renderProducts() {
        if (this.model?.products.length) {
            const nodeItems: HTMLElement[] = [];
            const { products, currency } = this.model;
            for (const product of products) {
                const element = (
                    <i-vstack gap="0.5rem" width="100%">
                        {product.images?.length ? <i-image url={product.images[0]} width="auto" maxWidth="100%" height={100} margin={{ left: 'auto', right: 'auto', bottom: '0.5rem' }} /> : []}
                        <i-label caption={product.name} font={{ bold: true }} />
                        {product.serviceName ? <i-hstack gap="0.5rem" verticalAlignment="center" horizontalAlignment="space-between">
                            <i-label caption={this.i18n.get('$service')} font={{ color: Theme.text.hint }} />
                            <i-label caption={product.serviceName} class={textEllipsis} />
                        </i-hstack> : []}
                        {product.providerName ? <i-hstack gap="0.5rem" verticalAlignment="center" horizontalAlignment="space-between">
                            <i-label caption={this.i18n.get('$provider')} font={{ color: Theme.text.hint }} />
                            <i-label caption={product.providerName} class={textEllipsis} />
                        </i-hstack> : []}
                        {product.time ? <i-hstack gap="0.5rem" verticalAlignment="center" horizontalAlignment="space-between" wrap="wrap">
                            <i-label caption={this.i18n.get('$time')} font={{ color: Theme.text.hint }} />
                            <i-label caption={moment(product.time * 1000).format('DD MMM YYYY, hh:mm A')} margin={{ left: 'auto' }} />
                        </i-hstack> : []}
                        {product.duration ? <i-hstack gap="0.5rem" verticalAlignment="center" horizontalAlignment="space-between" wrap="wrap">
                            <i-label caption={this.i18n.get('$duration')} font={{ color: Theme.text.hint }} />
                            <i-label caption={`${product.duration} ${this.getDurationUnit(product.durationUnit, product.duration)}`} margin={{ left: 'auto' }} />
                        </i-hstack> : []}
                        <i-hstack gap="0.5rem" verticalAlignment="center" horizontalAlignment="space-between" wrap="wrap">
                            <i-label caption={this.i18n.get('$price')} font={{ color: Theme.text.hint }} />
                            <i-label caption={`${FormatUtils.formatNumber(product.price, { decimalFigures: 6, hasTrailingZero: false })} ${currency}`} class={textUpperCaseStyle} margin={{ left: 'auto' }} />
                        </i-hstack>
                        <i-hstack gap="0.5rem" verticalAlignment="center" horizontalAlignment="space-between" wrap="wrap">
                            <i-label caption={this.i18n.get('$quantity')} font={{ color: Theme.text.hint }} />
                            <i-label caption={FormatUtils.formatNumber(product.quantity, { hasTrailingZero: false })} margin={{ left: 'auto' }} />
                        </i-hstack>
                    </i-vstack>
                );
                nodeItems.push(element);
            }
            this.carouselSlider.items = nodeItems.map((item, idx) => {
                return {
                    name: `Product ${idx}`,
                    controls: [item]
                }
            });
            this.carouselSlider.refresh();
            this.carouselSlider.visible = true;
        } else {
            this.carouselSlider.visible = false;
        }
    }

    private getDurationUnit(unit: string, value: number) {
        switch (unit) {
            case 'minutes':
                return this.i18n.get(value == 1 ? '$minute' : '$minutes');
            case 'hours':
                return this.i18n.get(value == 1 ? '$hour' : '$hours');
            case 'days':
                return this.i18n.get(value == 1 ? '$day' : '$days');
        }
        return '';
    }

    private updateInfo() {
        const { totalAmount, currency, products, paymentId, title } = this.model;
        if (this.pnlItemInfo) {
            const hasTitle = !!title;
            const hasProduct = !!products?.length;
            this.pnlItemInfo.visible = hasTitle || hasProduct;
            this.lbItem.caption = title || '';
            this.lbItem.visible = hasTitle;
            this.renderProducts();
        }
        if (this.lbAmount) {
            this.lbAmount.caption = `${FormatUtils.formatNumber(totalAmount, { decimalFigures: 6, hasTrailingZero: false })} ${currency}`;
        }
        if (this.pnlPaymentId) {
            const _paymentId = paymentId || '';
            this.pnlPaymentId.visible = !!_paymentId;
            this.lbPaymentId.caption = _paymentId;
        }
    }

    private handleContinue() {
        if (this.onContinue) this.onContinue();
    }

    async init() {
        this.i18n.init({ ...translations });
        super.init();
        this.onContinue = this.getAttribute('onContinue', true) || this.onContinue;
        const model = this.getAttribute('model', true);
        if (model) {
            this.model = model;
        }
    }

    render() {
        return <i-stack direction="vertical" gap="1rem" width="100%" alignItems="center" padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}>
            <i-stack direction="vertical" height="100%" width="100%">
                <i-stack id="pnlItemInfo" visible={false} direction="vertical" gap="1rem" alignItems="center" width="100%" margin={{ bottom: '1rem' }}>
                    <i-label id="lbItem" class={textCenterStyle} font={{ size: '1.25rem', color: Theme.colors.primary.main, bold: true, transform: 'uppercase' }} />
                    <i-carousel-slider
                        id="carouselSlider"
                        width="calc(100% - 60px)"
                        maxWidth={280}
                        height="100%"
                        overflow="inherit"
                        minHeight={80}
                        slidesToShow={1}
                        transitionSpeed={300}
                        autoplay={true}
                        autoplaySpeed={6000}
                        items={[]}
                        type="arrow"
                        class={carouselSliderStyle}
                    />
                    <i-panel height={1} width="80%" background={{ color: Theme.divider }} />
                </i-stack>
                <i-stack direction="vertical" gap="1rem" alignItems="center" width="100%" margin={{ bottom: '1.5rem' }}>
                    <i-stack direction="vertical" gap="0.5rem" alignItems="center">
                        <i-label caption="$amount_to_pay" font={{ color: Theme.text.primary, bold: true, transform: 'uppercase' }} />
                        <i-label id="lbAmount" class={textCenterStyle} font={{ size: '1.25rem', color: Theme.colors.primary.main, bold: true }} />
                    </i-stack>
                    <i-stack id="pnlPaymentId" visible={false} direction="vertical" gap="0.25rem" alignItems="center">
                        <i-label caption="$payment_id" font={{ color: Theme.text.primary, bold: true, transform: 'uppercase' }} />
                        <i-label id="lbPaymentId" class={textCenterStyle} font={{ color: Theme.text.primary, bold: true, transform: 'uppercase' }} />
                    </i-stack>
                </i-stack>
            </i-stack>
            <i-button
                caption="$continue"
                background={{ color: Theme.colors.primary.main }}
                class={fullWidthButtonStyle}
                onClick={this.handleContinue}
            />
        </i-stack>
    }
}