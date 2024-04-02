import { CachedProposalDataItemWithId } from '@bgd-labs/aave-governance-ui-helpers';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect } from 'react';

import { useRootStore } from '../../../store/storeProvider';
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

  const activePageFromStore = useRootStore((state) => state.activePage);
  const filteredStateFromStore = useRootStore((state) => state.filteredState);
  const loadingListCache = useRootStore((state) => state.loadingListCache);
  const representativeLoading = useRootStore(
    (state) => state.representativeLoading,
  );
  const getPaginatedProposalsData = useRootStore(
    (state) => state.getPaginatedProposalsData,
  );
  const getPaginatedProposalsDataWithoutIpfs = useRootStore(
    (state) => state.getPaginatedProposalsDataWithoutIpfs,
  );
  const activeWallet = useRootStore((state) => state.activeWallet);
  const representative = useRootStore((state) => state.representative);
  const isInitialLoading = useRootStore((state) => state.isInitialLoading);
  const startNewProposalsPolling = useRootStore(
    (state) => state.startNewProposalsPolling,
  );
  const startDetailedProposalDataPolling = useRootStore(
    (state) => state.startDetailedProposalDataPolling,
  );
  const stopNewProposalsPolling = useRootStore(
    (state) => state.stopNewProposalsPolling,
  );
  const stopDetailedProposalDataPolling = useRootStore(
    (state) => state.stopDetailedProposalDataPolling,
  );
  const setActivePage = useRootStore((state) => state.setActivePage);
  const setFilteredState = useRootStore((state) => state.setFilteredState);

  const totalPages = useRootStore((store) =>
    selectProposalsPages(store),
  ).length;
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

  const proposalData = useRootStore((store) =>
    selectPaginatedProposalsData(store),
  );

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
