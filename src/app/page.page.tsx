import { Metadata } from 'next';
import { createClient, http } from 'viem';
import { mainnet } from 'viem/chains';

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

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // const activePage = searchParams['activePage']
  //   ? Number(searchParams['activePage']) - 1
  //   : 0;

  const client = createClient({
    chain: mainnet,
    transport: http(),
  });

  const data = await api.configs.get({ govCoreClient: client });

  return <h1>Hello world {data.totalProposalsCount}</h1>;
}
