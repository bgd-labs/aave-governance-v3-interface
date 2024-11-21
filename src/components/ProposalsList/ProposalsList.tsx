'use client';

import { useEffect } from 'react';

import { useStore } from '../../providers/ZustandStoreProvider';
import { selectProposalsForActivePage } from '../../store/selectors/proposalsSelector';
import {
  ActiveProposalOnTheList,
  ContractsConstants,
  ProposalOnTheList,
  VotingConfig,
} from '../../types';
import { Container } from '../primitives/Container';
import { ActiveItem } from './ActiveItem';
import { FinishedItem } from './FinishedItem';
import { ProposalsPagination } from './ProposalsPagination';

export function ProposalsList({
  activePage,
  configs,
  count,
  proposalsData,
}: {
  activePage: number;
  configs: {
    configs: VotingConfig[];
    contractsConstants: ContractsConstants;
  };
  count: number;
  proposalsData: {
    activeProposalsData: ActiveProposalOnTheList[];
    finishedProposalsData: ProposalOnTheList[];
  };
}) {
  const initializeConfigs = useStore((store) => store.initializeConfigs);
  const initializeProposalsCount = useStore(
    (store) => store.initializeProposalsCount,
  );
  const initializeProposalsListData = useStore(
    (store) => store.initializeProposalsListData,
  );
  const totalProposalsCount = useStore((store) => store.totalProposalsCount);
  const startActiveProposalsDataPolling = useStore(
    (store) => store.startActiveProposalsDataPolling,
  );
  const stopActiveProposalsDataPolling = useStore(
    (store) => store.stopActiveProposalsDataPolling,
  );
  const startNewProposalsPolling = useStore(
    (store) => store.startNewProposalsPolling,
  );
  const stopNewProposalsPolling = useStore(
    (store) => store.stopNewProposalsPolling,
  );
  const proposalsListData = useStore((store) =>
    selectProposalsForActivePage(store, activePage),
  );

  useEffect(() => {
    initializeConfigs(configs);
  }, [configs]);
  useEffect(() => {
    initializeProposalsCount(count);
  }, [count]);
  useEffect(() => {
    if (
      proposalsData.activeProposalsData.length ||
      proposalsData.finishedProposalsData.length
    ) {
      initializeProposalsListData(proposalsData, true);
    }
  }, [
    proposalsData.activeProposalsData.length,
    proposalsData.finishedProposalsData.length,
  ]);
  useEffect(() => {
    startActiveProposalsDataPolling();
    startNewProposalsPolling();
    () => {
      stopActiveProposalsDataPolling();
      stopNewProposalsPolling();
    };
  }, []);

  return (
    <Container>
      {proposalsListData.activeProposalsData.map((proposal) => {
        return <ActiveItem proposalData={proposal} key={proposal.proposalId} />;
      })}
      {proposalsListData.finishedProposalsData.map((proposal) => {
        return <FinishedItem data={proposal} key={proposal.proposalId} />;
      })}
      <ProposalsPagination
        activePage={activePage - 1}
        totalItems={totalProposalsCount}
      />
    </Container>
  );
}
