import {
  selectLastTxByTypeAndPayload,
  TransactionStatus,
} from '@bgd-labs/frontend-web3-utils';
import { Box, styled, useTheme } from '@mui/system';
import React from 'react';

import InfoIcon from '/public/images/icons/info.svg';

import { checkIsVotingAvailable } from '../../../representations/store/representationsSelectors';
import { useStore } from '../../../store';
import { TransactionUnion } from '../../../transactions/store/transactionsSlice';
import { BigButton, BoxWith3D, NoSSR } from '../../../ui';
import { ChainNameWithIcon } from '../../../ui/components/ChainNameWithIcon';
import { CustomSkeleton } from '../../../ui/components/CustomSkeleton';
import { FormattedNumber } from '../../../ui/components/FormattedNumber';
import { NetworkIcon } from '../../../ui/components/NetworkIcon';
import { IconBox } from '../../../ui/primitives/IconBox';
import { texts } from '../../../ui/utils/texts';
import { media } from '../../../ui/utils/themeMUI';
import { useMediaQuery } from '../../../ui/utils/useMediaQuery';
import { RepresentationIcon } from '../RepresentationIcon';
import { VotedState } from '../VotedState';

const VotingPowerWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 24,
  },
  [theme.breakpoints.up('lg')]: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

interface ProposalVotingPowerProps {
  proposalDataLoading: boolean;
  balanceLoading: boolean;
  votingPower: number;
  votedPower: number;
  proposalId: number;
  onClick: () => void;
  support: boolean;
  isVoted: boolean;
  isFinished: boolean;
  isStarted: boolean;
  isAnyVote?: boolean;
  votingChainId: number;
}

