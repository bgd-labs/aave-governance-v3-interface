// TODO: initial phase

import { Metadata } from 'next';
import React from 'react';
import { Hex } from 'viem';

import { metaTexts } from '../../helpers/texts/metaTexts';

export const metadata: Metadata = {
  title: metaTexts.ipfsTitle,
  description: metaTexts.ipfsDescription,
  openGraph: {
    images: ['/metaLogo.jpg'],
    title: metaTexts.ipfsTitle,
    description: metaTexts.ipfsDescription,
  },
};

export default async function ProposalCreateOverview({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // params
  const proposalId = searchParams['proposalId']
    ? (Number(searchParams['proposalId']) as number)
    : undefined;
  const ipfsHash = searchParams['ipfsHash']
    ? (String(searchParams['ipfsHash']) as Hex)
    : undefined;
  const votingPortal = searchParams['votingPortal']
    ? (String(searchParams['votingPortal']) as Hex)
    : undefined;

  const payloads: Record<number, any> = {};
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

  const initialParams = {
    proposalId,
    ipfsHash,
    votingPortal,
    payloads: Object.values(payloads),
  };

  return <h1>Create proposal overview</h1>;
}
