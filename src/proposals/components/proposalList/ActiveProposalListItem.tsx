import {
  CombineProposalState,
  formatProposal,
  ProposalWithLoadings,
} from '@bgd-labs/aave-governance-ui-helpers';
import { WalletType } from '@bgd-labs/frontend-web3-utils';
import { Box, useTheme } from '@mui/system';
import React, { useState } from 'react';
import { zeroAddress } from 'viem';

import { useRootStore } from '../../../store/storeProvider';
import { Link } from '../../../ui';
import { ChainNameWithIcon } from '../../../ui/components/ChainNameWithIcon';
import { disablePageLoader } from '../../../ui/utils/disablePageLoader';
import { ROUTES } from '../../../ui/utils/routes';
import { texts } from '../../../ui/utils/texts';
import { appConfig } from '../../../utils/appConfig';
import { chainInfoHelper } from '../../../utils/configs';
import { ProposalEstimatedStatus } from '../ProposalEstimatedStatus';
import { ProposalStatusWithDate } from '../ProposalStatusWithDate';
import { VoteBar } from '../VoteBar';
import { VotedState } from '../VotedState';
import { Loading } from './Loading';
import { ProposalListItemFinalStatus } from './ProposalListItemFinalStatus';
import { ProposalListItemWrapper } from './ProposalListItemWrapper';
import { VoteButton } from './VoteButton';
import { VotingPower } from './VotingPower';

interface ActiveProposalListItemProps {
  proposalData: ProposalWithLoadings;
  voteButtonClick: (proposalId: number) => void;
  isForHelpModal?: boolean;
}

export function ActiveProposalListItem({
  proposalData,
  voteButtonClick,
  isForHelpModal,
}: ActiveProposalListItemProps) {
  const theme = useTheme();

  const isRendered = useRootStore((state) => state.isRendered);
  const appClients = useRootStore((state) => state.appClients);
  let activeWallet = useRootStore((state) => state.activeWallet);

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

  const proposal = proposalData.proposal;
  const loading = proposalData.loading;
  const balanceLoading = proposalData.balanceLoading;

  const {
    stateTimestamp,
    estimatedState,
    timestampForEstimatedState,
    waitForState,
    votingPower,
    forVotes,
    requiredForVotes,
    forPercent,
    againstVotes,
    requiredAgainstVotes,
    againstPercent,
    votedPower,
  } = formatProposal(proposal);

  const isVotingActive =
    !loading && proposal.combineState === CombineProposalState.Active;
  const isVotingFinished =
    !loading && proposal.combineState > CombineProposalState.Active;
  const isFinished =
    !loading &&
    (proposal.combineState >= CombineProposalState.Executed ||
      proposal.combineState === CombineProposalState.Failed);

  const support = proposal.data.votingMachineData.votedInfo.support;

  const isVoted = votedPower > 0;

  const handleVoteButtonClick = (proposalId: number) => {
    voteButtonClick(proposalId);
    disablePageLoader();
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
          chainId={proposal.data.votingChainId}
        />
        {texts.proposals.votingNotStartedEnd}
      </Box>
    );
  };

  return (
    <div className="ProposalListItem">
      <Box
        component={isForHelpModal ? Box : Link}
        href={ROUTES.proposal(proposal.data.id, proposal.data.ipfsHash)}
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
          isVotingActive={isVotingActive}
          estimatedState={estimatedState}
          isForHelpModal={isForHelpModal}
          isFinished={isFinished}
          disabled={isClicked}>
          {loading ? (
            <Loading />
          ) : (
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
                      mb: isFinished ? 0 : 8,
                      [theme.breakpoints.up('sm')]: {
                        mb: isFinished ? 0 : 12,
                        fontWeight: 600,
                      },
                      [theme.breakpoints.up('lg')]: { mb: isFinished ? 0 : 8 },
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
                      {proposal.data.title}
                    </Box>
                  </Box>

                  {!isFinished && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}>
                      <ProposalStatusWithDate
                        css={{ mt: 8 }}
                        status={proposal.combineState}
                        timestamp={stateTimestamp}
                        waitForState={waitForState}
                        isFinished={isFinished}
                      />

                      {!isFinished && !waitForState && (
                        <Box sx={{ minWidth: 150 }}>
                          <ProposalEstimatedStatus
                            css={{ mt: 8, mr: 12 }}
                            proposalId={proposal.data.id}
                            estimatedStatus={estimatedState}
                            timestamp={timestampForEstimatedState}
                            isForHelpModal={isForHelpModal}
                          />
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>

                {isVotingFinished && isVoted && !isFinished && (
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
                      support={support}
                    />
                  </Box>
                )}

                {!isVotingFinished && (
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
                        {isVotingActive ? (
                          <>
                            <VotingPower
                              balanceLoading={balanceLoading}
                              isVoted={isVoted}
                              votingPower={isVoted ? votedPower : votingPower}
                              isForHelpModal={isForHelpModal}
                              votingChainId={proposal.data.votingChainId}
                            />
                            <Box sx={{ mt: 8 }}>
                              {isVoted ? (
                                <VotedState support={support} />
                              ) : (
                                <VoteButton
                                  balanceLoading={balanceLoading}
                                  votingPower={votingPower}
                                  proposalId={proposal.data.id}
                                  onClick={handleVoteButtonClick}
                                  votingChainId={proposal.data.votingChainId}
                                  isForHelpModal={isForHelpModal}
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
                      <>
                        {isVotingActive && !isVotingFinished ? (
                          <Box
                            component="p"
                            sx={{
                              typography: 'body',
                              color: '$textSecondary',
                              textAlign: 'center',
                            }}>
                            {texts.proposals.walletNotConnected}
                          </Box>
                        ) : (
                          !isVotingActive && (
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
                      </>
                    )}
                  </Box>
                )}

                <>
                  {isFinished ? (
                    <ProposalListItemFinalStatus
                      timestamp={stateTimestamp}
                      status={proposal.combineState}
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
                    </Box>
                  )}
                </>
              </Box>

              {!isFinished && (
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
                        {isVotingActive ? (
                          <>
                            <VotingPower
                              balanceLoading={balanceLoading}
                              isVoted={isVoted}
                              votingPower={isVoted ? votedPower : votingPower}
                              isForHelpModal={isForHelpModal}
                              votingChainId={proposal.data.votingChainId}
                            />
                            {isVoted ? (
                              <VotedState support={support} />
                            ) : (
                              <VoteButton
                                balanceLoading={balanceLoading}
                                votingPower={votingPower}
                                proposalId={proposal.data.id}
                                onClick={handleVoteButtonClick}
                                votingChainId={proposal.data.votingChainId}
                                isForHelpModal={isForHelpModal}
                              />
                            )}
                          </>
                        ) : isVotingFinished ? (
                          <>
                            {isVoted ? (
                              <>
                                <VotingPower
                                  balanceLoading={balanceLoading}
                                  isVoted={isVoted}
                                  votingPower={
                                    isVoted ? votedPower : votingPower
                                  }
                                  isForHelpModal={isForHelpModal}
                                  votingChainId={proposal.data.votingChainId}
                                />
                                <VotedState support={support} />
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
                        {isVotingActive && !isVotingFinished ? (
                          <Box
                            sx={{
                              color: '$textSecondary',
                              typography: 'body',
                            }}>
                            <p>{texts.proposals.walletNotConnected}</p>
                          </Box>
                        ) : (
                          !isVotingActive &&
                          !isVotingFinished && (
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
          )}
        </ProposalListItemWrapper>
      </Box>
    </div>
  );
}
