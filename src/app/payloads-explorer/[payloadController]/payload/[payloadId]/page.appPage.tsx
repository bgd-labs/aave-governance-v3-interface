import { Metadata } from 'next';
import React from 'react';

import { PayloadDetailsContent } from '../../../../../components/PayloadsExplorer/PayloadDetailsContent';
import { metaTexts } from '../../../../../helpers/texts/metaTexts';
import { api } from '../../../../../trpc/server';
import { PayloadsExplorerPageParams as PayloadsExplorerPageParamsInitial } from '../../../layout.appPage';

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
  payloadId: string;
};

export async function generateStaticParams({
  params,
}: {
  params: PayloadsExplorerPageParamsInitial;
}) {
  const count = await api.payloads.getCount({
    chainWithController: params.payloadController,
  });
  return await Promise.all(
    [...Array(Number(count)).keys()].map(async (id) => {
      return {
        payloadId: String(id),
        fallback: false,
      };
    }),
  );
}

export const revalidate = 60;

export default async function Page({
  params,
}: {
  params: PayloadsExplorerPageParams;
}) {
  const payload = await api.payloads.getById({
    chainWithController: params.payloadController,
    payloadId: Number(params.payloadId),
  });
  return <PayloadDetailsContent payload={payload} withExecute />;
}
