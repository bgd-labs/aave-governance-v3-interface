import { Metadata } from 'next';
import React, { Suspense } from 'react';

import { PayloadsExplorerPage } from '../../components/PayloadsExplorer/PayloadsExplorerPage';
import { appConfig } from '../../configs/appConfig';
import { metaTexts } from '../../helpers/texts/metaTexts';
import { api } from '../../trpc/server';

export const metadata: Metadata = {
  title: metaTexts.ipfsTitle,
  description: metaTexts.ipfsDescription,
  openGraph: {
    images: ['/metaLogo.jpg'],
    title: metaTexts.ipfsTitle,
    description: metaTexts.ipfsDescription,
  },
};

export const revalidate = 60;

export default async function Page() {
  const payloadController = `${appConfig.govCoreChainId}_${appConfig.payloadsControllerConfig[appConfig.govCoreChainId].contractAddresses[0]}`;

  const data = await api.payloads.getPaginated({
    activePage: 0,
    chainWithController: payloadController,
  });

  return (
    <Suspense
      fallback={
        <PayloadsExplorerPage
          payloads={[]}
          chainWithController={payloadController}
          activePage={0}
          totalItems={0}
          currentIds={[]}
        />
      }>
      <PayloadsExplorerPage
        payloads={data.data}
        chainWithController={payloadController}
        activePage={0}
        totalItems={data.count}
        currentIds={data.ids ?? []}
      />
    </Suspense>
  );
}
