import { Metadata } from 'next';

import { ProposalDetailsInitializer } from '../../components/ProposalsDetails/ProposalDetailsInitializer';
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

export const revalidate = 3600 * 3;

export default async function Page() {
  const [configs, count] = await Promise.all([
    await api.configs.get(),
    await api.configs.getProposalsCount(),
  ]);
  return <ProposalDetailsInitializer configs={configs} count={Number(count)} />;
}
