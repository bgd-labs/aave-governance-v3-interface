import { selectAllTransactionsByWallet } from '@bgd-labs/frontend-web3-utils';
import React, { useEffect } from 'react';
import { zeroAddress } from 'viem';

import { appConfig } from '../../../configs/appConfig';
import { useStore } from '../../../providers/ZustandStoreProvider';
import { RepresentedAddress } from '../../../types';
import { BasicModal } from '../../BasicModal';
import { AccountInfoModalContent } from './AccountInfoModalContent';

interface AccountInfoModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  setAllTransactionModalOpen: (value: boolean) => void;
  ensName?: string;
  ensAvatar?: string;
  isAvatarExists?: boolean;
  representedAddresses?: RepresentedAddress[];
  onDisconnectButtonClick: () => void;
  setIsCreationFeeModalOpen?: (value: boolean) => void;
}

export function AccountInfoModal({
  isOpen,
  setIsOpen,
  setAllTransactionModalOpen,
  ensName,
  ensAvatar,
  isAvatarExists,
  representedAddresses,
  onDisconnectButtonClick,
  setIsCreationFeeModalOpen,
}: AccountInfoModalProps) {
  const representative = useStore((store) => store.representative);
  const getCurrentPowers = useStore((store) => store.getCurrentPowers);
  const activeWallet = useStore((store) => store.activeWallet);
  const allTxsFromStore = useStore((store) =>
    selectAllTransactionsByWallet(
      store.transactionsPool,
      activeWallet?.address || zeroAddress,
    ),
  );

  const allTransactions = activeWallet ? allTxsFromStore : [];

  useEffect(() => {
    if (isOpen) {
      if (representative.address) {
        getCurrentPowers(representative.address);
      } else if (activeWallet?.address) {
        getCurrentPowers(activeWallet?.address);
      }
    }
  }, [activeWallet?.address, representative.address, isOpen]);

  return (
    <BasicModal
      contentCss={{ marginTop: 12 }}
      isOpen={isOpen}
      setIsOpen={(value) => setTimeout(() => setIsOpen(value), 1)}
      withCloseButton
      maxWidth={690}>
      <AccountInfoModalContent
        ensName={ensName}
        ensAvatar={ensAvatar}
        isAvatarExists={isAvatarExists}
        activeAddress={activeWallet?.address || ''}
        chainId={activeWallet?.chain?.id || appConfig.govCoreChainId}
        isActive={activeWallet?.isActive || false}
        allTransactions={allTransactions.sort(
          (a, b) => b.localTimestamp - a.localTimestamp,
        )}
        onDelegateButtonClick={() => setIsOpen(false)}
        onRepresentationsButtonClick={() => setIsOpen(false)}
        onReturnFeeButtonClick={() => {
          setIsOpen(false);
          if (setIsCreationFeeModalOpen) {
            setIsCreationFeeModalOpen(true);
          }
        }}
        onDisconnectButtonClick={onDisconnectButtonClick}
        onAllTransactionButtonClick={() => {
          setIsOpen(false);
          setAllTransactionModalOpen(true);
        }}
        representedAddresses={representedAddresses}
      />
    </BasicModal>
  );
}
