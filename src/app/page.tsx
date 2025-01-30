import { Metadata } from 'next';
import { Suspense } from 'react';

import { ProposalsListInitialize } from '../components/ProposalsList/ProposalsListInitialize';
import ProposalsListPageLoading from '../components/ProposalsList/ProposalsListPageLoading';
import { metaTexts } from '../helpers/texts/metaTexts';
import { api } from '../trpc/server';

export const metadata: Metadata = {
  title: `${metaTexts.ipfsTitle}`,
  description: metaTexts.proposalListMetaDescription,
  openGraph: {
    images: ['/metaLogo.jpg'],
    title: `${metaTexts.ipfsTitle}`,
    description: metaTexts.proposalListMetaDescription,
  },
};

export const revalidate = 60;

export default async function Page() {
  const [configs, count] = await Promise.all([
    api.configs.get(),
    api.configs.getProposalsCount({}),
  ]);
  return (
    <Suspense fallback={<ProposalsListPageLoading />}>
      <ProposalsListInitialize activePage={1} configs={configs} count={count} />
    </Suspense>
  );
}
