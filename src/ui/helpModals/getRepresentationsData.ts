import { ChainIdByName } from '@bgd-labs/aave-governance-ui-helpers/src/helpers/chains';

import { RepresentationDataItem } from '../../representations/store/representationsSlice';

export function getRepresentationsData() {
  return {
    [ChainIdByName.EthereumMainnet]: {
      representative: '',
      represented: [],
    },
    [ChainIdByName.Polygon]: {
      representative: '0x2Ae626304D770eed47E5C80bF64E44A2352FF53b',
      represented: [],
    },
  } as Record<number, RepresentationDataItem>;
}
