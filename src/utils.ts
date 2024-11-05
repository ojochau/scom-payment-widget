import { STRIPE_LIB_URL } from './store';

export async function loadStripe() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = STRIPE_LIB_URL;
    script.async = true;
    script.onload = () => {
      resolve(true);
    };
    document.head.appendChild(script);
  })
}