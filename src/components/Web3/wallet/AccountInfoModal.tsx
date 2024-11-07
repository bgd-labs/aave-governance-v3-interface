import { selectAllTransactionsByWallet } from '@bgd-labs/frontend-web3-utils';
import React from 'react';
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
}: AccountInfoModalProps) {
  const activeWallet = useStore((store) => store.activeWallet);
  const allTxsFromStore = useStore((store) =>
    selectAllTransactionsByWallet(
      store.transactionsPool,
      activeWallet?.address || zeroAddress,
    ),
  );

  const allTransactions = activeWallet ? allTxsFromStore : [];

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
