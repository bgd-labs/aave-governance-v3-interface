// TODO: need add no data styles

import { ReturnFeeState } from '@bgd-labs/aave-governance-ui-helpers';
import { Box, useTheme } from '@mui/system';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { zeroAddress } from 'viem';

import { useStore } from '../../../store';
import { useLastTxLocalStatus } from '../../../transactions/hooks/useLastTxLocalStatus';
import { TxType } from '../../../transactions/store/transactionsSlice';
import { BackButton3D, BasicModal, BigButton, Pagination } from '../../../ui';
import { textCenterEllipsis } from '../../../ui/utils/text-center-ellipsis';
import { texts } from '../../../ui/utils/texts';
import { media } from '../../../ui/utils/themeMUI';
import { useMediaQuery } from '../../../ui/utils/useMediaQuery';
import { appConfig } from '../../../utils/appConfig';
import { selectReturnsFeesDataByCreator } from '../../store/returnFeesSelectors';
import { AccountAddressInfo } from './AccountAddressInfo';
import { BlockTitleWithTooltip } from './BlockTitleWithTooltip';
import { ReturnFeesModalItem } from './ReturnFeesModalItem';
import { ReturnFeesModalItemLoading } from './ReturnFeesModalItemLoading';
import { ReturnFeesTxModal } from './ReturnFeesTxModal';

interface ReturnFeesModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  ensName?: string;
  ensAvatar?: string;
  isAvatarExists?: boolean;
}

