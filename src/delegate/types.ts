import { Asset } from '@bgd-labs/governance-v3-js-utils/dist/utils';
import { Address } from 'viem';

export type DelegateItem = {
  underlyingAsset: Address;
  symbol: Asset;
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
  symbol: Asset;
  underlyingAsset: Address;
  bothAddresses?: Address | string;
  votingToAddress?: Address | string;
  propositionToAddress?: Address | string;
};
