import { useEffect, useState } from 'react';
import { Hex } from 'viem';

import { getRepresentedAddresses } from '../../../representations/utils/getRepresentedAddresses';
import { useStore } from '../../../store/ZustandStoreProvider';
import { TransactionsModal } from '../../../transactions/components/TransactionsModal';
import { selectENSAvatar } from '../../store/ensSelectors';
import { CreationFeesModal } from '../creationFee/CreationFeesModal';
import { PowersInfoModal } from '../powers/PowersInfoModal';
import { AccountInfoModal } from './AccountInfoModal';
import { ConnectWalletButton } from './ConnectWalletButton';
import { ConnectWalletModal } from './ConnectWalletModal';

export function WalletWidget() {
  const appMode = useStore((store) => store.appMode);
  const connectWalletModalOpen = useStore(
    (store) => store.connectWalletModalOpen,
  );
  const activeWallet = useStore((store) => store.activeWallet);
  const fetchEnsAvatarByAddress = useStore(
    (store) => store.fetchEnsAvatarByAddress,
  );
  const setConnectWalletModalOpen = useStore(
    (store) => store.setConnectWalletModalOpen,
  );
  const accountInfoModalOpen = useStore((store) => store.accountInfoModalOpen);
  const setAccountInfoModalOpen = useStore(
    (store) => store.setAccountInfoModalOpen,
  );
  const allTransactionModalOpen = useStore(
    (store) => store.allTransactionModalOpen,
  );
  const setAllTransactionModalOpen = useStore(
    (store) => store.setAllTransactionModalOpen,
  );
  const resetWalletConnectionError = useStore(
    (store) => store.resetWalletConnectionError,
  );
  const representative = useStore((store) => store.representative);
  const representationData = useStore((store) => store.representationData);
  const ensData = useStore((store) => store.ensData);
  const fetchEnsNameByAddress = useStore(
    (store) => store.fetchEnsNameByAddress,
  );
  const powersInfoModalOpen = useStore((store) => store.powersInfoModalOpen);
  const setPowersInfoModalOpen = useStore(
    (store) => store.setPowersInfoModalOpen,
  );
  const isCreationFeeModalOpen = useStore(
    (store) => store.isCreationFeeModalOpen,
  );
  const setIsCreationFeeModalOpen = useStore(
    (store) => store.setIsCreationFeeModalOpen,
  );
  const disconnectActiveWallet = useStore(
    (store) => store.disconnectActiveWallet,
  );
  const setModalOpen = useStore((store) => store.setModalOpen);

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
