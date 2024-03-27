import {
  CombineProposalState,
  formatProposal,
  getProposalStepsAndAmounts,
  InitialPayload,
  ProposalMetadata,
  ProposalWithLoadings,
} from '@bgd-labs/aave-governance-ui-helpers';
import { Box, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Hex } from 'viem';

import { useStore } from '../../../store';
import { BackButton3D, BoxWith3D, NoSSR } from '../../../ui';
import { TopPanelContainer } from '../../../ui/components/TopPanelContainer';
import { ToTopButton } from '../../../ui/components/ToTopButton';
import { getChainName } from '../../../ui/utils/getChainName';
import { texts } from '../../../ui/utils/texts';
import { selectVotersByProposalId } from '../../store/proposalsSelectors';
import { ActivateVotingOnVotingMachineModal } from '../actionModals/ActivateVotingOnVotingMachineModal';
import { ExecutePayloadModal } from '../actionModals/ExecutePayloadModal';
import { VoteModal } from '../actionModals/VoteModal';
import { BlockWrapper } from '../BlockWrapper';
import { ProposalHistoryModal } from '../proposalHistory/ProposalHistoryModal';
import { Timeline } from '../timeline/Timeline';
import { ClaimFeesButton } from './ClaimFeesButton';
import { Details } from './Details';
import { DetailsLinks } from './DetailsLinks';
import { DetailsShareLinks } from './DetailsShareLinks';
import { LeftPanelWrapper } from './LeftPanelWrapper';
import { ProposalPayloads } from './ProposalPayloads';
import { ProposalStatusDetails } from './ProposalStatusDetails';
import { ProposalVoteInfo } from './ProposalVoteInfo';
import { ProposalVotingPower } from './ProposalVotingPower';
import { RightPanelWrapper } from './RightPanelWrapper';

interface ProposalPageProps {
  id: number;
  proposalData: ProposalWithLoadings;
  ipfsData?: ProposalMetadata;
  ipfsDataError?: string;
}

