import NProgress from 'nprogress';

import { isForIPFS } from '../../utils/appConfig';

export function disablePageLoader() {
  if (typeof document !== 'undefined' && !isForIPFS) {
    setTimeout(() => {
      NProgress.start();
      NProgress.done();
      document.documentElement.classList.remove('nprogress-busy');
      const nprogressElement = document.getElementById('nprogress');
      if (nprogressElement) {
        nprogressElement.remove();
      }
    }, 1);
  }
}
