export enum ProductType {
	Physical = "Physical",
	Digital = "Digital",
	Course = "Course",
	Ebook = "Ebook",
	Membership = "Membership",
	Bundle = "Bundle"
}

export interface IProduct {
  name: string;
  price: number | string;
  quantity: number;
  shippingCost?: number;
  images?: string[];
  productType?: ProductType;
  stallId?: string;
}

export interface IPaymentInfo {
  title: string;
  products: IProduct[];
  description?: string;
  paymentId?: string;
  currency?: string;
  payload?: string;
  address?: string; //wallet
  provider?: PaymentProvider;
  userInfo?: {
    name: string;
    email: string;
  }
}

export enum PaymentType {
  Fiat = 'Fiat',
  Crypto = 'Crypto'
}

export enum PaymentProvider {
  Stripe = 'Stripe',
  Paypal = 'Paypal',
  TonWallet = 'Ton Wallet',
  Metamask = 'Metamask'
}

export interface IPaymentStatus {
  status: 'pending' | 'complete' | 'failed';
  receipt: string;
  provider: PaymentProvider;
  ownerAddress: string;
}

export interface INetworkConfig {
  chainName?: string;
  chainId: number;
}
