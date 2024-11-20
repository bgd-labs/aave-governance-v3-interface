'use client';

import { Box, useTheme } from '@mui/system';
import React, { useState } from 'react';

import { ROUTES } from '../../configs/routes';
import { texts } from '../../helpers/texts/texts';
import { useStore } from '../../providers/ZustandStoreProvider';
import { ActiveProposalOnTheList } from '../../types';
import { ChainNameWithIcon } from '../ChainNameWithIcon';
import { Link } from '../Link';
import { ProposalNextState } from '../ProposalNextState';
import { ProposalStateWithDate } from '../ProposalStateWithDate';
import { VoteBar } from '../VoteBar';
import { Loading } from './Loading';
import { ProposalListItemFinalState } from './ProposalListItemFinalState';
import { ProposalListItemWrapper } from './ProposalListItemWrapper';

interface ActiveProposalListItemProps {
  proposalData: ActiveProposalOnTheList;
  voteButtonClick?: (proposalId: number) => void;
  isForHelpModal?: boolean;
}

export function ActiveItem({
  proposalData,
  voteButtonClick,
  isForHelpModal,
}: ActiveProposalListItemProps) {
  const theme = useTheme();

  const isRendered = useStore((state) => state.isRendered);
  const activeWallet = useStore((state) => state.activeWallet);

  const [isClicked, setIsClicked] = useState(false);
  // const [isIPFSError, setIsIpfsError] = useState(
  //   ipfsDataErrors[proposal.data.ipfsHash] && !ipfsData[proposal.data.ipfsHash],
  // );
  //
  // useEffect(() => {
  //   setIsIpfsError(
  //     ipfsDataErrors[proposal.data.ipfsHash] &&
  //       !ipfsData[proposal.data.ipfsHash],
  //   );
  // }, [isIPFSError, Object.keys(ipfsDataErrors).length]);

  // if (isForHelpModal) {
  //   activeWallet = {
  //     walletType: WalletType.Injected,
  //     address: zeroAddress,
  //     chain: chainInfoHelper.getChainParameters(appConfig.govCoreChainId),
  //     chainId: appConfig.govCoreChainId,
  //     connectorClient: appClients[appConfig.govCoreChainId].instance,
  //     isActive: true,
  //     isContractAddress: false,
  //   };
  // }
  //
  // const support = proposal.data.votingMachineData.votedInfo.support;
  //
  // const isVoted = votedPower > 0;

  // const handleVoteButtonClick = (proposalId: number) => {
  //   voteButtonClick(proposalId);
  //   disablePageLoader();
  // };

  const VotingNotStarted = ({
    withoutMaxWidth,
  }: {
    withoutMaxWidth?: boolean;
  }) => {
    return (
      <Box
        sx={{
          display: 'inline-flex',
          flexWrap: 'wrap',
          alignItems: withoutMaxWidth ? 'flex-start' : 'center',
          justifyContent: withoutMaxWidth ? 'flex-start' : 'center',
          maxWidth: withoutMaxWidth ? 'unset' : 210,
        }}>
        {texts.proposals.votingNotStartedStart}
        <ChainNameWithIcon
          css={{ mx: 4 }}
          iconSize={14}
          chainId={proposalData.votingChainId}
        />
        {texts.proposals.votingNotStartedEnd}
      </Box>
    );
  };

  return (
    <div className="ProposalListItem">
      <Box
        component={isForHelpModal ? Box : Link}
        href={ROUTES.proposal(proposalData.proposalId)}
        onClick={() => {
          if (!isForHelpModal) {
            setIsClicked(true);
          }
        }}
        sx={{
          '&:visited': {
            '.VoteLine': {
              borderColor: `${theme.palette.$mainElements} !important`,
            },
          },
        }}>
        <ProposalListItemWrapper
          isVotingActive={proposalData.isVotingActive}
          nextState={proposalData.nextState.state}
          isForHelpModal={isForHelpModal}
          isFinished={proposalData.isFinished}
          disabled={isClicked}>
          {/*{loading ? (*/}
          {/*  <Loading />*/}
          {/*) : (*/}
          <>
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                flexDirection: 'column',
                [theme.breakpoints.up('sm')]: {
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
              }}>
              <Box
                sx={{
                  width: '100%',
                  mb: 16,
                  [theme.breakpoints.up('sm')]: {
                    width: isForHelpModal ? 'unset' : 315,
                    mb: 0,
                  },
                  [theme.breakpoints.up('lg')]: {
                    width: isForHelpModal ? 'unset' : 440,
                  },
                }}>
                <Box
                  sx={{
                    mb: proposalData.isFinished ? 0 : 8,
                    [theme.breakpoints.up('sm')]: {
                      mb: proposalData.isFinished ? 0 : 12,
                      fontWeight: 600,
                    },
                    [theme.breakpoints.up('lg')]: {
                      mb: proposalData.isFinished ? 0 : 8,
                    },
                  }}>
                  <Box
                    className="ProposalListItem__title"
                    component="h2"
                    sx={{
                      typography: 'h2',
                      color: isRendered
                        ? `${theme.palette.$text} !important`
                        : theme.palette.$text,
                    }}>
                    {proposalData.title}
                  </Box>
                </Box>

                {!proposalData.isFinished && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}>
                    <ProposalStateWithDate
                      css={{ mt: 8 }}
                      state={proposalData.state.state}
                      timestamp={proposalData.state.timestamp}
                      pendingState={proposalData.pendingState}
                      isFinished={proposalData.isFinished}
                    />

                    {!proposalData.isFinished && !proposalData.pendingState && (
                      <Box sx={{ minWidth: 150 }}>
                        <ProposalNextState
                          css={{ mt: 8, mr: 12 }}
                          proposalId={proposalData.proposalId}
                          state={proposalData.nextState.state}
                          timestamp={proposalData.nextState.timestamp}
                          isForHelpModal={isForHelpModal}
                        />
                      </Box>
                    )}
                  </Box>
                )}
              </Box>

              {/*{isVotingFinished && isVoted && !isFinished && (*/}
              {/*  <Box*/}
              {/*    sx={{*/}
              {/*      display: 'none',*/}
              {/*      [theme.breakpoints.up('md')]: {*/}
              {/*        display: 'block',*/}
              {/*      },*/}
              {/*    }}>*/}
              {/*    <VotedState*/}
              {/*      isBig*/}
              {/*      css={{*/}
              {/*        display: 'flex',*/}
              {/*        flexDirection: 'column',*/}
              {/*        alignItems: 'center',*/}
              {/*        span: {*/}
              {/*          display: 'block',*/}
              {/*          mt: 4,*/}
              {/*          color: '$text',*/}
              {/*        },*/}
              {/*      }}*/}
              {/*      support={support}*/}
              {/*    />*/}
              {/*  </Box>*/}
              {/*)}*/}

              {/*{!isVotingFinished && (*/}
              {/*  <Box*/}
              {/*    sx={{*/}
              {/*      display: 'none',*/}
              {/*      [theme.breakpoints.up('md')]: {*/}
              {/*        display: 'flex',*/}
              {/*        flexDirection: 'column',*/}
              {/*        alignItems: 'center',*/}
              {/*        justifyContent: 'center',*/}
              {/*      },*/}
              {/*    }}>*/}
              {/*    {activeWallet?.isActive ? (*/}
              {/*      <>*/}
              {/*        {isVotingActive ? (*/}
              {/*          <>*/}
              {/*            <VotingPower*/}
              {/*              balanceLoading={balanceLoading}*/}
              {/*              isVoted={isVoted}*/}
              {/*              votingPower={isVoted ? votedPower : votingPower}*/}
              {/*              isForHelpModal={isForHelpModal}*/}
              {/*              votingChainId={proposal.data.votingChainId}*/}
              {/*            />*/}
              {/*            <Box sx={{ mt: 8 }}>*/}
              {/*              {isVoted ? (*/}
              {/*                <VotedState support={support} />*/}
              {/*              ) : (*/}
              {/*                <VoteButton*/}
              {/*                  balanceLoading={balanceLoading}*/}
              {/*                  votingPower={votingPower}*/}
              {/*                  proposalId={proposal.data.id}*/}
              {/*                  onClick={handleVoteButtonClick}*/}
              {/*                  votingChainId={proposal.data.votingChainId}*/}
              {/*                  isForHelpModal={isForHelpModal}*/}
              {/*                />*/}
              {/*              )}*/}
              {/*            </Box>*/}
              {/*          </>*/}
              {/*        ) : (*/}
              {/*          <Box*/}
              {/*            component="div"*/}
              {/*            sx={{*/}
              {/*              typography: 'body',*/}
              {/*              color: '$textSecondary',*/}
              {/*              textAlign: 'center',*/}
              {/*            }}>*/}
              {/*            <VotingNotStarted />*/}
              {/*          </Box>*/}
              {/*        )}*/}
              {/*      </>*/}
              {/*    ) : (*/}
              {/*      <>*/}
              {/*        {isVotingActive && !isVotingFinished ? (*/}
              {/*          <Box*/}
              {/*            component="p"*/}
              {/*            sx={{*/}
              {/*              typography: 'body',*/}
              {/*              color: '$textSecondary',*/}
              {/*              textAlign: 'center',*/}
              {/*            }}>*/}
              {/*            {texts.proposals.walletNotConnected}*/}
              {/*          </Box>*/}
              {/*        ) : (*/}
              {/*          !isVotingActive && (*/}
              {/*            <Box*/}
              {/*              component="div"*/}
              {/*              sx={{*/}
              {/*                typography: 'body',*/}
              {/*                color: '$textSecondary',*/}
              {/*                textAlign: 'center',*/}
              {/*              }}>*/}
              {/*              <VotingNotStarted />*/}
              {/*            </Box>*/}
              {/*          )*/}
              {/*        )}*/}
              {/*      </>*/}
              {/*    )}*/}
              {/*  </Box>*/}
              {/*)}*/}

              <>
                {proposalData.isFinished ? (
                  <ProposalListItemFinalState
                    timestamp={proposalData.state.state}
                    state={proposalData.state.timestamp}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      [theme.breakpoints.up('sm')]: { width: 250, ml: 18 },
                      [theme.breakpoints.up('lg')]: { width: 300 },
                    }}>
                    <VoteBar
                      type="for"
                      value={proposalData.forVotes}
                      requiredValue={proposalData.requiredForVotes}
                      linePercent={proposalData.forPercent}
                      isFinished={proposalData.isVotingFinished}
                    />
                    <VoteBar
                      type="against"
                      value={proposalData.againstVotes}
                      requiredValue={proposalData.requiredAgainstVotes}
                      linePercent={proposalData.againstPercent}
                      isFinished={proposalData.isVotingFinished}
                    />
                  </Box>
                )}
              </>
            </Box>

            {!proposalData.isFinished && (
              <Box
                sx={{
                  width: '100%',
                  display: 'block',
                  mt: 12,
                  [theme.breakpoints.up('md')]: { display: 'none' },
                }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  {activeWallet?.isActive ? (
                    <>
                      {proposalData.isVotingActive ? (
                        <>
                          {/*<VotingPower*/}
                          {/*  balanceLoading={balanceLoading}*/}
                          {/*  isVoted={isVoted}*/}
                          {/*  votingPower={isVoted ? votedPower : votingPower}*/}
                          {/*  isForHelpModal={isForHelpModal}*/}
                          {/*  votingChainId={proposal.data.votingChainId}*/}
                          {/*/>*/}
                          {/*{isVoted ? (*/}
                          {/*  <VotedState support={support} />*/}
                          {/*) : (*/}
                          {/*  <VoteButton*/}
                          {/*    balanceLoading={balanceLoading}*/}
                          {/*    votingPower={votingPower}*/}
                          {/*    proposalId={proposal.data.id}*/}
                          {/*    onClick={handleVoteButtonClick}*/}
                          {/*    votingChainId={proposal.data.votingChainId}*/}
                          {/*    isForHelpModal={isForHelpModal}*/}
                          {/*  />*/}
                          {/*)}*/}
                        </>
                      ) : proposalData.isVotingFinished ? (
                        <>
                          {proposalData.isVotingFinished ? ( // TODO: isVoted
                            <>
                              {/*<VotingPower*/}
                              {/*  balanceLoading={balanceLoading}*/}
                              {/*  isVoted={isVoted}*/}
                              {/*  votingPower={isVoted ? votedPower : votingPower}*/}
                              {/*  isForHelpModal={isForHelpModal}*/}
                              {/*  votingChainId={proposal.data.votingChainId}*/}
                              {/*/>*/}
                              {/*<VotedState support={support} />*/}
                            </>
                          ) : (
                            <Box
                              component="p"
                              sx={{
                                typography: 'body',
                                color: '$textSecondary',
                              }}>
                              {texts.proposals.notVoted}
                            </Box>
                          )}
                        </>
                      ) : (
                        <Box
                          component="div"
                          sx={{
                            typography: 'body',
                            color: '$textSecondary',
                          }}>
                          <VotingNotStarted withoutMaxWidth />
                        </Box>
                      )}
                    </>
                  ) : (
                    <>
                      {proposalData.isVotingActive &&
                      !proposalData.isVotingFinished ? (
                        <Box
                          sx={{
                            color: '$textSecondary',
                            typography: 'body',
                          }}>
                          <p>{texts.proposals.walletNotConnected}</p>
                        </Box>
                      ) : (
                        !proposalData.isVotingActive &&
                        !proposalData.isVotingFinished && (
                          <Box
                            sx={{
                              color: '$textSecondary',
                              typography: 'body',
                            }}>
                            <VotingNotStarted withoutMaxWidth />
                          </Box>
                        )
                      )}
                    </>
                  )}
                </Box>
              </Box>
            )}
          </>
          {/*)}*/}
        </ProposalListItemWrapper>
      </Box>
    </div>
  );
}
