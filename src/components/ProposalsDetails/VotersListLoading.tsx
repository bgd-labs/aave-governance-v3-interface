import { Box } from '@mui/system';
import React from 'react';
import { zeroAddress } from 'viem';

import { useStore } from '../../providers/ZustandStoreProvider';
import { CustomSkeleton } from '../primitives/CustomSkeleton';
import {
  votersCountForViewAll,
  VotersListHeader,
  VotersListItem,
  VotersListItemsWrapper,
  VotersListProps,
  VotersListViewAllButton,
  VotersListWrapper,
  votersVisibleCount,
} from './VotersList';

export function VotersListLoading({
  voters,
  isStarted,
  setIsVotersModalOpen,
}: Pick<VotersListProps, 'voters' | 'isStarted' | 'setIsVotersModalOpen'>) {
  // const representative = useStore((store) => store.representative);
  const activeWallet = useStore((store) => store.activeWallet);

  if (!isStarted) return null;
  if (!voters?.length) return null;

  return (
    <VotersListWrapper>
      <VotersListItemsWrapper voters={voters}>
        <Box>
          <VotersListHeader />
          {voters
            .sort((a, b) => b.votingPower - a.votingPower)
            .slice(0, votersVisibleCount)
            .map((vote) => (
              <VotersListItem
                activeAddress={
                  // representative.address ||
                  activeWallet?.address || zeroAddress
                }
                vote={vote}
                key={vote.transactionHash}
              />
            ))}
        </Box>
        <Box
          sx={{
            display: 'flex',
            position: 'absolute',
            bottom: voters?.length <= votersCountForViewAll ? 10 : 2,
            width: '100%',
          }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              flex: 1,
            }}>
            <CustomSkeleton width={60} height={13} />
          </Box>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
            }}>
            <CustomSkeleton width={60} height={13} />
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              flex: 1,
            }}>
            <CustomSkeleton width={30} height={13} />
          </Box>
        </Box>
      </VotersListItemsWrapper>

      <VotersListViewAllButton
        voters={voters}
        setIsVotersModalOpen={setIsVotersModalOpen}
      />
    </VotersListWrapper>
  );
}
