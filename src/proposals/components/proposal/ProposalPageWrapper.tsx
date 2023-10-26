import {
  ProposalMetadata,
  ProposalState,
  ProposalWithLoadings,
  VotersData,
} from '@bgd-labs/aave-governance-ui-helpers';
import React, { useEffect, useState } from 'react';

import { useStore } from '../../../store';
import {
  getProposalDataById,
  selectIpfsDataByProposalId,
  selectIpfsDataErrorByProposalId,
  setProposalDetailsVoters,
} from '../../store/proposalsSelectors';
import { ProposalLoading } from './ProposalLoading';
import { ProposalPage } from './ProposalPage';

interface ProposalPageWrapperProps {
  id: number;
  proposalDataSSR?: ProposalWithLoadings;
  ipfsDataSSR?: ProposalMetadata;
  cachedProposalsIds?: number[];
  votesData?: {
    votes: VotersData[];
  };
}

export function ProposalPageWrapper({
  id,
  proposalDataSSR,
  ipfsDataSSR,
  cachedProposalsIds,
  votesData,
}: ProposalPageWrapperProps) {
  const store = useStore();

  const proposalDataFromStore = getProposalDataById(store, id);
  const ipfsDataFromStore = selectIpfsDataByProposalId(store, id);

  const [cachedProposalsIdsLocal, setCachedProposalsIdsLocal] = useState(
    cachedProposalsIds || store.cachedProposals.map((proposal) => proposal.id),
  );
  const [proposalData, setProposalData] = useState(
    proposalDataSSR || proposalDataFromStore,
  );

  useEffect(() => {
    if (!!store.cachedProposals.length) {
      setCachedProposalsIdsLocal(
        store.cachedProposals.map((proposal) => proposal.id),
      );
    }
  }, [store.cachedProposals.length]);

  useEffect(() => {
    store.setDetailedProposalsDataLoadings(id);
  }, [store.representative.address, store.activeWallet?.address]);

  useEffect(() => {
    if (!!proposalDataFromStore) {
      setProposalData(getProposalDataById(store, id));
    }
  }, [
    store.isRendered,
    proposalDataFromStore?.proposal.data.votingMachineData.votedInfo,
    store.detailedProposalsDataLoading,
    store.blockHashBalance,
    store.representativeLoading,
    store.representative.address,
    store.blockHashBalanceLoadings,
  ]);

  const ipfsData =
    store.isRendered && ipfsDataFromStore
      ? ipfsDataFromStore
      : ipfsDataSSR || ipfsDataFromStore;
  const ipfsDataError = selectIpfsDataErrorByProposalId(store, id);

  useEffect(() => {
    return () => {
      store.stopDetailedProposalDataPolling();
    };
  }, []);

  useEffect(() => {
    if (id || id === 0) {
      if (
        !store.detailedProposalsData[id] &&
        !store.totalProposalCountLoading &&
        !cachedProposalsIdsLocal.find((i) => i === id) &&
        !store.representativeLoading
      ) {
        store.getProposalDataWithIpfsById(id);
      }
    }
  }, [
    id,
    store.detailedProposalsData,
    store.ipfsData,
    store.blockHashBalance,
    store.totalProposalCountLoading,
    store.representativeLoading,
  ]);

  useEffect(() => {
    if (proposalData) {
      if (
        store.activeWallet?.isActive &&
        !proposalData.proposal.balances.length &&
        store.detailedProposalsData[id] &&
        !store.representativeLoading
      ) {
        store.getL1Balances([id]);
      }
      const isFinished =
        proposalData.proposal.state === ProposalState.Executed ||
        proposalData.proposal.state === ProposalState.Defeated ||
        proposalData.proposal.state === ProposalState.Canceled ||
        proposalData.proposal.state === ProposalState.Expired;

      if (!proposalData.proposal.data.prerender && !isFinished) {
        store.startDetailedProposalDataPolling([id]);
      }
    }
  }, [
    id,
    proposalData?.loading,
    store.representative.address,
    proposalData?.proposal.state,
    store.representativeLoading,
  ]);

  useEffect(() => {
    if (
      !proposalData?.loading &&
      proposalData?.proposal &&
      store.activeWallet?.isActive
    ) {
      setTimeout(() => store.getProposalDataWithIpfsById(id), 1);
    }
  }, [
    id,
    proposalData?.loading,
    store.activeWallet?.address,
    store.detailedProposalsDataLoading,
    store.representativeLoading,
    store.representative.address,
  ]);

  useEffect(() => {
    if (votesData) {
      setProposalDetailsVoters(store, votesData.votes);
    }
  }, []);

  if (!proposalData?.proposal && ipfsData && !ipfsDataError)
    return (
      <ProposalLoading ipfsData={ipfsData} ipfsDataError={ipfsDataError} />
    );

  if (
    !proposalData?.proposal ||
    proposalData.loading ||
    (!ipfsData && !ipfsDataError) ||
    store.totalProposalCountLoading
  )
    return <ProposalLoading />;

  return (
    <ProposalPage
      id={id}
      proposalData={proposalData}
      ipfsData={ipfsData}
      ipfsDataError={ipfsDataError}
    />
  );
}
