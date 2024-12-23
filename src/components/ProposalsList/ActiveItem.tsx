'use client';

import { WalletType } from '@bgd-labs/frontend-web3-utils';
import { Box, useTheme } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { zeroAddress } from 'viem';

import { appConfig } from '../../configs/appConfig';
import { chainInfoHelper } from '../../configs/configs';
import { ROUTES } from '../../configs/routes';
import { texts } from '../../helpers/texts/texts';
import { useStore } from '../../providers/ZustandStoreProvider';
import { selectProposalDataByUser } from '../../store/selectors/proposalsSelector';
import { disablePageLoader } from '../../styles/disablePageLoader';
import {
  ActiveProposalOnTheList,
  VotedDataByUser,
  VotingDataByUser,
} from '../../types';
import { ChainNameWithIcon } from '../ChainNameWithIcon';
import { Link } from '../Link';
import { CustomSkeleton } from '../primitives/CustomSkeleton';
import { ProposalNextState } from '../ProposalNextState';
import { ProposalStateWithDate } from '../ProposalStateWithDate';
import { VoteBar } from '../VoteBar';
import { VotedState } from '../VotedState';
import { ProposalListItemFinalState } from './ProposalListItemFinalState';
import { ProposalListItemWrapper } from './ProposalListItemWrapper';
import { VoteButton } from './VoteButton';
import { VotingPower } from './VotingPower';

interface ActiveItemProps {
  proposalData: ActiveProposalOnTheList;
  voteButtonClick?: (proposalId: number) => void;
  isForHelpModal?: boolean;
  userData?: {
    voted: VotedDataByUser;
    voting: VotingDataByUser[];
    votingPower: bigint;
  };
}

