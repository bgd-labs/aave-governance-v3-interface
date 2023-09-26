import { useEffect } from 'react';

import { useStore } from '../../store';

function Child() {
  const {
    activeWallet,
    resetL1Balances,
    fullClearSupportObject,
    getRepresentingAddress,
    representationData,
    getRepresentationData,
    initEns,
  } = useStore();

  useEffect(() => {
    initEns();
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
