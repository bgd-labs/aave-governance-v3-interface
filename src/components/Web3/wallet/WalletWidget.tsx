import { useEffect, useState } from 'react';
import { Hex } from 'viem';

import { getRepresentedAddresses } from '../../../helpers/getRepresentedAddresses';
import { useStore } from '../../../providers/ZustandStoreProvider';
import { selectENSAvatar } from '../../../store/selectors/ensSelectors';
import { TransactionsModal } from '../../../transactions/components/TransactionsModal';
import { CreationFeesModal } from '../creationFee/CreationFeesModal';
import { PowersInfoModal } from '../powers/PowersInfoModal';
import { AccountInfoModal } from './AccountInfoModal';
import { ConnectWalletButton } from './ConnectWalletButton';
import { ConnectWalletModal } from './ConnectWalletModal';

export function WalletWidget() {
  const appMode = useStore((store) => store.appMode);
  const activeWallet = useStore((store) => store.activeWallet);
  const fetchEnsAvatarByAddress = useStore(
    (store) => store.fetchEnsAvatarByAddress,
  );
  const resetWalletConnectionError = useStore(
    (store) => store.resetWalletConnectionError,
  );
  const ensData = useStore((store) => store.ensData);
  const fetchEnsNameByAddress = useStore(
    (store) => store.fetchEnsNameByAddress,
  );
  const disconnectActiveWallet = useStore(
    (store) => store.disconnectActiveWallet,
  );
  const connectWalletModalOpen = useStore(
    (store) => store.connectWalletModalOpen,
  );
  const setConnectWalletModalOpen = useStore(
    (store) => store.setConnectWalletModalOpen,
  );
  const accountInfoModalOpen = useStore((store) => store.accountInfoModalOpen);
  const setAccountInfoModalOpen = useStore(
    (store) => store.setAccountInfoModalOpen,
  );
  const representative = useStore((store) => store.representative);
  const representationData = useStore((store) => store.representationData);
  const powersInfoModalOpen = useStore((store) => store.powersInfoModalOpen);
  const setPowersInfoModalOpen = useStore(
    (store) => store.setPowersInfoModalOpen,
  );

  const activeAddress = activeWallet?.address || '';

  const [shownUserName, setShownUserName] = useState<string | undefined>(
    activeAddress,
  );
  const [shownAvatar, setShownAvatar] = useState<string | undefined>(undefined);
  const [isAvatarExists, setIsAvatarExists] = useState<boolean | undefined>(
    undefined,
  );

  const [allTransactionModalOpen, setAllTransactionModalOpen] = useState(false);
  const [isCreationFeeModalOpen, setIsCreationFeeModalOpen] = useState(false);

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
        setIsCreationFeeModalOpen={setIsCreationFeeModalOpen}
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
