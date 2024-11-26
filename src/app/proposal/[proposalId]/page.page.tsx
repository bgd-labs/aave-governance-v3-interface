import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

import { ProposalDetailsInitializer } from '../../../components/ProposalsDetails/ProposalDetailsInitializer';
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

export async function generateStaticParams() {
  const proposalsCount = await api.configs.getProposalsCount();
  return [...Array(Number(proposalsCount)).keys()].map((proposalId) => ({
    proposalId: String(proposalId),
    fallback: false,
  }));
}

export const revalidate = 3600 * 3;

export default async function Page({
  params,
}: {
  params: { proposalId: string };
}) {
  const proposalId = +params.proposalId;
  if (isNaN(proposalId)) {
    notFound();
  }
  const [configs, count] = await Promise.all([
    await api.configs.get(),
    await api.configs.getProposalsCount(),
  ]);
  return (
    <ProposalDetailsInitializer
      proposalId={proposalId}
      configs={configs}
      count={Number(count)}
    />
  );
}
