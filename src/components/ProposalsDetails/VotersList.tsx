import { Box, useTheme } from '@mui/system';
import React, { ReactNode } from 'react';
import { Hex, zeroAddress } from 'viem';

import { formatVoterAddress } from '../../helpers/formatVoterAddress';
import { getScanLink } from '../../helpers/getScanLink';
import { texts } from '../../helpers/texts/texts';
import { useStore } from '../../providers/ZustandStoreProvider';
import { VotersData } from '../../types';
import { FormattedNumber } from '../FormattedNumber';
import { Link } from '../Link';

export interface VotersListProps {
  voters?: VotersData[];
  setIsVotersModalOpen: (value: boolean) => void;
  isVotingFinished: boolean;
  isStarted: boolean;
}

export const votersCountForViewAll = 1;
export const votersVisibleCount = 5;

export function VotersListWrapper({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={(theme) => ({
        mt: 12,
        [theme.breakpoints.up('lg')]: {
          mt: 20,
        },
      })}>
      {children}
    </Box>
  );
}

export function VotersListHeader() {
  return (
    <Box sx={{ display: 'flex', color: '$text', mb: 12 }}>
      <Box
        component="p"
        sx={{
          typography: 'descriptorAccent',
          textAlign: 'left',
          flex: 1,
        }}>
        {texts.proposals.votersListVoters}
      </Box>
      <Box
        component="p"
        sx={{
          typography: 'descriptorAccent',
          textAlign: 'center',
          flex: 1,
        }}>
        {texts.proposals.votersListVotingPower}
      </Box>
      <Box
        component="p"
        sx={{
          typography: 'descriptorAccent',
          textAlign: 'right',
          flex: 1,
        }}>
        {texts.proposals.votersListSupport}
      </Box>
    </Box>
  );
}

export function VotersListItemsWrapper({
  voters,
  children,
}: { children: ReactNode } & Pick<VotersListProps, 'voters'>) {
  return (
    <Box
      sx={(theme) => ({
        position: 'relative',
        pb: !voters?.length
          ? 24
          : voters?.length <= votersCountForViewAll
            ? 32
            : 24,
        [theme.breakpoints.up('sm')]: {
          pb: !voters?.length
            ? 24
            : voters?.length <= votersCountForViewAll
              ? 30
              : 24,
        },
        [theme.breakpoints.up('lg')]: {
          pb: !voters?.length
            ? 24
            : voters?.length <= votersCountForViewAll
              ? 34
              : 24,
        },
      })}>
      {children}
    </Box>
  );
}

export function VotersListItem({
  vote,
  activeAddress,
}: {
  vote: VotersData;
  activeAddress: Hex;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        color: '$text',
        mb: 12,
        '&:last-of-type': { mb: 0 },
      }}>
      <Link
        inNewWindow
        css={{
          textAlign: 'left',
          flex: 1,
          transition: 'all 0.2s ease',
          hover: { opacity: '0.5' },
        }}
        href={getScanLink({
          address: vote.address,
        })}>
        <Box
          component="p"
          sx={{
            typography:
              vote.address.toLowerCase() ===
              (activeAddress || zeroAddress)?.toLowerCase()
                ? 'descriptorAccent'
                : 'descriptor',
          }}>
          {formatVoterAddress(vote)}
        </Box>
      </Link>
      <FormattedNumber
        variant="descriptor"
        value={vote.votingPower}
        visibleDecimals={2}
        css={{
          textAlign: 'center',
          flex: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
      <Box
        component="p"
        sx={{
          typography: 'descriptorAccent',
          textAlign: 'right',
          flex: 1,
          color: vote.support ? '$mainFor' : '$mainAgainst',
        }}>
        {vote.support ? texts.other.toggleFor : texts.other.toggleAgainst}
      </Box>
    </Box>
  );
}

export function VotersListViewAllButton({
  voters,
  setIsVotersModalOpen,
}: Pick<VotersListProps, 'voters' | 'setIsVotersModalOpen'>) {
  const theme = useTheme();

  if (!voters) return null;
  if (voters?.length <= votersCountForViewAll) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mt: 4,
      }}>
      <button type="button" onClick={() => setIsVotersModalOpen(true)}>
        <Box
          component="p"
          sx={{
            typography: 'descriptor',
            color: '$textSecondary',
            fontWeight: 600,
            transition: 'all 0.2s ease',
            hover: { color: theme.palette.$text },
          }}>
          {texts.proposals.votersListShowAll}
        </Box>
      </button>
    </Box>
  );
}

export function VotersList({
  voters,
  setIsVotersModalOpen,
  isVotingFinished,
  isStarted,
}: VotersListProps) {
  const representative = useStore((store) => store.representative);
  const activeWallet = useStore((store) => store.activeWallet);

  if (!isStarted) return null;

  return (
    <VotersListWrapper>
      {!voters?.length ? (
        <Box
          component="p"
          sx={{
            typography: 'body',
            color: '$textSecondary',
            mt: 18,
            textAlign: 'center',
          }}>
          {isVotingFinished
            ? texts.proposals.votersListFinishedNoDataTitle
            : texts.proposals.votersListNoDataTitle}
        </Box>
      ) : (
        <>
          <VotersListItemsWrapper voters={voters}>
            <Box>
              <VotersListHeader />
              {voters
                .sort((a, b) => b.votingPower - a.votingPower)
                .slice(0, votersVisibleCount)
                .map((vote) => (
                  <VotersListItem
                    vote={vote}
                    key={vote.transactionHash}
                    activeAddress={
                      representative?.address ||
                      activeWallet?.address ||
                      zeroAddress
                    }
                  />
                ))}
            </Box>
          </VotersListItemsWrapper>

          <VotersListViewAllButton
            voters={voters}
            setIsVotersModalOpen={setIsVotersModalOpen}
          />
        </>
      )}
    </VotersListWrapper>
  );
}
