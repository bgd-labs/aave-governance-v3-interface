import { Box } from '@mui/system';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { zeroAddress } from 'viem';

import { appConfig } from '../../../configs/appConfig';
import { useStore } from '../../../providers/ZustandStoreProvider';
import { getTotalPowers } from '../../../requests/queryHelpers/getTotalPower';
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

  const representativeAddress =
    representative.address === '' ? zeroAddress : representative.address;
  const activeWalletAddress = activeWallet?.address ?? zeroAddress;

  const { data } = useQuery({
    queryKey: ['currentPowers', representativeAddress, activeWalletAddress],
    queryFn: () =>
      getTotalPowers({
        adr: representativeAddress,
        activeAdr: activeWalletAddress,
        govCoreClient: clients[appConfig.govCoreChainId],
      }),
    enabled: false,
    gcTime: 3600000,
  });

  if (!data?.currentPowers || !data?.currentPowersActiveWallet) return null;

  return (
    <BasicModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      maxWidth={690}
      withCloseButton>
      <PowersModalItem
        type={GovernancePowerType.VOTING}
        representativeAddress={representative.address}
        totalValue={data?.currentPowers.totalVotingPower}
        powersByAssets={data?.currentPowers.powersByAssets}
      />
      <PowersModalItem
        type={GovernancePowerType.PROPOSITION}
        totalValue={data?.currentPowersActiveWallet.totalPropositionPower}
        powersByAssets={data?.currentPowersActiveWallet.powersByAssets}
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
