'use client';

import { InitialPayload } from '@bgd-labs/aave-governance-ui-helpers';
import { Box, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Hex } from 'viem';

import { ExecutePayloadModal } from '../../proposals/components/actionModals/ExecutePayloadModal';
import { useStore } from '../../store';
import { BackButton3D, Container, Pagination } from '../../ui';
import { CustomSkeleton } from '../../ui/components/CustomSkeleton';
import { InputWrapper } from '../../ui/components/InputWrapper';
import { SelectField } from '../../ui/components/SelectField';
import { TopPanelContainer } from '../../ui/components/TopPanelContainer';
import { texts } from '../../ui/utils/texts';
import { appConfig } from '../../utils/appConfig';
import { PayloadExploreItem } from './PayloadExploreItem';
import { PayloadExploreItemLoading } from './PayloadExploreItemLoading';
import { PayloadItemDetailsModal } from './PayloadItemDetailsModal';
import { PayloadsControllerSelect } from './PayloadsControllerSelect';

export function PayloadsExplorerPage() {
  const theme = useTheme();
  const router = useRouter();

  const {
    getPayloadsExploreData,
    payloadsExploreData,
    payloadsExplorePagination,
    setPayloadsExploreActivePage,
    isExecutePayloadModalOpen,
    setExecutePayloadModalOpen,
    isRendered,
  } = useStore();

  const [chainId, setChainId] = useState<number>(appConfig.govCoreChainId);
  const [controllerAddress, setControllerAddress] = useState<Hex>(
    appConfig.payloadsControllerConfig[chainId].contractAddresses[0],
  );
  const [selectedPayloadForExecute, setSelectedPayloadForExecute] = useState<
    InitialPayload | undefined
  >(undefined);
  const [selectedPayloadForDetailsModal, setSelectedPayloadForDetailsModal] =
    useState<InitialPayload | undefined>(undefined);

  useEffect(() => {
    setControllerAddress(
      appConfig.payloadsControllerConfig[chainId].contractAddresses[0],
    );
  }, [chainId]);

  useEffect(() => {
    getPayloadsExploreData(chainId, controllerAddress, 0);
  }, [controllerAddress]);

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
                    options={appConfig.payloadsControllerChainIds}
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
          <PayloadsControllerSelect
            chainId={chainId}
            controllerAddress={controllerAddress}
            setControllerAddress={setControllerAddress}
          />
        </TopPanelContainer>

        <Box
          sx={{
            mt: 18,
            [theme.breakpoints.up('lg')]: {
              mt: 24,
            },
          }}>
          {!!payloadsExplorePagination[controllerAddress]?.currentIds.length &&
            !filteredPayloadsData.length && (
              <Box>
                {payloadsExplorePagination[controllerAddress]?.currentIds.map(
                  (id) => <PayloadExploreItemLoading key={id} />,
                )}
              </Box>
            )}
          {!!filteredPayloadsData.length && (
            <>
              {filteredPayloadsData
                .sort((a, b) => b.id - a.id)
                .map((payload) => (
                  <PayloadExploreItem
                    key={`${payload.id}_${payload.chainId}`}
                    payload={payload}
                    setSelectedPayloadForExecute={setSelectedPayloadForExecute}
                    setSelectedPayloadForDetailsModal={
                      setSelectedPayloadForDetailsModal
                    }
                  />
                ))}
            </>
          )}
          {!payloadsExplorePagination[controllerAddress]?.currentIds.length &&
            !filteredPayloadsData.length && <PayloadExploreItemLoading />}
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
        />
      )}
    </>
  );
}
