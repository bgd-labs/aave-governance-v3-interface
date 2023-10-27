import { RootState } from '../../store';

export const checkIsVotingAvailable = (
  store: RootState,
  votingChainId: number,
) => {
  return store.representative.address !== ''
    ? !!store.representative.chainsIds.length &&
        !!store.representative.chainsIds.find(
          (chainId) => chainId === votingChainId,
        )
    : true;
};
