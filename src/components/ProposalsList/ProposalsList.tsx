'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { useStore } from '../../providers/ZustandStoreProvider';
import { selectProposalsForActivePage } from '../../store/selectors/proposalsSelector';
import { VoteModal } from '../../transactions/components/ActionModals/VoteModal';
import {
  ActiveProposalOnTheList,
  ContractsConstants,
  ProposalOnTheList,
  VotingConfig,
} from '../../types';
import { Pagination } from '../Pagination';
import { Container } from '../primitives/Container';
import { ActiveItem } from './ActiveItem';
import { FiltersPanel } from './FiltersPanel';
import { FinishedItem } from './FinishedItem';
import { NoFilteredData } from './NoFilteredData';
import ProposalsListPageLoading from './ProposalsListPageLoading';

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
  const router = useRouter();
  const activeWallet = useStore((store) => store.activeWallet);
  const filtersLoading = useStore((store) => store.filtersLoading);
  const initializeConfigs = useStore((store) => store.initializeConfigs);
  const initializeProposalsCount = useStore(
    (store) => store.initializeProposalsCount,
  );
  const initializeProposalsListData = useStore(
    (store) => store.initializeProposalsListData,
  );
  const paginationCount = useStore((store) => store.paginationCount);
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
  const updateUserDataOnTheList = useStore(
    (store) => store.updateUserDataOnTheList,
  );
  const updatedListDataLoading = useStore(
    (store) => store.updatedListDataLoading,
  );
  const initializeFilters = useStore((store) => store.initializeFilters);
  const filters = useStore((store) => store.filters);
  const setActivePageFilter = useStore((store) => store.setActivePageFilter);
  const clearFilters = useStore((store) => store.clearFilters);
  const initializeLoading = useStore((store) => store.initializeLoading);

  const proposalsListData = useStore((store) =>
    selectProposalsForActivePage(store, activePage),
  );

  const [proposalId, setProposalId] = useState<null | number>(null);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);

  useEffect(() => {
    clearFilters();
    if (activePage === 1) {
      initializeFilters();
    }
  }, [activePage]);
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
    startActiveProposalsDataPolling(activePage);
    startNewProposalsPolling();
    return () => {
      stopActiveProposalsDataPolling();
      stopNewProposalsPolling();
    };
  }, []);
  useEffect(() => {
    if (activeWallet?.address) {
      updateUserDataOnTheList();
    }
  }, [activeWallet?.address]);

  const handleVoteButtonClick = (proposalId: number) => {
    setIsVoteModalOpen(true);
    setProposalId(proposalId);
  };

  const handleClose = (value: boolean) => {
    setProposalId(null);
    setIsVoteModalOpen(value);
  };

  if (
    updatedListDataLoading[activePage] ||
    filtersLoading ||
    initializeLoading
  ) {
    return (
      <>
        <ProposalsListPageLoading />
        <Container>
          <Pagination
            forcePage={
              filters.state !== null
                ? Number(filters.activePage) - 1
                : activePage - 1
            }
            totalItems={
              filters.state !== null ? paginationCount : totalProposalsCount
            }
            setCurrentPageState={(value) => setActivePageFilter(value, router)}
            filtering={filters.state !== null}
          />
        </Container>
      </>
    );
  }

  if (
    ![
      ...proposalsListData.activeProposalsData,
      ...proposalsListData.finishedProposalsData,
    ].length &&
    !initializeLoading
  ) {
    return (
      <>
        <FiltersPanel />

        <Container>
          <NoFilteredData />
        </Container>
      </>
    );
  }

  return (
    <>
      <FiltersPanel />

      <Container>
        {proposalsListData.activeProposalsData.map((proposal) => {
          if (!proposal.isFinished) {
            return (
              <ActiveItem
                proposalData={proposal}
                key={proposal.proposalId}
                voteButtonClick={handleVoteButtonClick}
              />
            );
          }
        })}
        {proposalsListData.finishedProposalsData.map((proposal) => {
          return <FinishedItem data={proposal} key={proposal.proposalId} />;
        })}
        <Pagination
          forcePage={
            filters.state !== null
              ? Number(filters.activePage) - 1
              : activePage - 1
          }
          totalItems={
            filters.state !== null ? paginationCount : totalProposalsCount
          }
          setCurrentPageState={(value) => setActivePageFilter(value, router)}
          filtering={filters.state !== null}
        />
      </Container>

      {(proposalId || proposalId === 0) && (
        <VoteModal
          isOpen={isVoteModalOpen}
          setIsOpen={handleClose}
          proposalId={proposalId}
          fromList
        />
      )}
    </>
  );
}
