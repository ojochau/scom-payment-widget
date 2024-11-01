import { Module, Container, customElements, ControlElement, Styles, Button, Modal } from '@ijstech/components';
import { PaymentModule } from './components';
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
	private state: State;
	private paymentModule: PaymentModule;
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
		this.openPaymentModal();
	}

	private updatePayment(payment: IPaymentInfo) {
		this._payment = payment;
	}

	private async openPaymentModal() {
		if (!this.paymentModule) {
			this.paymentModule = new PaymentModule();
			this.paymentModule.state = this.state;
		}
		this.paymentModule.wallets = this.wallets;
		this.paymentModule.networks = this.networks;
		this.paymentModule.tokens = this.tokens;
		this.paymentModule.onPaymentSuccess = this.onPaymentSuccess;
		const modal = this.paymentModule.openModal({
			title: 'Payment',
			closeIcon: { name: 'times', fill: Theme.colors.primary.main },
			width: 480,
			maxWidth: '100%',
			padding: { left: '1rem', right: '1rem', top: '0.75rem', bottom: '0.75rem' },
			border: { radius: '1rem' }
		});
		await this.paymentModule.ready();
		this.paymentModule.show(this._payment);
		modal.refresh();
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
		this.openPaymentModal = this.openPaymentModal.bind(this);
		this.onPaymentSuccess = this.getAttribute('onPaymentSuccess', true) || this.onPaymentSuccess;
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
					font={{ size: '1rem', color: Theme.colors.primary.contrastText, bold: true }}
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
			</i-modal>
		</i-scom-dapp-container>
	}
}