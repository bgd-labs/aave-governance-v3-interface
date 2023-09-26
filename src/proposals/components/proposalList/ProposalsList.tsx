import { Box, useTheme } from '@mui/system';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import NoDataImage from '/public/images/noDataList.svg';
import NotFoundGhostImage from '/public/images/notFoundGhost.svg';
import NotFoundImage from '/public/images/notFoundList.svg';

import {
  CachedProposalDataItemWithId,
  ProposalEstimatedState,
  ProposalWithId,
} from '../../../../lib/helpers/src';
import { useStore } from '../../../store';
import { BigButton, BoxWith3D, FilterDropdown } from '../../../ui';
import { CustomSkeleton } from '../../../ui/components/CustomSkeleton';
import { SearchButton } from '../../../ui/components/SearchButton';
import { IconBox } from '../../../ui/primitives/IconBox';
import { texts } from '../../../ui/utils/texts';
import { useDebounce } from '../../../ui/utils/useDebounce';
import { isForIPFS } from '../../../utils/appConfig';
import { proposalStatusesForFilter } from '../../utils/statuses';
import { VoteModal } from '../actionModals/VoteModal';
import { ProposalsPagination } from '../ProposalsPagination';
import { ActiveProposalListItem } from './ActiveProposalListItem';
import { CachedProposalListItem } from './CachedProposalListItem';
import { Loading } from './Loading';
import { ProposalListItemWrapper } from './ProposalListItemWrapper';

interface ProposalsListProps {
  activeProposalsData: ProposalWithId[];
  cachedProposalData: CachedProposalDataItemWithId[];
  cachedTotalProposalsCount?: number;
  cachedActiveIds?: number[];
}

