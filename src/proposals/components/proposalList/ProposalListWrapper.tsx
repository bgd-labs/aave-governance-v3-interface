import { CachedProposalDataItemWithId } from '@bgd-labs/aave-governance-ui-helpers/src';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect } from 'react';

import { useStore } from '../../../store';
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
  const store = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = selectProposalsPages(store).length;
  const totalStatuses = proposalStatuses.length;

  const isActivePageWrong =
    Number(searchParams?.get('activePage')) > totalPages ||
    isNaN(Number(searchParams?.get('activePage')));
  const isFilteredStateWrong =
    Number(searchParams?.get('filteredState')) > totalStatuses ||
    isNaN(Number(searchParams?.get('filteredState')));

  const activePage = isForIPFS
    ? store.activePage
    : isActivePageWrong
    ? 0
    : Number(searchParams?.get('activePage'));
  const filteredState = isForIPFS
    ? store.filteredState
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
        store.setFilteredState(Number(filteredState));
      } else {
        store.setFilteredState(null);
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
