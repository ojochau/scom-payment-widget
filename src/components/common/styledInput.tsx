import { customElements, Styles, Module, ControlElement, Input, Label, IBorder } from "@ijstech/components";
import translations from "../../translations.json";

interface StyledInputElement extends ControlElement {
  caption: string;
  required?: boolean;
  onChanged: () => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['scom-payment-widget--styled-input']: StyledInputElement;
    }
  }
}

const Theme = Styles.Theme.ThemeVars;

@customElements('scom-payment-widget--styled-input')
export class StyledInput extends Module {
  private styledInput: Input;
  private lbCaption: Label;
  private lbRequired: Label;
  private onChanged: () => void;

  get value() {
    return this.styledInput.value;
  }

  set value(value: string) {
    this.styledInput.value = value;
  }

  get enabled() {
    return this.styledInput.enabled;
  }

  set enabled(value: boolean) {
    this.styledInput.enabled = value;
  }

  set inputBorder(value: IBorder) {
    this.styledInput.border = value;
  }

  init() {
    this.i18n.init({ ...translations });
    super.init();
    this.lbCaption.caption = this.getAttribute('caption', true);
    this.lbRequired.visible = this.getAttribute('required', true, false);
    this.onChanged = this.getAttribute('onChanged', true);
  }

  render() {
    return (
      <i-hstack gap="0.5rem" width="100%" verticalAlignment="center" wrap="wrap" horizontalAlignment="space-between">
        <i-hstack gap="0.15rem">
          <i-label id="lbCaption" />
          <i-label id="lbRequired" visible={false} caption="*" font={{ color: Theme.colors.error.main }} />
        </i-hstack>
        <i-input
          id="styledInput"
          width="calc(100% - 116px)"
          minWidth={150}
          height={36}
          padding={{ left: '0.5rem', right: '0.5rem' }}
          border={{ radius: 5, width: 1, style: 'solid', color: 'transparent' }}
          onChanged={this.onChanged}
        />
      </i-hstack>
    )
  }
}