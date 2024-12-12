'use client';

import { useEffect } from 'react';

import { PAGE_SIZE } from '../../configs/configs';
import { Container } from '../primitives/Container';
import { FiltersPanelLoading } from './FiltersPanel';
import { Loading } from './Loading';
import { ProposalListItemWrapper } from './ProposalListItemWrapper';

export default function ProposalsListPageLoading() {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  return (
    <>
      <FiltersPanelLoading />

      <Container>
        {Array.from({ length: 2 }).map((_, index) => (
          <ProposalListItemWrapper isForHelpModal key={index}>
            <Loading />
          </ProposalListItemWrapper>
        ))}
        {Array.from({ length: PAGE_SIZE - 2 }).map((_, index) => (
          <ProposalListItemWrapper isForHelpModal isFinished key={index}>
            <Loading isFinished />
          </ProposalListItemWrapper>
        ))}
      </Container>
    </>
  );
}
