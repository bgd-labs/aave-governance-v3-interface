'use client';

import {
  CachedDetails,
  ContractsConstants,
  ProposalHistoryItem,
  ProposalMetadata,
  ProposalWithLoadings,
  VotersData,
  VotingConfig,
} from '@bgd-labs/aave-governance-ui-helpers';
import React, { useEffect } from 'react';

import { useStore } from '../../../store/ZustandStoreProvider';
import { Container } from '../../../ui';
import { NotFoundPage } from '../../../ui/pages/NotFoundPage';
import { ProposalPageWrapper } from './ProposalPageWrapper';
import { ProposalPageWrapperSSR } from './ProposalPageWrapperSSR';

interface ProposalClientPageSSRProps {
  idSSR?: number;
  cachedProposalsIdsData?: {
    cachedProposalsIds: number[];
  };
  cachedDetailsData?: CachedDetails;
  cachedVotesData?: {
    votes: VotersData[];
  };
  govCoreConfigs: VotingConfig[];
  contractsConstants: ContractsConstants;
  proposalCount: number;
  proposalDataSSR?: ProposalWithLoadings;
  ipfsDataSSR?: ProposalMetadata;
  cachedProposalEvents?: Record<string, ProposalHistoryItem>;
}
export function ProposalClientPageSSR({
  idSSR,
  cachedProposalsIdsData,
  cachedDetailsData,
  cachedVotesData,
  govCoreConfigs,
  contractsConstants,
  proposalCount,
  proposalDataSSR,
  ipfsDataSSR,
  cachedProposalEvents,
}: ProposalClientPageSSRProps) {
  const id = Number(idSSR);
  const setSSRGovCoreConfigs = useStore((store) => store.setSSRGovCoreConfigs);
  const setTotalProposalCount = useStore(
    (store) => store.setTotalProposalCount,
  );
  const cachedProposalsIds = useStore((store) => store.cachedProposalsIds);
  const setCachedProposalsIds = useStore(
    (store) => store.setCachedProposalsIds,
  );
  const setIpfsData = useStore((store) => store.setIpfsData);

  useEffect(() => {
    setSSRGovCoreConfigs(govCoreConfigs, contractsConstants);
    setTotalProposalCount(proposalCount);
  }, []);

  useEffect(() => {
    if (
      !cachedProposalsIds.length ||
      cachedProposalsIds.length <
        (cachedProposalsIdsData?.cachedProposalsIds.length || 0)
    ) {
      setCachedProposalsIds(cachedProposalsIdsData?.cachedProposalsIds || []);
    }
  }, []);

  useEffect(() => {
    if (ipfsDataSSR) {
      setIpfsData(ipfsDataSSR.originalIpfsHash, ipfsDataSSR);
    }
  }, [ipfsDataSSR]);

  if (Number.isNaN(id) || id < 0) {
    return <NotFoundPage />;
  } else if (
    !!cachedProposalsIdsData?.cachedProposalsIds.find(
      (proposalId) => proposalId === id,
    ) ||
    cachedProposalsIdsData?.cachedProposalsIds.find(
      (proposalId) => proposalId === id,
    ) === 0
  ) {
    return (
      <Container>
        <ProposalPageWrapperSSR
          id={id}
          detailsData={cachedDetailsData}
          votesData={cachedVotesData}
          proposalDataSSR={proposalDataSSR}
          cachedProposalsIds={cachedProposalsIdsData?.cachedProposalsIds}
          cachedProposalEvents={cachedProposalEvents}
        />
      </Container>
    );
  } else {
    return (
      <Container>
        <ProposalPageWrapper
          id={id}
          proposalDataSSR={proposalDataSSR}
          ipfsDataSSR={cachedDetailsData?.ipfs || ipfsDataSSR}
          cachedProposalsIds={cachedProposalsIdsData?.cachedProposalsIds}
          votesData={cachedVotesData}
          cachedProposalEvents={cachedProposalEvents}
        />
      </Container>
    );
  }
}
