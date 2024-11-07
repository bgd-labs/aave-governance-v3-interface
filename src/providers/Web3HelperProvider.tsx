import { useEffect } from 'react';

import { appUsedNetworks } from '../configs/appConfig';
import { chainInfoHelper } from '../configs/configs';
import { useStore } from './ZustandStoreProvider';

function Child() {
  const initEns = useStore((state) => state.initEns);
  const initClients = useStore((state) => state.initClients);

  useEffect(() => {
    initEns();
    initClients(chainInfoHelper, appUsedNetworks);
  }, []);

  return null;
}

export default function Web3HelperProvider() {
  return <Child />;
}
