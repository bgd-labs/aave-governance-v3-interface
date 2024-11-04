'use client';

import { InitialPayload } from '@bgd-labs/aave-governance-ui-helpers';
import { Box, useTheme } from '@mui/system';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { Hex } from 'viem';

import ColumnsIcon from '/public/images/icons/columnsIcon.svg';
import RowIcon from '/public/images/icons/rowIcon.svg';

import { SeatBeltReportModal } from '../../proposalCreateOverview/components/SeatBeltReportModal';
import { NewPayload } from '../../proposalCreateOverview/store/proposalCreateOverviewSlice';
import { ExecutePayloadModal } from '../../proposals/components/actionModals/ExecutePayloadModal';
import { generateSeatbeltLink } from '../../proposals/utils/formatPayloadData';
import { useStore } from '../../store/ZustandStoreProvider';
import { BackButton3D, Container, NoSSR, Pagination } from '../../ui';
import { CustomSkeleton } from '../../ui/components/CustomSkeleton';
import { InputWrapper } from '../../ui/components/InputWrapper';
import { SelectField } from '../../ui/components/SelectField';
import { TopPanelContainer } from '../../ui/components/TopPanelContainer';
import { IconBox } from '../../ui/primitives/IconBox';
import { texts } from '../../ui/utils/texts';
import { appConfig, appUsedNetworks, isForIPFS } from '../../utils/appConfig';
import {
  getLocalStoragePayloadsExplorerView,
  setLocalStoragePayloadsExplorerView,
} from '../../utils/localStorage';
import { PayloadExploreItem } from './PayloadExploreItem';
import { PayloadExploreItemLoading } from './PayloadExploreItemLoading';
import { PayloadItemDetailsModal } from './PayloadItemDetailsModal';
import { PayloadsControllerSelect } from './PayloadsControllerSelect';

function checkChainId(chainId?: string | number) {
  const chainIdFromQuery = Number(chainId || appConfig.govCoreChainId);

  return appUsedNetworks.some((id) => chainIdFromQuery === id)
    ? chainIdFromQuery
    : appConfig.govCoreChainId;
}

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

