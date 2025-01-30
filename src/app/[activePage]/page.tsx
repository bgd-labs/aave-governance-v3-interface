import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProposalsListInitialize } from '../../components/ProposalsList/ProposalsListInitialize';
import { isForIPFS } from '../../configs/appConfig';
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
  if (isForIPFS) {
    const proposalsCount = await api.configs.getProposalsCount({});
    const allPagesCount = Math.ceil(Number(proposalsCount) / PAGE_SIZE);
    return [...Array(Number(allPagesCount)).keys()].map((activePage) => ({
      activePage: String(activePage + 1),
      fallback: false,
    }));
  } else {
    return [];
  }
}

export const revalidate = 60;

export default async function Page({
  params,
}: {
  params: { activePage: string };
}) {
  const [configs, count] = await Promise.all([
    api.configs.get(),
    api.configs.getProposalsCount({}),
  ]);
  const activePage = +params.activePage;
  if (isNaN(activePage)) {
    notFound();
  }
  return (
    <ProposalsListInitialize
      count={count}
      configs={configs}
      activePage={activePage}
    />
  );
}