export function ReturnFeesModal({
  isOpen,
  setIsOpen,
  ensName,
  ensAvatar,
  isAvatarExists,
}: ReturnFeesModalProps) {
  const store = useStore();
  const theme = useTheme();
  const sm = useMediaQuery(media.sm);

  const {
    returnFeesProposalsCountOnRequest,
    activeWallet,
    setAccountInfoModalOpen,
    returnFeesData,
    getReturnFeesData,
    updateReturnFeesDataByCreator,
    totalProposalCount,
    dataByCreatorLength,
    setDataByCreatorLength,
    returnFees,
    isReturnFeesTxModalOpen,
    setIsReturnFeesTxModalOpen,
  } = store;

  // get data logic
  const [currentPage, setCurrentPage] = useState(1);
  const dataByCreator = selectReturnsFeesDataByCreator(
    store,
    activeWallet?.address || zeroAddress,
  );

  useEffect(() => {
    setSelectedProposalIds([]);
    setCurrentPage(1);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && activeWallet) {
      if (totalProposalCount > returnFeesProposalsCountOnRequest) {
        getReturnFeesData();
      } else if (!Object.keys(returnFeesData).length) {
        getReturnFeesData();
      }
    }
  }, [activeWallet?.address, isOpen]);

  useEffect(() => {
    if (isOpen && activeWallet && !!returnFeesData[activeWallet.address]) {
      setDataByCreatorLength(
        activeWallet.address,
        Object.keys(returnFeesData[activeWallet.address]).length,
      );
    }
  }, [
    isOpen,
    activeWallet?.address,
    Object.keys(returnFeesData[activeWallet?.address || zeroAddress] || {})
      .length,
  ]);

  useEffect(() => {
    if (isOpen && activeWallet && !!dataByCreatorLength[activeWallet.address]) {
      updateReturnFeesDataByCreator(activeWallet.address);
    }
  }, [activeWallet?.address, dataByCreatorLength]);

  const ensNameAbbreviated = ensName
    ? ensName.length > 30
      ? textCenterEllipsis(ensName, sm ? 10 : 6, sm ? 10 : 6)
      : ensName
    : undefined;

  // tx logic
  const [selectedProposalIds, setSelectedProposalIds] = useState<number[]>([]);
  const [timestampTx] = useState(dayjs().unix());

  const {
    error,
    setError,
    loading,
    isTxStart,
    setIsTxStart,
    setFullTxErrorMessage,
    fullTxErrorMessage,
    executeTxWithLocalStatuses,
    tx,
  } = useLastTxLocalStatus({
    type: TxType.returnFees,
    payload: {
      creator: activeWallet?.address,
      proposalIds: selectedProposalIds,
      timestamp: timestampTx,
    },
  });

  const handleReturnFees = async () => {
    setIsReturnFeesTxModalOpen(true);
    if (!!selectedProposalIds.length) {
      await executeTxWithLocalStatuses({
        callbackFunction: async () =>
          await returnFees(
            activeWallet?.address || zeroAddress,
            selectedProposalIds,
            timestampTx,
          ),
      });
    }
  };

  useEffect(() => {
    if (!!selectedProposalIds.length) {
      handleReturnFees();
    }
  }, [selectedProposalIds]);

  // logic for pagination in UI
  const pageSize = 5;
  const totalItemsCount = Object.values(dataByCreator).length;
  const pageCount =
    pageSize < totalItemsCount ? Math.ceil(totalItemsCount / pageSize) : 0;
  const filteredDataByCreator = Object.values(dataByCreator).filter(
    (value) => value.status === ReturnFeeState.AVAILABLE,
  );

  // random
  const txLoading = loading || tx.pending;

  return (
    <BasicModal
      withoutOverlap={isReturnFeesTxModalOpen}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      maxWidth={690}
      withCloseButton>
      <>
        <AccountAddressInfo
          activeAddress={activeWallet?.address || zeroAddress}
          chainId={activeWallet?.chainId || appConfig.govCoreChainId}
          ensNameAbbreviated={ensNameAbbreviated}
          ensAvatar={ensAvatar}
          forTest={false}
          isAvatarExists={isAvatarExists}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 11,
          }}>
          <BlockTitleWithTooltip
            title={texts.walletConnect.returnFees}
            description={texts.walletConnect.returnFeesDescription}
          />

          <BackButton3D
            isSmall
            alwaysWithBorders
            isVisibleOnMobile
            alwaysVisible
            onClick={() => {
              setIsOpen(false);
              setAccountInfoModalOpen(true);
            }}
          />
        </Box>

        <Box sx={{ mt: 24 }}>
          {returnFeesProposalsCountOnRequest === -1 ? (
            <>
              <ReturnFeesModalItemLoading />
              <ReturnFeesModalItemLoading />
              <ReturnFeesModalItemLoading />
              <ReturnFeesModalItemLoading />
            </>
          ) : !!totalItemsCount ? (
            Object.values(dataByCreator)
              .sort((a, b) => b.proposalId - a.proposalId)
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((data) => (
                <ReturnFeesModalItem
                  data={data}
                  setIsOpen={setIsOpen}
                  selectedProposalIds={selectedProposalIds}
                  setSelectedProposalIds={setSelectedProposalIds}
                  txLoading={txLoading}
                  key={data.proposalId}
                />
              ))
          ) : (
            <Box
              sx={{
                minHeight: 200,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Box sx={{ typography: 'headline' }}>
                You haven't created any proposals yet
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ mt: 24, '.Pagination': { m: 0, maxWidth: '100%' } }}>
          <Pagination
            borderSize={4}
            forcePage={0}
            pageCount={pageCount}
            onPageChange={(value) => {
              setCurrentPage(value + 1);
            }}
            withoutQuery
            isSmall
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 40,
          }}>
          {filteredDataByCreator.length > 1 && (
            <BigButton
              loading={txLoading}
              onClick={() => {
                setSelectedProposalIds(
                  filteredDataByCreator.map((value) =>
                    Number(value.proposalId),
                  ),
                );
              }}>
              {texts.walletConnect.returnAll}
            </BigButton>
          )}
        </Box>

        {!!selectedProposalIds.length && (
          <ReturnFeesTxModal
            isOpen={isReturnFeesTxModalOpen}
            setIsOpen={setIsReturnFeesTxModalOpen}
            setFullTxErrorMessage={setFullTxErrorMessage}
            isTxStart={isTxStart}
            setIsTxStart={setIsTxStart}
            error={error}
            setError={setError}
            proposalIds={selectedProposalIds}
            tx={tx}
            fullTxErrorMessage={fullTxErrorMessage}
          />
        )}
      </>
    </BasicModal>
  );
}
