import { Box } from '@mui/system';
import React from 'react';

import { useRootStore } from '../../../store/storeProvider';
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
  const representative = useRootStore((store) => store.representative);
  const setAccountInfoModalOpen = useRootStore(
    (store) => store.setAccountInfoModalOpen,
  );

  const currentPowersAll = useRootStore((store) => selectCurrentPowers(store));
  const currentPowersActiveWallet = useRootStore((store) =>
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
