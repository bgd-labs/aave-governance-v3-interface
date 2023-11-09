import React from 'react';
import { Hex } from 'viem';

import { CreateByParamsPage } from '../../src/createByParams/components/CreateByParamsPage';
import { InitialParams, PayloadParams } from '../../src/createByParams/types';

export default async function CreateByParams({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // params
  const ipfsHash = !!searchParams['ipfsHash']
    ? (String(searchParams['ipfsHash']) as Hex)
    : undefined;
  const votingPortal = !!searchParams['votingPortal']
    ? (String(searchParams['votingPortal']) as Hex)
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