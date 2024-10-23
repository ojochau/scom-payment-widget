import { Module, Container, customElements, ControlElement } from '@ijstech/components';
import { InvoiceCreation, PaymentMethod, WalletPayment, StatusPayment } from './components/index';
import { INetworkConfig, IPaymentInfo, IPaymentStatus, PaymentProvider } from './interface';
import { State } from './store';
import { IWalletPlugin } from '@scom/scom-wallet-modal';
import { ITokenObject } from "@scom/scom-token-list";
import configData from './data';
import '@scom/scom-dapp-container';
import { dappContainerStyle } from './index.css';
import { IRpcWallet } from '@ijstech/eth-wallet';
import { ScomTelegramPayWidget } from './telegramPayWidget';
export { ScomTelegramPayWidget };

interface ScomPaymentWidgetElement extends ControlElement {
  lazyLoad?: boolean;
  wallets?: IWalletPlugin[];
  networks?: INetworkConfig[];
  tokens?: ITokenObject[];
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-payment-widget']: ScomPaymentWidgetElement;
    }
  }
}

@customElements('i-scom-payment-widget')
export class ScomPaymentWidget extends Module {
  private state: State;
  private isInitialized: boolean;
  private invoiceCreation: InvoiceCreation;
  private paymentMethod: PaymentMethod;
  private walletPayment: WalletPayment;
  private statusPayment: StatusPayment;
  private payment: IPaymentInfo;

  private _wallets: IWalletPlugin[] = [];
  private _networks: INetworkConfig[] = [];
  private _tokens: ITokenObject[] = [];

  constructor(parent?: Container, options?: ScomPaymentWidgetElement) {
    super(parent, options);
  }

  get wallets() {
    return this._wallets ?? configData.defaultData.wallets;
  }

  set wallets(value: IWalletPlugin[]) {
    this._wallets = value;
  }

  get networks() {
    return this._networks ?? configData.defaultData.networks;
  }

  set networks(value: INetworkConfig[]) {
    this._networks = value;
  }

  get tokens() {
    return this._tokens ?? configData.defaultData.tokens;
  }

  set tokens(value: ITokenObject[]) {
    this._tokens = value;
  }

  get rpcWallet(): IRpcWallet {
    return this.state.getRpcWallet();
  }

  onStartPayment(payment: IPaymentInfo) {
    this.payment = payment;
    if (!this.invoiceCreation) return;
    this.isInitialized = true;
    this.invoiceCreation.payment = payment;
    this.invoiceCreation.visible = true;
    this.paymentMethod.payment = payment;
    this.paymentMethod.visible = false;
    this.walletPayment.visible = false;
    this.walletPayment.state = this.state;
    this.statusPayment.visible = false;
  }

  async init() {
    if (!this.state) {
      this.state = new State(configData);
    }
    super.init();
    this.invoiceCreation.onContinue = () => {
      this.invoiceCreation.visible = false;
      this.paymentMethod.visible = true;
      this.walletPayment.visible = false;
      this.statusPayment.visible = false;
    };
    this.paymentMethod.onSelectedPaymentProvider = (payment: IPaymentInfo, paymentProvider: PaymentProvider) => {
      this.paymentMethod.visible = false;
      this.walletPayment.wallets = this.wallets;
      this.walletPayment.networks = this.networks;
      this.walletPayment.tokens = this.tokens;
      this.walletPayment.onStartPayment({
        ...payment,
        provider: paymentProvider
      })
      this.walletPayment.visible = true;
    };
    this.walletPayment.onPaid = (paymentStatus: IPaymentStatus) => {
      this.walletPayment.visible = false;
      this.statusPayment.visible = true;
      this.statusPayment.updateStatus(this.state, paymentStatus);
    }
    this.walletPayment.onBack = () => {
      this.paymentMethod.visible = true;
      this.walletPayment.visible = false;
      this.statusPayment.visible = false;
    };
    this.statusPayment.onClose = () => {
      this.onStartPayment(this.payment);
    }
    const lazyLoad = this.getAttribute('lazyLoad', true, false);
    if (!lazyLoad) {
      this.networks = this.getAttribute('networks', true, configData.defaultData.networks);
      this.tokens = this.getAttribute('tokens', true, configData.defaultData.tokens);
      this.wallets = this.getAttribute('wallets', true, configData.defaultData.wallets);
    }
    if (this.payment && !this.isInitialized) {
      this.onStartPayment(this.payment);
    }
    this.executeReadyCallback();
  }

  render() {
    return <i-scom-dapp-container id="containerDapp" showHeader={true} showFooter={false} class={dappContainerStyle}>
      <i-stack
        direction="vertical"
        width={360}
        height="100%"
        maxWidth="100%"
        minHeight={480}
        border={{ radius: 12 }}
      >
        <scom-payment-widget--invoice-creation id="invoiceCreation" visible={false} height="100%" />
        <scom-payment-widget--payment-method id="paymentMethod" visible={false} height="100%" />
        <scom-payment-widget--wallet-payment id="walletPayment" visible={false} height="100%" />
        <scom-payment-widget--status-payment id="statusPayment" visible={false} height="100%" />
      </i-stack>
    </i-scom-dapp-container>
  }
}