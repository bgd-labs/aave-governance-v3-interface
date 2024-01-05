import { Hex } from 'viem';

import { RootState } from '../../store';

export const selectPayloadExploreById = (
  store: RootState,
  chainId: number,
  address: Hex,
  payloadId: number,
) => {
  if (!store.payloadsExploreData[chainId]) {
    return;
  } else if (!store.payloadsExploreData[chainId][address]) {
    return;
  } else if (
    !store.payloadsExploreData[chainId][address][`${address}_${payloadId}`]
  ) {
    return;
  } else {
    return store.payloadsExploreData[chainId][address][
      `${address}_${payloadId}`
    ];
  }
};
