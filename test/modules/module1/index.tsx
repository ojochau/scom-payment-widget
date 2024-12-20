import { Module, customModule, Container, application, Styles } from '@ijstech/components';
import { INetwork } from '@ijstech/eth-wallet';
import { getMulticallInfoList } from '@scom/scom-multicall';
import getNetworkList from '@scom/scom-network-list';
import { IPaymentActivity, IPlaceOrder, ProductType, ScomPaymentWidget } from '@scom/scom-payment-widget';

@customModule
export default class Module1 extends Module {
  private scomPaymentWidget: ScomPaymentWidget;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    const multicalls = getMulticallInfoList();
    const networkMap = this.getNetworkMap(options.infuraId);
    application.store = {
      infuraId: options.infuraId,
      multicalls,
      networkMap
    }
  }

  private getNetworkMap = (infuraId?: string) => {
    const networkMap = {};
    const defaultNetworkList: INetwork[] = getNetworkList();
    const defaultNetworkMap: Record<number, INetwork> = defaultNetworkList.reduce((acc, cur) => {
      acc[cur.chainId] = cur;
      return acc;
    }, {});
    for (const chainId in defaultNetworkMap) {
      const networkInfo = defaultNetworkMap[chainId];
      const explorerUrl = networkInfo.blockExplorerUrls && networkInfo.blockExplorerUrls.length ? networkInfo.blockExplorerUrls[0] : "";
      if (infuraId && networkInfo.rpcUrls && networkInfo.rpcUrls.length > 0) {
        for (let i = 0; i < networkInfo.rpcUrls.length; i++) {
          networkInfo.rpcUrls[i] = networkInfo.rpcUrls[i].replace(/{INFURA_ID}/g, infuraId);
        }
      }
      networkMap[networkInfo.chainId] = {
        ...networkInfo,
        symbol: networkInfo.nativeCurrency?.symbol || "",
        explorerTxUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}tx/` : "",
        explorerAddressUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}address/` : ""
      }
    }
    return networkMap;
  }

  async init() {
    super.init();
  }

  private async handlePay() {
    this.scomPaymentWidget.onStartPayment();
  }

  private async handlePlaceMarketplaceOrder(data: IPlaceOrder) {
    console.log('handlePlaceMarketplaceOrder', data);
  }

  private async handlePaymentSuccess(data: IPaymentActivity) {
    console.log('handlePaymentSuccess', data);
  }

  render() {
    return <i-panel width="100%">
      <i-hstack id="mainStack" margin={{ top: '1rem', left: '1rem' }} gap="2rem" width="100%" justifyContent="center" padding={{ top: '1rem', bottom: '1rem' }}>
        <i-scom-payment-widget
          id="scomPaymentWidget"
          payment={{
            title: 'Product Mix',
            products: [
              {
                id: "cb772b0e-c288-a2b1-8f19-ca9ade20045d",
                productType: ProductType.Physical,
                name: "Denzel's Dog Treats x 6",
                images: ['https://images.unsplash.com/photo-1592468275155-ea8bf1f84360?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
                price: 55.99,
                quantity: 1,
                stallId: 'b36768bc-b479-6692-94ba-d421eefbe8df',
                stallUri: '30018:dd2ea973537231c4c04b366acb37993a522b478c7f5705eeabef038e185605c3:b36768bc-b479-6692-94ba-d421eefbe8df'
              },
              {
                id: "2",
                productType: ProductType.Physical,
                name: 'Lens',
                images: ['https://images.pexels.com/photos/279906/pexels-photo-279906.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
                price: 50,
                quantity: 2,
              },
              {
                id: "3",
                productType: ProductType.Physical,
                name: 'Venus mascara',
                images: ['https://images.pexels.com/photos/2697787/pexels-photo-2697787.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
                price: 99.90,
                quantity: 1,
              }
            ],
            stripeAccountId: 'acct_1QXIQv01aOhOuz1h',
            paymentId: '262951AA-D913-40A5-9468-7EB8B92706E3',
            address: '0xA81961100920df22CF98703155029822f2F7f033',
            currency: 'USD'
          }}
          onPaymentSuccess={this.handlePaymentSuccess}
          placeMarketplaceOrder={this.handlePlaceMarketplaceOrder}
          showButtonPay={true}
          baseStripeApi="http://127.0.0.1:8100/stripe"
          returnUrl="http://127.0.0.1:8100/#!/invoice-detail"
        />
        {/* <i-button
          caption="Pay"
          width="100%"
          maxWidth={180}
          minWidth={90}
          padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
          font={{ size: '1rem', color: Theme.colors.primary.contrastText }}
          background={{ color: Theme.colors.primary.main }}
          border={{ radius: 12 }}
          onClick={this.handlePay}
        /> */}
      </i-hstack>
    </i-panel>
  }
}