export function ActiveItem({
  proposalData,
  voteButtonClick,
  isForHelpModal,
  userData,
}: ActiveItemProps) {
  const theme = useTheme();

  const isRendered = useStore((state) => state.isRendered);
  const representative = useStore((state) => state.representative);
  const appClients = useStore((state) => state.appClients);
  let activeWallet = useStore((state) => state.activeWallet);
  const balanceLoading = useStore(
    (state) => state.userDataLoadings[proposalData.proposalId],
  );
  const votingBalances = useStore((state) => state.votingBalances);
  const votedData = useStore((state) => state.votedData);
  const proposalDetailsLoading = useStore(
    (state) => state.proposalDetailsLoading,
  );

  const userProposalData =
    userData ??
    selectProposalDataByUser({
      votingBalances,
      snapshotBlockHash: proposalData.snapshotBlockHash,
      walletAddress:
        representative?.address || activeWallet?.address || zeroAddress,
      votedData,
    });

  const [votingPower, setVotingPower] = useState(0n);
  const [isClicked, setIsClicked] = useState(false);

  if (isForHelpModal) {
    activeWallet = {
      walletType: WalletType.Injected,
      address: zeroAddress,
      chain: chainInfoHelper.getChainParameters(appConfig.govCoreChainId),
      chainId: appConfig.govCoreChainId,
      connectorClient: appClients[appConfig.govCoreChainId].instance,
      isActive: true,
      isContractAddress: false,
    };
  }

  useEffect(() => {
    if (userProposalData.voted) {
      if (userProposalData.voted.isVoted) {
        setVotingPower(userProposalData.voted.votedInfo.votedPower);
      } else {
        if (userProposalData.voting) {
          setVotingPower(userProposalData.votingPower);
        }
      }
    }
  }, [
    userProposalData.voted,
    userProposalData.voting,
    activeWallet,
    representative,
  ]);

  const handleVoteButtonClick = (proposalId: number) => {
    if (voteButtonClick) {
      voteButtonClick(proposalId);
      disablePageLoader();
    }
  };

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
        href={
          proposalData.isActive
            ? ROUTES.proposal(
                proposalData.proposalId,
                proposalData.ipfsHash,
                proposalData.isActive,
              )
            : ROUTES.proposal(proposalData.proposalId, proposalData.ipfsHash)
        }
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
                    {proposalData.ipfsError ? (
                      'Ipfs getting error'
                    ) : proposalData.ipfsError ? (
                      <CustomSkeleton width={250} height={24} />
                    ) : proposalData.title ===
                        `Proposal ${proposalData.proposalId}` &&
                      !proposalData.isFinished ? (
                      <CustomSkeleton width={250} height={24} />
                    ) : (
                      proposalData.title
                    )}
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

              {proposalData.isVotingFinished &&
                userProposalData.voted?.isVoted &&
                !proposalData.isFinished && (
                  <Box
                    sx={{
                      display: 'none',
                      [theme.breakpoints.up('md')]: {
                        display: 'block',
                      },
                    }}>
                    <VotedState
                      isBig
                      css={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        span: {
                          display: 'block',
                          mt: 4,
                          color: '$text',
                        },
                      }}
                      support={userProposalData.voted.votedInfo.support}
                    />
                  </Box>
                )}

              {!proposalData.isVotingFinished && (
                <Box
                  sx={{
                    display: 'none',
                    [theme.breakpoints.up('md')]: {
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                  }}>
                  {activeWallet?.isActive ? (
                    <>
                      {proposalData.isVotingActive ? (
                        <>
                          <VotingPower
                            balanceLoading={balanceLoading}
                            isVoted={userProposalData.voted?.isVoted ?? false}
                            votingPower={votingPower}
                            isForHelpModal={isForHelpModal}
                            votingChainId={proposalData.votingChainId}
                          />
                          <Box sx={{ mt: 8 }}>
                            {userProposalData.voted?.isVoted ? (
                              <VotedState
                                support={
                                  userProposalData.voted.votedInfo.support
                                }
                              />
                            ) : (
                              <VoteButton
                                balanceLoading={balanceLoading}
                                votingPower={votingPower}
                                proposalId={proposalData.proposalId}
                                onClick={handleVoteButtonClick}
                                votingChainId={proposalData.votingChainId}
                                isForHelpModal={isForHelpModal}
                                loading={
                                  proposalDetailsLoading[
                                    proposalData.proposalId
                                  ]
                                }
                              />
                            )}
                          </Box>
                        </>
                      ) : (
                        <Box
                          component="div"
                          sx={{
                            typography: 'body',
                            color: '$textSecondary',
                            textAlign: 'center',
                          }}>
                          <VotingNotStarted />
                        </Box>
                      )}
                    </>
                  ) : (
                    !proposalData.isVotingActive && (
                      <Box
                        component="div"
                        sx={{
                          typography: 'body',
                          color: '$textSecondary',
                          textAlign: 'center',
                        }}>
                        <VotingNotStarted />
                      </Box>
                    )
                  )}
                </Box>
              )}

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
                          <VotingPower
                            balanceLoading={balanceLoading}
                            isVoted={userProposalData.voted?.isVoted ?? false}
                            votingPower={votingPower}
                            isForHelpModal={isForHelpModal}
                            votingChainId={proposalData.votingChainId}
                          />
                          {userProposalData.voted?.isVoted ? (
                            <VotedState
                              support={userProposalData.voted.votedInfo.support}
                            />
                          ) : (
                            <VoteButton
                              balanceLoading={balanceLoading}
                              votingPower={votingPower}
                              proposalId={proposalData.proposalId}
                              onClick={handleVoteButtonClick}
                              votingChainId={proposalData.votingChainId}
                              isForHelpModal={isForHelpModal}
                              loading={
                                proposalDetailsLoading[proposalData.proposalId]
                              }
                            />
                          )}
                        </>
                      ) : proposalData.isVotingFinished ? (
                        <>
                          {proposalData.isVotingFinished ? (
                            <>
                              <VotingPower
                                balanceLoading={balanceLoading}
                                isVoted={
                                  userProposalData.voted?.isVoted ?? false
                                }
                                votingPower={votingPower}
                                isForHelpModal={isForHelpModal}
                                votingChainId={proposalData.votingChainId}
                              />
                              <VotedState
                                support={
                                  userProposalData.voted?.votedInfo.support
                                }
                              />
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
                </Box>
              </Box>
            )}
          </>
        </ProposalListItemWrapper>
      </Box>
    </div>
  );
}
