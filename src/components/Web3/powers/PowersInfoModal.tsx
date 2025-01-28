import { Box } from '@mui/system';
import React from 'react';
import { Address } from 'viem';

import { appConfig } from '../../../configs/appConfig';
import { useStore } from '../../../providers/ZustandStoreProvider';
import { useGetCurrentPowersQuery } from '../../../requests/queryFetchers/fetchCurrentUserPowersQuery';
import { selectAppClients } from '../../../store/selectors/rpcSwitcherSelectors';
import { GovernancePowerType } from '../../../types';
import { BackButton3D } from '../../BackButton3D';
import { BasicModal } from '../../BasicModal';
import { PowersModalItem } from './PowersModalItem';

interface PowersInfoModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export function PowersInfoModal({ isOpen, setIsOpen }: PowersInfoModalProps) {
  const representative = useStore((store) => store.representative);
  const activeWallet = useStore((store) => store.activeWallet);
  const clients = useStore((store) => selectAppClients(store));
  const setAccountInfoModalOpen = useStore(
    (store) => store.setAccountInfoModalOpen,
  );

  const { currentPowers, currentPowersActiveWallet } = useGetCurrentPowersQuery(
    {
      adr: representative.address as Address,
      activeAdr: activeWallet?.address,
      govCoreClient: clients[appConfig.govCoreChainId],
    },
  );

  if (!currentPowers || !currentPowersActiveWallet) return null;

  return (
    <BasicModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      maxWidth={690}
      withCloseButton>
      <PowersModalItem
        type={GovernancePowerType.VOTING}
        representativeAddress={representative.address}
        totalValue={currentPowers.totalVotingPower}
        powersByAssets={currentPowers.powersByAssets}
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
