import { useEffect } from 'react';

import { useRootStore } from '../../store/storeProvider';
import { appUsedNetworks } from '../../utils/appConfig';
import { chainInfoHelper } from '../../utils/configs';

function Child() {
  const activeWallet = useRootStore((state) => state.activeWallet);
  const resetL1Balances = useRootStore((state) => state.resetL1Balances);
  const fullClearSupportObject = useRootStore(
    (state) => state.fullClearSupportObject,
  );
  const getRepresentingAddress = useRootStore(
    (state) => state.getRepresentingAddress,
  );
  const representationData = useRootStore((state) => state.representationData);
  const getRepresentationData = useRootStore(
    (state) => state.getRepresentationData,
  );
  const initEns = useRootStore((state) => state.initEns);
  const initClients = useRootStore((state) => state.initClients);

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
