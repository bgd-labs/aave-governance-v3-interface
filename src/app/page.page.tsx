// TODO: just for test

import { Metadata } from 'next';
import { mainnet } from 'viem/chains';

import { metaTexts } from '../helpers/texts/metaTexts';
import { createViemClient } from '../old/utils/chains';
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

export default async function Page() {
  const data = await api.configs.get({
    govCoreClient: createViemClient(mainnet, ''),
  });

  return <h1>Hello world {data.totalProposalsCount}</h1>;
}
