import { Module, customModule, Container, StackLayout } from '@ijstech/components';
import { ScomPaymentWidget } from '@scom/scom-payment-widget';
@customModule
export default class Module1 extends Module {
    private mainStack: StackLayout;

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
        return <i-stack width={'100%'} height={'100%'} alignItems="center" justifyContent='center'>
            <i-stack id="mainStack" margin={{ top: '1rem', left: '1rem' }} gap="2rem" width={800} height={1200}>
                <i-scom-payment-widget onPaymentSuccess={this.handlePaymentSuccess} botAPIEndpoint={'http://localhost:3000'} 
                data={{
                    title: 'Invoice title',
                    // description: 'Invoice description',
                    currency: 'USD',
                    amount: 100000,
                    // prices: [{label: 'Item 1', amount: 10000}],
                    // payload: 'payload',
                    photoUrl: 'https://cdn.corporatefinanceinstitute.com/assets/product-mix3.jpeg'
                }}/>
            </i-stack>
        </i-stack>
    }
}