export function PayloadsExplorerPage() {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      params.delete('payloadId');
      params.delete('payloadChainId');
      params.delete('payloadsControllerAddress');
      return params.toString();
    },
    [searchParams],
  );

  const isRendered = useStore((store) => store.isRendered);
  const getPayloadsExploreData = useStore(
    (store) => store.getPayloadsExploreData,
  );
  const payloadsExploreData = useStore((store) => store.payloadsExploreData);
  const payloadsExplorePagination = useStore(
    (store) => store.payloadsExplorePagination,
  );
  const setPayloadsExploreActivePage = useStore(
    (store) => store.setPayloadsExploreActivePage,
  );
  const isExecutePayloadModalOpen = useStore(
    (store) => store.isExecutePayloadModalOpen,
  );
  const setExecutePayloadModalOpen = useStore(
    (store) => store.setExecutePayloadModalOpen,
  );
  const startDetailedPayloadsExplorerDataPolling = useStore(
    (store) => store.startDetailedPayloadsExplorerDataPolling,
  );
  const stopDetailedPayloadsExplorerDataPolling = useStore(
    (store) => store.stopDetailedPayloadsExplorerDataPolling,
  );
  const setIsPayloadExplorerItemDetailsModalOpen = useStore(
    (store) => store.setIsPayloadExplorerItemDetailsModalOpen,
  );
  const getCachedProposalPayloadsData = useStore(
    (store) => store.getCachedProposalPayloadsData,
  );
  const cachedProposalsPayloadsData = useStore(
    (store) => store.cachedProposalsPayloadsData,
  );
  const payloadsHelperData = useStore((store) => store.payloadsHelperData);
  const getPayloadSeatbeltMD = useStore((store) => store.getPayloadSeatbeltMD);

  const [isSeatbeltModalOpen, setIsSeatbeltModalOpen] = useState<
    Record<string, boolean>
  >({});
  const [isSeatbeltReportLoading, setIsSeatbeltReportLoadingOpen] = useState<
    Record<string, boolean>
  >({});
  const [finalReport, setFinalReport] = useState<string | undefined>(undefined);
  const [reportPayload, setReportPayload] = useState<NewPayload | undefined>(
    undefined,
  );

  const [isColumns, setIsColumns] = useState(false);
  const [chainId, setChainId] = useState<number>(
    checkChainId(Number(searchParams?.get('chainId'))),
  );
  const [controllerAddress, setControllerAddress] = useState<Hex>(
    appConfig.payloadsControllerConfig[chainId].contractAddresses[0],
  );
  const [selectedPayloadForExecute, setSelectedPayloadForExecute] = useState<
    InitialPayload | undefined
  >(undefined);
  const [selectedPayloadForDetailsModal, setSelectedPayloadForDetailsModal] =
    useState<InitialPayload | undefined>(undefined);

  useEffect(() => {
    setIsColumns(getLocalStoragePayloadsExplorerView() === 'column');
    getCachedProposalPayloadsData();
  }, []);

  useEffect(() => {
    if (
      searchParams &&
      (!!searchParams.get('payloadChainId') || !!searchParams.get('chainId'))
    ) {
      setChainId(
        checkChainId(
          Number(
            searchParams?.get('payloadChainId') || searchParams?.get('chainId'),
          ),
        ),
      );
    }
  }, [searchParams]);

  useEffect(() => {
    if (
      searchParams &&
      !!searchParams.get('payloadId') &&
      !!searchParams.get('payloadChainId') &&
      !!searchParams.get('payloadsControllerAddress')
    ) {
      const payloadId = Number(searchParams.get('payloadId'));
      const payloadChainId = Number(searchParams.get('payloadChainId'));
      const payloadsControllerAddress = String(
        searchParams.get('payloadsControllerAddress'),
      ) as Hex;

      setSelectedPayloadForDetailsModal({
        chainId: payloadChainId,
        payloadsController: payloadsControllerAddress,
        id: payloadId,
      });
      setIsPayloadExplorerItemDetailsModalOpen(true);
    }
  }, [searchParams?.get('payloadId')]);

  useEffect(() => {
    setControllerAddress(
      appConfig.payloadsControllerConfig[chainId].contractAddresses[0],
    );
    if (!isForIPFS) {
      router.replace(
        pathname + '?' + createQueryString('chainId', chainId.toString() || ''),
        {
          scroll: false,
        },
      );
    }
  }, [chainId]);

  useEffect(() => {
    getPayloadsExploreData(chainId, controllerAddress, 0);
    stopDetailedPayloadsExplorerDataPolling();
    startDetailedPayloadsExplorerDataPolling(chainId, controllerAddress, 0);
  }, [controllerAddress, Object.keys(cachedProposalsPayloadsData).length]);

  useEffect(() => {
    stopDetailedPayloadsExplorerDataPolling();
    if (payloadsExplorePagination[controllerAddress]) {
      startDetailedPayloadsExplorerDataPolling(
        chainId,
        controllerAddress,
        payloadsExplorePagination[controllerAddress].activePage,
      );
    }
  }, [payloadsExplorePagination[controllerAddress]?.activePage]);

  useEffect(() => {
    return () => stopDetailedPayloadsExplorerDataPolling();
  }, []);

  const payloadsDataByChain = payloadsExploreData[chainId];
  const payloadsData = Object.values(
    !!payloadsExploreData[chainId] && !!payloadsDataByChain[controllerAddress]
      ? payloadsDataByChain[controllerAddress]
      : {},
  );

  const filteredPayloadsData = payloadsData.filter((payload) =>
    payloadsExplorePagination[controllerAddress].currentIds.some(
      (id) => id === payload.id,
    ),
  );

  const handleReportClick = async (payload: NewPayload) => {
    setReportPayload(payload);
    setIsSeatbeltReportLoadingOpen({
      ...isSeatbeltReportLoading,
      [`${payload.payloadsController}_${payload.id}`]: true,
    });
    const reportFromStore =
      payloadsHelperData[`${payload.payloadsController}_${payload.id}`]
        ?.seatbeltMD;
    if (reportFromStore) {
      setFinalReport(reportFromStore);
      setIsSeatbeltModalOpen({
        ...isSeatbeltModalOpen,
        [`${payload.payloadsController}_${payload.id}`]: true,
      });
    } else {
      const report = await getPayloadSeatbeltMD(payload);
      setFinalReport(report);
      setIsSeatbeltModalOpen({
        ...isSeatbeltModalOpen,
        [`${payload.payloadsController}_${payload.id}`]: true,
      });
    }
    setIsSeatbeltReportLoadingOpen({
      ...isSeatbeltReportLoading,
      [`${payload.payloadsController}_${payload.id}`]: false,
    });
  };

  const handleSeatbeltModalOpen = (value: boolean) => {
    if (reportPayload) {
      setFinalReport(undefined);
      setIsSeatbeltModalOpen({
        ...isSeatbeltModalOpen,
        [`${reportPayload.payloadsController}_${reportPayload.id}`]: value,
      });
    }
  };

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
                    onChange={(event) => {
                      setChainId(event);
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
                controllerAddress={controllerAddress}
                setControllerAddress={setControllerAddress}
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
            {!!payloadsExplorePagination[controllerAddress]?.currentIds
              .length &&
              !filteredPayloadsData.length && (
                <>
                  {payloadsExplorePagination[controllerAddress]?.currentIds.map(
                    (id) => (
                      <PayloadExploreItemLoading
                        key={id}
                        isColumns={isColumns}
                      />
                    ),
                  )}
                </>
              )}
            {!!filteredPayloadsData.length && (
              <>
                {filteredPayloadsData
                  .sort((a, b) => b.id - a.id)
                  .map((payload) => (
                    <PayloadExploreItem
                      key={`${payload.id}_${payload.chainId}`}
                      payload={payload}
                      setSelectedPayloadForExecute={
                        setSelectedPayloadForExecute
                      }
                      setSelectedPayloadForDetailsModal={
                        setSelectedPayloadForDetailsModal
                      }
                      isColumns={isColumns}
                      handleReportClick={handleReportClick}
                      isSeatbeltReportLoading={isSeatbeltReportLoading}
                      isSeatbeltModalOpen={isSeatbeltModalOpen}
                    />
                  ))}
              </>
            )}

            {payloadsExplorePagination[controllerAddress]?.currentIds.length ===
            0 ? (
              <PayloadExploreItemLoading isColumns={false} noData />
            ) : (
              <>
                {!payloadsExplorePagination[controllerAddress]?.currentIds
                  .length &&
                  !filteredPayloadsData.length && (
                    <PayloadExploreItemLoading isColumns={isColumns} />
                  )}
              </>
            )}
          </Box>
        </Box>

        <Pagination
          forcePage={
            payloadsExplorePagination[controllerAddress]?.activePage || 0
          }
          pageCount={
            payloadsExplorePagination[controllerAddress]?.pageCount || 1
          }
          onPageChange={(value) =>
            setPayloadsExploreActivePage(value, chainId, controllerAddress)
          }
          withoutQuery
        />
      </Container>

      {selectedPayloadForExecute && (
        <ExecutePayloadModal
          isOpen={isExecutePayloadModalOpen}
          setIsOpen={setExecutePayloadModalOpen}
          proposalId={0}
          payload={selectedPayloadForExecute}
          withController
        />
      )}

      {selectedPayloadForDetailsModal && (
        <PayloadItemDetailsModal
          initialPayload={selectedPayloadForDetailsModal}
          setSelectedPayloadForExecute={setSelectedPayloadForExecute}
        />
      )}

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