export function ProposalsList({
  activeProposalsData,
  cachedProposalData,
  cachedTotalProposalsCount,
  cachedActiveIds,
}: ProposalsListProps) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string, resetActivePage?: boolean) => {
      // @ts-ignore
      const params = new URLSearchParams(searchParams);
      if (resetActivePage) {
        params.delete('activePage');
      }

      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const {
    isRendered,
    setActivePage,
    titleSearchValue,
    setTitleSearchValue,
    totalProposalCount,
    activePage,
    loadingListCache,
    filteredState,
    setFilteredState,
    ipfsDataErrors,
  } = useStore();

  const isVoteModalOpen = useStore((state) => state.isVoteModalOpen);
  const setIsVoteModalOpen = useStore((state) => state.setIsVoteModalOpen);

  const [proposalId, setProposalId] = useState<null | number>(null);
  const [isSearchButtonOpen, setIsSearchButtonOpen] = useState(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const debouncedSearchValue = useDebounce<string>(searchValue, 500);

  const handleSearchValueChange = (value: string) => {
    setSearchValue(value);
  };

  useEffect(() => {
    if (activePage > 0 && searchValue !== '') {
      setActivePage(0);
      if (!isForIPFS) {
        router.replace(pathname + '?' + createQueryString('activePage', '1'), {
          scroll: false,
        });
      }
    }
    setTitleSearchValue(searchValue);
  }, [debouncedSearchValue]);

  const setFilteredStateLocal = (status: number | null) => {
    setActivePage(0);
    if (!isForIPFS) {
      if (!!status || status === 0) {
        setFilteredState(Number(status));
      } else {
        setFilteredState(null);
      }
      router.replace(
        pathname +
          '?' +
          createQueryString('filteredState', status?.toString() || '', true),
        {
          scroll: false,
        },
      );
    } else {
      if (!!status || status === 0) {
        setFilteredState(Number(status));
      } else {
        setFilteredState(null);
      }
    }
  };

  const handleVoteButtonClick = (proposalId: number) => {
    setIsVoteModalOpen(true);
    setProposalId(proposalId);
  };

  const handleClose = (value: boolean) => {
    setProposalId(null);
    setIsVoteModalOpen(value);
  };

  return (
    <>
      {!isRendered ? (
        <Box
          sx={(theme) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            mb: 12,
            [theme.breakpoints.up('md')]: {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            },
          })}>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 9,
              [theme.breakpoints.up('xs')]: {
                '.react-loading-skeleton': {
                  width: '36px !important',
                  height: '36px !important',
                },
              },
              [theme.breakpoints.up('sm')]: {
                '.react-loading-skeleton': {
                  width: '38px !important',
                  height: '38px !important',
                },
              },
              [theme.breakpoints.up('md')]: {
                width: 'unset',
                mb: 0,
                '.react-loading-skeleton': {
                  width: '40px !important',
                  height: '40px !important',
                },
              },
              [theme.breakpoints.up('lg')]: {
                '.react-loading-skeleton': {
                  width: '42px !important',
                  height: '42px !important',
                },
              },
            }}>
            <Box
              component="h2"
              sx={{
                typography: 'h1',
                display: 'block',
                pl: 6,
                [theme.breakpoints.up('sm')]: { typography: 'h1', pl: 8 },
                [theme.breakpoints.up('md')]: {
                  typography: 'h1',
                  display: 'none',
                },
              }}>
              {texts.proposals.proposalListTitle}
            </Box>

            <CustomSkeleton width={42} height={42} />
          </Box>

          <Box
            sx={{
              width: '100%',
              [theme.breakpoints.up('xs')]: {
                '.react-loading-skeleton': {
                  height: '28px !important',
                },
              },
              [theme.breakpoints.up('sm')]: {
                width: '136px',
                '.react-loading-skeleton': {
                  height: '40px !important',
                },
              },
              [theme.breakpoints.up('md')]: {
                width: '138px',
                '.react-loading-skeleton': {
                  height: '42px !important',
                },
              },
              [theme.breakpoints.up('lg')]: {
                width: '140px',
                '.react-loading-skeleton': {
                  height: '44px !important',
                },
              },
            }}>
            <CustomSkeleton width="100%" height={44} />
          </Box>
        </Box>
      ) : (
        <Box
          sx={(theme) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            mb: 12,
            [theme.breakpoints.up('md')]: {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            },
          })}>
          <SearchButton
            isOpen={isSearchButtonOpen}
            setIsOpen={setIsSearchButtonOpen}
            searchValue={searchValue}
            setSearchValue={handleSearchValueChange}
            disabled={
              (!loadingListCache
                ? totalProposalCount
                : cachedTotalProposalsCount) === 0
            }
          />

          <FilterDropdown
            statuses={proposalStatusesForFilter}
            selectedStatus={filteredState}
            setSelectedStatus={setFilteredStateLocal}
            disabled={
              (!loadingListCache
                ? totalProposalCount
                : cachedTotalProposalsCount) === 0
            }
          />
        </Box>
      )}

      {!loadingListCache && totalProposalCount === -1 ? (
        <div className="ProposalListItem">
          <ProposalListItemWrapper>
            <Loading />
          </ProposalListItemWrapper>
          <ProposalListItemWrapper>
            <Loading />
          </ProposalListItemWrapper>
        </div>
      ) : (!loadingListCache
          ? totalProposalCount
          : cachedTotalProposalsCount) === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <BoxWith3D
            className="NoDataWrapper"
            borderSize={10}
            contentColor="$mainLight"
            wrapperCss={{
              width: '100%',
              mb: 24,
              position: 'relative',
              pb: 40,
            }}
            css={{
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              p: 30,
            }}>
            <IconBox
              sx={{
                width: '100%',
                maxHeight: 79,
                '> svg': { width: '100%', maxHeight: 79 },
              }}>
              <NoDataImage />
            </IconBox>
            <IconBox
              sx={(theme) => ({
                width: 50,
                maxHeight: 90,
                '> svg': {
                  width: 50,
                  maxHeight: 90,
                  [theme.breakpoints.up('sm')]: {
                    width: 65,
                    maxHeight: 120,
                  },
                  [theme.breakpoints.up('lg')]: {
                    width: 73,
                    maxHeight: 137,
                  },
                },
                position: 'absolute',
                bottom: -35,
                right: '25%',
                [theme.breakpoints.up('sm')]: {
                  width: 65,
                  maxHeight: 120,
                  bottom: -60,
                },
                [theme.breakpoints.up('lg')]: {
                  width: 73,
                  maxHeight: 137,
                  bottom: -80,
                  right: '30%',
                },
              })}>
              <NotFoundGhostImage />
            </IconBox>
          </BoxWith3D>
        </Box>
      ) : (
        <>
          {![...activeProposalsData, ...cachedProposalData].length &&
            (filteredState !== null || titleSearchValue !== undefined) && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                <BoxWith3D
                  className="NoDataWrapper"
                  borderSize={10}
                  contentColor="$mainLight"
                  wrapperCss={{
                    width: '100%',
                    mb: 24,
                    position: 'relative',
                    pb: 40,
                  }}
                  css={{
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    p: 30,
                  }}>
                  <IconBox
                    sx={{
                      width: '100%',
                      maxHeight: 79,
                      '> svg': { width: '100%', maxHeight: 79 },
                    }}>
                    <NotFoundImage />
                  </IconBox>
                  <IconBox
                    sx={(theme) => ({
                      width: 50,
                      maxHeight: 90,
                      '> svg': {
                        width: 50,
                        maxHeight: 90,
                        [theme.breakpoints.up('sm')]: {
                          width: 65,
                          maxHeight: 120,
                        },
                        [theme.breakpoints.up('lg')]: {
                          width: 73,
                          maxHeight: 137,
                        },
                      },
                      position: 'absolute',
                      bottom: -35,
                      right: '25%',
                      [theme.breakpoints.up('sm')]: {
                        width: 65,
                        maxHeight: 120,
                        bottom: -60,
                      },
                      [theme.breakpoints.up('lg')]: {
                        width: 73,
                        maxHeight: 137,
                        bottom: -80,
                        right: '30%',
                      },
                    })}>
                    <NotFoundGhostImage />
                  </IconBox>
                </BoxWith3D>

                <BigButton
                  onClick={() => {
                    handleSearchValueChange('');
                    setIsSearchButtonOpen(false);
                    setFilteredStateLocal(null);
                  }}>
                  {texts.proposals.viewAll}
                </BigButton>
              </Box>
            )}
          {(!!activeProposalsData.length ||
            (loadingListCache && !!cachedActiveIds?.length)) && (
            <>
              {loadingListCache ? (
                <>
                  {cachedActiveIds?.map((id) => (
                    <div className="ProposalListItem" key={id}>
                      <ProposalListItemWrapper isForHelpModal>
                        <Loading />
                      </ProposalListItemWrapper>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {activeProposalsData.map((data) => {
                    if (!data.proposal) {
                      return (
                        <div className="ProposalListItem" key={data.id}>
                          <ProposalListItemWrapper isForHelpModal>
                            <Loading />
                          </ProposalListItemWrapper>
                        </div>
                      );
                    } else if (
                      data.proposal &&
                      ipfsDataErrors[data.proposal.data.ipfsHash]
                    ) {
                      return (
                        <div className="ProposalListItem" key={data.id}>
                          <ProposalListItemWrapper
                            estimatedState={ProposalEstimatedState.Defeated}
                            isFinished={false}
                            isForHelpModal>
                            <Box component="p" sx={{ typography: 'body' }}>
                              {ipfsDataErrors[data.proposal.data.ipfsHash]}
                            </Box>
                          </ProposalListItemWrapper>
                        </div>
                      );
                    } else if (
                      data.proposal &&
                      data.proposal.data.title === `Proposal #${data.id}`
                    ) {
                      return (
                        <div className="ProposalListItem" key={data.id}>
                          <ProposalListItemWrapper isForHelpModal>
                            <Loading />
                          </ProposalListItemWrapper>
                        </div>
                      );
                    } else {
                      return (
                        <ActiveProposalListItem
                          proposalData={{
                            loading: data.loading || false,
                            balanceLoading: data.balanceLoading || false,
                            proposal: data.proposal,
                          }}
                          voteButtonClick={handleVoteButtonClick}
                          key={data.proposal.data.id}
                        />
                      );
                    }
                  })}
                </>
              )}
            </>
          )}
          {!!cachedProposalData.length &&
            cachedProposalData.map((data) => {
              if (!data.proposal)
                return (
                  <div className="ProposalListItem" key={data.id}>
                    <ProposalListItemWrapper>
                      <Loading />
                    </ProposalListItemWrapper>
                  </div>
                );
              return (
                <CachedProposalListItem
                  key={data.proposal.data.id}
                  proposalData={data}
                />
              );
            })}
          <ProposalsPagination />
        </>
      )}

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
