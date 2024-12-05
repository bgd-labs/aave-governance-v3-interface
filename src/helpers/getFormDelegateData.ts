import { Address } from 'viem';

import { DelegateData } from '../types';

interface GetFormDelegateDataParams {
  underlyingAsset?: Address;
  votingToAddress?: Address | string;
  propositionToAddress?: Address | string;
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
