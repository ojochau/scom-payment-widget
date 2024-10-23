export interface IPaymentInfo {
  paymentId: string;
  amount: number;
  address?: string;
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
