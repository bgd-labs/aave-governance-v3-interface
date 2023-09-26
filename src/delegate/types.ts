import { Token } from '../utils/getTokenName';

export type DelegateItem = {
  underlyingAsset: string;
  symbol: Token;
  amount: number;
  votingToAddress: string;
  propositionToAddress: string;
};

export type DelegateData = {
  underlyingAsset: string;
  votingToAddress: string;
  propositionToAddress: string;
};

export type TxDelegateData = {
  symbol: Token;
  underlyingAsset: string;
  bothAddresses?: string;
  votingToAddress?: string;
  propositionToAddress?: string;
};
