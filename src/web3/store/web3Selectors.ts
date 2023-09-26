import { memoize } from 'proxy-memoize';

import { appConfig } from '../../utils/appConfig';
import { IWeb3Slice } from './web3Slice';

export const selectActiveWallet = memoize((store: IWeb3Slice) => {
  return store.activeWallet
    ? {
        ...store.activeWallet,
        wrongNetwork: store.activeWallet.chainId !== appConfig.govCoreChainId,
      }
    : undefined;
});
