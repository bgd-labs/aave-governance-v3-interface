import NProgress from 'nprogress';

export function disablePageLoader() {
  if (typeof document !== 'undefined') {
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
