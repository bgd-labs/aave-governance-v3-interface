'use client';

import { useEffect } from 'react';

import { appUsedNetworks } from '../configs/appConfig';
import { chainInfoHelper } from '../configs/configs';
import { useStore } from './ZustandStoreProvider';

function Child() {
  const activeWallet = useStore((state) => state.activeWallet);
  const initEns = useStore((state) => state.initEns);
  const initClients = useStore((state) => state.initClients);
  const getRepresentingAddress = useStore(
    (state) => state.getRepresentingAddress,
  );
  const representationData = useStore((state) => state.representationData);
  const getRepresentationData = useStore(
    (state) => state.getRepresentationData,
  );

  useEffect(() => {
    initEns();
    initClients(chainInfoHelper, appUsedNetworks);
  }, []);

  useEffect(() => {
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
