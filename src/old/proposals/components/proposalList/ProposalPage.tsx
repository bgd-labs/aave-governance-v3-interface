'use client';

import { useRequest } from 'alova';
import React, { useEffect } from 'react';

import { useStore } from '../../../store/ZustandStoreProvider';
import { Container } from '../../../ui';
import { getProposalListCacheFromGithub } from '../../../utils/githubCacheRequests';
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

  const { loading, data, error } = useRequest(getProposalListCacheFromGithub);

  useEffect(() => {
    setLoadingListCache(loading);
    if (!loading && !error) {
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
