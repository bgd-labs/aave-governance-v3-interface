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
      {Array.from({ length: PAGE_SIZE }).map((_, index) => (
        <ProposalListItemWrapper key={index}>
          <Loading />
        </ProposalListItemWrapper>
      ))}
    </Container>
  );
}
