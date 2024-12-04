import { Metadata } from 'next';
import React from 'react';
import { Hex, zeroHash } from 'viem';

import {
  InitialParams,
  PayloadParams,
  ProposalCreateOverviewPage,
} from '../../components/pages/ProposalCreateOverviewPage';
import { metaTexts } from '../../helpers/texts/metaTexts';
import { api } from '../../trpc/server';

export const metadata: Metadata = {
  title: metaTexts.ipfsTitle,
  description: metaTexts.ipfsDescription,
  openGraph: {
    images: ['/metaLogo.jpg'],
    title: metaTexts.ipfsTitle,
    description: metaTexts.ipfsDescription,
  },
};

export const revalidate = 60;

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

  const initialPayloads = Object.values(payloads);
  const [configs, proposalsCount] = await Promise.all([
    api.configs.get(),
    api.configs.getProposalsCount(),
  ]);
  const data = await api.createProposal.getForCreateOverview({
    payloads: initialPayloads,
    ipfsHash: ipfsHash ?? zeroHash,
  });

  const initialParams: InitialParams = {
    proposalId,
    ipfsHash,
    votingPortal,
    proposalsCount: Number(proposalsCount),
    cancellationFee: configs.contractsConstants.cancellationFee.toString(10),
    payloads: data.payloads,
    ipfsData: data.ipfsData,
    ipfsError: data.ipfsError,
  };

  return <ProposalCreateOverviewPage initialParams={initialParams} />;
}
