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
  }, [id, data]);

  const proposalData = selectProposalDetailedData({ id: +id, proposalDetails });

  useEffect(() => {
    if (proposalData && !proposalData.formattedData.isFinished) {
      startActiveProposalDetailsPolling(+id);
      () => stopActiveProposalDetailsPolling();
    }
  }, [proposalData?.proposalData.id]);

  useEffect(() => {
    if (activeWallet && proposalData?.proposalData.id) {
      updateDetailsUserData(proposalData.proposalData.id);
    }
  }, [proposalData?.proposalData.id, activeWallet?.address]);

  const balanceLoading = useStore(
    (state) => state.userDataLoadings[proposalData?.proposalData.id ?? -1],
  );
  const userProposalData = selectProposalDataByUser({
    votingBalances,
    snapshotBlockHash: proposalData?.proposalData.snapshotBlockHash ?? zeroHash,
    walletAddress: activeWallet?.address ?? zeroAddress, // TODO: representation
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
  }, [userProposalData.voted, userProposalData.voting, activeWallet]);

  if (!proposalData) {
    return <ProposalLoading withContainer />;
  }

  return (
    <Container>
      <h1>Proposal {proposalData.metadata.title}</h1>
    </Container>
  );
}
