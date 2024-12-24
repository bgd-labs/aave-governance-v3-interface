import { Box, useTheme } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { Address, zeroAddress } from 'viem';

import { appConfig } from '../../../configs/appConfig';
import { texts } from '../../../helpers/texts/texts';
import { useStore } from '../../../providers/ZustandStoreProvider';
import {
  selectCreationFeesDataByCreator,
  selectCreationFeesDataLoadingByCreator,
} from '../../../store/selectors/creationFeesSelectors';
import { TxType } from '../../../store/transactionsSlice';
import { textCenterEllipsis } from '../../../styles/textCenterEllipsis';
import { media } from '../../../styles/themeMUI';
import { useMediaQuery } from '../../../styles/useMediaQuery';
import { CreationFeesTxModal } from '../../../transactions/components/ActionModals/CreationFeesTxModal';
import { useLastTxLocalStatus } from '../../../transactions/useLastTxLocalStatus';
import { CreationFeeState } from '../../../types';
import { BackButton3D } from '../../BackButton3D';
import { BasicModal } from '../../BasicModal';
import { BigButton } from '../../BigButton';
import { Pagination } from '../../Pagination';
import NoSSR from '../../primitives/NoSSR';
import { BlockTitleWithTooltip } from '../BlockTitleWithTooltip';
import { AccountAddressInfo } from '../wallet/AccountAddressInfo';
import { CreationFeesModalItem } from './CreationFeesModalItem';
import { CreationFeesModalItemLoading } from './CreationFeesModalItemLoading';

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
  const theme = useTheme();
  const sm = useMediaQuery(media.sm);

  const activeWallet = useStore((store) => store.activeWallet);
  const setAccountInfoModalOpen = useStore(
    (store) => store.setAccountInfoModalOpen,
  );

  const creationFeesDataLoading = useStore(
    (store) => store.creationFeesDataLoading,
  );
  const creationFeesData = useStore((store) => store.creationFeesData);
  const getCreationFeesData = useStore((store) => store.getCreationFeesData);
  const updateCreationFeesDataByCreator = useStore(
    (store) => store.updateCreationFeesDataByCreator,
  );

  const dataByCreatorLength = useStore((store) => store.dataByCreatorLength);
  const setDataByCreatorLength = useStore(
    (store) => store.setDataByCreatorLength,
  );
  const redeemCancellationFee = useStore(
    (store) => store.redeemCancellationFee,
  );

  // get data logic
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setSelectedProposalIds([]);
    setCurrentPage(1);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && activeWallet) {
      getCreationFeesData(activeWallet.address);
    }
  }, [activeWallet?.address, isOpen]);

  useEffect(() => {
    if (
      isOpen &&
      activeWallet &&
      !!creationFeesData[activeWallet.address.toLowerCase() as Address]
    ) {
      setDataByCreatorLength(
        activeWallet.address,
        Object.keys(
          creationFeesData[activeWallet.address.toLowerCase() as Address],
        ).length,
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

  const dataByCreator = selectCreationFeesDataByCreator({
    creator: activeWallet?.address || zeroAddress,
    creationFeesData,
  });
  const dataByCreatorLoading = selectCreationFeesDataLoadingByCreator({
    creator: activeWallet?.address || zeroAddress,
    creationFeesDataLoading,
  });

  // logic for pagination in UI
  const pageSize = 5;
  const totalItemsCount = Object.values(dataByCreator).length;
  const filteredDataByCreator = Object.values(dataByCreator).filter(
    (value) => value.status === CreationFeeState.AVAILABLE,
  );

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
    if (selectedProposalIds.length) {
      await executeTxWithLocalStatuses({
        callbackFunction: async () =>
          await redeemCancellationFee({
            creator: activeWallet?.address || zeroAddress,
            proposalsIds: selectedProposalIds,
          }),
      });
    }
  };

  useEffect(() => {
    if (selectedProposalIds.length) {
      handleClaim();
    }
  }, [selectedProposalIds]);

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
          {dataByCreatorLoading ? (
            <>
              <CreationFeesModalItemLoading />
              <CreationFeesModalItemLoading />
              <CreationFeesModalItemLoading />
              <CreationFeesModalItemLoading />
            </>
          ) : totalItemsCount ? (
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
                      src="/DarkNoFees.svg"
                      alt={texts.creationFee.noData}
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      width="100%"
                      height="auto"
                      src="/LightNoFees.svg"
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
            totalItems={totalItemsCount}
            setCurrentPageState={(value) => {
              setCurrentPage(value + 1);
            }}
            isSmall
            filtering
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
            proposalsIds={selectedProposalIds}
            tx={tx}
            fullTxErrorMessage={fullTxErrorMessage}
          />
        )}
      </>
    </BasicModal>
  );
}
