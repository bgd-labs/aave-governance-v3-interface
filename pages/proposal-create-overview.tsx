import { useSearchParams } from 'next/navigation';
import queryString from 'query-string';
import React from 'react';
import { Hex } from 'viem';

import { CreateByParamsPage } from '../src/createByParams/components/CreateByParamsPage';
import { InitialParams, PayloadParams } from '../src/createByParams/types';

export default function ProposalCreateOverview() {
  const searchParams = useSearchParams();

  if (!searchParams) return null;

  // params
  const proposalId = !!searchParams.get('proposalId')
    ? (Number(searchParams.get('proposalId')) as number)
    : undefined;
  const ipfsHash = !!searchParams.get('ipfsHash')
    ? (String(searchParams.get('ipfsHash')) as Hex)
    : undefined;
  const votingPortal = !!searchParams.get('votingPortal')
    ? (String(searchParams.get('votingPortal')) as Hex)
    : undefined;

  const payloads: Record<number, PayloadParams> = {};
  Object.entries(queryString.parse(searchParams.toString()))
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
    proposalId,
    ipfsHash,
    votingPortal,
    payloads: Object.values(payloads),
  };

  return <CreateByParamsPage initialParams={initialParams} />;
}
