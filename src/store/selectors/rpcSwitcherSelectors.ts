import { ClientsRecord } from '@bgd-labs/frontend-web3-utils';

import { IRpcSwitcherSlice } from '../rpcSwitcherSlice';

export const selectAppClients = (store: IRpcSwitcherSlice) => {
  return Object.entries(store.appClients).reduce((acc, [key, value]) => {
    acc[+key] = value.instance;
    return acc;
  }, {} as ClientsRecord);
};

export const selectIsRpcAppHasErrors = (store: IRpcSwitcherSlice) => {
  return Object.values(store.rpcAppErrors).some((error) => error.error);
};
