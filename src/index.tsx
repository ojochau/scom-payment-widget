import { Module, Container, customElements, ControlElement, Styles, Button, Modal } from '@ijstech/components';
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
const Theme = Styles.Theme.ThemeVars;

interface ScomPaymentWidgetElement extends ControlElement {
	lazyLoad?: boolean;
	payment?: IPaymentInfo;
	wallets?: IWalletPlugin[];
	networks?: INetworkConfig[];
	tokens?: ITokenObject[];
	showButtonPay?: boolean;
	payButtonCaption?: string;
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
	private btnPay: Button;
	private mdPayment: Modal;
	private state: State;
	private invoiceCreation: InvoiceCreation;
	private paymentMethod: PaymentMethod;
	private walletPayment: WalletPayment;
	private stripePayment: StripePayment;
	private statusPayment: StatusPayment;
	private _payment: IPaymentInfo;
	private _showButtonPay: boolean;
	private _payButtonCaption: string;

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
		this.updatePayment(value);
		if (this.btnPay) this.btnPay.enabled = !!value;
	}

	get showButtonPay() {
		return this._showButtonPay;
	}

	set showButtonPay(value: boolean) {
		this._showButtonPay = value;
		if (this.btnPay) this.btnPay.visible = value;
	}

	get payButtonCaption() {
		return this._payButtonCaption || 'Pay';
	}

	set payButtonCaption(value: string) {
		this._payButtonCaption = value;
		if (this.btnPay) this.btnPay.caption = value;
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
				secondaryColor: '#444444',
				modalColor: '#000'
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

	onStartPayment(payment?: IPaymentInfo) {
		this.updatePayment(payment || this.payment);
		if (this.mdPayment) this.mdPayment.visible = true;
	}

	private updatePayment(payment: IPaymentInfo) {
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

	private handlePay() {
		if (this.payment) {
			this.onStartPayment(this.payment);
		}
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
		this.paymentMethod.onBack = () => {
			this.paymentMethod.visible = false;
			this.invoiceCreation.visible = true;
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
			this.showButtonPay = this.getAttribute('showButtonPay', true, false);
			this.payButtonCaption = this.getAttribute('payButtonCaption', true, 'Pay');
			this.networks = this.getAttribute('networks', true, configData.defaultData.networks);
			this.tokens = this.getAttribute('tokens', true, configData.defaultData.tokens);
			this.wallets = this.getAttribute('wallets', true, configData.defaultData.wallets);
			if (payment) this.payment = payment;
		}
		this.btnPay.visible = this.showButtonPay;
		this.btnPay.enabled = !!this.payment;
		this.btnPay.caption = this.payButtonCaption;
		this.executeReadyCallback();
	}

	render() {
		return <i-scom-dapp-container id="containerDapp" showHeader={true} showFooter={false} class={dappContainerStyle}>
			<i-stack
				direction="vertical"
				alignItems="center"
				width="100%"
				height="100%"
			>
				<i-button
					id="btnPay"
					visible={false}
					enabled={false}
					caption="Pay"
					width="100%"
					minWidth={60}
					maxWidth={180}
					padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
					font={{ size: '1rem', color: Theme.colors.primary.contrastText }}
					background={{ color: Theme.colors.primary.main }}
					border={{ radius: 12 }}
					onClick={this.handlePay}
				/>
			</i-stack>
			<i-modal
				id="mdPayment"
				title="Payment"
				closeIcon={{ name: 'times', fill: Theme.colors.primary.main }}
				visible={false}
				width={480}
				maxWidth="100%"
				padding={{ left: '1rem', right: '1rem', top: '0.75rem', bottom: '0.75rem' }}
				border={{ radius: '1rem' }}
			>
				<i-stack
					margin={{ top: '1rem' }}
					direction="vertical"
					width="100%"
					height={480}
					border={{ radius: 12, style: 'solid', width: 1, color: Theme.action.hover }}
					overflow="hidden"
				>
					<scom-payment-widget--invoice-creation id="invoiceCreation" visible={false} height="100%" />
					<scom-payment-widget--payment-method id="paymentMethod" visible={false} height="100%" />
					<scom-payment-widget--wallet-payment id="walletPayment" visible={false} height="100%" />
					<scom-payment-widget--stripe-payment id="stripePayment" visible={false} height="100%" />
					<scom-payment-widget--status-payment id="statusPayment" visible={false} height="100%" />
				</i-stack>
			</i-modal>
		</i-scom-dapp-container>
	}
}