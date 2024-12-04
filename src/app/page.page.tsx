import { Metadata } from 'next';

import { ProposalsListInitialize } from '../components/ProposalsList/ProposalsListInitialize';
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
    await api.configs.get(),
    await api.configs.getProposalsCount(),
  ]);
  return (
    <ProposalsListInitialize activePage={1} configs={configs} count={count} />
  );
}
