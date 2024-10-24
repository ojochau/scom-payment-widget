import { Module, Container, customElements, ControlElement, Styles, Label, Button, Image } from '@ijstech/components';
import { loadingImageStyle, textCenterStyle } from './index.css';
import assets from '../assets';
import { PaymentProviders, State } from '../store';
import { IPaymentStatus } from '../interface';
const Theme = Styles.Theme.ThemeVars;

interface ScomPaymentWidgetStatusPaymentElement extends ControlElement {
    onClose?: () => void;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['scom-payment-widget--status-payment']: ScomPaymentWidgetStatusPaymentElement;
        }
    }
}

@customElements('scom-payment-widget--status-payment')
export class StatusPayment extends Module {
    private state: State;
    private receipt: string;
    private status: string;
    private lbHeaderStatus: Label;
    private imgHeaderStatus: Image;
    private lbStatus: Label;
    private imgStatus: Image;
    private lbAddress: Label;
    private imgWallet: Image;
    private btnClose: Button;
    public onClose: (status: string) => void;

    constructor(parent?: Container, options?: ScomPaymentWidgetStatusPaymentElement) {
        super(parent, options);
    }

    updateStatus(state: State, info: IPaymentStatus) {
        this.state = state;
        const { status, receipt, provider, ownerAddress } = info;
        this.receipt = receipt;
        this.status = status;
        const isPending = status === 'pending';
        const isCompleted = status === 'complete';
        this.lbHeaderStatus.caption = isPending ? 'Payment Pending' : isCompleted ? 'Success' : 'Failed';
        this.lbHeaderStatus.style.color = isPending ? Theme.colors.primary.main : isCompleted ? Theme.colors.success.main : Theme.colors.error.main;
        this.lbHeaderStatus.style.marginInline = isPending ? 'inherit' : 'auto';
        this.imgHeaderStatus.visible = isPending;
        this.lbStatus.caption = `Payment ${status}`;
        if (isPending) {
            this.imgStatus.classList.add(loadingImageStyle);
        } else {
            this.imgStatus.classList.remove(loadingImageStyle);
        }
        this.imgStatus.url = assets.fullPath(`img/${isPending ? 'loading.svg' : isCompleted ? 'success.svg' : 'error.png'}`);
        const currentProvider = PaymentProviders.find(v => v.provider === provider);
        this.imgWallet.url = assets.fullPath(`img/${currentProvider.image}`);
        this.lbAddress.caption = ownerAddress.substr(0, 6) + '...' + ownerAddress.substr(-4);
        this.btnClose.visible = !isPending;
    }

    private handleViewTransaction() {
        const network = this.state.getNetworkInfo(this.state.getChainId());
        if (network && network.explorerTxUrl) {
            const url = `${network.explorerTxUrl}${this.receipt}`;
            window.open(url);
        }
    }

    private handleClose() {
        if (this.onClose) this.onClose(this.status);
    }

    async init() {
        super.init();
        this.onClose = this.getAttribute('onClose', true) || this.onClose;
    }

    render() {
        return <i-stack direction="vertical" gap="1rem" height="100%" width="100%" alignItems="center" padding={{ top: '1rem', bottom: '1rem' }}>
            <i-stack direction="vertical" gap="1rem" height="100%" width="100%">
                <i-stack
                    direction="horizontal"
                    gap="1rem"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                    minHeight={40}
                    padding={{ left: '1rem', right: '1rem', bottom: '1rem' }}
                    border={{ bottom: { style: 'solid', width: 1, color: Theme.divider } }}
                >
                    <i-label id="lbHeaderStatus" font={{ size: '0.875rem', color: Theme.colors.primary.main, transform: 'uppercase', bold: true }} />
                    <i-image id="imgHeaderStatus" class={loadingImageStyle} url={assets.fullPath('img/loading.svg')} width={20} height={20} minWidth={20} />
                </i-stack>
                <i-stack direction="vertical" gap="1rem" width="100%" height="100%" alignItems="center" padding={{ left: '1rem', right: '1rem' }}>
                    <i-stack direction="horizontal" justifyContent="space-between" alignItems="center" gap="1rem" width="100%" wrap="wrap" margin={{ bottom: '0.5rem' }}>
                        <i-stack
                            direction="horizontal"
                            gap="0.5rem"
                            alignItems="center"
                            padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}
                            border={{ style: 'solid', width: 1, color: Theme.divider, radius: 8 }}
                        >
                            <i-image id="imgWallet" width={24} height={24} minWidth={24} />
                            <i-label id="lbAddress" />
                        </i-stack>
                        <i-stack
                            direction="horizontal"
                            gap="0.5rem"
                            alignItems="center"
                            padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}
                            border={{ style: 'solid', width: 1, color: Theme.divider, radius: 8 }}
                            cursor="pointer"
                            width="fit-content"
                            onClick={this.handleViewTransaction}
                        >
                            <i-label caption="View transaction" />
                        </i-stack>
                    </i-stack>
                    <i-stack direction="vertical" alignItems="center" justifyContent="center" gap="1rem" width="100%" height="100%">
                        <i-image id="imgStatus" width={64} height={64} />
                        <i-label id="lbStatus" class={textCenterStyle} font={{ size: '1rem', color: Theme.text.primary, bold: true }} />
                    </i-stack>
                </i-stack>
            </i-stack>
            <i-button
                id="btnClose"
                visible={false}
                width="100%"
                maxWidth={180}
                caption="Close"
                padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
                font={{ size: '1rem', color: Theme.colors.primary.contrastText }}
                background={{ color: Theme.colors.primary.main }}
                border={{ radius: 12 }}
                onClick={this.handleClose}
            />
        </i-stack>
    }
}