export interface IPaymentInfo {
  title: string;
  description?: string;
  // paymentId: string;
  amount: number;
  currency?: string;
  photoUrl?: string;
  payload?: string;
  prices?: { label: string; amount: number | string }[];
  address?: string; //wallet
  provider?: PaymentProvider;
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
