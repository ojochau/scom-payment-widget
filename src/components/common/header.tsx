import { customElements, Styles, Module, ControlElement, Label, FormatUtils } from "@ijstech/components";
import { textCenterStyle } from "../index.css";
import translations from "../../translations.json";

interface HeaderElement extends ControlElement {
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['scom-payment-widget--header']: HeaderElement;
    }
  }
}

const Theme = Styles.Theme.ThemeVars;

@customElements('scom-payment-widget--header')
export class PaymentHeader extends Module {
  private lbTitle: Label;
  private lbAmount: Label;

  setHeader(title: string, currency: string, amount: number) {
    if (this.lbTitle) {
      if (this.lbTitle.caption !== title) this.lbTitle.caption = title || '';
      const formattedAmount = `${FormatUtils.formatNumber(amount, { decimalFigures: 2 })} ${currency?.toUpperCase() || 'USD'}`;
      if (this.lbAmount.caption !== formattedAmount) this.lbAmount.caption = formattedAmount;
    }
  }

  init() {
    this.i18n.init({ ...translations });
    super.init();
    this.width = '100%';
  }

  render() {
    return (
      <i-stack
        direction="vertical"
        gap="0.5rem"
        justifyContent="center"
        alignItems="center"
        width="100%"
        minHeight={85}
        padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}
        background={{ color: Theme.colors.primary.main }}
      >
        <i-label id="lbTitle" class={textCenterStyle} font={{ size: '0.875rem', color: Theme.text.primary, bold: true }} wordBreak="break-word" />
        <i-label caption="$amount_to_pay" font={{ size: '0.675rem', bold: true, transform: 'uppercase', color: Theme.text.primary }} />
        <i-label id="lbAmount" font={{ size: '0.875rem', color: Theme.text.primary, bold: true }} />
      </i-stack>
    )
  }
}