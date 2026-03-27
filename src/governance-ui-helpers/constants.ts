import { Asset } from './types';

// balance slots by assets name
export const baseSlots = {
  [Asset.STKAAVE]: {
    balance: 0,
    exchangeRate: 81,
  },
  [Asset.AAAVE]: {
    balance: 52,
    delegation: 64,
  },
  [Asset.AAVE]: {
    balance: 0,
  },
  [Asset.GOVCORE]: {
    balance: 9,
  },
};

export const ipfsGateway = 'https://cloudflare-ipfs.com/ipfs';

export const zeroHash =
  '0x0000000000000000000000000000000000000000000000000000000000000000' as const;

// block limit for getting events for mostly all public RPC's = 1024 blocks
export const blockLimit = 1023;
