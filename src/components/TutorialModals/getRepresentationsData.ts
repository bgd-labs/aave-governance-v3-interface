import { mainnet } from 'viem/chains';

import { RepresentationDataItem } from '../../types';

export function getRepresentationsData() {
  return {
    [mainnet.id]: {
      representative: '0x2Ae626304D770eed47E5C80bF64E44A2352FF53b',
      represented: [],
    },
  } as Record<number, RepresentationDataItem>;
}
