'use client';

import { Box, useTheme } from '@mui/system';
import { useRouter } from 'nextjs-toploader/app';
import React, { useEffect, useState } from 'react';

import ColumnsIcon from '../../assets/icons/columnsIcon.svg';
import RowIcon from '../../assets/icons/rowIcon.svg';
import { appConfig, appUsedNetworks } from '../../configs/appConfig';
import { PAGE_SIZE } from '../../configs/configs';
import {
  getLocalStoragePayloadsExplorerView,
  setLocalStoragePayloadsExplorerView,
} from '../../configs/localStorage';
import { ROUTES } from '../../configs/routes';
import { texts } from '../../helpers/texts/texts';
import { useStore } from '../../providers/ZustandStoreProvider';
import { getChainAndPayloadsController } from '../../requests/fetchFilteredPayloadsData';
import { BackButton3D } from '../BackButton3D';
import { InputWrapper } from '../InputWrapper';
import { Pagination } from '../Pagination';
import { Container } from '../primitives/Container';
import { CustomSkeleton } from '../primitives/CustomSkeleton';
import NoSSR from '../primitives/NoSSR';
import { SelectField } from '../SelectField';
import { TopPanelContainer } from '../TopPanelContainer';
import { PayloadExploreItemLoading } from './PayloadExploreItemLoading';
import { PayloadsControllerSelect } from './PayloadsControllerSelect';
import {
  PayloadsExplorerPageProps,
  PayloadsExploreViewSwitcherButton,
} from './PayloadsExplorerPage';

export function PayloadsExplorerPageLoading({
  activePage,
  chainWithController,
  count,
}: Pick<PayloadsExplorerPageProps, 'activePage' | 'chainWithController'> & {
  count: number;
}) {
  const theme = useTheme();
  const router = useRouter();

  const isRendered = useStore((store) => store.isRendered);

  const [isColumns, setIsColumns] = useState(false);

  useEffect(() => {
    setIsColumns(getLocalStoragePayloadsExplorerView() === 'column');
  }, []);

  const { chainId, payloadsController } =
    getChainAndPayloadsController(chainWithController);

  return (
    <Container>
      <TopPanelContainer withoutContainer>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <BackButton3D onClick={router.back} alwaysVisible alwaysWithBorders />
          <Box
            sx={{
              position: 'relative',
              zIndex: 8,
              maxWidth: '100%',
              width: '100%',
              [theme.breakpoints.up('sm')]: { maxWidth: 250 },
            }}>
            {isRendered ? (
              <InputWrapper>
                <SelectField
                  withChainIcon
                  withChainName
                  placeholder={texts.other.payloadsNetwork}
                  value={chainId}
                  onChange={(value) => {
                    router.push(
                      ROUTES.payloadsExplorerPages(
                        value,
                        appConfig.payloadsControllerConfig[value]
                          .contractAddresses[0],
                        0,
                      ),
                    );
                  }}
                  options={appUsedNetworks}
                />
              </InputWrapper>
            ) : (
              <Box
                sx={{
                  lineHeight: '1 !important',
                  width: '100%',
                  '.react-loading-skeleton': { width: '100%' },
                }}>
                <CustomSkeleton height={31} />
              </Box>
            )}
          </Box>
        </Box>
      </TopPanelContainer>

      <TopPanelContainer withoutContainer>
        <Box
          sx={{
            [theme.breakpoints.up('xsm')]: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            },
          }}>
          <Box sx={{ minWidth: '70%' }}>
            <PayloadsControllerSelect
              chainId={chainId}
              controllerAddress={payloadsController}
              setControllerAddress={(value) =>
                router.push(ROUTES.payloadsExplorerPages(chainId, value, 0))
              }
            />
          </Box>

          <NoSSR>
            <Box
              sx={{
                display: 'none',
                [theme.breakpoints.up('xsm')]: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  position: 'relative',
                  top: 13,
                },
                [theme.breakpoints.up('sm')]: {
                  top: 0,
                },
              }}>
              <PayloadsExploreViewSwitcherButton
                icon={<ColumnsIcon />}
                onClick={() => {
                  setLocalStoragePayloadsExplorerView('column');
                  setIsColumns(true);
                }}
                isActive={isColumns}
              />
              <PayloadsExploreViewSwitcherButton
                icon={<RowIcon />}
                onClick={() => {
                  setLocalStoragePayloadsExplorerView('row');
                  setIsColumns(false);
                }}
                isActive={!isColumns}
              />
            </Box>
          </NoSSR>
        </Box>
      </TopPanelContainer>

      <Box
        sx={{
          mt: 18,
          [theme.breakpoints.up('lg')]: {
            mt: 24,
          },
        }}>
        <Box
          sx={{
            display: isColumns ? 'grid' : 'block',
            gridTemplateColumns: 'repeat(1, 1fr)',
            gridGap: '8px',
            [theme.breakpoints.up('xsm')]: {
              gridTemplateColumns: 'repeat(2, 1fr)',
            },
            [theme.breakpoints.up('sm')]: {
              gridTemplateColumns: 'repeat(2, 1fr)',
              gridGap: '18px',
            },
            [theme.breakpoints.up('md')]: {
              gridTemplateColumns: 'repeat(3, 1fr)',
            },
            [theme.breakpoints.up('lg')]: {
              gridGap: '24px',
              gridTemplateColumns: 'repeat(4, 1fr)',
            },
          }}>
          {[...Array(Number(PAGE_SIZE)).keys()].map((id) => (
            <PayloadExploreItemLoading key={id} isColumns={isColumns} />
          ))}
        </Box>
      </Box>

      <Pagination
        forcePage={activePage}
        totalItems={count}
        chainWithController={chainWithController}
        withoutQuery
      />
    </Container>
  );
}
