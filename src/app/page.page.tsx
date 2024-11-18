import { Metadata } from 'next';

import { ProposalsList } from '../components/ProposalsList/ProposalsList';
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

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  return <ProposalsList activePage={1} searchParams={searchParams} />;
}
