import { Hex } from 'viem';

import { DelegateData } from '../types';

interface GetFormDelegateDataParams {
  underlyingAsset?: Hex;
  votingToAddress?: Hex;
  propositionToAddress?: Hex;
  formDelegateData?: DelegateData[];
}

export function getFormDelegateData({
  underlyingAsset,
  votingToAddress,
  propositionToAddress,
  formDelegateData,
}: GetFormDelegateDataParams) {
  const formDelegatedDataItem =
    !!formDelegateData &&
    !!formDelegateData.length &&
    formDelegateData.find((item) => item.underlyingAsset === underlyingAsset);

  const formVotingToAddress =
    typeof formDelegatedDataItem !== 'boolean' &&
    typeof formDelegatedDataItem !== 'undefined'
      ? formDelegatedDataItem.votingToAddress
      : votingToAddress;

  const formPropositionToAddress =
    typeof formDelegatedDataItem !== 'boolean' &&
    typeof formDelegatedDataItem !== 'undefined'
      ? formDelegatedDataItem.propositionToAddress
      : propositionToAddress;

  return {
    formVotingToAddress,
    formPropositionToAddress,
  };
}
