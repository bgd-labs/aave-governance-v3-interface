import { useEffect, useState } from 'react';
import { Hex } from 'viem';

import { getRepresentedAddresses } from '../../../representations/utils/getRepresentedAddresses';
import { useStore } from '../../../store';
import { TransactionsModal } from '../../../transactions/components/TransactionsModal';
import { selectENSAvatar } from '../../store/ensSelectors';
import { AccountInfoModal } from './AccountInfoModal';
import { ConnectWalletButton } from './ConnectWalletButton';
import { ConnectWalletModal } from './ConnectWalletModal';
import { PowersInfoModal } from './PowersInfoModal';
import { ReturnFeesModal } from './ReturnFeesModal';

export function WalletWidget() {
  const store = useStore();
  const {
    activeWallet,
    connectWalletModalOpen,
    setConnectWalletModalOpen,
    accountInfoModalOpen,
    setAccountInfoModalOpen,
    allTransactionModalOpen,
    setAllTransactionModalOpen,
    resetWalletConnectionError,
    representative,
    representationData,
    ensData,
    fetchEnsNameByAddress,
    powersInfoModalOpen,
    setPowersInfoModalOpen,
    returnsFeeModalOpen,
    setReturnsFeeModalOpen,
  } = store;

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
      if (!accountInfoModalOpen) {
        setAccountInfoModalOpen(true);
      }
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
      {returnsFeeModalOpen && (
        <ReturnFeesModal
          isOpen={returnsFeeModalOpen}
          setIsOpen={setReturnsFeeModalOpen}
          ensName={shownUserName}
          ensAvatar={shownAvatar}
          isAvatarExists={isAvatarExists}
        />
      )}
    </>
  );
}
