import {
  ProposalEstimatedState,
  VotersData,
} from '@bgd-labs/aave-governance-ui-helpers';
import { Box, useTheme } from '@mui/system';
import React from 'react';

import { useStore } from '../../../store/ZustandStoreProvider';
import { BoxWith3D, NoSSR } from '../../../ui';
import { CustomSkeleton } from '../../../ui/components/CustomSkeleton';
import { VoteBar } from '../VoteBar';
import {
  votersCountForViewAll,
  VotersList,
  VotersListWrapper,
} from './VotersList';
import { VotersListLoading } from './VotersListLoading';
import { VotersModal } from './VotersModal';

interface ProposalVoteInfoProps {
  title: string;
  forPercent: number;
  forVotes: number;
  againstPercent: number;
  againstVotes: number;
  requiredForVotes: number;
  requiredAgainstVotes: number;
  estimatedStatus: ProposalEstimatedState;
  isFinished: boolean;
  isStarted: boolean;
  isVotingFinished: boolean;
  votersInitialLoading?: boolean;
  votersLoading?: boolean;
  voters?: VotersData[];
}

export function ProposalVoteInfo({
  title,
  forPercent,
  forVotes,
  againstPercent,
  againstVotes,
  requiredForVotes,
  requiredAgainstVotes,
  estimatedStatus,
  isFinished,
  isStarted,
  isVotingFinished,
  voters,
  votersInitialLoading,
  votersLoading,
}: ProposalVoteInfoProps) {
  const theme = useTheme();

  const isRendered = useStore((store) => store.isRendered);
  const setIsVotersModalOpen = useStore((store) => store.setIsVotersModalOpen);
  const isVotersModalOpen = useStore((store) => store.isVotersModalOpen);

  if (!isRendered) {
    return (
      <BoxWith3D
        className="ProposalLoading__SSR"
        borderSize={10}
        contentColor="$mainLight"
        wrapperCss={{ mb: 18, [theme.breakpoints.up('lg')]: { mb: 24 } }}
        css={{
          pt: 18,
          px: 18,
          pb:
            !!voters?.length && voters.length <= votersCountForViewAll ? 0 : 18,
          [theme.breakpoints.up('sm')]: {
            pt: 24,
            px: 24,
            pb:
              !!voters?.length && voters.length <= votersCountForViewAll
                ? 0
                : 24,
          },
          [theme.breakpoints.up('lg')]: {
            pt: 24,
            px: 30,
            pb:
              !!voters?.length && voters.length <= votersCountForViewAll
                ? 0
                : 24,
          },
        }}>
        <Box
          sx={{
            width: '100%',
          }}>
          <Box sx={{ width: '100%', mb: 12 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <CustomSkeleton width={50} height={14} />
              <CustomSkeleton width={50} height={14} />
            </Box>
            <CustomSkeleton width="100%" height={10} />
          </Box>
          <Box sx={{ width: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <CustomSkeleton width={50} height={14} />
              <CustomSkeleton width={50} height={14} />
            </Box>
            <CustomSkeleton width="100%" height={10} />
          </Box>

          <Box sx={{ m: '10px auto', width: '80%' }}>
            <CustomSkeleton width="100%" height={18} />
          </Box>
        </Box>
      </BoxWith3D>
    );
  }

  return (
    <NoSSR>
      <BoxWith3D
        borderSize={10}
        contentColor="$mainLight"
        bottomBorderColor={
          estimatedStatus === ProposalEstimatedState.Failed && !isFinished
            ? '$secondaryAgainst'
            : estimatedStatus === ProposalEstimatedState.Succeed && !isFinished
              ? '$secondaryFor'
              : '$light'
        }
        wrapperCss={{ mb: 18, [theme.breakpoints.up('lg')]: { mb: 24 } }}
        css={{
          pt: 18,
          px: 18,
          pb:
            !!voters?.length && voters.length <= votersCountForViewAll ? 0 : 18,
          [theme.breakpoints.up('lg')]: {
            pt: 24,
            px: 30,
            pb:
              !!voters?.length && voters.length <= votersCountForViewAll
                ? 0
                : 24,
          },
        }}>
        <VoteBar
          type="for"
          value={forVotes}
          requiredValue={requiredForVotes}
          linePercent={forPercent}
          isFinished={isVotingFinished}
        />
        <VoteBar
          type="against"
          value={againstVotes}
          requiredValue={requiredAgainstVotes}
          linePercent={againstPercent}
          isFinished={isVotingFinished}
        />

        {votersInitialLoading && !voters?.length ? (
          <VotersListWrapper>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <CustomSkeleton width={180} height={26} />
            </Box>
          </VotersListWrapper>
        ) : votersLoading && !votersInitialLoading ? (
          <VotersListLoading
            voters={voters}
            setIsVotersModalOpen={setIsVotersModalOpen}
            isStarted={isStarted}
          />
        ) : (
          <VotersList
            voters={voters}
            setIsVotersModalOpen={setIsVotersModalOpen}
            isVotingFinished={isVotingFinished}
            isStarted={isStarted}
          />
        )}
      </BoxWith3D>

      {voters && voters.length > votersCountForViewAll && (
        <VotersModal
          isOpen={isVotersModalOpen}
          setIsOpen={setIsVotersModalOpen}
          voters={voters}
          title={title}
          forPercent={forPercent}
          forVotes={forVotes}
          againstPercent={againstPercent}
          againstVotes={againstVotes}
          requiredForVotes={requiredForVotes}
          requiredAgainstVotes={requiredAgainstVotes}
          isFinished={isVotingFinished}
        />
      )}
    </NoSSR>
  );
}
