import { Module, customModule, Container, application } from '@ijstech/components';
import { INetwork } from '@ijstech/eth-wallet';
import { getMulticallInfoList } from '@scom/scom-multicall';
import getNetworkList from '@scom/scom-network-list';
import { ScomPaymentWidget } from '@scom/scom-payment-widget';
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
    this.scomPaymentWidget.onStartPayment({
      amount: 1000,
      paymentId: '262951AA-D913-40A5-9468-7EB8B92706E3',
      address: '0xA81961100920df22CF98703155029822f2F7f033'
    });
  }

  private onSubmit(content: string, medias: any) {
    console.log(content);
  }

  private async handlePaymentSuccess() {

  }

  render() {
    return <i-panel width="100%">
      <i-hstack id="mainStack" margin={{ top: '1rem', left: '1rem' }} gap="2rem" width="100%" padding={{ top: '1rem', bottom: '1rem' }}>
        <i-scom-payment-widget id="scomPaymentWidget" />
        {/* <i-scom-telegram-pay-widget onPaymentSuccess={this.handlePaymentSuccess} botAPIEndpoint={'http://localhost:3000'} payBtnCaption="Pay now"
                data={{
                    title: 'Invoice title',
                    description: 'Invoice description',
                    currency: 'USD',
                    prices: [{label: 'Item 1', amount: 10000}],
                    payload: 'payload',
                    photoUrl: 'https://cdn.corporatefinanceinstitute.com/assets/product-mix3.jpeg'
                }}/> */}
      </i-hstack>
    </i-panel>
  }
}