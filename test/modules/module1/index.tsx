import { Module, customModule, Container, VStack } from '@ijstech/components';
import { ScomTelegramPayWidget } from '@scom/scom-payment-widget';
@customModule
export default class Module1 extends Module {
    private mainStack: VStack;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    async init() {
        super.init();
    }

    private onSubmit(content: string, medias: any) {
        console.log(content);
    }

    private async handlePaymentSuccess() {

    }

    render() {
        return <i-panel>
            <i-hstack id="mainStack" margin={{ top: '1rem', left: '1rem' }} gap="2rem">
                <i-scom-telegram-pay-widget onPaymentSuccess={this.handlePaymentSuccess} botAPIEndpoint={'http://localhost:3000'} payBtnCaption="Pay now"
                data={{
                    title: 'Invoice title',
                    description: 'Invoice description',
                    currency: 'USD',
                    prices: [{label: 'Item 1', amount: 10000}],
                    payload: 'payload',
                    photoUrl: 'https://cdn.corporatefinanceinstitute.com/assets/product-mix3.jpeg'
                }}/>
            </i-hstack>
        </i-panel>
    }
}