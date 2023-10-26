import { PublicClient } from '@wagmi/core';

import { IRpcSwitcherSlice } from './rpcSwitcherSlice';

export const selectAppClients = (store: IRpcSwitcherSlice) => {
  return Object.entries(store.appClients).reduce(
    (acc, [key, value]) => {
      acc[key] = value.instance;
      return acc;
    },
    {} as Record<string, PublicClient>,
  );
};
