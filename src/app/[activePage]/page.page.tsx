import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProposalsList } from '../../components/ProposalsList/ProposalsList';
import { PAGE_SIZE } from '../../configs/configs';
import { metaTexts } from '../../helpers/texts/metaTexts';
import { api } from '../../trpc/server';

export const metadata: Metadata = {
  title: `${metaTexts.ipfsTitle}`,
  description: metaTexts.proposalListMetaDescription,
  openGraph: {
    images: ['/metaLogo.jpg'],
    title: `${metaTexts.ipfsTitle}`,
    description: metaTexts.proposalListMetaDescription,
  },
};

export async function generateStaticParams() {
  const proposalsCount = await api.configs.getProposalsCount();
  const allPagesCount = Math.ceil(Number(proposalsCount) / PAGE_SIZE);
  return [...Array(Number(allPagesCount)).keys()].map((activePage) => ({
    activePage: String(activePage + 1),
    fallback: false,
  }));
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { activePage: string };
  searchParams: Record<string, string | undefined>;
}) {
  const activePage = +params.activePage;
  if (isNaN(activePage)) {
    notFound();
  }
  return <ProposalsList activePage={activePage} searchParams={searchParams} />;
}
