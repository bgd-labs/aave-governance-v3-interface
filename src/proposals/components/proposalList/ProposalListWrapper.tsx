import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

import { CachedProposalDataItemWithId } from '../../../../lib/helpers/src';
import { useStore } from '../../../store';
import { isForIPFS } from '../../../utils/appConfig';
import { selectPaginatedProposalsData } from '../../store/proposalsSelectors';
import { ProposalsList } from './ProposalsList';

interface ProposalListWrapperProps {
  cachedTotalProposalCount?: number;
  cachedProposalsData?: CachedProposalDataItemWithId[];
  cachedActiveIds?: number[];
}

export default function ProposalListWrapper({
  cachedTotalProposalCount,
  cachedProposalsData,
  cachedActiveIds,
}: ProposalListWrapperProps) {
  const store = useStore();

  const searchParams = useSearchParams();
  const activePage = isForIPFS
    ? store.activePage
    : Number(searchParams?.get('activePage'));
  const filteredState = isForIPFS
    ? store.filteredState
    : searchParams?.get('filteredState');

  // initial data loading
  useEffect(() => {
    if (!store.loadingListCache && !store.representativeLoading) {
      store.getPaginatedProposalsData();
    }
  }, [activePage, store.loadingListCache, store.representativeLoading]);

  // reload data when wallet connected or wallet address changed
  useEffect(() => {
    if (
      !!store.activeWallet?.isActive &&
      !store.isInitialLoading &&
      !store.loadingListCache &&
      !store.representativeLoading
    ) {
      store.getPaginatedProposalsDataWithoutIpfs();
    }
  }, [
    store.activeWallet?.accounts[0],
    store.isInitialLoading,
    store.loadingListCache,
    store.representative.address,
  ]);

  // proposals data polling
  useEffect(() => {
    store.startNewProposalsPolling();
    store.startDetailedProposalDataPolling();
    return () => {
      store.stopNewProposalsPolling();
      store.stopDetailedProposalDataPolling();
    };
  }, []);

  useEffect(() => {
    if (isForIPFS) {
      if (!!activePage && activePage !== 0) {
        store.setActivePage(activePage);
      }
    } else {
      if (!!activePage && activePage !== 1) {
        store.setActivePage(activePage - 1);
      }
    }
  }, [activePage]);

  useEffect(() => {
    if (!isForIPFS) {
      if (!!filteredState || filteredState === '0') {
        store.setFilteredState(Number(filteredState));
      } else {
        store.setFilteredState(null);
      }
    }
  }, [store.isInitialLoading, store.loadingListCache]);

  const proposalData = selectPaginatedProposalsData(store);

  return (
    <ProposalsList
      activeProposalsData={proposalData.activeProposals}
      cachedProposalData={
        !store.loadingListCache
          ? proposalData.cachedProposals
          : cachedProposalsData || []
      }
      cachedTotalProposalsCount={cachedTotalProposalCount}
      cachedActiveIds={cachedActiveIds}
    />
  );
}
