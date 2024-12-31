import ScomWalletModal from "@scom/scom-wallet-modal";
import ScomNetworkMoal from "@scom/scom-network-modal";
import {
    application,
    Component
} from "@ijstech/components";
import { Constants, Contracts, IClientSideProvider, IEventBusRegistry, INetwork, TransactionReceipt, Utils, Wallet } from "@ijstech/eth-wallet";
import getNetworkList from "@scom/scom-network-list";
import { ITokenObject } from "@scom/scom-token-list";
import { IExtendedNetwork, INetworkConfig } from '../interface';

export interface IWalletPlugin {
    name: string;
    packageName?: string;
    provider?: IClientSideProvider;
}

class EventEmitter {
    private events: { [key: string]: Function[] } = {};

    on(event: string, listener: Function) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    off(event: string, listener: Function) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(l => l !== listener);
    }

    emit(event: string, data?: any) {
        if (!this.events[event]) return;
        this.events[event].forEach(listener => listener(data));
    }
}

export class EVMWallet extends EventEmitter {
    private mdEVMWallet: ScomWalletModal;
    private mdNetwork: ScomNetworkMoal;
    private _wallets: IWalletPlugin[];
    private _networks: INetworkConfig[];
    private rpcWalletEvents: IEventBusRegistry[] = [];
    private rpcWalletId: string = '';
    private defaultChainId: number;
    private defaultWallets: IWalletPlugin[] = [
        {
            "name": "metamask"
        },
        {
            "name": "walletconnect"
        }
    ];
    private networkMap: { [key: number]: IExtendedNetwork };
    
    get wallets() {
        return this._wallets ?? this.defaultWallets;
    }

    set wallets(value: IWalletPlugin[]) {
        this._wallets = value;
    }

    get networks() {
        return this._networks;
    }

    set networks(value: INetworkConfig[]) {
        this._networks = value;
    }

