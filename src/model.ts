import { IExtendedNetwork, INetworkConfig, IOrder, IPaymentActivity, IPaymentInfo, IPlaceOrder, IShippingInfo, PaymentProvider, ProductType } from './interface';
import { ITokenObject } from '@scom/scom-token-list';
import configData from './defaultData';
import { stripeCurrencies, stripeSpecialCurrencies, stripeZeroDecimalCurrencies } from './store';
import { application, Component, IdUtils } from '@ijstech/components';
import ScomWalletModal from '@scom/scom-wallet-modal';
import { IClientSideProvider } from '@ijstech/eth-wallet';
import TonWalletProvider from './wallets/tonProvider';
import { EVMWallet, TonWallet } from './wallets';

declare const window: any;

export interface IWalletModel {
	isWalletConnected(): boolean;
	isNetworkConnected(): boolean;
	getNetworkInfo(chainId?: number): IExtendedNetwork;
	openNetworkModal(modalContainer: Component): Promise<void>;
	// connectWallet(modalContainer?: Component): Promise<void>;
	switchNetwork(): Promise<void>;
	disconnectWallet(): Promise<void>;
	getWalletAddress(): string;
	viewExplorerByTransactionHash(hash: string) : void;
	getTokenBalance(token: ITokenObject): Promise<string>;
	transferToken(to: string, token: ITokenObject, amount: number, callback?: (error: Error, receipt?: string) => Promise<void>, confirmationCallback?: (receipt: any) => Promise<void>): Promise<any>;
}

export class Model {
	private _payment: IPaymentInfo = { title: '', products: [] };
	private _baseStripeApi: string;
	private _returnUrl: string;
	private _wallets: any[] = [];
	private _networks: INetworkConfig[] = [];
	private _tokens: ITokenObject[] = [];
	private _referenceId: string;
	private _networkCode: string;
	private _paymentMethod: 'Stripe' | 'EVM';
	private _isCompleted: boolean;
	private orderId: string;
	private shippingInfo: IShippingInfo = {
		contact: {
			nostr: ''
		}
	};
	public onPaymentSuccess: (data: IPaymentActivity) => Promise<void>;
	public placeMarketplaceOrder: (data: IPlaceOrder) => Promise<void>;
	private _walletModel: IWalletModel;
	private mdWallet: ScomWalletModal;
	private _isOnTelegram: boolean;
	constructor() { }

	get walletModel() {
		return this._walletModel;
	}

	set walletModel(value: IWalletModel) {
		this._walletModel = value;
	}

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
		return 0; //TODO shipping cost
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

	get toAddress() {
		return this.payment?.address || '';
	}

	get cryptoPayoutOptions() {
		return this.payment?.cryptoPayoutOptions || [];
	}

	get stripeAccountId() {
		return this.payment?.stripeAccountId
	}

	get hasPayment() {
		return this.cryptoPayoutOptions.length > 0 || !!this.stripeAccountId;
	}

	get isShippingInfoShown() {
		return this.hasPayment && this.hasPhysicalProduct;
	}

	get baseStripeApi() {
		return this._baseStripeApi ?? '/stripe';
	}

	set baseStripeApi(value: string) {
		this._baseStripeApi = value;
	}

	get returnUrl() {
		return this._returnUrl ?? `${window.location.origin}/#!/invoice-detail`;
	}

	set returnUrl(value: string) {
		this._returnUrl = value;
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
		return this._tokens;
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

	get isOnTelegram() {
		return this._isOnTelegram;
	}

	set isOnTelegram(value: boolean) {
		this._isOnTelegram = value;
	}

	get isCompleted() {
		return this._isCompleted;
	}

	set isCompleted(value: boolean) {
		this._isCompleted = value;
	}

	get placeOrder(): IPlaceOrder {
		const { stallId, stallUri } = this.products[0];
		const merchantId = stallUri?.split(':')[1] || '';
		const shippingInfo = this.isShippingInfoShown ? this.shippingInfo : {
			contact: {
				nostr: ''
			}
		}
		const order: IOrder = {
			id: this.orderId,
			...shippingInfo,
			currency: this.currency,
			totalAmount: this.totalAmount,
			items: this.products.map(v => {
				let params = {
					productName: v.name,
					productId: v.id,
					price: v.price as number,
					quantity: v.quantity
				}
				if (v.time) {
					params['reservationTime'] = v.time;
				}
				if (v.parentProductId) {
					params['parentProductId'] = v.parentProductId;
				}
				return params;
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

	async handleWalletConnected() {		
	}

	async handleWalletChainChanged() {
	}

	async connectWallet(moduleDir: string, modalContainer: Component) {
		return new Promise<PaymentProvider>(async (resolve, reject) => {
			if (!this.mdWallet) {
				const tonWalletProvider = new TonWalletProvider(null, { name: 'tonwallet' });
				const tonWallet = new TonWallet(
					tonWalletProvider,
					moduleDir, 
					this.handleWalletConnected.bind(this)
				);
				tonWalletProvider.onAccountChanged = (account: string) => {
					this.mdWallet.hideModal();
					this.walletModel = tonWallet;
					this.handleWalletConnected();
				}
				const evmWallet = new EVMWallet();
				evmWallet.on("chainChanged", () => {
					this.walletModel = evmWallet;
					this.handleWalletChainChanged();
				});
				evmWallet.on("walletConnected", () => {
					this.walletModel = evmWallet;
					this.handleWalletConnected();
				});
				evmWallet.setData({
					wallets: this.wallets,
					networks: this.networks,
					defaultChainId: configData.defaultData.defaultChainId
				})
				evmWallet.initWallet();
				const wallets = [
					{
						"name": "metamask"
					},
					{
						"name": "walletconnect"
					},
					{
						"name": "tonwallet",
						provider: tonWalletProvider
					}
				]
				await application.loadPackage('@scom/scom-wallet-modal', '*');
				this.mdWallet = new ScomWalletModal(undefined, {
					wallets: this.isOnTelegram ? wallets.slice(2) : wallets,
					networks: this.networks,
					onCustomWalletSelected: async (provider: IClientSideProvider) => {
						console.log('onCustomWalletSelected', provider);
						let paymentProvider: PaymentProvider;
						if (provider.name === 'tonwallet') {
							this.walletModel = tonWallet;
							paymentProvider = PaymentProvider.TonWallet;
						}
						else {
							this.walletModel = evmWallet;
							paymentProvider = PaymentProvider.Metamask;
						}
						resolve(paymentProvider);
					}
				});
				modalContainer.append(this.mdWallet);
				await this.mdWallet.ready();
			}
			this.mdWallet.showModal();
		});
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
			this.isCompleted = true;
		}
	}

	processCompletedHandler() {
		if (this.isCompleted) {
			window.location.assign(`${this.returnUrl}/${this.paymentActivity.orderId || ''}`);
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
					amount: this.stripeAmount,
					accountId: this.stripeAccountId
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
