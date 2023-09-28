'use client';

import {
  CachedDetails,
  ContractsConstants,
  ProposalMetadata,
  ProposalWithLoadings,
  VotersData,
  VotingConfig,
} from '@bgd-labs/aave-governance-ui-helpers';
import React, { useEffect } from 'react';

import { useStore } from '../../../store';
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
}: ProposalClientPageSSRProps) {
  const id = Number(idSSR);
  const store = useStore();

  useEffect(() => {
    store.setSSRGovCoreConfigs(govCoreConfigs, contractsConstants);
    store.setTotalProposalCount(proposalCount);
  }, []);

  useEffect(() => {
    if (
      !store.cachedProposalsIds.length ||
      store.cachedProposalsIds.length <
        (cachedProposalsIdsData?.cachedProposalsIds.length || 0)
    ) {
      store.setCachedProposalsIds(
        cachedProposalsIdsData?.cachedProposalsIds || [],
      );
    }
  }, []);

  useEffect(() => {
    if (ipfsDataSSR) {
      store.setIpfsData(ipfsDataSSR.originalIpfsHash, ipfsDataSSR);
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
        />
      </Container>
    );
  }
}
