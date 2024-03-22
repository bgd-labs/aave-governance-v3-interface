import { CreationFeeState } from '@bgd-labs/aave-governance-ui-helpers';
import { Box, useTheme } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { zeroAddress } from 'viem';

import { useStore } from '../../../store';
import { useLastTxLocalStatus } from '../../../transactions/hooks/useLastTxLocalStatus';
import { TxType } from '../../../transactions/store/transactionsSlice';
import { BackButton3D, BasicModal, BigButton, Pagination } from '../../../ui';
import NoSSR from '../../../ui/primitives/NoSSR';
import { textCenterEllipsis } from '../../../ui/utils/text-center-ellipsis';
import { texts } from '../../../ui/utils/texts';
import { media } from '../../../ui/utils/themeMUI';
import { useMediaQuery } from '../../../ui/utils/useMediaQuery';
import { appConfig } from '../../../utils/appConfig';
import { selectCreationFeesDataByCreator } from '../../store/creationFeesSelectors';
import { BlockTitleWithTooltip } from '../BlockTitleWithTooltip';
import { AccountAddressInfo } from '../wallet/AccountAddressInfo';
import { CreationFeesModalItem } from './CreationFeesModalItem';
import { CreationFeesModalItemLoading } from './CreationFeesModalItemLoading';
import { CreationFeesTxModal } from './CreationFeesTxModal';

interface CreationFeesModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  ensName?: string;
  ensAvatar?: string;
  isAvatarExists?: boolean;
  onDisconnectButtonClick: () => void;
}

export function CreationFeesModal({
  isOpen,
  setIsOpen,
  ensName,
  ensAvatar,
  isAvatarExists,
  onDisconnectButtonClick,
}: CreationFeesModalProps) {
  const store = useStore();
  const theme = useTheme();
  const sm = useMediaQuery(media.sm);

  const {
    creationFeesProposalsCountOnRequest,
    activeWallet,
    setAccountInfoModalOpen,
    creationFeesData,
    getCreationFeesData,
    updateCreationFeesDataByCreator,
    totalProposalCount,
    dataByCreatorLength,
    setDataByCreatorLength,
    redeemCancellationFee,
  } = store;

  // get data logic
  const [currentPage, setCurrentPage] = useState(1);
  const dataByCreator = selectCreationFeesDataByCreator(
    store,
    activeWallet?.address || zeroAddress,
  );

  useEffect(() => {
    setSelectedProposalIds([]);
    setCurrentPage(1);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && activeWallet) {
      if (totalProposalCount > creationFeesProposalsCountOnRequest) {
        getCreationFeesData();
      } else if (!Object.keys(creationFeesData).length) {
        getCreationFeesData();
      }
    }
  }, [activeWallet?.address, isOpen]);

  useEffect(() => {
    if (isOpen && activeWallet && !!creationFeesData[activeWallet.address]) {
      setDataByCreatorLength(
        activeWallet.address,
        Object.keys(creationFeesData[activeWallet.address]).length,
      );
    }
  }, [
    isOpen,
    activeWallet?.address,
    Object.keys(creationFeesData[activeWallet?.address || zeroAddress] || {})
      .length,
  ]);

  useEffect(() => {
    if (isOpen && activeWallet && !!dataByCreatorLength[activeWallet.address]) {
      updateCreationFeesDataByCreator(activeWallet.address);
    }
  }, [activeWallet?.address, dataByCreatorLength]);

  const ensNameAbbreviated = ensName
    ? ensName.length > 30
      ? textCenterEllipsis(ensName, sm ? 10 : 6, sm ? 10 : 6)
      : ensName
    : undefined;

  // tx logic
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [selectedProposalIds, setSelectedProposalIds] = useState<number[]>([]);

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
    type: TxType.claimFees,
    payload: {
      creator: activeWallet?.address,
      proposalIds: selectedProposalIds,
    },
  });

  const handleClaim = async () => {
    setIsTxModalOpen(true);
    if (!!selectedProposalIds.length) {
      await executeTxWithLocalStatuses({
        callbackFunction: async () =>
          await redeemCancellationFee(
            activeWallet?.address || zeroAddress,
            selectedProposalIds,
          ),
      });
    }
  };

  useEffect(() => {
    if (!!selectedProposalIds.length) {
      handleClaim();
    }
  }, [selectedProposalIds]);

  // logic for pagination in UI
  const pageSize = 5;
  const totalItemsCount = Object.values(dataByCreator).length;
  const pageCount =
    pageSize < totalItemsCount ? Math.ceil(totalItemsCount / pageSize) : 0;
  const filteredDataByCreator = Object.values(dataByCreator).filter(
    (value) => value.status === CreationFeeState.AVAILABLE,
  );

  // random
  const txLoading = loading || tx.pending;

  return (
    <BasicModal
      contentCss={{ mt: 12 }}
      withoutOverlap={isTxModalOpen}
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
          onDisconnectButtonClick={onDisconnectButtonClick}
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
            title={texts.creationFee.title}
            description={texts.creationFee.description}
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
          {creationFeesProposalsCountOnRequest === -1 ? (
            <>
              <CreationFeesModalItemLoading />
              <CreationFeesModalItemLoading />
              <CreationFeesModalItemLoading />
              <CreationFeesModalItemLoading />
            </>
          ) : !!totalItemsCount ? (
            Object.values(dataByCreator)
              .sort((a, b) => b.proposalId - a.proposalId)
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((data) => (
                <CreationFeesModalItem
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
              <Box sx={{ maxWidth: 444, m: '0 auto' }}>
                <NoSSR>
                  {theme.palette.mode === 'dark' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      width="100%"
                      height="auto"
                      src="/images/DarkNoFees.svg"
                      alt={texts.creationFee.noData}
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      width="100%"
                      height="auto"
                      src="/images/LightNoFees.svg"
                      alt="You haven't created any proposals yet"
                    />
                  )}
                </NoSSR>
              </Box>
              <Box sx={{ typography: 'headline' }}>
                {texts.creationFee.noData}
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
              {texts.creationFee.claimAll}
            </BigButton>
          )}
        </Box>

        {!!selectedProposalIds.length && (
          <CreationFeesTxModal
            isOpen={isTxModalOpen}
            setIsOpen={setIsTxModalOpen}
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
