import { Box } from '@mui/system';
import React from 'react';

import { useStore } from '../../../store/ZustandStoreProvider';
import { BackButton3D, BasicModal } from '../../../ui';
import { GovernancePowerType } from '../../services/delegationService';
import {
  selectCurrentPowers,
  selectCurrentPowersForActiveWallet,
} from '../../store/web3Selectors';
import { PowersModalItem } from './PowersModalItem';

interface PowersInfoModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export function PowersInfoModal({ isOpen, setIsOpen }: PowersInfoModalProps) {
  const representative = useStore((store) => store.representative);
  const setAccountInfoModalOpen = useStore(
    (store) => store.setAccountInfoModalOpen,
  );

  const currentPowersAll = useStore((store) => selectCurrentPowers(store));
  const currentPowersActiveWallet = useStore((store) =>
    selectCurrentPowersForActiveWallet(store),
  );

  if (!currentPowersAll || !currentPowersActiveWallet) return null;

  return (
    <BasicModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      maxWidth={690}
      withCloseButton>
      <PowersModalItem
        type={GovernancePowerType.VOTING}
        representativeAddress={representative.address}
        totalValue={currentPowersAll.totalVotingPower}
        powersByAssets={currentPowersAll.powersByAssets}
      />
      <PowersModalItem
        type={GovernancePowerType.PROPOSITION}
        totalValue={currentPowersActiveWallet.totalPropositionPower}
        powersByAssets={currentPowersActiveWallet.powersByAssets}
      />

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
