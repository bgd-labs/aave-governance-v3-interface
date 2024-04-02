'use client';

import {
  CachedProposalDataItemWithId,
  ContractsConstants,
  FinishedProposalForList,
  VotingConfig,
} from '@bgd-labs/aave-governance-ui-helpers';
import React, { useEffect } from 'react';

import { useRootStore } from '../../../store/storeProvider';
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
  const totalProposalCount = useRootStore((store) => store.totalProposalCount);
  const setLoadingListCache = useRootStore(
    (store) => store.setLoadingListCache,
  );
  const setTotalProposalCount = useRootStore(
    (store) => store.setTotalProposalCount,
  );
  const cachedProposalsIds = useRootStore((store) => store.cachedProposalsIds);
  const setCachedProposalsIds = useRootStore(
    (store) => store.setCachedProposalsIds,
  );
  const setSSRGovCoreConfigs = useRootStore(
    (store) => store.setSSRGovCoreConfigs,
  );
  const setCachedProposals = useRootStore((store) => store.setCachedProposals);
  const storeCachedProposals = useRootStore((store) => store.cachedProposals);

  const data = {
    totalProposalCount: cachedTotalProposalCount,
    proposals: cachedProposals || [],
  };

  useEffect(() => {
    setSSRGovCoreConfigs(govCoreConfigs, contractsConstants);
  }, []);

  useEffect(() => {
    if (!!data.proposals.length) {
      setLoadingListCache(false);
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
        !storeCachedProposals.length ||
        storeCachedProposals.length <
          (proposalListCachedData.cachedProposals?.length || 0)
      ) {
        setCachedProposals(proposalListCachedData.cachedProposals || []);
      }
    } else {
      setLoadingListCache(false);
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
