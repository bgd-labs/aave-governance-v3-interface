import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

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

export const revalidate = 3600;

export default function Page({ params }: { params: { proposalId: string } }) {
  const proposalId = +params.proposalId;
  if (isNaN(proposalId)) {
    notFound(); // TODO: should be dynamic proposal page
  }
  return <h1>Proposal id {proposalId}</h1>;
}
