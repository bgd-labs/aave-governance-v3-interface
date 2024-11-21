'use client';

import { useEffect } from 'react';

import { Container } from '../components/primitives/Container';
import { Loading } from '../components/ProposalsList/Loading';
import { ProposalListItemWrapper } from '../components/ProposalsList/ProposalListItemWrapper';
import { PAGE_SIZE } from '../configs/configs';

export default function LoadingPage() {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  return (
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
  );
}
