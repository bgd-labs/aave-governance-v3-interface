import {
  CombineProposalState,
  ProposalHistoryItem,
  ProposalMetadata,
  ProposalWithLoadings,
  VotersData,
} from '@bgd-labs/aave-governance-ui-helpers';
import React, { useEffect, useState } from 'react';

import { useStore } from '../../../store/ZustandStoreProvider';
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
  const cachedProposals = useStore((store) => store.cachedProposals);
  const activeWallet = useStore((store) => store.activeWallet);
  const configs = useStore((store) => store.configs);
  const ipfsDataErrors = useStore((store) => store.ipfsDataErrors);
  const getL1Balances = useStore((store) => store.getL1Balances);
  const contractsConstants = useStore((store) => store.contractsConstants);
  const setDetailedProposalsDataLoadings = useStore(
    (store) => store.setDetailedProposalsDataLoadings,
  );
  const ipfsDataFromStoreInit = useStore((store) => store.ipfsData);
  const representative = useStore((store) => store.representative);
  const isRendered = useStore((store) => store.isRendered);
  const rpcAppErrors = useStore((store) => store.rpcAppErrors);
  const setVoters = useStore((store) => store.setVoters);
  const initProposalHistory = useStore((store) => store.initProposalHistory);
  const startDetailedProposalDataPolling = useStore(
    (store) => store.startDetailedProposalDataPolling,
  );
  const detailedProposalsData = useStore(
    (store) => store.detailedProposalsData,
  );
  const stopDetailedProposalDataPolling = useStore(
    (store) => store.stopDetailedProposalDataPolling,
  );
  const detailedProposalsDataLoading = useStore(
    (store) => store.detailedProposalsDataLoading,
  );
  const blockHashBalance = useStore((store) => store.blockHashBalance);
  const getProposalDataWithIpfsById = useStore(
    (store) => store.getProposalDataWithIpfsById,
  );
  const totalProposalCountLoading = useStore(
    (store) => store.totalProposalCountLoading,
  );
  const representativeLoading = useStore(
    (store) => store.representativeLoading,
  );
  const blockHashBalanceLoadings = useStore(
    (store) => store.blockHashBalanceLoadings,
  );
  const appMode = useStore((store) => store.appMode);
  const getDetailedProposalsData = useStore(
    (store) => store.getDetailedProposalsData,
  );

  const proposalDataFromStore = getProposalDataById({
    detailedProposalsData,
    configs,
    contractsConstants,
    representativeLoading,
    activeWallet,
    representative,
    blockHashBalanceLoadings,
    blockHashBalance,
    proposalId: id,
  });
  const ipfsDataFromStore = selectIpfsDataByProposalId(
    detailedProposalsData,
    ipfsDataFromStoreInit,
    id,
  );

  const [cachedProposalsIdsLocal, setCachedProposalsIdsLocal] = useState(
    cachedProposalsIds || cachedProposals.map((proposal) => proposal.id),
  );
  const [proposalData, setProposalData] = useState(
    proposalDataSSR || proposalDataFromStore,
  );

  useEffect(() => {
    setProposalData(proposalDataSSR || proposalDataFromStore);
  }, [id]);

  useEffect(() => {
    if (cachedProposals.length) {
      setCachedProposalsIdsLocal(
        cachedProposals.map((proposal) => proposal.id),
      );
    }
  }, [id, cachedProposals.length]);

  useEffect(() => {
    setDetailedProposalsDataLoadings(id);
  }, [id, representative.address, activeWallet?.address]);

  useEffect(() => {
    if (proposalDataFromStore) {
      setProposalData(
        getProposalDataById({
          detailedProposalsData,
          configs,
          contractsConstants,
          representativeLoading,
          activeWallet,
          representative,
          blockHashBalanceLoadings,
          blockHashBalance,
          proposalId: id,
        }),
      );
    }
  }, [
    id,
    isRendered,
    proposalDataFromStore?.proposal.data.votingMachineData.votedInfo,
    detailedProposalsDataLoading,
    blockHashBalance,
    representativeLoading,
    representative.address,
    blockHashBalanceLoadings,
  ]);

  const ipfsData =
    isRendered && ipfsDataFromStore
      ? ipfsDataFromStore
      : ipfsDataSSR || ipfsDataFromStore;
  const ipfsDataError = selectIpfsDataErrorByProposalId(
    detailedProposalsData,
    ipfsDataErrors,
    id,
  );

  useEffect(() => {
    return () => {
      stopDetailedProposalDataPolling();
    };
  }, []);

  useEffect(() => {
    if (id || id === 0) {
      if (
        !detailedProposalsData[id] &&
        !totalProposalCountLoading &&
        !cachedProposalsIdsLocal.find((i) => i === id) &&
        !representativeLoading
      ) {
        getProposalDataWithIpfsById(id);
      }
    }
  }, [
    id,
    detailedProposalsData,
    ipfsDataFromStoreInit,
    blockHashBalance,
    totalProposalCountLoading,
    representativeLoading,
  ]);

  useEffect(() => {
    if (proposalData) {
      if (
        activeWallet?.isActive &&
        !proposalData.proposal.balances.length &&
        detailedProposalsData[id] &&
        !representativeLoading
      ) {
        getL1Balances([id]);
      }
      const isFinished =
        proposalData.proposal.combineState === CombineProposalState.Executed ||
        proposalData.proposal.combineState === CombineProposalState.Failed ||
        proposalData.proposal.combineState === CombineProposalState.Canceled ||
        proposalData.proposal.combineState === CombineProposalState.Expired;

      if (!proposalData.proposal.data.isFinished && !isFinished) {
        startDetailedProposalDataPolling([id]);
      }
    }
  }, [
    id,
    proposalData?.loading,
    representative.address,
    proposalData?.proposal.combineState,
    representativeLoading,
  ]);

  useEffect(() => {
    if (
      !proposalData?.loading &&
      proposalData?.proposal &&
      activeWallet?.isActive
    ) {
      setTimeout(() => getProposalDataWithIpfsById(id), 1);
    }
  }, [
    id,
    proposalData?.loading,
    activeWallet?.address,
    detailedProposalsDataLoading,
    representativeLoading,
    representative.address,
  ]);

  useEffect(() => {
    if (votesData) {
      setProposalDetailsVoters(setVoters, votesData.votes);
    }
  }, [id]);

  useEffect(() => {
    if (
      appMode === 'expert' &&
      proposalData?.proposal.data.isFinished &&
      proposalData?.proposal.data.cancellationFee > 0
    ) {
      setTimeout(
        () =>
          getDetailedProposalsData({
            ids: [id],
            fullData: true,
          }),
        1,
      );
    }
  }, [id, proposalData?.loading, appMode]);

  useEffect(() => {
    if (cachedProposalEvents) {
      if (!!Object.keys(cachedProposalEvents).length && !!proposalData) {
        initProposalHistory(proposalData.proposal, cachedProposalEvents);
      }
    } else if (!cachedProposalEvents && !isForIPFS && !!proposalData) {
      initProposalHistory(proposalData.proposal);
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
    (totalProposalCountLoading &&
      !Object.values(rpcAppErrors).find(
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
