import { useEffect, useState } from 'react';
import { Hex } from 'viem';

import { getRepresentedAddresses } from '../../../representations/utils/getRepresentedAddresses';
import { useRootStore } from '../../../store/storeProvider';
import { TransactionsModal } from '../../../transactions/components/TransactionsModal';
import { selectENSAvatar } from '../../store/ensSelectors';
import { CreationFeesModal } from '../creationFee/CreationFeesModal';
import { PowersInfoModal } from '../powers/PowersInfoModal';
import { AccountInfoModal } from './AccountInfoModal';
import { ConnectWalletButton } from './ConnectWalletButton';
import { ConnectWalletModal } from './ConnectWalletModal';

export function WalletWidget() {
  const appMode = useRootStore((store) => store.appMode);
  const connectWalletModalOpen = useRootStore(
    (store) => store.connectWalletModalOpen,
  );
  const activeWallet = useRootStore((store) => store.activeWallet);
  const fetchEnsAvatarByAddress = useRootStore(
    (store) => store.fetchEnsAvatarByAddress,
  );
  const setConnectWalletModalOpen = useRootStore(
    (store) => store.setConnectWalletModalOpen,
  );
  const accountInfoModalOpen = useRootStore(
    (store) => store.accountInfoModalOpen,
  );
  const setAccountInfoModalOpen = useRootStore(
    (store) => store.setAccountInfoModalOpen,
  );
  const allTransactionModalOpen = useRootStore(
    (store) => store.allTransactionModalOpen,
  );
  const setAllTransactionModalOpen = useRootStore(
    (store) => store.setAllTransactionModalOpen,
  );
  const resetWalletConnectionError = useRootStore(
    (store) => store.resetWalletConnectionError,
  );
  const representative = useRootStore((store) => store.representative);
  const representationData = useRootStore((store) => store.representationData);
  const ensData = useRootStore((store) => store.ensData);
  const fetchEnsNameByAddress = useRootStore(
    (store) => store.fetchEnsNameByAddress,
  );
  const powersInfoModalOpen = useRootStore(
    (store) => store.powersInfoModalOpen,
  );
  const setPowersInfoModalOpen = useRootStore(
    (store) => store.setPowersInfoModalOpen,
  );
  const isCreationFeeModalOpen = useRootStore(
    (store) => store.isCreationFeeModalOpen,
  );
  const setIsCreationFeeModalOpen = useRootStore(
    (store) => store.setIsCreationFeeModalOpen,
  );
  const disconnectActiveWallet = useRootStore(
    (store) => store.disconnectActiveWallet,
  );
  const setModalOpen = useRootStore((store) => store.setModalOpen);

  const activeAddress = activeWallet?.address || '';

  const [shownUserName, setShownUserName] = useState<string | undefined>(
    activeAddress,
  );
  const [shownAvatar, setShownAvatar] = useState<string | undefined>(undefined);
  const [isAvatarExists, setIsAvatarExists] = useState<boolean | undefined>(
    undefined,
  );

  useEffect(() => {
    if (activeAddress) {
      setShownUserName(activeAddress);
      fetchEnsNameByAddress(activeAddress).then(() => {
        const addressData = ensData[activeAddress.toLocaleLowerCase() as Hex];
        setShownUserName(
          addressData && addressData.name ? addressData.name : activeAddress,
        );
        selectENSAvatar({
          ensData,
          fetchEnsAvatarByAddress,
          address: activeAddress,
          setAvatar: setShownAvatar,
          setIsAvatarExists,
        });
      });
    }
  }, [ensData, activeAddress]);

  const representedAddresses = getRepresentedAddresses(representationData);

  useEffect(() => {
    resetWalletConnectionError();
  }, [connectWalletModalOpen]);

  const handleButtonClick = () => {
    if (activeWallet?.isActive) {
      if (!accountInfoModalOpen) {
        setAccountInfoModalOpen(true);
      }
    } else {
      setConnectWalletModalOpen(true);
    }
  };

  const handleDisconnectClick = async () => {
    await disconnectActiveWallet();
    setAccountInfoModalOpen(false);
    setIsCreationFeeModalOpen(false);
    setModalOpen(false);
  };

  return (
    <>
      <ConnectWalletButton
        ensName={shownUserName}
        ensAvatar={shownAvatar}
        isAvatarExists={isAvatarExists}
        onClick={handleButtonClick}
        representative={representative}
      />

      <ConnectWalletModal
        isOpen={connectWalletModalOpen}
        setIsOpen={setConnectWalletModalOpen}
      />
      <AccountInfoModal
        ensName={shownUserName}
        ensAvatar={shownAvatar}
        isAvatarExists={isAvatarExists}
        isOpen={accountInfoModalOpen}
        setIsOpen={setAccountInfoModalOpen}
        setAllTransactionModalOpen={setAllTransactionModalOpen}
        representedAddresses={representedAddresses}
        onDisconnectButtonClick={handleDisconnectClick}
      />

      {allTransactionModalOpen && (
        <TransactionsModal
          isOpen={allTransactionModalOpen}
          setIsOpen={setAllTransactionModalOpen}
        />
      )}
      {powersInfoModalOpen && (
        <PowersInfoModal
          isOpen={powersInfoModalOpen}
          setIsOpen={setPowersInfoModalOpen}
        />
      )}

      {appMode === 'expert' && (
        <CreationFeesModal
          isOpen={isCreationFeeModalOpen}
          setIsOpen={setIsCreationFeeModalOpen}
          ensName={shownUserName}
          ensAvatar={shownAvatar}
          isAvatarExists={isAvatarExists}
          onDisconnectButtonClick={handleDisconnectClick}
        />
      )}
    </>
  );
}
