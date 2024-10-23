import { application } from "@ijstech/components";
import { INetwork, Wallet, IRpcWallet, IClientWallet } from "@ijstech/eth-wallet";
import getNetworkList from "@scom/scom-network-list";
import { PaymentProvider, PaymentType } from "./interface";

const infuraId = 'adc596bf88b648e2a8902bc9093930c5';

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

export const PaymentProviders = [
  {
    provider: PaymentProvider.Stripe,
    type: PaymentType.Fiat,
    image: 'stripe.png'
  },
  {
    provider: PaymentProvider.Paypal,
    type: PaymentType.Fiat,
    image: 'paypal.png'
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
