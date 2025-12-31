'use client';

import React, { useEffect } from 'react';

import { useProposalListCache } from '../../../queries/proposalQueries';
import { useStore } from '../../../store/ZustandStoreProvider';
import { Container } from '../../../ui';
import { Loading } from './Loading';
import { ProposalListItemWrapper } from './ProposalListItemWrapper';
import ProposalListWrapper from './ProposalListWrapper';

export function ProposalPage() {
  const totalProposalCount = useStore((store) => store.totalProposalCount);
  const setLoadingListCache = useStore((store) => store.setLoadingListCache);
  const setTotalProposalCount = useStore(
    (store) => store.setTotalProposalCount,
  );
  const cachedProposalsIds = useStore((store) => store.cachedProposalsIds);
  const setCachedProposalsIds = useStore(
    (store) => store.setCachedProposalsIds,
  );
  const cachedProposals = useStore((store) => store.cachedProposals);
  const setCachedProposals = useStore((store) => store.setCachedProposals);

  const { isLoading, data, error } = useProposalListCache();

  useEffect(() => {
    setLoadingListCache(isLoading);
    if (!isLoading && !error) {
      const proposalListCachedData = {
        totalProposalCount: data?.totalProposalCount || -1,
        cachedProposalsIds:
          data?.proposals.map((proposal) => proposal.id) || [],
        cachedProposals: data?.proposals || [],
      };

      if (totalProposalCount < 0) {
        setTotalProposalCount(proposalListCachedData.totalProposalCount || 0);
      }

      if (
        !cachedProposalsIds.length ||
        cachedProposalsIds.length <
          (proposalListCachedData.cachedProposalsIds?.length || 0)
      ) {
        setCachedProposalsIds(proposalListCachedData.cachedProposalsIds || []);
      }

      if (
        !cachedProposals.length ||
        cachedProposals.length <
          (proposalListCachedData.cachedProposals?.length || 0)
      ) {
        setCachedProposals(proposalListCachedData.cachedProposals || []);
      }
    }
  }, [isLoading, error]);

  if (isLoading)
    return (
      <Container>
        <ProposalListItemWrapper>
          <Loading />
        </ProposalListItemWrapper>
        <ProposalListItemWrapper>
          <Loading />
        </ProposalListItemWrapper>
        <ProposalListItemWrapper>
          <Loading />
        </ProposalListItemWrapper>
        <ProposalListItemWrapper>
          <Loading />
        </ProposalListItemWrapper>
      </Container>
    );

  return (
    <Container>
      <ProposalListWrapper />
    </Container>
  );
}
