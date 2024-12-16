export enum ProductType {
  Physical = "Physical",
  Digital = "Digital",
  Course = "Course",
  Ebook = "Ebook",
  Membership = "Membership",
  Bundle = "Bundle"
}

export interface IProduct {
  id: string;
  name: string;
  price: number | string;
  quantity: number;
  shippingCost?: number;
  images?: string[];
  productType?: ProductType;
  stallId?: string;
  stallUri?: string;
}

export interface IPaymentInfo {
  title: string;
  products: IProduct[];
  description?: string;
  paymentId?: string;
  currency?: string;
  payload?: string;
  address?: string; //wallet
}

interface IOrderItem {
  productId: string;
  productName?: string;
  quantity: number;
  price?: number;
}

export interface IShippingInfo {
  name?: string;
  address?: string;
  message?: string;
  contact: {
    nostr: string;
    phone?: string;
    email?: string;
  };
  shippingId?: string;
  shippingCost?: number;
}

export interface IOrder extends IShippingInfo {
  id: string;
  currency?: string;
  totalAmount?: number;
  items: IOrderItem[];
}

export interface IPlaceOrder {
  merchantId: string;
  stallId: string;
  order: IOrder;
}

export interface IPaymentActivity {
  id: string;
  sender: string;
  recipient: string;
  amount: string;
  currencyCode: string;
  networkCode?: string;
  stallId?: string;
  stallName?: string;
  orderId?: string;
  referenceId?: string;
  paymentMethod?: 'Stripe' | 'EVM';
  createdAt?: number;
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
