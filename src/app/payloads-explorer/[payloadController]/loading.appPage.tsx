'use client';

import { useEffect } from 'react';

import { PayloadsExplorerPageLoading } from '../../../components/PayloadsExplorer/PayloadsExplorerPageLoading';
import { appConfig } from '../../../configs/appConfig';

export default function LoadingPage() {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  const chainWithController = `${appConfig.govCoreChainId}_${appConfig.payloadsControllerConfig[appConfig.govCoreChainId].contractAddresses[0]}`;
  return (
    <PayloadsExplorerPageLoading
      activePage={0}
      chainWithController={
        typeof window !== 'undefined'
          ? window.location.pathname.split('/')[
              window.location.pathname.split('/').length - 1
            ]
          : chainWithController
      }
      count={0}
    />
  );
}
