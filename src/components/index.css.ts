import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

const spinnerAnim = Styles.keyframes({
  "0%": {
    transform: 'rotate(0deg)'
  },
  "100%": {
    transform: 'rotate(360deg)'
  },
});

export const elementStyle = Styles.style({
  display: 'flex',
  flexGrow: 1
})

export const textCenterStyle = Styles.style({
  textAlign: 'center'
})

export const textUpperCaseStyle = Styles.style({
  textTransform: 'uppercase'
})

export const checkboxTextStyle = Styles.style({
  $nest: {
    'span': {
      display: 'inline'
    },
    'a': {
      display: 'inline',
      color: Theme.colors.info.main
    }
  }
})

export const loadingImageStyle = Styles.style({
  animation: `${spinnerAnim} 2s linear infinite`
})

export const alertStyle = Styles.style({
  $nest: {
    'i-vstack i-label': {
      textAlign: 'center'
    },
    'span': {
      display: 'inline'
    },
    'a': {
      display: 'inline',
      color: Theme.colors.info.main
    }
  }
})

export const carouselSliderStyle = Styles.style({
  position: 'relative',
  $nest: {
    '.wrapper-slider': {
      $nest: {
        '.slider-arrow:first-child': {
          left: '-30px'
        },
        '.slider-arrow:last-child': {
          right: '-30px'
        }
      }
    },
    '.slider-arrow': {
      position: 'absolute'
    }
  }
})
