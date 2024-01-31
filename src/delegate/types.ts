import { Address } from 'viem';

import { Token } from '../utils/getTokenName';

export type DelegateItem = {
  underlyingAsset: Address;
  symbol: Token;
  amount: number;
  votingToAddress: Address | string;
  propositionToAddress: Address | string;
};

export type DelegateData = {
  underlyingAsset: Address;
  votingToAddress: Address | string;
  propositionToAddress: Address | string;
};

export type TxDelegateData = {
  symbol: Token;
  underlyingAsset: Address;
  bothAddresses?: Address | string;
  votingToAddress?: Address | string;
  propositionToAddress?: Address | string;
};
