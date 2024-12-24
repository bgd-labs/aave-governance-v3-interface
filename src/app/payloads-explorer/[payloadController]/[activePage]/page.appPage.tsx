import { Metadata } from 'next';
import React, { Suspense } from 'react';

import { PayloadsExplorerPage } from '../../../../components/PayloadsExplorer/PayloadsExplorerPage';
import { PAGE_SIZE } from '../../../../configs/configs';
import { metaTexts } from '../../../../helpers/texts/metaTexts';
import { api } from '../../../../trpc/server';
import { PayloadsExplorerPageParams as PayloadsExplorerPageParamsInitial } from '../../layout.appPage';

export const metadata: Metadata = {
  title: metaTexts.ipfsTitle,
  description: metaTexts.ipfsDescription,
  openGraph: {
    images: ['/metaLogo.jpg'],
    title: metaTexts.ipfsTitle,
    description: metaTexts.ipfsDescription,
  },
};

export type PayloadsExplorerPageParams = PayloadsExplorerPageParamsInitial & {
  activePage: string;
};

export async function generateStaticParams({
  params,
}: {
  params: PayloadsExplorerPageParamsInitial;
}) {
  const count = await api.payloads.getCount({
    chainWithController: params.payloadController,
  });
  const allPagesCount = Math.ceil(Number(count) / PAGE_SIZE);
  return [...Array(Number(allPagesCount)).keys()].map((activePage) => ({
    activePage: String(activePage),
    fallback: false,
  }));
}

export const revalidate = 60;

export default async function Page({
  params,
}: {
  params: PayloadsExplorerPageParams;
}) {
  const data = await api.payloads.getPaginated({
    activePage: Number(params.activePage),
    chainWithController: params.payloadController,
  });

  return (
    <Suspense
      fallback={
        <PayloadsExplorerPage
          payloads={[]}
          chainWithController={params.payloadController}
          activePage={Number(params.activePage)}
          totalItems={0}
          currentIds={[]}
        />
      }>
      <PayloadsExplorerPage
        payloads={data.data}
        chainWithController={params.payloadController}
        activePage={Number(params.activePage)}
        totalItems={data.count}
        currentIds={data.ids ?? []}
      />
    </Suspense>
  );
}
