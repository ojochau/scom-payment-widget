import { Module, Container, customElements, ControlElement, Styles, Button, StackLayout } from '@ijstech/components';
import { PaymentModule } from './components';
import { INetworkConfig, IPaymentActivity, IPaymentInfo, IPlaceOrder, ProductType, IProduct } from './interface';
import { ITokenObject } from "@scom/scom-token-list";
import configData from './defaultData';
import { StatusPaymentTracking } from './components/index';
import translations from './translations.json';
import { Model } from './model';
import { IWalletPlugin } from '@scom/scom-wallet-modal';
const Theme = Styles.Theme.ThemeVars;

export { IProduct, ProductType, IPlaceOrder, IPaymentActivity };
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
	returnUrl?: string;
	mode?: Mode;
	isOnTelegram?: boolean;
	placeMarketplaceOrder?: (data: IPlaceOrder) => Promise<void>;
	onPaymentSuccess?: (data: IPaymentActivity) => Promise<void>;
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
	private model: Model;
	private pnlWrapper: StackLayout;
	private btnPay: Button;
	private statusPaymentTracking: StatusPaymentTracking;
	private paymentModule: PaymentModule;
	private _mode: Mode;
	private _showButtonPay: boolean;
	private _payButtonCaption: string;
	private isUrl: boolean;
	placeMarketplaceOrder: (data: IPlaceOrder) => Promise<void>;
	onPaymentSuccess: (data: IPaymentActivity) => Promise<void>;

	constructor(parent?: Container, options?: ScomPaymentWidgetElement) {
		super(parent, options);
		this.initModel();
	}

	get payment() {
		return this.model.payment;
	}

	set payment(value: IPaymentInfo) {
		this.model.payment = value;
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
		return this.model.baseStripeApi;
	}

	set baseStripeApi(value: string) {
		this.model.baseStripeApi = value;
		if (this.statusPaymentTracking) this.statusPaymentTracking.baseStripeApi = value;
	}

	get returnUrl() {
		return this.model.returnUrl;
	}

	set returnUrl(value: string) {
		this.model.returnUrl = value;
	}

	get wallets() {
		return this.model.wallets;
	}

	set wallets(value: IWalletPlugin[]) {
		this.model.wallets = value;
	}

	get networks() {
		return this.model.networks
	}

	set networks(value: INetworkConfig[]) {
		this.model.networks = value;
	}

	get tokens() {
		return this.model.tokens;
	}

	set tokens(value: ITokenObject[]) {
		this.model.tokens = value;
	}

	get isOnTelegram() {
		return this.model.isOnTelegram;
	}

	set isOnTelegram(value: boolean) {
		this.model.isOnTelegram = value;
	}

	onStartPayment(payment?: IPaymentInfo) {
		this.initModel();
		if (payment) this.payment = payment;
		this.openPaymentModal();
	}

	private async openPaymentModal() {
		if (!this.paymentModule) {
			this.paymentModule = new PaymentModule();
			this.paymentModule.model = this.model;
			if (this.isUrl) {
				this.paymentModule.width = '100%';
				this.paymentModule.maxWidth = 480;
				this.pnlWrapper.appendChild(this.paymentModule);
			}
		}
		if (this.isUrl) {
			await this.paymentModule.ready();
			this.paymentModule.show(false);
			return;
		}
		const modal = this.paymentModule.openModal({
			title: this.i18n.get('$payment'),
			closeOnBackdropClick: false,
			closeIcon: { name: 'times', fill: Theme.colors.primary.main },
			width: 480,
			maxWidth: '100%',
			padding: { left: '1rem', right: '1rem', top: '0.75rem', bottom: '0.75rem' },
			border: { radius: '1rem' }
		});
		await this.paymentModule.ready();
		this.paymentModule.show();
		modal.refresh();
		modal.onClose = () => this.model.processCompletedHandler();
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

	private initModel() {
		if (!this.model) {
			this.model = new Model();
		}
		if (this.placeMarketplaceOrder) {
			this.model.placeMarketplaceOrder = this.placeMarketplaceOrder.bind(this);
		}
		if (this.onPaymentSuccess) {
			this.model.onPaymentSuccess = this.onPaymentSuccess.bind(this);
		}
	}

	async init() {
		this.i18n.init({ ...translations });
		super.init();
		this.openPaymentModal = this.openPaymentModal.bind(this);
		this.placeMarketplaceOrder = this.getAttribute('placeMarketplaceOrder', true) || this.placeMarketplaceOrder;
		this.onPaymentSuccess = this.getAttribute('onPaymentSuccess', true) || this.onPaymentSuccess;
		this.initModel();
		this.handleWidgetUrl();
		const isOnTelegram = this.getAttribute('isOnTelegram', true);
		if (isOnTelegram != null) this.model.isOnTelegram = isOnTelegram;
		const lazyLoad = this.getAttribute('lazyLoad', true, false);
		if (!lazyLoad) {
			const payment = this.getAttribute('payment', true);
			this.mode = this.getAttribute('mode', true, 'payment');
			this.baseStripeApi = this.getAttribute('baseStripeApi', true, this.baseStripeApi);
			this.returnUrl = this.getAttribute('returnUrl', true, this.returnUrl);
			this.showButtonPay = this.getAttribute('showButtonPay', true, false);
			this.payButtonCaption = this.getAttribute('payButtonCaption', true, this.i18n.get('$pay'));
			this.networks = this.getAttribute('networks', true, configData.defaultData.networks);
			this.tokens = this.getAttribute('tokens', true);
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
		return <i-panel width='100%'>
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
		</i-panel>
	}
}