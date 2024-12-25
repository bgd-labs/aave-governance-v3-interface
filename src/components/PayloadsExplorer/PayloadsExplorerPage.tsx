'use client';

import { Box, useTheme } from '@mui/system';
import { useRouter } from 'nextjs-toploader/app';
import React, { ReactNode, useEffect, useState } from 'react';
import useSWR from 'swr';

import ColumnsIcon from '../../assets/icons/columnsIcon.svg';
import RowIcon from '../../assets/icons/rowIcon.svg';
import { appConfig, appUsedNetworks } from '../../configs/appConfig';
import {
  getLocalStoragePayloadsExplorerView,
  setLocalStoragePayloadsExplorerView,
} from '../../configs/localStorage';
import { ROUTES } from '../../configs/routes';
import { generateSeatbeltLink } from '../../helpers/formatPayloadData';
import { texts } from '../../helpers/texts/texts';
import { useGetSeatbeltReportPayloadsExplorer } from '../../hooks/useGetSeatbeltReportPayloadsExplorer';
import { useStore } from '../../providers/ZustandStoreProvider';
import { filteredPayloadsDataFetcher } from '../../requests/fetchers/filteredPayloadsDataFetcher';
import { getChainAndPayloadsController } from '../../requests/fetchFilteredPayloadsData';
import { selectAppClients } from '../../store/selectors/rpcSwitcherSelectors';
import { PayloadWithHashes } from '../../types';
import { BackButton3D } from '../BackButton3D';
import { InputWrapper } from '../InputWrapper';
import { Pagination } from '../Pagination';
import { Container } from '../primitives/Container';
import { CustomSkeleton } from '../primitives/CustomSkeleton';
import { IconBox } from '../primitives/IconBox';
import NoSSR from '../primitives/NoSSR';
import { SeatBeltReportModal } from '../SeatBeltReportModal';
import { SelectField } from '../SelectField';
import { TopPanelContainer } from '../TopPanelContainer';
import { PayloadExploreItem } from './PayloadExploreItem';
import { PayloadExploreItemLoading } from './PayloadExploreItemLoading';
import { PayloadsControllerSelect } from './PayloadsControllerSelect';

function PayloadsExploreViewSwitcherButton({
  onClick,
  isActive,
  icon,
}: {
  onClick: () => void;
  isActive?: boolean;
  icon: ReactNode;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        cursor: isActive ? 'default' : 'pointer',
        transition: 'all 0.2s ease',
        hover: {
          opacity: isActive ? 1 : 0.6,
          svg: {
            path: {
              fill: !isActive ? theme.palette.$main : undefined,
            },
          },
        },
      }}
      onClick={onClick}>
      <IconBox
        sx={{
          width: 18,
          height: 18,
          '> svg': {
            width: 18,
            height: 18,
            path: {
              transactions: 'all 0.2s ease',
              stroke: theme.palette.$main,
              fill: isActive ? theme.palette.$main : undefined,
            },
          },
        }}>
        {icon}
      </IconBox>
    </Box>
  );
}

interface PayloadsExplorerPageProps {
  data: {
    data: PayloadWithHashes[];
    count: number;
    ids: number[];
  };
  chainWithController: string;
  activePage: number;
}

export function PayloadsExplorerPage({
  data,
  chainWithController,
  activePage,
}: PayloadsExplorerPageProps) {
  const theme = useTheme();
  const router = useRouter();

  const isRendered = useStore((store) => store.isRendered);
  const setSelectedPayloadForExecute = useStore(
    (store) => store.setSelectedPayloadForExecute,
  );

  const clients = useStore((store) => selectAppClients(store));
  const { data: pollingData } = useSWR(
    {
      chainWithController,
      activePage,
      clients,
    },
    filteredPayloadsDataFetcher,
    {
      refreshInterval: 10_000,
    },
  );

  const updatedData = pollingData ?? data;

  const {
    handleReportClick,
    isSeatbeltReportLoading,
    isSeatbeltModalOpen,
    finalReport,
    reportPayload,
    handleSeatbeltModalOpen,
  } = useGetSeatbeltReportPayloadsExplorer();

  const { chainId, payloadsController } =
    getChainAndPayloadsController(chainWithController);

  const [isColumns, setIsColumns] = useState(false);

  useEffect(() => {
    setIsColumns(getLocalStoragePayloadsExplorerView() === 'column');
  }, []);

  return (
    <>
      <Container>
        <TopPanelContainer withoutContainer>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <BackButton3D
              onClick={router.back}
              alwaysVisible
              alwaysWithBorders
            />
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
            {!!updatedData.ids.length && !updatedData.data.length && (
              <>
                {updatedData.ids.map((id) => (
                  <PayloadExploreItemLoading key={id} isColumns={isColumns} />
                ))}
              </>
            )}

            {!!updatedData.data.length && (
              <>
                {updatedData.data
                  .sort((a, b) => Number(b.id) - Number(a.id))
                  .map((payload) => (
                    <PayloadExploreItem
                      key={`${payload.id}_${payload.chain}`}
                      payload={payload}
                      setSelectedPayloadForExecute={
                        setSelectedPayloadForExecute
                      }
                      isColumns={isColumns}
                      handleReportClick={handleReportClick}
                      isSeatbeltReportLoading={isSeatbeltReportLoading}
                      isSeatbeltModalOpen={isSeatbeltModalOpen}
                    />
                  ))}
              </>
            )}

            {updatedData.data.length === 0 ? (
              <PayloadExploreItemLoading isColumns={false} noData />
            ) : (
              <>
                {!updatedData.ids.length && !updatedData.data.length && (
                  <PayloadExploreItemLoading isColumns={isColumns} />
                )}
              </>
            )}
          </Box>
        </Box>

        <Pagination
          forcePage={activePage}
          totalItems={updatedData.count}
          chainWithController={chainWithController}
          withoutQuery
        />
      </Container>

      {finalReport && !!reportPayload && (
        <SeatBeltReportModal
          isOpen={
            isSeatbeltModalOpen[
              `${reportPayload.payloadsController}_${reportPayload.id}`
            ]
          }
          setIsOpen={handleSeatbeltModalOpen}
          report={finalReport}
          link={generateSeatbeltLink(reportPayload)}
        />
      )}
    </>
  );
}
