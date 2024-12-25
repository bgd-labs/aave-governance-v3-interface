import React, { Suspense } from 'react';

import { PayloadsExplorerPage } from '../../../components/PayloadsExplorer/PayloadsExplorerPage';
import { api } from '../../../trpc/server';

type PayloadsExplorerPageParams = {
  payloadController: string;
};

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
