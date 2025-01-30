import React from 'react';

import { PayloadDetails } from '../../../../components/PayloadsExplorer/PayloadDetails';
import { api } from '../../../../trpc/server';

export type PayloadsExplorerPageParams = {
  payloadId: string;
};

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

  return <PayloadDetails payload={payload} />;
}
