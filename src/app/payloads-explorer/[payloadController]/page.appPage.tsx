import { Metadata } from 'next';
import React, { Suspense } from 'react';

import { PayloadsExplorerPage } from '../../../components/PayloadsExplorer/PayloadsExplorerPage';
import { metaTexts } from '../../../helpers/texts/metaTexts';
import { api } from '../../../trpc/server';
import { PayloadsExplorerPageParams } from '../layout.appPage';

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

export default async function Page({
  params,
}: {
  params: PayloadsExplorerPageParams;
}) {
  const data = await api.payloads.getPaginated({
    activePage: 0,
    chainWithController: params.payloadController,
  });

  return (
    <Suspense
      fallback={
        <PayloadsExplorerPage
          payloads={[]}
          chainWithController={params.payloadController}
          activePage={0}
          totalItems={0}
          currentIds={[]}
        />
      }>
      <PayloadsExplorerPage
        payloads={data.data}
        chainWithController={params.payloadController}
        activePage={0}
        totalItems={data.count}
        currentIds={data.ids ?? []}
      />
    </Suspense>
  );
}
