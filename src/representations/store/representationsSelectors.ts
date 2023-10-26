import { RootState } from '../../store';

export const checkIsVotingAvailable = (
  store: RootState,
  votingChainId: number,
) => {
  return store.representative.address !== '0x0'
    ? !!store.representative.chainsIds.length &&
        !!store.representative.chainsIds.find(
          (chainId) => chainId === votingChainId,
        )
    : true;
};
