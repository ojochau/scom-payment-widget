import { application } from "@ijstech/components";
import { INetwork, Wallet, IRpcWallet, IClientWallet } from "@ijstech/eth-wallet";
import getNetworkList from "@scom/scom-network-list";
import { PaymentProvider, PaymentType } from "./interface";

const infuraId = 'adc596bf88b648e2a8902bc9093930c5';

export const STRIPE_LIB_URL = 'https://js.stripe.com/v3';

interface IExtendedNetwork extends INetwork {
  explorerName?: string;
  explorerTxUrl?: string;
  explorerAddressUrl?: string;
}

export class State {
  rpcWalletId: string = '';
  networkMap = {} as { [key: number]: IExtendedNetwork };
  infuraId: string = '';

  constructor(options: any) {
    if (options.infuraId) {
      this.infuraId = options.infuraId;
    }
  }

  initRpcWallet(defaultChainId: number) {
    if (this.rpcWalletId) {
      return this.rpcWalletId;
    }
    const clientWallet = Wallet.getClientInstance();
    const networkList: INetwork[] = Object.values(application.store?.networkMap || []);
    const instanceId = clientWallet.initRpcWallet({
      networks: networkList,
      defaultChainId,
      infuraId: application.store?.infuraId,
      multicalls: application.store?.multicalls
    });
    this.rpcWalletId = instanceId;
    if (clientWallet.address) {
      const rpcWallet = Wallet.getRpcWalletInstance(instanceId);
      rpcWallet.address = clientWallet.address;
    }

    const defaultNetworkList = getNetworkList();
    const defaultNetworkMap = defaultNetworkList.reduce((acc, cur) => {
      acc[cur.chainId] = cur;
      return acc;
    }, {});
    for (let network of networkList) {
      const networkInfo = defaultNetworkMap[network.chainId];
      if (!networkInfo) continue;
      if (infuraId && network.rpcUrls && network.rpcUrls.length > 0) {
        for (let i = 0; i < network.rpcUrls.length; i++) {
          network.rpcUrls[i] = network.rpcUrls[i].replace(/{InfuraId}/g, infuraId);
        }
      }
      this.networkMap[network.chainId] = {
        ...networkInfo,
        ...network
      };
    }
    return instanceId;
  }

  getRpcWallet(): IRpcWallet {
    return this.rpcWalletId ? Wallet.getRpcWalletInstance(this.rpcWalletId) : null;
  }

  isRpcWalletConnected() {
    const wallet = this.getRpcWallet();
    return wallet?.isConnected;
  }

  getNetworkInfo = (chainId: number) => {
    return this.networkMap[chainId];
  }

  getChainId() {
    const rpcWallet = this.getRpcWallet();
    return rpcWallet?.chainId;
  }
}

export function getClientWallet(): IClientWallet {
  return Wallet.getClientInstance();
}

export function isClientWalletConnected() {
  const wallet = Wallet.getClientInstance();
  return wallet.isConnected;
}

export async function getStripeKey(apiUrl: string) {
  let publishableKey: string;
  try {
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      if (data.publishableKey) {
        publishableKey = data.publishableKey;
      }
    }
  } catch (error) {
    console.log(error);
  }
  if (!publishableKey) {
    console.log('initStripePayment', 'Cannot get the publishable key');
  }
  return publishableKey;
}

export const PaymentProviders = [
  {
    provider: PaymentProvider.Stripe,
    type: PaymentType.Fiat,
    image: 'stripe.png'
  },
  {
    provider: PaymentProvider.TonWallet,
    type: PaymentType.Crypto,
    image: 'ton.png'
  },
  {
    provider: PaymentProvider.Metamask,
    type: PaymentType.Crypto,
    image: 'metamask.png'
  }
]

export const stripeCurrencies = [
  "aed", "afn", "all", "amd", "ang", "aoa", "ars", "aud", "awg", "azn",
  "bam", "bbd", "bdt", "bgn", "bhd", "bif", "bmd", "bnd", "bob", "brl",
  "bsd", "btn", "bwp", "byn", "byr", "bzd", "cad", "cdf", "chf", "clf",
  "clp", "cny", "cop", "crc", "cuc", "cup", "cve", "czk", "djf", "dkk",
  "dop", "dzd", "egp", "ern", "etb", "eur", "fjd", "fkp", "gbp", "gel",
  "ghs", "gip", "gmd", "gnf", "gtq", "gyd", "hkd", "hnl", "htg", "huf",
  "idr", "ils", "inr", "iqd", "irr", "isk", "jmd", "jod", "jpy", "kes",
  "kgs", "khr", "kmf", "kpw", "krw", "kwd", "kyd", "kzt", "lak", "lbp",
  "lkr", "lrd", "lsl", "ltl", "lvl", "lyd", "mad", "mdl", "mga", "mkd",
  "mmk", "mnt", "mop", "mro", "mur", "mvr", "mwk", "mxn", "myr", "mzn",
  "nad", "ngn", "nio", "nok", "npr", "nzd", "omr", "pab", "pen", "pgk",
  "php", "pkr", "pln", "pyg", "qar", "ron", "rsd", "rub", "rwf", "sar",
  "sbd", "scr", "sdg", "sek", "sgd", "shp", "skk", "sll", "sos", "srd",
  "ssp", "std", "svc", "syp", "szl", "thb", "tjs", "tmt", "tnd", "top",
  "try", "ttd", "twd", "tzs", "uah", "ugx", "usd", "uyu", "uzs", "vef",
  "vnd", "vuv", "wst", "xaf", "xag", "xau", "xcd", "xdr", "xof", "xpf",
  "yer", "zar", "zmk", "zmw", "btc", "jep", "eek", "ghc", "mtl", "tmm",
  "yen", "zwd", "zwl", "zwn", "zwr"
]

export const stripeZeroDecimalCurrencies = [
  "bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga",
  "pyg", "rwf", "ugx", "vnd", "vuv", "xaf", "xof", "xpf"
]

export const stripeSpecialCurrencies = [
  'isk', 'huf', 'twd', 'ugx'
]

