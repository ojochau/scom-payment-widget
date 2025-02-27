import { INetwork } from "@ijstech/eth-wallet";

export enum ProductType {
  Physical = "Physical",
  Digital = "Digital",
  Course = "Course",
  Ebook = "Ebook",
  Membership = "Membership",
  Bundle = "Bundle"
}

export interface IProduct extends IReservationProduct {
  id: string;
  name: string;
  description?: string;
  price: number | string;
  quantity: number;
  currency?: string;
  images?: string[];
  productType?: ProductType;
  stallId?: string;
  stallUri?: string;
  shipping?: IStallShipping[];
  communityUri?: string;
}

interface IReservationProduct {
  parentProductId?: string;
  id: string;
  time?: number;
  providerName?: string;
  serviceName?: string;
  duration?: number;
  durationUnit?: string;
  capacity?: number;
}

interface IStallShipping {
  id: string;
  name?: string;
  cost: number;
  regions?: string[];
  amountWithOthers?: number;
}

export interface ICryptoPayoutOption {
  chainId?: string;
  cryptoCode: string;
  networkCode: string;
  tokenAddress?: string;
  walletAddress: string;
}

export interface IRewardsPoints {
  creatorId: string;
  communityId: string;
  points: number;
}

export interface IRewardsPointsOption {
  creatorId: string;
  communityId: string;
  exchangeRate: number;
  upperBoundary?: number;
}

export interface IPaymentInfo {
  title: string;
  products: IProduct[];
  description?: string;
  paymentId?: string;
  currency?: string;
  payload?: string;
  address?: string; //wallet
  cryptoPayoutOptions?: ICryptoPayoutOption[];
  rewardsPointsOptions?: IRewardsPointsOption[];
  stripeAccountId?: string;
}

interface IOrderItem {
  productId: string;
  productName?: string;
  quantity: number;
  price?: number;
  reservationTime?: number;
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
  rewardsPoints?: IRewardsPoints;
}

export interface IPlaceOrder {
  merchantId: string;
  stallId: string;
  order: IOrder;
}

export enum PaymentMethod {
  EVM = "EVM",
  TON = "TON",
  Stripe = "Stripe",
  RewardsPoints = "RewardsPoints"
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
  paymentMethod?: PaymentMethod;
  createdAt?: number;
  rewardsPoints?: IRewardsPoints;
}

export enum PaymentType {
  Fiat = 'Fiat',
  Crypto = 'Crypto',
  RewardsPoints = 'RewardsPoints'
}

export enum PaymentProvider {
  Stripe = 'Stripe',
  Paypal = 'Paypal',
  TonWallet = 'Ton Wallet',
  Metamask = 'Metamask'
}

export interface IPaymentStatus {
  status: 'pending' | 'completed' | 'failed';
  receipt?: string;
  provider?: PaymentProvider;
  ownerAddress?: string;
}

export interface INetworkConfig {
  chainName?: string;
  chainId: number;
}

export interface IExtendedNetwork extends INetwork {
  explorerTxUrl?: string;
  explorerAddressUrl?: string;
  networkCode?: string;
};