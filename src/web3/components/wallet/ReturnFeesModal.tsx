import { Box } from '@mui/system';
import React, { useEffect } from 'react';
import { zeroAddress } from 'viem';

import { useStore } from '../../../store';
import { BackButton3D, BasicModal } from '../../../ui';
import { selectReturnsFeesDataByCreator } from '../../store/returnFeesSelectors';

interface ReturnFeesModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export function ReturnFeesModal({ isOpen, setIsOpen }: ReturnFeesModalProps) {
  const store = useStore();
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

  console.log(dataByCreator);

  return (
    <BasicModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      maxWidth={690}
      withCloseButton>
      <h1>Hello</h1>

      <Box sx={{ mt: 40 }}>
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
    </BasicModal>
  );
}
