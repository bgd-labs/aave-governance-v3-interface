import { useEffect } from 'react';

import { useStore } from '../../store/ZustandStoreProvider';
import { appUsedNetworks } from '../../utils/appConfig';
import { chainInfoHelper } from '../../utils/configs';

function Child() {
  const activeWallet = useStore((state) => state.activeWallet);
  const resetL1Balances = useStore((state) => state.resetL1Balances);
  const fullClearSupportObject = useStore(
    (state) => state.fullClearSupportObject,
  );
  const getRepresentingAddress = useStore(
    (state) => state.getRepresentingAddress,
  );
  const representationData = useStore((state) => state.representationData);
  const getRepresentationData = useStore(
    (state) => state.getRepresentationData,
  );
  const initEns = useStore((state) => state.initEns);
  const initClients = useStore((state) => state.initClients);

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
