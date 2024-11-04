import { RepresentativeAddress } from './representationsSlice';

export const checkIsVotingAvailable = (
  representative: RepresentativeAddress,
  votingChainId: number,
) => {
  return representative.address !== ''
    ? !!representative.chainsIds.length &&
        !!representative.chainsIds.find((chainId) => chainId === votingChainId)
    : true;
};
