import { Hex } from 'viem';

import { IPayloadsExplorerSlice } from '../payloadsExplorerSlice';

export const selectPayloadExploreById = ({
  payloadsExploreData,
  payloadId,
  address,
  chainId,
}: {
  chainId: number;
  address: Hex;
  payloadId: number;
} & Pick<IPayloadsExplorerSlice, 'payloadsExploreData'>) => {
  if (!payloadsExploreData[chainId]) {
    return;
  } else if (!payloadsExploreData[chainId][address]) {
    return;
  } else if (
    !payloadsExploreData[chainId][address][`${address}_${payloadId}`]
  ) {
    return;
  } else {
    return payloadsExploreData[chainId][address][`${address}_${payloadId}`];
  }
};
