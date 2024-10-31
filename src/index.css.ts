import { Styles } from '@ijstech/components';

export const dappContainerStyle = Styles.style({
  $nest: {
    '&>:first-child': {
      borderRadius: 12,
      background: 'transparent'
    },
    '#pnlModule': {
      height: '100%'
    },
    'dapp-container-header': {
      width: 0,
      height: 0,
      overflow: 'hidden'
    },
    'dapp-container-footer': {
      display: 'none'
    }
  }
})
