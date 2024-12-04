'use client';

import { useEffect, useState } from 'react';
import { zeroAddress, zeroHash } from 'viem';

import { useStore } from '../../providers/ZustandStoreProvider';
import {
  selectProposalDataByUser,
  selectProposalDetailedData,
} from '../../store/selectors/proposalsSelector';
import {
  ContractsConstants,
  DetailedProposalData,
  VotingConfig,
} from '../../types';
import { Container } from '../primitives/Container';
import { ProposalLoading } from './ProposalLoading';
import { ProposalPage } from './ProposalPage';

export function ProposalDetailsInitializer({
  proposalId,
  configs,
  count,
  data,
}: {
  proposalId?: string;
  configs: {
    configs: VotingConfig[];
    contractsConstants: ContractsConstants;
  };
  count: number;
  data?: DetailedProposalData;
}) {
  const activeWallet = useStore((store) => store.activeWallet);
  const votingBalances = useStore((store) => store.votingBalances);
  const votedData = useStore((store) => store.votedData);
  const representative = useStore((store) => store.representative);
  const initializeConfigs = useStore((store) => store.initializeConfigs);
  const initializeProposalsCount = useStore(
    (store) => store.initializeProposalsCount,
  );
  const initializeProposalDetails = useStore(
    (store) => store.initializeProposalDetails,
  );
  const getProposalDetails = useStore((store) => store.getProposalDetails);
  const proposalDetails = useStore((store) => store.proposalDetails);
  const startActiveProposalDetailsPolling = useStore(
    (store) => store.startActiveProposalDetailsPolling,
  );
  const stopActiveProposalDetailsPolling = useStore(
    (store) => store.stopActiveProposalDetailsPolling,
  );
  const updateDetailsUserData = useStore(
    (store) => store.updateDetailsUserData,
  );
  const creatorPropositionPower = useStore(
    (store) => store.creatorPropositionPower,
  );

  const [idFromQuery, setIdFromQuery] = useState<string | null>(null);
  const [votingPower, setVotingPower] = useState(0n);

  useEffect(() => {
    initializeConfigs(configs);
  }, [configs]);
  useEffect(() => {
    initializeProposalsCount(count);
  }, [count]);

  useEffect(() => {
    const search =
      typeof window !== 'undefined' ? window.location.search.substr(1) : '';
    const queryParams = new URLSearchParams(search);
    for (const [key, value] of queryParams.entries()) {
      if (value) {
        if (key === 'proposalId') {
          setIdFromQuery(value);
        }
      }
    }
  }, []);

  const id = proposalId?.split('_')[0] ?? idFromQuery?.split('_')[0] ?? -1;

  useEffect(() => {
    if (+id === 0 || +id > 0) {
      if (data) {
        initializeProposalDetails(data);
      } else {
        getProposalDetails(Number(id));
      }
    }
  }, [id, data, activeWallet, representative]);

  const proposalData = selectProposalDetailedData({ id: +id, proposalDetails });

  useEffect(() => {
    if (proposalData && !proposalData.formattedData.isFinished) {
      startActiveProposalDetailsPolling(+id);
      () => stopActiveProposalDetailsPolling();
    }
  }, [proposalData?.proposalData.id]);

  useEffect(() => {
    if (
      activeWallet &&
      (proposalData?.proposalData.id || proposalData?.proposalData.id === 0)
    ) {
      updateDetailsUserData(proposalData.proposalData.id);
    }
  }, [
    proposalData?.proposalData.id,
    activeWallet?.address,
    representative?.address,
  ]);

  const balanceLoading = useStore(
    (state) => state.userDataLoadings[proposalData?.proposalData.id ?? -1],
  );
  const userProposalData = selectProposalDataByUser({
    votingBalances,
    snapshotBlockHash: proposalData?.proposalData.snapshotBlockHash ?? zeroHash,
    walletAddress:
      representative?.address || activeWallet?.address || zeroAddress,
    votedData,
  });

  useEffect(() => {
    if (userProposalData.voted) {
      if (userProposalData.voted.isVoted) {
        setVotingPower(userProposalData.voted.votedInfo.votedPower);
      } else {
        if (userProposalData.voting) {
          setVotingPower(userProposalData.votingPower);
        }
      }
    }
  }, [
    userProposalData.voted,
    userProposalData.voting,
    activeWallet,
    representative.address,
  ]);

  const [isCreatorBalanceWarningVisible, setCreatorBalanceWarningVisible] =
    useState(false);

  useEffect(() => {
    if (proposalData) {
      const creator = proposalData?.proposalData.creator;
      if (!proposalData?.formattedData.isFinished) {
        const config = configs.configs.filter(
          (conf) => conf.accessLevel === proposalData.proposalData.accessLevel,
        )[0];
        if (
          !!creatorPropositionPower[creator] &&
          creatorPropositionPower[creator] <= config.minPropositionPower
        ) {
          setCreatorBalanceWarningVisible(true);
        }
      }
    }
  }, [proposalData?.proposalData.creator]);

  if (!proposalData) {
    return <ProposalLoading withContainer />;
  }

  return (
    <Container>
      <ProposalPage
        data={proposalData}
        votingConfig={
          configs.configs.filter(
            (conf) =>
              Number(conf.accessLevel) ===
              Number(proposalData.proposalData.accessLevel),
          )[0]
        }
        constants={configs.contractsConstants}
        balanceLoading={balanceLoading}
        votingPower={votingPower}
        userProposalData={userProposalData}
        isCreatorBalanceWarningVisible={isCreatorBalanceWarningVisible}
      />
    </Container>
  );
}
