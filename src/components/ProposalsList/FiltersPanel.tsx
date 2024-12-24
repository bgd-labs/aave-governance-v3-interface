import { Box, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { mainnet } from 'viem/chains';

import { appConfig } from '../../configs/appConfig';
import { proposalStatusesForFilter } from '../../helpers/statuses';
import { texts } from '../../helpers/texts/texts';
import { useDebounce } from '../../hooks/useDebounce';
import { useStore } from '../../providers/ZustandStoreProvider';
import { CustomSkeleton } from '../primitives/CustomSkeleton';
import { TopPanelContainer } from '../TopPanelContainer';
import { FilterDropdown } from './FilterDropdown';
import { SearchButton } from './SearchButton';

export function FiltersPanelLoading() {
  const theme = useTheme();
  return (
    <TopPanelContainer>
      <Box
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          '*': {
            lineHeight: '1 !important',
          },
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
                width: '40px !important',
                height: '40px !important',
              },
            },
            [theme.breakpoints.up('md')]: {
              width: 'unset',
              mb: 0,
              '.react-loading-skeleton': {
                width: '42px !important',
                height: '42px !important',
              },
            },
            [theme.breakpoints.up('lg')]: {
              '.react-loading-skeleton': {
                width: '46px !important',
                height: '46px !important',
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
                height: '46px !important',
              },
            },
          }}>
          <CustomSkeleton width="100%" height={44} />
        </Box>
      </Box>
    </TopPanelContainer>
  );
}

export function FiltersPanel() {
  const router = useRouter();

  const isRendered = useStore((store) => store.isRendered);
  const setTitleFilter = useStore((store) => store.setTitleFilter);
  const filters = useStore((store) => store.filters);
  const setStateFilter = useStore((store) => store.setStateFilter);

  const [isSearchButtonOpen, setIsSearchButtonOpen] = useState(false);
  const [searchValue, setSearchValue] = useState<string | null>(filters.title);
  const debouncedSearchValue = useDebounce<string | null>(searchValue, 1000);

  const handleSearchValueChange = (value: string | null) => {
    setSearchValue(value);
  };

  useEffect(() => {
    if (isSearchButtonOpen) {
      if (
        typeof debouncedSearchValue === 'string' &&
        debouncedSearchValue !== ''
      ) {
        setTitleFilter(searchValue, router, false, true);
      } else {
        setTitleFilter(null, router, true, true);
      }
    }
  }, [debouncedSearchValue, isSearchButtonOpen]);

  const setFilteredStateLocal = (status: number | null) => {
    if (!!status || status === 0) {
      setStateFilter(Number(status), router);
    } else {
      setStateFilter(null, router);
    }
  };

  return (
    <>
      {!isRendered ? (
        <FiltersPanelLoading />
      ) : (
        <TopPanelContainer>
          <Box
            sx={(theme) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
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
              disabled={appConfig.govCoreChainId !== mainnet.id}
            />

            <FilterDropdown
              statuses={proposalStatusesForFilter}
              selectedStatus={filters.state}
              setSelectedStatus={setFilteredStateLocal}
              disabled={appConfig.govCoreChainId !== mainnet.id}
            />
          </Box>
        </TopPanelContainer>
      )}
    </>
  );
}
