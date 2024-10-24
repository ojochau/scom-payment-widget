import { Module, Container, customElements, ControlElement } from '@ijstech/components';
import { InvoiceCreation, PaymentMethod, WalletPayment, StripePayment, StatusPayment } from './components/index';
import { INetworkConfig, IPaymentInfo, IPaymentStatus, PaymentProvider } from './interface';
import { State } from './store';
import { IWalletPlugin } from '@scom/scom-wallet-modal';
import { ITokenObject } from "@scom/scom-token-list";
import configData from './data';
import '@scom/scom-dapp-container';
import { dappContainerStyle } from './index.css';
import { IRpcWallet } from '@ijstech/eth-wallet';
import ScomDappContainer from '@scom/scom-dapp-container';

interface ScomPaymentWidgetElement extends ControlElement {
	lazyLoad?: boolean;
	payment?: IPaymentInfo;
	wallets?: IWalletPlugin[];
	networks?: INetworkConfig[];
	tokens?: ITokenObject[];
	onPaymentSuccess?: (status: string) => Promise<void>;
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
	private containerDapp: ScomDappContainer;
	private state: State;
	private invoiceCreation: InvoiceCreation;
	private paymentMethod: PaymentMethod;
	private walletPayment: WalletPayment;
	private stripePayment: StripePayment;
	private statusPayment: StatusPayment;
	private _payment: IPaymentInfo;

	private _wallets: IWalletPlugin[] = [];
	private _networks: INetworkConfig[] = [];
	private _tokens: ITokenObject[] = [];
	public onPaymentSuccess: (status: string) => Promise<void>;

	constructor(parent?: Container, options?: ScomPaymentWidgetElement) {
		super(parent, options);
	}

	get payment() {
		return this._payment;
	}

	set payment(value: IPaymentInfo) {
		this._payment = value;
		this.onStartPayment(value);
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

	private async updateTheme() {
		const themeVar = this.containerDapp?.theme || 'dark';
		this.updateStyle('--divider', '#fff');
		const theme = {
			[themeVar]: {
				inputFontColor: '#fff',
				secondaryColor: '#444444'
			}
		};
		await this.containerDapp.ready();
		this.containerDapp.setTag(theme);
	}

	private updateStyle(name: string, value: any) {
		if (value) {
			this.style.setProperty(name, value);
		} else {
			this.style.removeProperty(name);
		}
	}

	onStartPayment(payment: IPaymentInfo) {
		this._payment = payment;
		if (!this.invoiceCreation) return;
		this.invoiceCreation.payment = payment;
		this.invoiceCreation.visible = true;
		this.paymentMethod.payment = payment;
		this.paymentMethod.visible = false;
		this.walletPayment.visible = false;
		this.walletPayment.state = this.state;
		this.stripePayment.payment = payment;
		this.stripePayment.visible = false;
		this.statusPayment.visible = false;
	}

	async init() {
		if (!this.state) {
			this.state = new State(configData);
		}
		super.init();
		this.updateTheme();
		this.onPaymentSuccess = this.getAttribute('onPaymentSuccess', true) || this.onPaymentSuccess;
		this.invoiceCreation.onContinue = () => {
			this.invoiceCreation.visible = false;
			this.paymentMethod.visible = true;
		};
		this.paymentMethod.onSelectedPaymentProvider = (payment: IPaymentInfo, paymentProvider: PaymentProvider) => {
			this.paymentMethod.visible = false;
			if (paymentProvider === PaymentProvider.Metamask || paymentProvider === PaymentProvider.TonWallet) {
				this.paymentMethod.visible = false;
				this.walletPayment.wallets = this.wallets;
				this.walletPayment.networks = this.networks;
				this.walletPayment.tokens = this.tokens;
				this.walletPayment.onStartPayment({
					...payment,
					provider: paymentProvider
				})
				this.walletPayment.visible = true;
			} else {
				this.stripePayment.visible = true;
			}
		};
		this.walletPayment.onPaid = (paymentStatus: IPaymentStatus) => {
			this.walletPayment.visible = false;
			this.statusPayment.visible = true;
			this.statusPayment.updateStatus(this.state, paymentStatus);
		}
		this.walletPayment.onBack = () => {
			this.paymentMethod.visible = true;
			this.walletPayment.visible = false;
		};
		this.stripePayment.onBack = () => {
			this.paymentMethod.visible = true;
			this.stripePayment.visible = false;
		}
		this.stripePayment.onPaymentSuccess = (status: string) => {
			if (this.onPaymentSuccess) this.onPaymentSuccess(status);
		}
		this.statusPayment.onClose = (status: string) => {
			if (this.onPaymentSuccess) this.onPaymentSuccess(status);
		}
		const lazyLoad = this.getAttribute('lazyLoad', true, false);
		if (!lazyLoad) {
			const payment = this.getAttribute('payment', true);
			this.networks = this.getAttribute('networks', true, configData.defaultData.networks);
			this.tokens = this.getAttribute('tokens', true, configData.defaultData.tokens);
			this.wallets = this.getAttribute('wallets', true, configData.defaultData.wallets);
			if (payment) this.payment = payment;
		}
		this.executeReadyCallback();
	}

	render() {
		return <i-scom-dapp-container id="containerDapp" showHeader={true} showFooter={false} class={dappContainerStyle}>
			<i-stack
				direction="vertical"
				width="100%"
				height="100%"
				minHeight={480}
				border={{ radius: 12 }}
			>
				<scom-payment-widget--invoice-creation id="invoiceCreation" visible={false} height="100%" />
				<scom-payment-widget--payment-method id="paymentMethod" visible={false} height="100%" />
				<scom-payment-widget--wallet-payment id="walletPayment" visible={false} height="100%" />
				<scom-payment-widget--stripe-payment id="stripePayment" visible={false} height="100%" />
				<scom-payment-widget--status-payment id="statusPayment" visible={false} height="100%" />
			</i-stack>
		</i-scom-dapp-container>
	}
}