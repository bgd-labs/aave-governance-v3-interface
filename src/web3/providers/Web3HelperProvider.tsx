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
    initProviders,
  } = useStore();

  useEffect(() => {
    initEns();
    initProviders(chainInfoHelper, appUsedNetworks);
  }, []);

  useEffect(() => {
    resetL1Balances();
    fullClearSupportObject();
    setTimeout(() => getRepresentationData(), 1);
  }, [activeWallet?.accounts[0]]);

  useEffect(() => {
    getRepresentingAddress();
  }, [activeWallet?.accounts[0], representationData]);

  return null;
}

export default function Web3HelperProvider() {
  return <Child />;
}