export function ProposalPage({
  id,
  proposalData,
  ipfsData,
  ipfsDataError,
}: ProposalPageProps) {
  const theme = useTheme();
  const router = useRouter();
  const store = useStore();
  const {
    getProposalCreatorBalance,
    creatorBalance,
    isVoteModalOpen,
    setIsVoteModalOpen,
    getVoters,
    startVotersPolling,
    stopVotersPolling,
    isProposalHistoryModalOpen,
    setIsProposalHistoryOpen,
    isActivateVotingOnVotingMachineModalOpen,
    setIsActivateVotingOnVotingMachineModalOpen,
    isExecutePayloadModalOpen,
    setExecutePayloadModalOpen,
    detailedProposalsDataLoadings,
    getVotersLoading,
  } = store;

  const {
    lastBlockNumber: lastVoteBlockNumber,
    voters: votersForCurrentProposal,
  } = selectVotersByProposalId(store, id);

  const [isCreatorBalanceWarningVisible, setCreatorBalanceWarningVisible] =
    useState(false);
  const [selectedPayloadForExecute, setSelectedPayloadForExecute] = useState<
    InitialPayload | undefined
  >(undefined);

  useEffect(() => {
    const { forVotes, againstVotes } = formatProposal(proposalData.proposal);
    const { isVotingActive } = getProposalStepsAndAmounts({
      proposalData: proposal.data,
      quorum: proposal.config.quorum,
      differential: proposal.config.differential,
      precisionDivider: proposal.precisionDivider,
      cooldownPeriod: proposal.timings.cooldownPeriod,
      executionDelay: proposal.timings.executionDelay,
    });

    const startBlock =
      proposalData.proposal.data.votingMachineData.createdBlock;
    const endBlock =
      proposalData.proposal.data.votingMachineData
        .votingClosedAndSentBlockNumber;

    const totalVotes = forVotes + againstVotes;

    if (startBlock > 0) {
      if (totalVotes > 0 && !proposal.data.isFinished && isVotingActive) {
        getVoters(
          proposal.data.id,
          proposal.data.votingChainId,
          startBlock,
          endBlock,
          lastVoteBlockNumber,
        );
      }

      if (isVotingActive) {
        startVotersPolling(
          proposal.data.id,
          proposal.data.votingChainId,
          startBlock,
          endBlock,
          lastVoteBlockNumber,
        );
      } else {
        stopVotersPolling();
      }
    }
    return () => {
      stopVotersPolling();
    };
  }, [
    id,
    proposalData?.proposal.data.votingMachineData.createdBlock,
    proposalData?.proposal.data.votingMachineData
      .votingClosedAndSentBlockNumber,
  ]);

  useEffect(() => {
    const proposal = proposalData.proposal;
    const loading = proposalData.loading;

    const creator = proposalData.proposal.data.creator;

    const isFinished =
      !loading &&
      (proposal.combineState >= CombineProposalState.Executed ||
        proposal.combineState === CombineProposalState.Failed);

    if (!isFinished) {
      getProposalCreatorBalance(
        proposal.data.creator,
        proposal.data.votingMachineData.votingAssets as Hex[],
      );
      if (
        !!creatorBalance[creator] &&
        creatorBalance[creator] <= proposal.config.minPropositionPower
      ) {
        setCreatorBalanceWarningVisible(true);
      }
    }
  }, []);

  const proposal = proposalData.proposal;
  const loading = proposalData.loading;
  const balanceLoading = proposalData.balanceLoading;

  const { isProposalExecuted } = getProposalStepsAndAmounts({
    proposalData: proposal.data,
    quorum: proposal.config.quorum,
    differential: proposal.config.differential,
    precisionDivider: proposal.precisionDivider,
    cooldownPeriod: proposal.timings.cooldownPeriod,
    executionDelay: proposal.timings.executionDelay,
  });

  const {
    forVotes,
    forPercent,
    againstVotes,
    againstPercent,
    requiredForVotes,
    requiredAgainstVotes,
    estimatedState,
    votingPower,
    votedPower,
  } = formatProposal(proposal);

  const isVotingActive =
    !loading && proposal.combineState === CombineProposalState.Active;
  const isVotingFinished =
    !loading && proposal.combineState > CombineProposalState.Active;
  const isFinished =
    !loading && proposal.combineState >= CombineProposalState.Failed;

  return (
    <>
      <Box>
        <TopPanelContainer withoutContainer>
          <BackButton3D onClick={router.back} />
        </TopPanelContainer>

        <Box
          sx={{
            position: 'relative',
            mb: 18,
            [theme.breakpoints.up('sm')]: { display: 'none' },
          }}>
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}>
              <Box component="h2" sx={{ typography: 'h1', mb: 18 }}>
                {ipfsData?.title || proposalData.proposal.data.title}
              </Box>
              <ClaimFeesButton proposal={proposalData} />
            </Box>

            <DetailsShareLinks ipfs={ipfsData} ipfsError={ipfsDataError} />
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            zIndex: 2,
            [theme.breakpoints.up('sm')]: {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            },
          }}>
          <LeftPanelWrapper>
            <NoSSR>
              {proposal.data.payloads.some((payload) => !payload?.state) && (
                <BlockWrapper toBottom contentColor="$mainAgainst">
                  {proposal.data.payloads
                    .filter((payload) => !payload?.state)
                    .map((payload) => (
                      <Box
                        key={payload.id}
                        component="p"
                        sx={{
                          typography: 'descriptor',
                          color: '$light',
                          textAlign: 'center',
                        }}>
                        Cannot get data for Payload id{payload.id} on{' '}
                        {getChainName(payload.chainId)}
                      </Box>
                    ))}
                </BlockWrapper>
              )}
            </NoSSR>

            <ProposalVoteInfo
              title={ipfsData?.title || proposalData.proposal.data.title}
              forPercent={forPercent}
              forVotes={forVotes}
              againstPercent={againstPercent}
              againstVotes={againstVotes}
              requiredForVotes={requiredForVotes}
              requiredAgainstVotes={requiredAgainstVotes}
              estimatedStatus={estimatedState}
              isFinished={isFinished}
              isStarted={
                !loading && proposal.combineState > CombineProposalState.Created
              }
              isVotingFinished={isVotingFinished}
              voters={votersForCurrentProposal}
              votersInitialLoading={
                getVotersLoading[proposal.data.id]?.initialLoading || false
              }
              votersLoading={
                getVotersLoading[proposal.data.id]?.loading || false
              }
            />

            {isCreatorBalanceWarningVisible && (
              <NoSSR>
                <BlockWrapper contentColor="$mainAgainst">
                  <Box
                    component="p"
                    sx={{
                      typography: 'descriptor',
                      color: '$light',
                      textAlign: 'center',
                    }}>
                    {texts.proposals.canBeClosedByPropositionPower}
                  </Box>
                </BlockWrapper>
              </NoSSR>
            )}

            <NoSSR>
              <ProposalPayloads
                proposalId={proposal.data.id}
                isProposalExecuted={isProposalExecuted}
                payloads={proposal.data.payloads}
                setSelectedPayloadForExecute={setSelectedPayloadForExecute}
                proposalQueuingTime={proposal.data.queuingTime}
              />
            </NoSSR>

            <Box
              sx={{
                display: 'none',
                [theme.breakpoints.up('sm')]: { display: 'block' },
              }}>
              <ProposalVotingPower
                balanceLoading={balanceLoading}
                votingPower={votingPower}
                votedPower={votedPower}
                proposalId={proposal.data.id}
                onClick={() => setIsVoteModalOpen(true)}
                support={proposal.data.votingMachineData.votedInfo.support}
                isVoted={votedPower > 0}
                isFinished={isVotingFinished}
                isStarted={isVotingActive}
                isAnyVote={!!votersForCurrentProposal.length}
                votingChainId={proposal.data.votingChainId}
                proposalDataLoading={
                  typeof detailedProposalsDataLoadings[
                    proposalData.proposal.data.id
                  ] === 'undefined'
                    ? true
                    : detailedProposalsDataLoadings[
                        proposalData.proposal.data.id
                      ]
                }
              />
            </Box>

            <NoSSR>
              <ProposalStatusDetails
                creationTime={proposal.data.creationTime}
                coolDownBeforeVotingStart={
                  proposal.config.coolDownBeforeVotingStart
                }
                proposalBasicStatus={proposal.data.state}
                combineProposalStatus={proposal.combineState}
                proposalId={proposal.data.id}
                votingMachineState={proposal.data.votingMachineState}
                proposalResultsSent={
                  proposal.data.votingMachineData.sentToGovernance
                }
                proposalQueuingTime={proposal.data.queuingTime}
                cooldownPeriod={proposal.timings.cooldownPeriod}
                underlyingAssets={
                  proposal.data.votingMachineData.votingAssets as Hex[]
                }
                blockHash={proposal.data.snapshotBlockHash}
                votingBlockHash={proposal.data.votingMachineData.l1BlockHash}
                votingChainId={proposal.data.votingChainId}
                hasRequiredRoots={
                  proposal.data.votingMachineData.hasRequiredRoots
                }
              />
            </NoSSR>
          </LeftPanelWrapper>

          <BoxWith3D
            className="ProposalLoading__SSR"
            contentColor="$mainLight"
            borderSize={10}
            wrapperCss={{
              display: 'block',
              mb: 18,
              [theme.breakpoints.up('sm')]: { display: 'none' },
            }}
            css={{ display: 'flex', flexDirection: 'column', py: 18 }}>
            <Box sx={{ ml: 18 }}>
              <Timeline proposal={proposal} loading={loading} />
            </Box>

            <DetailsLinks
              discussionLink={ipfsData?.discussions}
              snapshot={ipfsData?.snapshot}
              proposalId={proposal.data.id}
              prerender={proposal.data.isFinished}
            />
          </BoxWith3D>

          <RightPanelWrapper>
            <Box
              sx={{
                display: 'none',
                [theme.breakpoints.up('sm')]: { display: 'block' },
              }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  mb: 18,
                  minHeight: 28,
                  [theme.breakpoints.up('lg')]: { mb: 24, minHeight: 32 },
                }}>
                <Box
                  component="h2"
                  sx={{
                    typography: 'h1',
                  }}>
                  {ipfsData?.title || proposalData.proposal.data.title}
                </Box>
                <ClaimFeesButton proposal={proposalData} />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 48 }}>
                <DetailsShareLinks ipfs={ipfsData} ipfsError={ipfsDataError} />
              </Box>
            </Box>

            <Box
              sx={{
                display: 'none',
                [theme.breakpoints.up('sm')]: {
                  display: 'flex',
                  flexDirection: 'column',
                },
              }}>
              <Timeline proposal={proposal} loading={loading} />
              <DetailsLinks
                discussionLink={ipfsData?.discussions}
                snapshot={ipfsData?.snapshot}
                proposalId={proposal.data.id}
                prerender={proposal.data.isFinished}
              />
            </Box>

            <Details
              proposalCreator={proposal.data.creator}
              ipfs={ipfsData}
              ipfsError={ipfsDataError}
            />
          </RightPanelWrapper>

          <Box
            sx={{
              display: 'block',
              mt: 18,
              [theme.breakpoints.up('sm')]: { display: 'none' },
            }}>
            <ProposalVotingPower
              balanceLoading={balanceLoading}
              votingPower={votingPower}
              votedPower={votedPower}
              proposalId={proposal.data.id}
              onClick={() => setIsVoteModalOpen(true)}
              support={proposal.data.votingMachineData.votedInfo.support}
              isVoted={votedPower > 0}
              isFinished={isVotingFinished}
              isStarted={isVotingActive}
              isAnyVote={!!votersForCurrentProposal.length}
              votingChainId={proposal.data.votingChainId}
              proposalDataLoading={
                typeof detailedProposalsDataLoadings[
                  proposalData.proposal.data.id
                ] === 'undefined'
                  ? true
                  : detailedProposalsDataLoadings[proposalData.proposal.data.id]
              }
            />
          </Box>
        </Box>
      </Box>

      <ToTopButton />

      {isVotingActive && (
        <VoteModal
          isOpen={isVoteModalOpen}
          setIsOpen={setIsVoteModalOpen}
          proposalId={proposal.data.id}
        />
      )}

      {isProposalHistoryModalOpen && (
        <ProposalHistoryModal
          isOpen={isProposalHistoryModalOpen}
          setIsOpen={setIsProposalHistoryOpen}
          proposalId={proposal.data.id}
        />
      )}

      <ActivateVotingOnVotingMachineModal
        isOpen={isActivateVotingOnVotingMachineModalOpen}
        setIsOpen={setIsActivateVotingOnVotingMachineModalOpen}
        proposalId={proposal.data.id}
        votingChainId={proposal.data.votingChainId}
      />

      {selectedPayloadForExecute && (
        <ExecutePayloadModal
          isOpen={isExecutePayloadModalOpen}
          setIsOpen={setExecutePayloadModalOpen}
          proposalId={proposal.data.id}
          payload={selectedPayloadForExecute}
        />
      )}
    </>
  );
}
