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
      overflow: 'hidden',
      $nest: {
        'i-modal .modal-overlay': {
          zIndex: 999
        },
        'i-modal .modal-wrapper': {
          zIndex: 999
        }
      }
    },
    'dapp-container-footer': {
      display: 'none'
    }
  }
})
