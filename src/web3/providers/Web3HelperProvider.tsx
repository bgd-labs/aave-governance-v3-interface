import { useEffect } from 'react';

import { useStore } from '../../store';
import { appUsedNetworks } from '../../utils/appConfig';
import { chainInfoHelper } from '../../utils/configs';

function Child() {
  const {
    activeWallet,
    resetL1Balances,
    fullClearSupportObject,
    getRepresentingAddress,
    representationData,
    getRepresentationData,
    initEns,
    initClients,
  } = useStore();

  useEffect(() => {
    initEns();
    initClients(chainInfoHelper, appUsedNetworks);
  }, []);

  useEffect(() => {
    resetL1Balances();
    fullClearSupportObject();
    setTimeout(() => getRepresentationData(), 1);
  }, [activeWallet?.address]);

  useEffect(() => {
    getRepresentingAddress();
  }, [activeWallet?.address, representationData]);

  return null;
}

export default function Web3HelperProvider() {
  return <Child />;
}
