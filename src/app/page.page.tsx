import { Metadata } from 'next';

import { ProposalsListInitialize } from '../components/ProposalsList/ProposalsListInitialize';
import { metaTexts } from '../helpers/texts/metaTexts';

export const metadata: Metadata = {
  title: `${metaTexts.ipfsTitle}`,
  description: metaTexts.proposalListMetaDescription,
  openGraph: {
    images: ['/metaLogo.jpg'],
    title: `${metaTexts.ipfsTitle}`,
    description: metaTexts.proposalListMetaDescription,
  },
};

export const revalidate = 3600;

export default async function Page() {
  return <ProposalsListInitialize activePage={1} />;
}
