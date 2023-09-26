import { useEffect, useState } from 'react';

import { getRepresentedAddresses } from '../../../representations/utils/getRepresentedAddresses';
import { useStore } from '../../../store';
import { TransactionsModal } from '../../../transactions/components/TransactionsModal';
import { selectENSAvatar } from '../../store/ensSelectors';
import { selectActiveWallet } from '../../store/web3Selectors';
import { AccountInfoModal } from './AccountInfoModal';
import { ConnectWalletButton } from './ConnectWalletButton';
import { ConnectWalletModal } from './ConnectWalletModal';

export function WalletWidget() {
  const store = useStore();
  const activeWallet = useStore(selectActiveWallet);
  const {
    connectWalletModalOpen,
    setConnectWalletModalOpen,
    accountInfoModalOpen,
    setAccountInfoModalOpen,
    allTransactionModalOpen,
    setAllTransactionModalOpen,
    resetWalletConnectionError,
    getActiveAddress,
    representative,
    representationData,
    ensData,
    fetchEnsNameByAddress,
  } = store;

  const activeAddress = getActiveAddress() || '';

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
        const addressData = ensData[activeAddress.toLocaleLowerCase()];
        setShownUserName(
          addressData && addressData.name ? addressData.name : activeAddress,
        );
        selectENSAvatar(
          store,
          activeAddress,
          setShownAvatar,
          setIsAvatarExists,
        );
      });
    }
  }, [ensData, activeAddress]);

  const representedAddresses = getRepresentedAddresses(representationData);

  useEffect(() => {
    resetWalletConnectionError();
  }, [connectWalletModalOpen]);

  const handleButtonClick = () => {
    if (activeWallet?.isActive) {
      setAccountInfoModalOpen(true);
    } else {
      setConnectWalletModalOpen(true);
    }
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
      />
      <TransactionsModal
        isOpen={allTransactionModalOpen}
        setIsOpen={setAllTransactionModalOpen}
        representedAddresses={representedAddresses}
      />
    </>
  );
}
