import { Hex } from 'viem';

import { Token } from '../utils/getTokenName';

export type DelegateItem = {
  underlyingAsset: Hex;
  symbol: Token;
  amount: number;
  votingToAddress: Hex;
  propositionToAddress: Hex;
};

export type DelegateData = {
  underlyingAsset: Hex;
  votingToAddress: Hex;
  propositionToAddress: Hex;
};

export type TxDelegateData = {
  symbol: Token;
  underlyingAsset: Hex;
  bothAddresses?: Hex;
  votingToAddress?: Hex;
  propositionToAddress?: Hex;
};
