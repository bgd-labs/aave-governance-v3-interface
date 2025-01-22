import { notFound } from 'next/navigation';
import React from 'react';

import { ProposalDetailsInitializer } from '../../../components/ProposalsDetails/ProposalDetailsInitializer';
import { isForIPFS } from '../../../configs/appConfig';
import { generateDetailsMetadata } from '../../../helpers/generateDetailsMetadata';
import { api } from '../../../trpc/server';

export async function generateMetadata({
  params,
}: {
  params: { proposalId: string };
}) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return await generateDetailsMetadata({ params });
}

export async function generateStaticParams() {
  if (isForIPFS) {
    const proposalsCount = await api.configs.getProposalsCount({});
    return await Promise.all(
      [...Array(Number(proposalsCount)).keys()].map(async (proposalId) => {
        const data = (await api.proposals.getProposalById({ proposalId }))[0];
        return {
          proposalId: `${proposalId}_${data.ipfsHash}`,
          fallback: false,
        };
      }),
    );
  } else {
    return [];
  }
}

export const revalidate = 60;

export default async function Page({
  params,
}: {
  params: { proposalId: string };
}) {
  const proposalId = params.proposalId;
  const id = +proposalId.split('_')[0];

  if (isNaN(id)) {
    notFound();
  }

  const configs = await api.configs.get();
  const data = await api.proposals.getDetails({
    ...configs.contractsConstants,
    votingConfigs: configs.configs,
    proposalId: id,
  });

  const voters = await api.proposals.getVoters({
    proposalId: id,
    votingChainId: data.votingData.votingChainId,
    startBlockNumber: Number(data.votingData.proposalData.creationBlockNumber),
    endBlockNumber: Number(
      data.votingData.proposalData.votingClosedAndSentBlockNumber,
    ),
  });

  return (
    <ProposalDetailsInitializer
      proposalId={proposalId}
      configs={configs}
      data={data}
      voters={voters}
    />
  );
}
