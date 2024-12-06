import { Module, customModule, Container, application, Styles } from '@ijstech/components';
import { INetwork } from '@ijstech/eth-wallet';
import { getMulticallInfoList } from '@scom/scom-multicall';
import getNetworkList from '@scom/scom-network-list';
import { ProductType, ScomPaymentWidget } from '@scom/scom-payment-widget';
const Theme = Styles.Theme.ThemeVars;

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

  private async handlePaymentSuccess(status: string) {
    console.log('handlePaymentSuccess', status);
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
                productType: ProductType.Physical,
                name: 'Canon minimal',
                images: ['https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
                price: 200,
                quantity: 1,
              },
              {
                productType: ProductType.Physical,
                name: 'Lens',
                images: ['https://images.pexels.com/photos/279906/pexels-photo-279906.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
                price: 50,
                quantity: 2,
              },
              {
                productType: ProductType.Physical,
                name: 'Venus mascara',
                images: ['https://images.pexels.com/photos/2697787/pexels-photo-2697787.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
                price: 99.90,
                quantity: 1,
              }
            ],
            paymentId: '262951AA-D913-40A5-9468-7EB8B92706E3',
            address: '0xA81961100920df22CF98703155029822f2F7f033',
            currency: 'USD',
            userInfo: {
              name: 'Test',
              email: 'test@example.com'
            }
          }}
          onPaymentSuccess={this.handlePaymentSuccess}
          showButtonPay={true}
          baseStripeApi="http://127.0.0.1:8100/stripe"
          urlStripeTracking="http://127.0.0.1:8100/#!/stripe-payment-status"
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