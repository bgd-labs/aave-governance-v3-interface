import { notFound } from 'next/navigation';
import React from 'react';

import { ProposalDetailsInitializer } from '../../../components/ProposalsDetails/ProposalDetailsInitializer';
import { generateDetailsMetadata } from '../../../helpers/generateDetailsMetadata';
import { api } from '../../../trpc/server';

export async function generateMetadata({
  params,
}: {
  params: { proposalId: string };
}) {
  return await generateDetailsMetadata({ params });
}

export async function generateStaticParams() {
  const proposalsCount = await api.configs.getProposalsCount();
  return await Promise.all(
    [...Array(Number(proposalsCount)).keys()].map(async (proposalId) => {
      const data = (await api.proposals.getProposalById({ proposalId }))[0];
      return {
        proposalId: `${proposalId}_${data.ipfsHash}`,
        fallback: false,
      };
    }),
  );
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

  const [configs, count] = await Promise.all([
    await api.configs.get(),
    await api.configs.getProposalsCount(),
  ]);

  const data = await api.proposals.getDetails({
    ...configs.contractsConstants,
    votingConfigs: configs.configs,
    proposalId: id,
  });

  return (
    <ProposalDetailsInitializer
      proposalId={proposalId}
      configs={configs}
      count={Number(count)}
      data={data}
    />
  );
}
