'use client';

import { useRequest } from 'alova';
import React, { useEffect } from 'react';

import { useStore } from '../../../store';
import { Container } from '../../../ui';
import { getProposalListCacheFromGithub } from '../../../utils/githubCacheRequests';
import { Loading } from './Loading';
import { ProposalListItemWrapper } from './ProposalListItemWrapper';
import ProposalListWrapper from './ProposalListWrapper';

export function ProposalPage() {
  const store = useStore();

  const { loading, data, error } = useRequest(getProposalListCacheFromGithub);

  useEffect(() => {
    store.setLoadingListCache(loading);
    if (!loading && !error) {
      const proposalListCachedData = {
        totalProposalCount: data?.totalProposalCount || -1,
        cachedProposalsIds:
          data?.proposals.map((proposal) => proposal.id) || [],
        cachedProposals: data?.proposals || [],
      };

      if (store.totalProposalCount < 0) {
        store.setTotalProposalCount(
          proposalListCachedData.totalProposalCount || 0,
        );
      }

      if (
        !store.cachedProposalsIds.length ||
        store.cachedProposalsIds.length <
          (proposalListCachedData.cachedProposalsIds?.length || 0)
      ) {
        store.setCachedProposalsIds(
          proposalListCachedData.cachedProposalsIds || [],
        );
      }

      if (
        !store.cachedProposals.length ||
        store.cachedProposals.length <
          (proposalListCachedData.cachedProposals?.length || 0)
      ) {
        store.setCachedProposals(proposalListCachedData.cachedProposals || []);
      }
    }
  }, [loading, error]);

  if (loading)
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