    constructor() {
        super();
        const defaultNetworkList = getNetworkList();
        this.networkMap = defaultNetworkList.reduce((acc, cur) => {
            const explorerUrl = cur.blockExplorerUrls && cur.blockExplorerUrls.length ? cur.blockExplorerUrls[0] : "";
            acc[cur.chainId] = {
                ...cur,
                explorerTxUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}tx/` : "",
                explorerAddressUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}address/` : ""
            };
            return acc;
        }, {});
    }

    setData(data: {wallets: IWalletPlugin[], networks: INetworkConfig[], defaultChainId: number}) {
        const { wallets, networks, defaultChainId } = data;
        this.wallets = wallets;
        this.networks = networks;
        this.defaultChainId = defaultChainId || 0;
    }

    async initWallet() {
        try {
            await Wallet.getClientInstance().init();
            await this.resetRpcWallet();
            const rpcWallet = this.getRpcWallet();
            await rpcWallet.init();
        } catch (err) {
            console.log(err);
        }
    }

    private removeRpcWalletEvents = () => {
        const rpcWallet = this.getRpcWallet();
        for (let event of this.rpcWalletEvents) {
            rpcWallet.unregisterWalletEvent(event);
        }
        this.rpcWalletEvents = [];
    }

    private initRpcWallet(defaultChainId: number) {
        if (this.rpcWalletId) {
            return this.rpcWalletId;
        }
        const clientWallet = Wallet.getClientInstance();
        const networkList: INetwork[] = Object.values(application.store?.networkMap || this.networkMap || []);
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
        return instanceId;
    }

    async resetRpcWallet() {
        this.removeRpcWalletEvents();
        this.initRpcWallet(this.defaultChainId);
        const rpcWallet = this.getRpcWallet();
        const chainChangedEvent = rpcWallet.registerWalletEvent(this, Constants.RpcWalletEvent.ChainChanged, async (chainId: number) => {
            this.emit("chainChanged");
        });
        const connectedEvent = rpcWallet.registerWalletEvent(this, Constants.RpcWalletEvent.Connected, async (connected: boolean) => {
            this.emit("walletConnected");
        });
        this.rpcWalletEvents.push(chainChangedEvent, connectedEvent);
    }

    getWalletAddress() {
        const wallet = Wallet.getClientInstance();
        return wallet.address;
    }

    getRpcWallet() {
        return this.rpcWalletId ? Wallet.getRpcWalletInstance(this.rpcWalletId) : null;
    }

    async connectWallet(modalContainer: Component) {
        if (!this.mdEVMWallet) {
            await application.loadPackage('@scom/scom-wallet-modal', '*');
            this.mdEVMWallet = new ScomWalletModal(undefined, {
                wallets: this.wallets,
                networks: this.networks,
                onCustomWalletSelected: async (wallet: IClientSideProvider) => {
                    console.log('onCustomWalletSelected', wallet);
                }
            });
            modalContainer.append(this.mdEVMWallet);
        }
        // await this.mdEVMWallet.setData({
        //     networks: this.networks,
        //     wallets: this.wallets
        // })
        this.mdEVMWallet.showModal();
    }

    async openNetworkModal(modalContainer: Component) {
        if (!this.mdNetwork) {
            await application.loadPackage('@scom/scom-network-modal', '*');
            this.mdNetwork = new ScomNetworkMoal(undefined, {
                networks: this.networks,
                rpcWalletId: this.rpcWalletId,
                switchNetworkOnSelect: true
            });
            modalContainer.append(this.mdNetwork);
        }
        await this.mdNetwork.setData({
            selectedChainId: this.getRpcWallet()?.chainId
        })
        this.mdNetwork.showModal();
    }

    isWalletConnected() {
        const wallet = Wallet.getClientInstance();
        return wallet.isConnected;
    }

    isNetworkConnected() {
        const wallet = this.getRpcWallet();
        return wallet?.isConnected;
    }

    async switchNetwork() {
        const rpcWallet = this.getRpcWallet();
        const wallet = Wallet.getClientInstance();
        await wallet.switchNetwork(rpcWallet.chainId);
    }

    async disconnectWallet() {
        const wallet = Wallet.getClientInstance();
        await wallet.disconnect();
    }

    getNetworkInfo(chainId?: number) {
        if (!chainId) {
            chainId = this.getRpcWallet()?.chainId;
        }
        return this.networkMap[chainId];
    }

    viewExplorerByAddress(address: string) {
        const rpcWallet = this.getRpcWallet();
        let network = this.getNetworkInfo(rpcWallet.chainId);
        if (network && network.explorerAddressUrl) {
            let url = `${network.explorerAddressUrl}${address}`;
            window.open(url);
        }
    }

    viewExplorerByTransactionHash(hash: string) {
        const rpcWallet = this.getRpcWallet();
        let network = this.getNetworkInfo(rpcWallet.chainId);
        if (network && network.explorerTxUrl) {
            let url = `${network.explorerTxUrl}${hash}`;
            window.open(url);
        }
    }

    async transferToken(
        to: string, 
        token: ITokenObject, 
        amount: number, 
        callback?: (error: Error, receipt?: string) => Promise<void>,
        confirmationCallback?: (receipt: any) => Promise<void>
    ) {
        const wallet = Wallet.getClientInstance();
        const rpcWallet = this.getRpcWallet();
        if (wallet.chainId !== rpcWallet.chainId) {
            await wallet.switchNetwork(rpcWallet.chainId);
        }
        wallet.registerSendTxEvents({
            transactionHash: (error: Error, receipt?: string) => {
                if (callback) {
                    callback(error, receipt);
                }
            },
            confirmation: (receipt: any) => {
                if (confirmationCallback) {
                    confirmationCallback(receipt);
                }
            },
        })
        let receipt: TransactionReceipt;
        if (!token.address) {
            receipt = await wallet.send(to, amount);
        }
        else {
            const erc20 = new Contracts.ERC20(wallet, token.address);
            const decimals = token.decimals;
            receipt = await erc20.transfer({
                to,
                amount: Utils.toDecimals(amount, decimals)
            });
        }
        return receipt?.transactionHash;
    }
}
