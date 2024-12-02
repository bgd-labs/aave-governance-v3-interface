import {
  selectLastTxByTypeAndPayload,
  TransactionStatus,
} from '@bgd-labs/frontend-web3-utils';
import { Box, styled, useTheme } from '@mui/system';
import React from 'react';

import InfoIcon from '../../assets/icons/info.svg';
import { texts } from '../../helpers/texts/texts';
import { useStore } from '../../providers/ZustandStoreProvider';
import { TransactionUnion, TxType } from '../../store/transactionsSlice';
import { media } from '../../styles/themeMUI';
import { useMediaQuery } from '../../styles/useMediaQuery';
import { BigButton } from '../BigButton';
import { BoxWith3D } from '../BoxWith3D';
import { ChainNameWithIcon } from '../ChainNameWithIcon';
import { FormattedNumber } from '../FormattedNumber';
import { NetworkIcon } from '../NetworkIcon';
import { CustomSkeleton } from '../primitives/CustomSkeleton';
import { IconBox } from '../primitives/IconBox';
import NoSSR from '../primitives/NoSSR';
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
  proposalId,
  onClick,
  support,
  isVoted,
  isFinished,
  isStarted,
  votingChainId,
}: ProposalVotingPowerProps) {
  const theme = useTheme();
  const lg = useMediaQuery(media.lg);

  const activeWallet = useStore((store) => store.activeWallet);
  const transactionsPool = useStore((store) => store.transactionsPool);

  // const representative = useStore((store) => store.representative);
  // const setIsRepresentationInfoModalOpen = useStore(
  //   (store) => store.setIsRepresentationInfoModalOpen,
  // );

  const tx =
    activeWallet &&
    selectLastTxByTypeAndPayload<TransactionUnion>(
      transactionsPool,
      activeWallet.address,
      TxType.vote,
      {
        proposalId,
        // support: !supportObject[proposalId],
        // voter: representative.address || activeWallet?.address,
        voter: activeWallet?.address,
      },
    );

  // const disabled = !checkIsVotingAvailable(representative, votingChainId);
  const disabled = false;

  if (!activeWallet?.isActive) return null;
  if (isFinished) return null;

  const VotedBlock = () => {
    return (
      <Box
        sx={{
          typography: 'body',
          display: 'inline',
          textAlign: 'center',
          color: '$text',
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
            {/*<RepresentationIcon*/}
            {/*  address={representative.address}*/}
            {/*  disabled={disabled}*/}
            {/*/>*/}
            <FormattedNumber
              variant="body"
              value={votingPower}
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
                              // onClick={() => {
                              //   if (disabled) {
                              //     setIsRepresentationInfoModalOpen(true);
                              //   }
                              // }}
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
                              {/*<RepresentationIcon*/}
                              {/*  address={representative.address}*/}
                              {/*  disabled={disabled}*/}
                              {/*/>*/}
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
                                      // tx.payload.voter ===
                                      //   (representative.address ||
                                      //     activeWallet.address) &&
                                      tx.payload.voter ===
                                        activeWallet.address &&
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