export function ProposalVotingPower({
  proposalDataLoading,
  balanceLoading,
  votingPower,
  votedPower,
  proposalId,
  onClick,
  support,
  isVoted,
  isFinished,
  isStarted,
  isAnyVote,
  votingChainId,
}: ProposalVotingPowerProps) {
  const theme = useTheme();
  const lg = useMediaQuery(media.lg);

  const store = useStore();
  const {
    supportObject,
    activeWallet,
    representative,
    setIsRepresentationInfoModalOpen,
  } = store;

  const tx = useStore((state) =>
    selectLastTxByTypeAndPayload<TransactionUnion>(
      state,
      activeWallet?.address || '',
      'vote',
      {
        proposalId,
        support: !supportObject[proposalId],
        voter: representative.address || activeWallet?.address,
      },
    ),
  );

  const disabled = !checkIsVotingAvailable(store, votingChainId);

  if (!activeWallet?.isActive) return null;
  if (!isAnyVote && isFinished) return null;

  const VotedBlock = () => {
    return (
      <Box
        sx={{
          typography: 'body',
          display: 'inline',
          textAlign: 'center',
          color: '$text',
          lineHeight: '22px',
          '*': {
            display: 'inline',
          },
        }}>
        <VotedState support={support} css={{ color: '$text' }} />{' '}
        <>
          with{' '}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              position: 'relative',
            }}>
            <RepresentationIcon
              address={representative.address}
              disabled={disabled}
            />
            <FormattedNumber
              variant="body"
              value={votedPower}
              visibleDecimals={2}
            />
          </Box>{' '}
          voting power
        </>
      </Box>
    );
  };

  return (
    <NoSSR>
      <BoxWith3D
        borderSize={10}
        contentColor="$mainLight"
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          minHeight: 60,
          p: !isVoted && votingPower > 0 ? 20 : '12px 20px',
          [theme.breakpoints.up('md')]: {
            minHeight: 70,
          },
          [theme.breakpoints.up('lg')]: {
            minHeight: 80,
          },
        }}>
        <>
          {activeWallet?.isActive && (
            <>
              {isFinished ? (
                <>
                  {proposalDataLoading ? (
                    <CustomSkeleton width={200} height={30} />
                  ) : (
                    <>
                      {!isVoted ? (
                        <Box
                          component="p"
                          sx={{ typography: 'body', textAlign: 'center' }}>
                          {texts.proposals.notVoted}
                        </Box>
                      ) : (
                        <VotedBlock />
                      )}
                    </>
                  )}
                </>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    [theme.breakpoints.up('sm')]: {
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                  }}>
                  {isStarted ? (
                    <>
                      {!isVoted && votingPower > 0 && (
                        <VotingPowerWrapper>
                          <Box
                            component="p"
                            sx={{
                              typography: lg ? 'h3' : 'body',
                              mb: 4,
                              [theme.breakpoints.up('sm')]: { mb: 0 },
                            }}>
                            {texts.proposals.yourVotingPower}
                          </Box>

                          {balanceLoading ? (
                            <CustomSkeleton width={50} height={20} />
                          ) : (
                            <Box
                              onClick={() => {
                                if (disabled) {
                                  setIsRepresentationInfoModalOpen(true);
                                }
                              }}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                [theme.breakpoints.up('sm')]: {
                                  top: 1,
                                  ml: 10,
                                },
                                [theme.breakpoints.up('lg')]: {
                                  top: 0,
                                  ml: 0,
                                },
                              }}>
                              <RepresentationIcon
                                address={representative.address}
                                disabled={disabled}
                              />
                              <FormattedNumber
                                variant="h3"
                                css={{
                                  color: disabled ? '$textDisabled' : '$text',
                                  '> p': { fontWeight: 600 },
                                }}
                                value={votingPower}
                                visibleDecimals={2}
                              />
                              {disabled && (
                                <IconBox
                                  sx={(theme) => ({
                                    ml: 4,
                                    width: 12,
                                    height: 12,
                                    cursor: 'pointer',
                                    hover: {
                                      '> svg': {
                                        path: { fill: theme.palette.$text },
                                      },
                                    },
                                    '> svg': {
                                      width: 12,
                                      height: 12,
                                      path: {
                                        fill: theme.palette.$textSecondary,
                                      },
                                    },
                                  })}>
                                  <InfoIcon />
                                </IconBox>
                              )}
                            </Box>
                          )}
                        </VotingPowerWrapper>
                      )}
                      {balanceLoading ? (
                        <>
                          <VotingPowerWrapper>
                            <Box
                              component="p"
                              sx={{
                                typography: lg ? 'h3' : 'body',
                                mb: 4,
                                [theme.breakpoints.up('sm')]: { mb: 0 },
                              }}>
                              {texts.proposals.yourVotingPower}
                            </Box>
                            <CustomSkeleton width={50} height={20} />
                          </VotingPowerWrapper>
                          <CustomSkeleton width={120} height={30} />
                        </>
                      ) : (
                        <>
                          {isVoted ? (
                            <>
                              {proposalDataLoading ? (
                                <CustomSkeleton width={200} height={30} />
                              ) : (
                                <>
                                  <VotedBlock />
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              {votingPower > 0 ? (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                  }}>
                                  <BigButton
                                    disabled={disabled}
                                    loading={
                                      tx &&
                                      tx.type === 'vote' &&
                                      tx.payload.proposalId === proposalId &&
                                      tx.payload.voter ===
                                        (representative.address ||
                                          activeWallet.address) &&
                                      tx.chainId === votingChainId &&
                                      (tx.pending ||
                                        tx.status === TransactionStatus.Success)
                                    }
                                    onClick={onClick}>
                                    <Box
                                      sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '100%',
                                      }}>
                                      <NetworkIcon
                                        chainId={votingChainId}
                                        size={12}
                                        css={{ mr: 4 }}
                                      />
                                      {texts.proposals.vote}
                                    </Box>
                                  </BigButton>
                                </Box>
                              ) : (
                                <Box
                                  component="p"
                                  sx={{
                                    typography: 'body',
                                    textAlign: 'center',
                                    lineHeight: '22px',
                                  }}>
                                  {texts.proposals.notEnoughPower}
                                </Box>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <Box
                      component="div"
                      sx={{
                        typography: 'body',
                        color: '$textSecondary',
                        textAlign: 'center',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                      }}>
                      {texts.proposals.votingNotStartedStart}
                      <ChainNameWithIcon
                        chainId={votingChainId}
                        css={{ ml: 3, mr: 3 }}
                        iconSize={14}
                      />
                      {texts.proposals.votingNotStartedEnd}
                    </Box>
                  )}
                </Box>
              )}
            </>
          )}
        </>
      </BoxWith3D>
    </NoSSR>
  );
}
