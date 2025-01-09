import { Metadata } from 'next';
import React from 'react';

import { CreateProposalPage } from '../../components/Create/CreateProposalPage';
import { metaTexts } from '../../helpers/texts/metaTexts';
import { api } from '../../trpc/server';

export const metadata: Metadata = {
  title: `${metaTexts.main}${metaTexts.createPageMetaTitle}`,
  description: metaTexts.createPageMetaDescription,
  openGraph: {
    images: ['/metaLogo.jpg'],
    title: `${metaTexts.main}${metaTexts.createPageMetaTitle}`,
    description: metaTexts.createPageMetaDescription,
  },
};

export const revalidate = 60;

export default async function Page() {
  const [configs, count] = await Promise.all([
    await api.configs.get(),
    await api.configs.getProposalsCount({}),
  ]);

  const data = await api.createProposal.getForCreate({ proposalsCount: count });

  return (
    <CreateProposalPage
      proposalsCount={Number(count)}
      proposalsData={data.proposalsData}
      payloadsCount={data.payloadsCounts}
      accessLevels={[1, 2]}
      cancellationFee={configs.contractsConstants.cancellationFee.toString(10)}
      payloadsAvailableIds={data.payloadsAvailableIds}
    />
  );
}
