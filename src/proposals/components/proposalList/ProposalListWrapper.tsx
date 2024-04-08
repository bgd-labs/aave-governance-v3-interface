import { CachedProposalDataItemWithId } from '@bgd-labs/aave-governance-ui-helpers';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect } from 'react';

import { useStore } from '../../../store/ZustandStoreProvider';
import { isForIPFS } from '../../../utils/appConfig';
import {
  selectPaginatedProposalsData,
  selectProposalsPages,
} from '../../store/proposalsSelectors';
import { proposalStatuses } from '../../utils/statuses';
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activePageFromStore = useStore((state) => state.activePage);
  const filteredStateFromStore = useStore((state) => state.filteredState);
  const loadingListCache = useStore((state) => state.loadingListCache);
  const representativeLoading = useStore(
    (state) => state.representativeLoading,
  );
  const getPaginatedProposalsData = useStore(
    (state) => state.getPaginatedProposalsData,
  );
  const getPaginatedProposalsDataWithoutIpfs = useStore(
    (state) => state.getPaginatedProposalsDataWithoutIpfs,
  );
  const activeWallet = useStore((state) => state.activeWallet);
  const representative = useStore((state) => state.representative);
  const isInitialLoading = useStore((state) => state.isInitialLoading);
  const startNewProposalsPolling = useStore(
    (state) => state.startNewProposalsPolling,
  );
  const startDetailedProposalDataPolling = useStore(
    (state) => state.startDetailedProposalDataPolling,
  );
  const stopNewProposalsPolling = useStore(
    (state) => state.stopNewProposalsPolling,
  );
  const stopDetailedProposalDataPolling = useStore(
    (state) => state.stopDetailedProposalDataPolling,
  );
  const setActivePage = useStore((state) => state.setActivePage);
  const setFilteredState = useStore((state) => state.setFilteredState);

  const totalPages = useStore((store) => selectProposalsPages(store)).length;
  const totalStatuses = proposalStatuses.length;

  const isActivePageWrong =
    Number(searchParams?.get('activePage')) > totalPages ||
    isNaN(Number(searchParams?.get('activePage')));
  const isFilteredStateWrong =
    Number(searchParams?.get('filteredState')) > totalStatuses ||
    isNaN(Number(searchParams?.get('filteredState')));

  const activePage = isForIPFS
    ? activePageFromStore
    : isActivePageWrong
      ? 0
      : Number(searchParams?.get('activePage'));
  const filteredState = isForIPFS
    ? filteredStateFromStore
    : isFilteredStateWrong
      ? null
      : searchParams?.get('filteredState');

  const createQueryString = useCallback(
    ({
      removeActivePage,
      removeFilteredState,
    }: {
      removeActivePage?: boolean;
      removeFilteredState?: boolean;
    }) => {
      // @ts-ignore
      const params = new URLSearchParams(searchParams);
      if (removeActivePage) {
        params.delete('activePage');
      }
      if (removeFilteredState) {
        params.delete('filteredState');
      }
      return params.toString();
    },
    [searchParams],
  );

  // initial data loading
  useEffect(() => {
    if (!loadingListCache && !representativeLoading) {
      getPaginatedProposalsData();
    }
  }, [activePage, loadingListCache, representativeLoading]);

  // reload data when wallet connected or wallet address changed
  useEffect(() => {
    if (
      !!activeWallet?.isActive &&
      !isInitialLoading &&
      !loadingListCache &&
      !representativeLoading
    ) {
      getPaginatedProposalsDataWithoutIpfs();
    }
  }, [
    activeWallet?.address,
    isInitialLoading,
    loadingListCache,
    representative.address,
  ]);

  // proposals data polling
  useEffect(() => {
    startNewProposalsPolling();
    startDetailedProposalDataPolling();
    return () => {
      stopNewProposalsPolling();
      stopDetailedProposalDataPolling();
    };
  }, []);

  useEffect(() => {
    if (isForIPFS) {
      if (!!activePage && activePage !== 0) {
        setActivePage(activePage);
      }
    } else {
      if (!!activePage && activePage !== 1) {
        setActivePage(activePage - 1);
      }
      if (isActivePageWrong) {
        router.replace(
          pathname + '?' + createQueryString({ removeActivePage: true }),
          {
            scroll: false,
          },
        );
      }
    }
  }, [activePage]);

  useEffect(() => {
    if (!isForIPFS) {
      if (!!filteredState || filteredState === '0') {
        setFilteredState(Number(filteredState));
      } else {
        setFilteredState(null);
      }
      if (isFilteredStateWrong) {
        router.replace(
          pathname + '?' + createQueryString({ removeFilteredState: true }),
          {
            scroll: false,
          },
        );
      }
    }
  }, [isInitialLoading, loadingListCache]);

  const proposalData = useStore((store) => selectPaginatedProposalsData(store));

  return (
    <ProposalsList
      activeProposalsData={proposalData.activeProposals}
      cachedProposalData={
        !loadingListCache
          ? proposalData.cachedProposals
          : cachedProposalsData || []
      }
      cachedTotalProposalsCount={cachedTotalProposalCount}
      cachedActiveIds={cachedActiveIds}
    />
  );
}
