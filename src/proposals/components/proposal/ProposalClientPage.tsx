'use client';

import { useRequest } from 'alova';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

import { useStore } from '../../../store';
import { Container } from '../../../ui';
import { NotFoundPage } from '../../../ui/pages/NotFoundPage';
import {
  getCachedProposalsIdsFromGithub,
  getProposalVotesCache,
} from '../../../utils/githubCacheRequests';
import { setProposalDetailsVoters } from '../../store/proposalsSelectors';
import { ProposalLoading } from './ProposalLoading';
import { ProposalPageWrapper } from './ProposalPageWrapper';
import { ProposalPageWrapperWithCache } from './ProposalPageWrapperWithCache';

export function ProposalClientPage() {
  const searchParams = useSearchParams();
  const id = Number(searchParams?.get('proposalId'));

  const store = useStore();

  const { loading, data, error } = useRequest(getCachedProposalsIdsFromGithub);
  const {
    loading: votesLoading,
    data: votesData,
    error: votesError,
  } = useRequest(getProposalVotesCache(id));

  useEffect(() => {
    if (store.totalProposalCount < 0 && id >= 0) {
      store.getTotalProposalCount(true);
    }
  }, [id, store.totalProposalCount]);

  useEffect(() => {
    if (!loading && !error) {
      if (
        !store.cachedProposalsIds.length ||
        store.cachedProposalsIds.length < (data?.cachedProposalsIds.length || 0)
      ) {
        store.setCachedProposalsIds(data?.cachedProposalsIds || []);
      }
    }
  }, [loading, error]);

  useEffect(() => {
    if (!votesLoading && !votesError) {
      if (votesData) {
        setProposalDetailsVoters(store, votesData.votes);
      }
    }
  }, [votesLoading, votesError, votesData]);

  if ((loading && !store.cachedProposalsIds.length) || votesLoading)
    return (
      <Container>
        <ProposalLoading />
      </Container>
    );

  if (store.detailedProposalsData[id]) {
    if (store.detailedProposalsData[id].isFinished) {
      return (
        <Container>
          <ProposalPageWrapperWithCache id={id} />
        </Container>
      );
    } else {
      return (
        <Container>
          <ProposalPageWrapper id={id} />
        </Container>
      );
    }
  } else if (
    (store.totalProposalCount - 1 < id && !store.totalProposalCountLoading) ||
    Number.isNaN(id) ||
    id < 0
  ) {
    return <NotFoundPage />;
  } else if (
    !!store.cachedProposalsIds.find((proposalId) => proposalId === id) ||
    store.cachedProposalsIds.find((proposalId) => proposalId === id) === 0
  ) {
    return (
      <Container>
        <ProposalPageWrapperWithCache id={id} />
      </Container>
    );
  } else {
    return (
      <Container>
        <ProposalPageWrapper id={id} />
      </Container>
    );
  }
}
