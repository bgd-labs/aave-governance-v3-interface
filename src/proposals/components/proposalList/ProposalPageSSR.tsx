'use client';

import {
  CachedProposalDataItemWithId,
  ContractsConstants,
  FinishedProposalForList,
  VotingConfig,
} from '@bgd-labs/aave-governance-ui-helpers/src';
import React, { useEffect } from 'react';

import { useStore } from '../../../store';
import { Container } from '../../../ui';
import ProposalListWrapper from './ProposalListWrapper';

interface ProposalPageSSRProps {
  cachedTotalProposalCount?: number;
  cachedProposals?: FinishedProposalForList[];
  cachedProposalsData?: CachedProposalDataItemWithId[];
  govCoreConfigs: VotingConfig[];
  contractsConstants: ContractsConstants;
  cachedActiveIds: number[];
}

export function ProposalPageSSR({
  cachedTotalProposalCount,
  cachedProposals,
  cachedProposalsData,
  govCoreConfigs,
  contractsConstants,
  cachedActiveIds,
}: ProposalPageSSRProps) {
  const store = useStore();

  const data = {
    totalProposalCount: cachedTotalProposalCount,
    proposals: cachedProposals || [],
  };

  useEffect(() => {
    store.setSSRGovCoreConfigs(govCoreConfigs, contractsConstants);
  }, []);

  useEffect(() => {
    if (!!data.proposals.length) {
      store.setLoadingListCache(false);
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
    } else {
      store.setLoadingListCache(false);
    }
  }, [data.proposals.length]);

  return (
    <Container>
      <ProposalListWrapper
        cachedProposalsData={cachedProposalsData}
        cachedTotalProposalCount={cachedTotalProposalCount}
        cachedActiveIds={cachedActiveIds}
      />
    </Container>
  );
}
