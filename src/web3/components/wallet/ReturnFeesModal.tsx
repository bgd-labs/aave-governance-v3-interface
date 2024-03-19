// TODO: styles in progress
// TODO: need add loading state
// TODO: need add no data state

import { Box, useTheme } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { zeroAddress } from 'viem';

import { useStore } from '../../../store';
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
    activeWallet,
    setAccountInfoModalOpen,
    returnFeesData,
    getReturnFeesData,
    updateReturnFeesDataByCreator,
    totalProposalCount,
    dataByCreatorLength,
    setDataByCreatorLength,
  } = store;

  const [currentPage, setCurrentPage] = useState(1);

  const dataByCreator = selectReturnsFeesDataByCreator(
    store,
    activeWallet?.address || zeroAddress,
  );

  useEffect(() => {
    if (isOpen && activeWallet) {
      if (totalProposalCount > returnFeesData.proposalsCountOnRequest) {
        getReturnFeesData();
      } else if (!returnFeesData.data) {
        getReturnFeesData();
      }
    }
  }, [activeWallet?.address, isOpen]);

  useEffect(() => {
    if (activeWallet && !!returnFeesData.data[activeWallet.address]) {
      setDataByCreatorLength(
        activeWallet.address,
        Object.keys(returnFeesData.data[activeWallet.address]).length,
      );
    }
  }, [activeWallet?.address, !!Object.values(returnFeesData.data).length]);

  useEffect(() => {
    if (activeWallet && !!dataByCreatorLength[activeWallet.address]) {
      updateReturnFeesDataByCreator(activeWallet.address);
    }
  }, [activeWallet?.address, dataByCreatorLength]);

  const ensNameAbbreviated = ensName
    ? ensName.length > 30
      ? textCenterEllipsis(ensName, sm ? 10 : 6, sm ? 10 : 6)
      : ensName
    : undefined;

  const pageSize = 8;
  const totalItemsCount = Object.values(dataByCreator).length;
  const pageCount =
    pageSize < totalItemsCount ? Math.ceil(totalItemsCount / pageSize) : 0;

  return (
    <BasicModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      maxWidth={690}
      withCloseButton>
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
        {!!totalItemsCount ? (
          Object.values(dataByCreator)
            .sort((a, b) => b.proposalId - a.proposalId)
            .slice((currentPage - 1) * pageSize, currentPage * pageSize)
            .map((data) => (
              <ReturnFeesModalItem data={data} key={data.proposalId} />
            ))
        ) : (
          <h1>No data</h1>
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
        {!!totalItemsCount && (
          <>
            {/*TODO: need add representation TX modal and connect to this button */}
            <BigButton>{texts.walletConnect.returnAll}</BigButton>
          </>
        )}
      </Box>
    </BasicModal>
  );
}
