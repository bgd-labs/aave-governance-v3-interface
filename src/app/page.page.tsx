import { Metadata } from 'next';
import { Suspense } from 'react';

import { Container } from '../components/primitives/Container';
import { Loading } from '../components/ProposalsList/Loading';
import { ProposalListItemWrapper } from '../components/ProposalsList/ProposalListItemWrapper';
import { ProposalsListInitialize } from '../components/ProposalsList/ProposalsListInitialize';
import { PAGE_SIZE } from '../configs/configs';
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
    <Suspense
      fallback={
        <Container>
          {Array.from({ length: 2 }).map((_, index) => (
            <ProposalListItemWrapper key={index}>
              <Loading />
            </ProposalListItemWrapper>
          ))}
          {Array.from({ length: PAGE_SIZE - 2 }).map((_, index) => (
            <ProposalListItemWrapper isFinished key={index}>
              <Loading isFinished />
            </ProposalListItemWrapper>
          ))}
        </Container>
      }>
      <ProposalsListInitialize activePage={1} configs={configs} count={count} />
    </Suspense>
  );
}
