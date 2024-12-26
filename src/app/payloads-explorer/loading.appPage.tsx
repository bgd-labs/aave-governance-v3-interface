'use client';

import React, { useEffect } from 'react';

import { PayloadsExplorerPageLoading } from '../../components/PayloadsExplorer/PayloadsExplorerPageLoading';
import { appConfig } from '../../configs/appConfig';

export default function LoadingPage() {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  const chainWithController = `${appConfig.govCoreChainId}_${appConfig.payloadsControllerConfig[appConfig.govCoreChainId].contractAddresses[0]}`;
  return (
    <PayloadsExplorerPageLoading
      activePage={0}
      chainWithController={chainWithController}
      count={0}
    />
  );
}
