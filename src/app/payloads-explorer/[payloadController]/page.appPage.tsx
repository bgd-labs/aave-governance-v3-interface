import { Metadata } from 'next';
import React, { Suspense } from 'react';

import { PayloadsExplorerPage } from '../../../components/PayloadsExplorer/PayloadsExplorerPage';
import { appConfig } from '../../../configs/appConfig';
import { PAGE_SIZE } from '../../../configs/configs';
import { metaTexts } from '../../../helpers/texts/metaTexts';
import { api } from '../../../trpc/server';

export const metadata: Metadata = {
  title: metaTexts.ipfsTitle,
  description: metaTexts.ipfsDescription,
  openGraph: {
    images: ['/metaLogo.jpg'],
    title: metaTexts.ipfsTitle,
    description: metaTexts.ipfsDescription,
  },
};

type PayloadsExplorerPageParams = {
  payloadController: string;
};

export async function generateStaticParams() {
  const config = appConfig.payloadsControllerConfig;
  const allControllers: string[] = [];
  Object.entries(config).forEach(([chain, config]) => {
    config.contractAddresses.forEach((controller) =>
      allControllers.push(`${chain}_${controller}`),
    );
  });

  const chainsWithCount = (
    await Promise.all(
      allControllers
        .filter((value, index, self) => self.indexOf(value) === index)
        .map(async (controller) => {
          const count = await api.payloads.getCount({
            chainWithController: controller,
          });
          const allPagesCount = Math.ceil(Number(count) / PAGE_SIZE);

          const activePages = [...Array(Number(allPagesCount)).keys()].map(
            (activePage) => String(activePage),
          );
          return activePages.map((activePage) => ({
            chainWithController: controller,
            activePage,
          }));
        }),
    )
  ).flat();

  return chainsWithCount.map((data) => {
    return {
      payloadController: `${data.chainWithController}_${data.activePage}`,
      fallback: false,
    };
  });
}

export const revalidate = 60;

export default async function Page({
  params,
}: {
  params: PayloadsExplorerPageParams;
}) {
  const activePage = Number(params.payloadController.split('_')[2]);
  const data = await api.payloads.getPaginated({
    activePage: activePage,
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
        activePage={activePage}
        totalItems={data.count}
        currentIds={data.ids ?? []}
      />
    </Suspense>
  );
}
