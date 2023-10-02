import { VotersData } from '@bgd-labs/aave-governance-ui-helpers/src';
import { Box, styled, useTheme } from '@mui/system';
import React, { useState } from 'react';

import BackArrowIcon from '/public/images/icons/backArrow.svg';

import { BasicModal, Link } from '../../../ui';
import { FormattedNumber } from '../../../ui/components/FormattedNumber';
import { IconBox } from '../../../ui/primitives/IconBox';
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

const TypeChangeButton = styled('button')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 90,
  height: 26,
  borderColor: theme.palette.$main,
  borderStyle: 'solid',
  borderWidth: '1px',
  color: theme.palette.$main,
  backgroundColor: theme.palette.$mainLight,
  transition: 'all 0.2s ease',
  '&:active': {
    backgroundColor: theme.palette.$disabled,
    borderColor: theme.palette.$disabled,
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
  const [type, setType] = useState<'for' | 'against'>('for');

  const isFor = type === 'for';

  const votersFor = voters.filter((vote) => vote.support);
  const votersAgainst = voters.filter((vote) => !vote.support);

  const NoData = ({ type }: { type: 'for' | 'against' }) => {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 20,
        }}>
        <Box sx={{ typography: 'h2' }}>
          {texts.proposals.noVotersData(type)}
        </Box>
      </Box>
    );
  };

  const ListItemAddress = ({ vote }: { vote: VotersData }) => {
    return (
      <Link
        inNewWindow
        css={{
          textAlign: 'left',
          transition: 'all 0.2s ease',
          hover: { opacity: '0.5' },
        }}
        href={`${
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          chainInfoHelper.getChainParameters(vote.chainId).blockExplorerUrls[0]
        }address/${vote.address}`}>
        <Box component="p" sx={{ typography: 'body' }}>
          {formatVoterAddress(vote)}
        </Box>
      </Link>
    );
  };

  return (
    <BasicModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      withCloseButton
      maxWidth={695}>
      <Box sx={{ px: 16, [theme.breakpoints.up('sm')]: { px: 0 } }}>
        <Box component="h3" sx={{ typography: 'h3', mb: 24, fontWeight: 600 }}>
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
              pr: 32,
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            },
          }}>
          <Box sx={{ [theme.breakpoints.up('sm')]: { display: 'none' } }}>
            <BarWrapper>
              <VoteBar
                type={type}
                value={isFor ? forVotes : againstVotes}
                requiredValue={isFor ? requiredForVotes : requiredAgainstVotes}
                linePercent={isFor ? forPercent : againstPercent}
                isFinished={isFinished}
              />
              <Box
                sx={{
                  display: 'flex',
                  mt: 20,
                  justifyContent: isFor ? 'flex-end' : 'flex-start',
                }}>
                <TypeChangeButton
                  type="button"
                  onClick={() => setType(isFor ? 'against' : 'for')}>
                  <Box
                    sx={{
                      typography: 'headline',
                      display: 'inline-flex',
                      alignItems: 'center',
                      svg: {
                        path: {
                          fill: theme.palette.$text,
                        },
                      },
                    }}>
                    {!isFor && (
                      <IconBox
                        sx={{
                          mr: 5,
                          width: 17,
                          height: 10,
                          '> svg': { width: 17, height: 10 },
                        }}>
                        <BackArrowIcon />
                      </IconBox>
                    )}
                    {isFor ? texts.other.toggleAgainst : texts.other.toggleFor}
                    {isFor && (
                      <IconBox
                        sx={{
                          ml: 5,
                          width: 17,
                          height: 10,
                          '> svg': {
                            width: 17,
                            height: 10,
                          },
                          transform: 'rotate(180deg)',
                        }}>
                        <BackArrowIcon />
                      </IconBox>
                    )}
                  </Box>
                </TypeChangeButton>
              </Box>
            </BarWrapper>

            {!!(isFor ? votersFor : votersAgainst).length ? (
              <>
                <ListItem>
                  <Box component="p" sx={{ typography: 'headline' }}>
                    {texts.proposals.voters}
                  </Box>
                  <Box component="p" sx={{ typography: 'headline' }}>
                    {texts.proposals.votersListVotingPower}
                  </Box>
                </ListItem>

                {(isFor ? votersFor : votersAgainst).map((vote, index) => (
                  <ListItem key={index}>
                    <ListItemAddress vote={vote} />
                    <FormattedNumber
                      value={vote.votingPower}
                      visibleDecimals={3}
                    />
                  </ListItem>
                ))}
              </>
            ) : (
              <NoData type={type} />
            )}
          </Box>

          <Box
            sx={{
              display: 'none',
              [theme.breakpoints.up('sm')]: { display: 'block', width: '46%' },
            }}>
            <BarWrapper>
              <VoteBar
                type="for"
                value={forVotes}
                requiredValue={requiredForVotes}
                linePercent={forPercent}
                isFinished={isFinished}
              />
            </BarWrapper>

            {!!votersFor.length ? (
              <>
                <ListItem>
                  <Box component="p" sx={{ typography: 'headline' }}>
                    {texts.proposals.voters}
                  </Box>
                  <Box component="p" sx={{ typography: 'headline' }}>
                    {texts.proposals.votersListVotingPower}
                  </Box>
                </ListItem>
                {votersFor.map((vote, index) => (
                  <ListItem key={index}>
                    <ListItemAddress vote={vote} />
                    <FormattedNumber
                      value={vote.votingPower}
                      visibleDecimals={3}
                    />
                  </ListItem>
                ))}
              </>
            ) : (
              <NoData type="for" />
            )}
          </Box>

          <Box
            sx={{
              display: 'none',
              [theme.breakpoints.up('sm')]: { display: 'block', width: '46%' },
            }}>
            <BarWrapper>
              <VoteBar
                type="against"
                value={againstVotes}
                requiredValue={requiredAgainstVotes}
                linePercent={againstPercent}
                isFinished={isFinished}
              />
            </BarWrapper>

            {!!votersAgainst.length ? (
              <>
                <ListItem>
                  <Box component="p" sx={{ typography: 'headline' }}>
                    {texts.proposals.voters}
                  </Box>
                  <Box component="p" sx={{ typography: 'headline' }}>
                    {texts.proposals.votersListVotingPower}
                  </Box>
                </ListItem>
                {votersAgainst.map((vote, index) => (
                  <ListItem key={index}>
                    <ListItemAddress vote={vote} />
                    <FormattedNumber
                      value={vote.votingPower}
                      visibleDecimals={3}
                    />
                  </ListItem>
                ))}
              </>
            ) : (
              <NoData type="against" />
            )}
          </Box>
        </Box>
      </Box>
    </BasicModal>
  );
}
