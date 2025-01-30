import React, { Suspense } from 'react';

import { PayloadsExplorerPage } from '../../components/PayloadsExplorer/PayloadsExplorerPage';
import { PayloadsExplorerPageLoading } from '../../components/PayloadsExplorer/PayloadsExplorerPageLoading';
import { appConfig } from '../../configs/appConfig';
import { api } from '../../trpc/server';

export const revalidate = 60;

export default async function Page() {
  const chainWithController = `${appConfig.govCoreChainId}_${appConfig.payloadsControllerConfig[appConfig.govCoreChainId].contractAddresses[0]}`;

  const data = await api.payloads.getPaginated({
    activePage: 0,
    chainWithController,
  });

  return (
    <Suspense
      fallback={
        <PayloadsExplorerPageLoading
          activePage={0}
          count={data.count}
          chainWithController={chainWithController}
        />
      }>
      <PayloadsExplorerPage
        data={data}
        chainWithController={chainWithController}
        activePage={0}
      />
    </Suspense>
  );
}
