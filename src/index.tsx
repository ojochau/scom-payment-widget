import { Module, Container, customElements, ControlElement, Styles, Button, StackLayout } from '@ijstech/components';
import { PaymentModule } from './components';
import { INetworkConfig, IPaymentInfo, ProductType } from './interface';
import { State } from './store';
import { IWalletPlugin } from '@scom/scom-wallet-modal';
import { ITokenObject } from "@scom/scom-token-list";
import configData from './defaultData';
import { dappContainerStyle } from './index.css';
import { IRpcWallet } from '@ijstech/eth-wallet';
import ScomDappContainer from '@scom/scom-dapp-container';
import { StatusPaymentTracking } from './components/index';
import translations from './translations.json';
const Theme = Styles.Theme.ThemeVars;

export { ProductType };
type Mode = 'payment' | 'status';
interface ScomPaymentWidgetElement extends ControlElement {
	lazyLoad?: boolean;
	payment?: IPaymentInfo;
	wallets?: IWalletPlugin[];
	networks?: INetworkConfig[];
	tokens?: ITokenObject[];
	showButtonPay?: boolean;
	payButtonCaption?: string;
	baseStripeApi?: string;
	urlStripeTracking?: string;
	mode?: Mode;
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
	private pnlWrapper: StackLayout;
	private btnPay: Button;
	private statusPaymentTracking: StatusPaymentTracking;
	private state: State;
	private paymentModule: PaymentModule;
	private _payment: IPaymentInfo;
	private _mode: Mode;
	private _baseStripeApi: string;
	private _urlStripeTracking: string;
	private _showButtonPay: boolean;
	private _payButtonCaption: string;
	private isUrl: boolean;

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
		if (this.btnPay) this.btnPay.enabled = !!value;
	}

	get mode() {
		return this._mode || 'payment';
	}

	set mode(value: Mode) {
		this._mode = value;
		this.updateUIByMode();
	}

	get showButtonPay() {
		return this._showButtonPay;
	}

	set showButtonPay(value: boolean) {
		this._showButtonPay = value;
		if (this.btnPay) this.btnPay.visible = !this.isUrl && value;
	}

	get payButtonCaption() {
		return this._payButtonCaption || this.i18n.get('$pay');
	}

	set payButtonCaption(value: string) {
		this._payButtonCaption = value;
		if (this.btnPay) this.btnPay.caption = value;
	}

	get baseStripeApi() {
		return this._baseStripeApi;
	}

	set baseStripeApi(value: string) {
		this._baseStripeApi = value;
		if (this.statusPaymentTracking) this.statusPaymentTracking.baseStripeApi = value;
	}

	get urlStripeTracking() {
		return this._urlStripeTracking;
	}

	set urlStripeTracking(value: string) {
		this._urlStripeTracking = value;
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
		if (payment) this._payment = payment;
		this.openPaymentModal();
	}

	private async openPaymentModal() {
		if (!this.paymentModule) {
			this.paymentModule = new PaymentModule();
			this.paymentModule.state = this.state;
			this.paymentModule.dappContainer = this.containerDapp;
			if (this.isUrl) {
				this.paymentModule.width = '100%';
				this.paymentModule.maxWidth = 480;
				this.pnlWrapper.appendChild(this.paymentModule);
			}
		}
		this.paymentModule.wallets = this.wallets;
		this.paymentModule.networks = this.networks;
		this.paymentModule.tokens = this.tokens;
		this.paymentModule.baseStripeApi = this.baseStripeApi;
		this.paymentModule.urlStripeTracking = this.urlStripeTracking;
		this.paymentModule.onPaymentSuccess = this.onPaymentSuccess;
		if (this.isUrl) {
			await this.paymentModule.ready();
			this.paymentModule.show(this._payment, false);
			return;
		}
		const modal = this.paymentModule.openModal({
			title: this.i18n.get('$payment'),
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

	private updateUIByMode() {
		if (!this.statusPaymentTracking) return;
		this.statusPaymentTracking.baseStripeApi = this.baseStripeApi;
		this.statusPaymentTracking.visible = this.mode === 'status';
		this.btnPay.visible = !this.isUrl && this.mode === 'payment' && this.showButtonPay;
	}

	private handleWidgetUrl() {
		try {
			const paths = window.location.hash.split('/');
			const dataBase64 = decodeURIComponent(paths[paths.length - 1]);
			const params = JSON.parse(atob(dataBase64));
			if (params?.isUrl) {
				this.isUrl = true;
				const { payment, baseStripeApi } = params;
				if (baseStripeApi) this.baseStripeApi = baseStripeApi;
				this.width = '100%';
				this.maxWidth = 480;
				this.padding = { left: '1rem', right: '1rem', top: '1rem', bottom: '1rem' };
				this.onStartPayment(payment);
			}
		} catch { }
	}

	async init() {
		if (!this.state) {
			this.state = new State(configData);
		}
		this.i18n.init({ ...translations });
		super.init();
		this.updateTheme();
		this.openPaymentModal = this.openPaymentModal.bind(this);
		this.onPaymentSuccess = this.getAttribute('onPaymentSuccess', true) || this.onPaymentSuccess;
		this.handleWidgetUrl();
		const lazyLoad = this.getAttribute('lazyLoad', true, false);
		if (!lazyLoad) {
			const payment = this.getAttribute('payment', true);
			this.mode = this.getAttribute('mode', true, 'payment');
			this.baseStripeApi = this.getAttribute('baseStripeApi', true);
			this.urlStripeTracking = this.getAttribute('urlStripeTracking', true);
			this.showButtonPay = this.getAttribute('showButtonPay', true, false);
			this.payButtonCaption = this.getAttribute('payButtonCaption', true, this.i18n.get('$pay'));
			this.networks = this.getAttribute('networks', true, configData.defaultData.networks);
			this.tokens = this.getAttribute('tokens', true, configData.defaultData.tokens);
			this.wallets = this.getAttribute('wallets', true, configData.defaultData.wallets);
			if (payment) this.payment = payment;
		}
		this.btnPay.visible = !this.isUrl && this.showButtonPay;
		this.btnPay.enabled = !!this.payment;
		this.btnPay.caption = this.payButtonCaption;
		this.updateUIByMode();
		this.executeReadyCallback();
	}

	render() {
		return <i-scom-dapp-container id="containerDapp" showHeader={true} showFooter={false} class={dappContainerStyle}>
			<i-stack
				id="pnlWrapper"
				direction="vertical"
				alignItems="center"
				width="100%"
				height="100%"
			>
				<i-button
					id="btnPay"
					visible={false}
					enabled={false}
					caption="$pay"
					width="100%"
					minWidth={60}
					maxWidth={180}
					padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
					font={{ size: '1rem', color: Theme.colors.primary.contrastText, bold: true }}
					background={{ color: Theme.colors.primary.main }}
					border={{ radius: 12 }}
					onClick={this.handlePay}
				/>
				<scom-payment-widget--stripe-payment-tracking id="statusPaymentTracking" visible={false} width="100%" height="100%" />
			</i-stack>
		</i-scom-dapp-container>
	}
}