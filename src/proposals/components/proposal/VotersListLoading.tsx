import { Box } from '@mui/system';
import React from 'react';

import { CustomSkeleton } from '../../../ui/components/CustomSkeleton';
import {
  votersCountForViewAll,
  VotersListHeader,
  VotersListItem,
  VotersListItemsWrapper,
  VotersListProps,
  VotersListViewAllButton,
  VotersListWrapper,
} from './VotersList';

interface VotersLoadingProps
  extends Pick<
    VotersListProps,
    'voters' | 'isStarted' | 'setIsVotersModalOpen'
  > {}

export function VotersListLoading({
  voters,
  isStarted,
  setIsVotersModalOpen,
}: VotersLoadingProps) {
  if (!isStarted) return null;
  if (!voters?.length) return null;

  return (
    <VotersListWrapper>
      <VotersListItemsWrapper voters={voters}>
        <Box>
          <VotersListHeader />
          {voters
            .sort((a, b) => b.votingPower - a.votingPower)
            .slice(0, votersCountForViewAll)
            .map((vote, index) => (
              <VotersListItem vote={vote} key={index} />
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
