import {
  CombineProposalState,
  ProposalHistoryItem,
  ProposalMetadata,
  ProposalWithLoadings,
  VotersData,
} from '@bgd-labs/aave-governance-ui-helpers';
import React, { useEffect, useState } from 'react';

import { useStore } from '../../../store';
import { appConfig, isForIPFS } from '../../../utils/appConfig';
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
  cachedProposalEvents?: Record<string, ProposalHistoryItem>;
}

export function ProposalPageWrapper({
  id,
  proposalDataSSR,
  ipfsDataSSR,
  cachedProposalsIds,
  votesData,
  cachedProposalEvents,
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
    setProposalData(proposalDataSSR || proposalDataFromStore);
  }, [id]);

  useEffect(() => {
    if (!!store.cachedProposals.length) {
      setCachedProposalsIdsLocal(
        store.cachedProposals.map((proposal) => proposal.id),
      );
    }
  }, [id, store.cachedProposals.length]);

  useEffect(() => {
    store.setDetailedProposalsDataLoadings(id);
  }, [id, store.representative.address, store.activeWallet?.address]);

  useEffect(() => {
    if (!!proposalDataFromStore) {
      setProposalData(getProposalDataById(store, id));
    }
  }, [
    id,
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
        proposalData.proposal.combineState === CombineProposalState.Executed ||
        proposalData.proposal.combineState === CombineProposalState.Failed ||
        proposalData.proposal.combineState === CombineProposalState.Canceled ||
        proposalData.proposal.combineState === CombineProposalState.Expired;

      if (!proposalData.proposal.data.isFinished && !isFinished) {
        store.startDetailedProposalDataPolling([id]);
      }
    }
  }, [
    id,
    proposalData?.loading,
    store.representative.address,
    proposalData?.proposal.combineState,
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
  }, [id]);

  useEffect(() => {
    if (
      store.appMode === 'expert' &&
      proposalData?.proposal.data.isFinished &&
      proposalData?.proposal.data.cancellationFee > 0
    ) {
      setTimeout(
        () =>
          store.getDetailedProposalsData({
            ids: [id],
            fullData: true,
          }),
        1,
      );
    }
  }, [id, proposalData?.loading, store.appMode]);

  useEffect(() => {
    if (!!cachedProposalEvents) {
      if (!!Object.keys(cachedProposalEvents).length && !!proposalData) {
        store.initProposalHistory(proposalData.proposal, cachedProposalEvents);
      }
    } else if (!cachedProposalEvents && !isForIPFS && !!proposalData) {
      store.initProposalHistory(proposalData.proposal);
    }
  }, [!!Object.keys(cachedProposalEvents || {}).length, proposalData?.loading]);

  if (!proposalData?.proposal && ipfsData && !ipfsDataError)
    return (
      <ProposalLoading ipfsData={ipfsData} ipfsDataError={ipfsDataError} />
    );

  if (
    !proposalData?.proposal ||
    proposalData.loading ||
    (!ipfsData && !ipfsDataError) ||
    (store.totalProposalCountLoading &&
      !Object.values(store.rpcAppErrors).find(
        (error) => error.error && error.chainId === appConfig.govCoreChainId,
      )?.error)
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
