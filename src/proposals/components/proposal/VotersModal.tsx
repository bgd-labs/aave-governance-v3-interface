import { VotersData } from '@bgd-labs/aave-governance-ui-helpers';
import { Box, styled, useTheme } from '@mui/system';
import React from 'react';

import { BasicModal, Link } from '../../../ui';
import { FormattedNumber } from '../../../ui/components/FormattedNumber';
import { texts } from '../../../ui/utils/texts';
import { chainInfoHelper } from '../../../utils/configs';
import { formatVoterAddress } from '../../utils/formatVoterAddress';
import { VoteBar } from '../VoteBar';

const BarWrapper = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: -32,
  backgroundColor: theme.palette.$paper,
  zIndex: 2,
  marginBottom: 24,
  [theme.breakpoints.up('sm')]: { top: 0 },
}));

const ListItem = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'inline-flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
  color: theme.palette.$main,
  '&:last-of-type': {
    marginBottom: 0,
  },
}));

interface VotersModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  voters: VotersData[];
  title: string;
  forPercent: number;
  forVotes: number;
  againstPercent: number;
  againstVotes: number;
  requiredForVotes: number;
  requiredAgainstVotes: number;
  isFinished: boolean;
}

export function VotersModal({
  isOpen,
  setIsOpen,
  voters,
  title,
  forPercent,
  forVotes,
  againstPercent,
  againstVotes,
  requiredForVotes,
  requiredAgainstVotes,
  isFinished,
}: VotersModalProps) {
  const theme = useTheme();

  const votersFor = voters.filter((vote) => vote.support);
  const votersAgainst = voters.filter((vote) => !vote.support);

  const ListItemAddress = ({ vote }: { vote: VotersData }) => {
    return (
      <Link
        inNewWindow
        css={{
          flex: 1,
          textAlign: 'left',
          transition: 'all 0.2s ease',
          hover: { opacity: '0.5' },
        }}
        href={`${chainInfoHelper.getChainParameters(vote.chainId).blockExplorers
          ?.default.url}/address/${vote.address}`}>
        <Box component="p" sx={{ typography: 'body' }}>
          {formatVoterAddress(vote)}
        </Box>
      </Link>
    );
  };

  const VotersTable = ({ type }: { type: 'for' | 'against' }) => {
    const isFor = type === 'for';

    return (
      <Box
        sx={{
          display: 'none',
          [theme.breakpoints.up('sm')]: {
            display: 'block',
            width: !(isFor ? votersAgainst : votersFor).length
              ? '70%'
              : 'calc(50% - 12px)',
            margin: !(isFor ? votersAgainst : votersFor).length
              ? '0 auto'
              : 'unset',
          },
        }}>
        <BarWrapper>
          <VoteBar
            type={type}
            value={isFor ? forVotes : againstVotes}
            requiredValue={isFor ? requiredForVotes : requiredAgainstVotes}
            linePercent={isFor ? forPercent : againstPercent}
            isFinished={isFinished}
          />
        </BarWrapper>
        <ListItem>
          <Box component="p" sx={{ typography: 'headline' }}>
            {texts.proposals.voters}
          </Box>
          <Box component="p" sx={{ typography: 'headline' }}>
            {texts.proposals.votersListVotingPower}
          </Box>
        </ListItem>
        {(type === 'for' ? votersFor : votersAgainst).map((vote, index) => (
          <ListItem key={index}>
            <ListItemAddress vote={vote} />
            <FormattedNumber value={vote.votingPower} visibleDecimals={3} />
          </ListItem>
        ))}
      </Box>
    );
  };

  return (
    <BasicModal
      modalCss={{
        '.BasicModal__content--wrapper': { justifyContent: 'flex-start' },
      }}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      withCloseButton
      withMinHeight
      maxWidth={690}>
      <Box sx={{ pt: 20 }}>
        <Box
          component="h2"
          sx={{
            typography: 'h1',
            mb: 34,
            textAlign:
              !votersFor.length || !votersAgainst.length ? 'center' : 'left',
          }}>
          {title}
        </Box>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
            [theme.breakpoints.up('sm')]: {
              height: 290,
              overflowY: 'auto',
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            },
          }}>
          <Box sx={{ [theme.breakpoints.up('sm')]: { display: 'none' } }}>
            <BarWrapper>
              {!!votersFor.length && (
                <VoteBar
                  type="for"
                  value={forVotes}
                  requiredValue={requiredForVotes}
                  linePercent={forPercent}
                  isFinished={isFinished}
                />
              )}
              {!!votersAgainst.length && (
                <VoteBar
                  type="against"
                  value={againstVotes}
                  requiredValue={requiredAgainstVotes}
                  linePercent={againstPercent}
                  isFinished={isFinished}
                />
              )}
            </BarWrapper>

            {!!voters.length && (
              <>
                <ListItem>
                  <Box
                    component="p"
                    sx={{
                      flex: 1,
                      typography: 'headline',
                      display: 'inline-flex',
                      justifyContent: 'flex-start',
                    }}>
                    {texts.proposals.voters}
                  </Box>
                  <Box
                    component="p"
                    sx={{
                      flex: 1,
                      typography: 'headline',
                      display: 'inline-flex',
                      justifyContent: 'center',
                    }}>
                    {texts.proposals.votersListVotingPower}
                  </Box>
                  <Box
                    component="p"
                    sx={{
                      flex: 1,
                      typography: 'headline',
                      display: 'inline-flex',
                      justifyContent: 'flex-end',
                    }}>
                    {texts.other.voted}
                  </Box>
                </ListItem>

                {voters.map((vote) => (
                  <ListItem key={vote.transactionHash}>
                    <ListItemAddress vote={vote} />
                    <Box
                      sx={{
                        flex: 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <FormattedNumber
                        value={vote.votingPower}
                        visibleDecimals={3}
                        css={{ display: 'block' }}
                      />
                    </Box>

                    <Box
                      component="p"
                      sx={{
                        typography: 'headline',
                        textAlign: 'right',
                        flex: 1,
                        color: vote.support ? '$mainFor' : '$mainAgainst',
                      }}>
                      {vote.support
                        ? texts.other.toggleFor
                        : texts.other.toggleAgainst}
                    </Box>
                  </ListItem>
                ))}
              </>
            )}
          </Box>

          {!!votersFor.length && <VotersTable type="for" />}
          {!!votersAgainst.length && <VotersTable type="against" />}
        </Box>
      </Box>
    </BasicModal>
  );
}
