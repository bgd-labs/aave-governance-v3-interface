import { Metadata } from 'next';
import React from 'react';

import { PayloadDetailsContent } from '../../../components/PayloadsExplorer/PayloadDetailsContent';
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

export type PayloadsExplorerPageParams = {
  payloadId: string;
};

export async function generateStaticParams() {
  const data = await api.payloads.getTotalCount({});
  const ids = data
    .map((data) => {
      return [...Array(Number(data.payloadCount)).keys()].map((id) => {
        return {
          payloadId: `${id}_${data.chainId}_${data.payloadsController}`,
        };
      });
    })
    .flat();
  return ids.map((data) => {
    return {
      payloadId: data.payloadId,
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
  const splitParams = params.payloadId.split('_');
  const payload = await api.payloads.getById({
    chainWithController: `${splitParams[1]}_${splitParams[2]}`,
    payloadId: Number(splitParams[0]),
  });
  return <PayloadDetailsContent payload={payload} withExecute />;
}
