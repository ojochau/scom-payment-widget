import { INetworkConfig, IOrder, IPaymentActivity, IPaymentInfo, IPlaceOrder, IShippingInfo, ProductType } from './interface';
import { ITokenObject } from '@scom/scom-token-list';
import configData from './defaultData';
import { stripeCurrencies, stripeSpecialCurrencies, stripeZeroDecimalCurrencies } from './store';
import { IdUtils } from '@ijstech/components';
declare const window: any;

export class Model {
	private _payment: IPaymentInfo = { title: '', products: [] };
	private _baseStripeApi: string;
	private _urlStripeTracking: string;
	private _wallets: any[] = [];
	private _networks: INetworkConfig[] = [];
	private _tokens: ITokenObject[] = [];
	private _referenceId: string;
	private _networkCode: string;
	private _paymentMethod: 'Stripe' | 'EVM';
	private orderId: string;
	private shippingInfo: IShippingInfo = {
		contact: {
			nostr: ''
		}
	};
	public onPaymentSuccess: (data: IPaymentActivity) => Promise<void>;
	public placeMarketplaceOrder: (data: IPlaceOrder) => Promise<void>;

	constructor() { }

	get title() {
		return this.payment.title || '';
	}

	get paymentId() {
		return this.payment.paymentId || '';
	}

	get payment() {
		return this._payment;
	}

	set payment(value: IPaymentInfo) {
		this._payment = value;
	}

	get products() {
		return this.payment.products || [];
	}

	get currency() {
		return this.payment.currency || 'USD';
	}

	get stripeCurrency() {
		const currency = this.payment.currency?.toLowerCase();
		const stripeCurrency = stripeCurrencies.find(v => v === currency) || 'usd';
		return stripeCurrency;
	}

	get totalPrice() {
		return this.products?.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0) || 0;
	}

	get totalShippingCost() {
		return this.products?.reduce((sum, item) => sum + (Number(item.shippingCost || 0) * item.quantity), 0) || 0;
	}

	get totalAmount() {
		return this.totalPrice + this.totalShippingCost
	}

	get stripeAmount() {
		const currency = this.stripeCurrency.toLowerCase();
		const amount = this.totalAmount;
		if (stripeZeroDecimalCurrencies.includes(currency)) return Math.round(amount);
		if (stripeSpecialCurrencies.includes(currency)) return Math.round(amount) * 100;
		return Math.round(amount * 100);
	}

	get totalQuantity() {
		return this.products?.reduce((sum, item) => sum + item.quantity, 0) || 0;
	}

	get hasPhysicalProduct() {
		return this.products.some(v => v.productType === ProductType.Physical);
	}

	get walletAddress() {
		return this.payment?.address || '';
	}

	get baseStripeApi() {
		return this._baseStripeApi ?? '/stripe';
	}

	set baseStripeApi(value: string) {
		this._baseStripeApi = value;
	}

	get urlStripeTracking() {
		return this._urlStripeTracking ?? `${window.location.origin}/#!/stripe-payment-status`;
	}

	set urlStripeTracking(value: string) {
		this._urlStripeTracking = value;
	}

	get wallets() {
		return this._wallets ?? configData.defaultData.wallets;
	}

	set wallets(value: any[]) {
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

	get referenceId() {
		return this._referenceId;
	}

	set referenceId(value: string) {
		this._referenceId = value;
	}

	get networkCode() {
		return this._networkCode || '';
	}

	set networkCode(value: string) {
		this._networkCode = value;
	}

	get paymentMethod() {
		return this._paymentMethod;
	}

	set paymentMethod(value: 'Stripe' | 'EVM') {
		this._paymentMethod = value;
	}

	get placeOrder(): IPlaceOrder {
		const { stallId, stallUri } = this.products[0];
		const merchantId = stallUri?.split(':')[1] || '';
		const order: IOrder = {
			id: this.orderId,
			...this.shippingInfo,
			currency: this.currency,
			totalAmount: this.totalAmount,
			items: this.products.map(v => {
				return {
					productName: v.name,
					productId: v.id,
					price: v.price as number,
					quantity: v.quantity
				}
			})
		}
		return {
			merchantId,
			stallId,
			order
		}
	}

	get paymentActivity(): IPaymentActivity {
		const { merchantId, stallId } = this.placeOrder;
		return {
			id: IdUtils.generateUUID(),
			sender: '',
			recipient: merchantId,
			amount: this.totalAmount.toString(),
			currencyCode: this.currency,
			networkCode: this.networkCode,
			stallId: stallId,
			orderId: this.orderId,
			referenceId: this.referenceId,
			paymentMethod: this.paymentMethod
		}
	}

	async handlePlaceMarketplaceOrder() {
		if (this.placeMarketplaceOrder) {
			this.orderId = IdUtils.generateUUID();
			await this.placeMarketplaceOrder(this.placeOrder);
		}
	}

	async handlePaymentSuccess() {
		if (this.onPaymentSuccess) {
			await this.onPaymentSuccess(this.paymentActivity);
		}
	}

	updateShippingInfo(value: IShippingInfo) {
		this.shippingInfo = value;
	}

	async createPaymentIntent(): Promise<string> {
		try {
			const response = await fetch(`${this.baseStripeApi}/payment-intent`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					currency: this.stripeCurrency,
					amount: this.stripeAmount
				})
			});
			if (response.ok) {
				const data = await response.json();
				if (data.clientSecret) {
					const clientSecret = data.clientSecret;
					return clientSecret;
				}
				return null;
			}
		} catch { }
		return null;
	}
}
