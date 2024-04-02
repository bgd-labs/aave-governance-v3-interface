'use client';

import { useRequest } from 'alova';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

import { useRootStore } from '../../../store/storeProvider';
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

  const totalProposalCount = useRootStore((store) => store.totalProposalCount);
  const totalProposalCountLoading = useRootStore(
    (store) => store.totalProposalCountLoading,
  );
  const detailedProposalsData = useRootStore(
    (store) => store.detailedProposalsData,
  );
  const getTotalProposalCount = useRootStore(
    (store) => store.getTotalProposalCount,
  );
  const cachedProposalsIds = useRootStore((store) => store.cachedProposalsIds);
  const setCachedProposalsIds = useRootStore(
    (store) => store.setCachedProposalsIds,
  );
  const setVoters = useRootStore((store) => store.setVoters);

  const { loading, data, error } = useRequest(getCachedProposalsIdsFromGithub);
  const {
    loading: votesLoading,
    data: votesData,
    error: votesError,
  } = useRequest(getProposalVotesCache(id));

  useEffect(() => {
    if (totalProposalCount < 0 && id >= 0) {
      getTotalProposalCount(true);
    }
  }, [id, totalProposalCount]);

  useEffect(() => {
    if (!loading && !error) {
      if (
        !cachedProposalsIds.length ||
        cachedProposalsIds.length < (data?.cachedProposalsIds.length || 0)
      ) {
        setCachedProposalsIds(data?.cachedProposalsIds || []);
      }
    }
  }, [loading, error]);

  useEffect(() => {
    if (!votesLoading && !votesError) {
      if (votesData) {
        setProposalDetailsVoters(setVoters, votesData.votes);
      }
    }
  }, [votesLoading, votesError, votesData]);

  if ((loading && !cachedProposalsIds.length) || votesLoading)
    return (
      <Container>
        <ProposalLoading />
      </Container>
    );

  if (detailedProposalsData[id]) {
    if (detailedProposalsData[id].isFinished) {
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
    (totalProposalCount - 1 < id && !totalProposalCountLoading) ||
    Number.isNaN(id) ||
    id < 0
  ) {
    return <NotFoundPage />;
  } else if (
    !!cachedProposalsIds.find((proposalId) => proposalId === id) ||
    cachedProposalsIds.find((proposalId) => proposalId === id) === 0
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
