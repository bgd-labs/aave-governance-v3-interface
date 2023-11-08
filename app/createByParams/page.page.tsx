import React from 'react';

import { CreateByParamsPage } from '../../src/createByParams/components/CreateByParamsPage';
import { InitialParams, PayloadParams } from '../../src/createByParams/types';

export default async function CreateByParams({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // params
  const ipfsHash = !!searchParams['ipfsHash']
    ? String(searchParams['ipfsHash'])
    : undefined;
  const votingPortal = !!searchParams['votingPortal']
    ? String(searchParams['votingPortal'])
    : undefined;

  const payloads: Record<number, PayloadParams> = {};
  Object.entries(searchParams)
    .filter((value) => value[0].startsWith('payload['))
    .forEach((value) => {
      const indexKey = Number(value[0].split('[')[1].split(']')[0]);
      const paramKey = value[0].split('.')[1];

      payloads[indexKey] = {
        ...payloads[indexKey],
        [paramKey]: value[1],
      };
    });

  const initialParams: InitialParams = {
    ipfsHash,
    votingPortal,
    payloads: Object.values(payloads),
  };

  return <CreateByParamsPage initialParams={initialParams} />;
}
