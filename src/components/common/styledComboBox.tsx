import { customElements, Styles, Module, ControlElement, ComboBox, IComboItem, Label } from "@ijstech/components";
import translations from "../../translations.json";

interface StyledComboBoxElement extends ControlElement {
  caption: string;
  required?: boolean;
  items?: IComboItem[];
  onChanged: () => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['scom-payment-widget--styled-combo-box']: StyledComboBoxElement;
    }
  }
}

const Theme = Styles.Theme.ThemeVars;

@customElements('scom-payment-widget--styled-combo-box')
export class StyledComboBox extends Module {
  private styledComboBox: ComboBox;
  private lbCaption: Label;
  private lbRequired: Label;
  private onChanged: () => void;

  get items() {
    return this.styledComboBox.items;
  }

  set items(value: IComboItem[]) {
    this.styledComboBox.items = value;
  }

  get selectedItem() {
    return this.styledComboBox.selectedItem;
  }

  set selectedItem(value: IComboItem) {
    this.styledComboBox.selectedItem = value;
  }

  get enabled() {
    return this.styledComboBox.enabled;
  }

  set enabled(value: boolean) {
    this.styledComboBox.enabled = value;
  }

  init() {
    this.i18n.init({ ...translations });
    super.init();
    this.lbCaption.caption = this.getAttribute('caption', true);
    this.lbRequired.visible = this.getAttribute('required', true, false);
    const items = this.getAttribute('items', true);
    if (items) {
      this.styledComboBox.items = this.getAttribute('items', true);
    }
    this.onChanged = this.getAttribute('onChanged', true);
  }

  clear() {
    this.styledComboBox.clear();
  }

  render() {
    return (
      <i-hstack gap="0.5rem" width="100%" verticalAlignment="center" wrap="wrap" horizontalAlignment="space-between">
        <i-hstack gap="0.15rem">
          <i-label id="lbCaption" />
          <i-label id="lbRequired" visible={false} caption="*" font={{ color: Theme.colors.error.main }} />
        </i-hstack>
        <i-combo-box
          id="styledComboBox"
          width="calc(100% - 116px)"
          minWidth={150}
          height={36}
          icon={{ width: 14, height: 14, name: 'angle-down', fill: Theme.divider }}
          border={{ width: 1, style: 'solid', color: Theme.divider, radius: 5 }}
          onChanged={this.onChanged}
        />
      </i-hstack>
    )
  }
}