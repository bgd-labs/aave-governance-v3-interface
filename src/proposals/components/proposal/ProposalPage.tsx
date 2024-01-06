import {
  BasicProposalState,
  formatProposal,
  getProposalStepsAndAmounts,
  InitialPayload,
  ProposalMetadata,
  ProposalState,
  ProposalStateWithName,
  ProposalWithLoadings,
} from '@bgd-labs/aave-governance-ui-helpers';
import { Box, useTheme } from '@mui/system';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Hex } from 'viem';

import { useStore } from '../../../store';
import { BackButton3D, BoxWith3D, NoSSR } from '../../../ui';
import { CustomSkeleton } from '../../../ui/components/CustomSkeleton';
import { TopPanelContainer } from '../../../ui/components/TopPanelContainer';
import { ToTopButton } from '../../../ui/components/ToTopButton';
import { getChainName } from '../../../ui/utils/getChainName';
import { texts } from '../../../ui/utils/texts';
import { selectVotersByProposalId } from '../../store/proposalsSelectors';
import { proposalStatuses } from '../../utils/statuses';
import { ActivateVotingOnVotingMachineModal } from '../actionModals/ActivateVotingOnVotingMachineModal';
import { ExecutePayloadModal } from '../actionModals/ExecutePayloadModal';
import { VoteModal } from '../actionModals/VoteModal';
import { BlockWrapper } from '../BlockWrapper';
import { ProposalHistoryModal } from '../proposalHistory/ProposalHistoryModal';
import { Details } from './Details';
import { DetailsLinks } from './DetailsLinks';
import { DetailsShareLinks } from './DetailsShareLinks';
import { LeftPanelWrapper } from './LeftPanelWrapper';
import { ProposalPayloads } from './ProposalPayloads';
import { ProposalStatusDetails } from './ProposalStatusDetails';
import { ProposalTimeline } from './ProposalTimeline';
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
      executionPayloadTime: proposal.timings.executionPayloadTime,
    });

    const startBlock =
      proposalData.proposal.data.votingMachineData.createdBlock;
    const endBlock =
      proposalData.proposal.data.votingMachineData
        .votingClosedAndSentBlockNumber;

    const totalVotes = forVotes + againstVotes;

    if (startBlock > 0) {
      if (totalVotes > 0 && !proposal.data.prerender) {
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
      (proposal.state >= ProposalState.Executed ||
        proposal.state === ProposalState.Defeated);

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

  const {
    lastPayloadQueuedAt,
    lastPayloadCanceledAt,
    lastPayloadExecutedAt,
    lastPayloadExpiredAt,
    isProposalExecuted,
  } = getProposalStepsAndAmounts({
    proposalData: proposal.data,
    quorum: proposal.config.quorum,
    differential: proposal.config.differential,
    precisionDivider: proposal.precisionDivider,
    cooldownPeriod: proposal.timings.cooldownPeriod,
    executionPayloadTime: proposal.timings.executionPayloadTime,
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

  const isVotingActive = !loading && proposal.state === ProposalState.Active;
  const isVotingFinished = !loading && proposal.state > ProposalState.Active;
  const isFinished =
    !loading &&
    (proposal.state >= ProposalState.Executed ||
      proposal.state === ProposalState.Defeated);

  const now = dayjs().unix();

  const openToVoteTimestamp =
    proposal.data.votingMachineData.startTime > 0
      ? proposal.data.votingMachineData.startTime
      : now >
          proposal.data.creationTime + proposal.config.coolDownBeforeVotingStart
        ? now + 60
        : proposal.data.creationTime +
          proposal.config.coolDownBeforeVotingStart;

  const votingClosedTimestamp =
    proposal.data.votingMachineData.votingClosedAndSentTimestamp > 0
      ? proposal.data.votingMachineData.votingClosedAndSentTimestamp
      : (proposal.data.votingMachineData.endTime > 0 &&
            proposal.data.votingMachineData.sentToGovernance) ||
          (proposal.data.votingMachineData.endTime > 0 &&
            now < proposal.data.votingMachineData.endTime) ||
          (proposal.data.votingMachineData.endTime > 0 && isFinished)
        ? proposal.data.votingMachineData.endTime
        : proposal.data.votingMachineData.endTime > 0 &&
            now > proposal.data.votingMachineData.endTime
          ? now + 60
          : openToVoteTimestamp + proposal.data.votingDuration;

  const payloadsExecutedTimestamp =
    lastPayloadExecutedAt > 0
      ? lastPayloadExecutedAt
      : lastPayloadQueuedAt > 0 &&
          lastPayloadExecutedAt === 0 &&
          lastPayloadQueuedAt + proposal.timings.executionPayloadTime < now
        ? now + 60
        : lastPayloadQueuedAt > 0 &&
            lastPayloadExecutedAt === 0 &&
            lastPayloadQueuedAt + proposal.timings.executionPayloadTime > now
          ? lastPayloadQueuedAt + proposal.timings.executionPayloadTime
          : proposal.data.queuingTime > 0 && lastPayloadQueuedAt === 0
            ? proposal.data.queuingTime + proposal.timings.executionPayloadTime
            : proposal.data.votingMachineData.votingClosedAndSentTimestamp >
                  0 &&
                lastPayloadExecutedAt <= 0 &&
                proposal.data.votingMachineData.votingClosedAndSentTimestamp +
                  proposal.timings.executionPayloadTime <
                  now
              ? now + 60
              : proposal.data.votingMachineData.votingClosedAndSentTimestamp >
                    0 &&
                  lastPayloadExecutedAt <= 0 &&
                  proposal.data.votingMachineData.votingClosedAndSentTimestamp +
                    proposal.timings.executionPayloadTime >
                    now
                ? proposal.data.votingMachineData.votingClosedAndSentTimestamp +
                  proposal.timings.executionPayloadTime
                : proposal.data.votingMachineData.endTime > 0 &&
                    lastPayloadExecutedAt <= 0
                  ? proposal.data.votingMachineData.endTime +
                    proposal.timings.executionPayloadTime
                  : openToVoteTimestamp +
                    proposal.data.votingDuration +
                    proposal.timings.executionPayloadTime;

  const Timeline = () => {
    if (!store.isRendered) {
      return (
        <Box sx={{ mb: 18, [theme.breakpoints.up('lg')]: { mb: 24 } }}>
          <CustomSkeleton height={80} />
        </Box>
      );
    }

    return (
      <NoSSR>
        <ProposalTimeline
          expiredTimestamp={
            proposal.data.basicState === BasicProposalState.Executed
              ? lastPayloadExpiredAt
              : proposal.data.creationTime + proposal.timings.expirationTime
          }
          votingStartTime={proposal.data.votingMachineData.startTime}
          createdTimestamp={proposal.data.creationTime}
          openToVoteTimestamp={openToVoteTimestamp}
          votingClosedTimestamp={votingClosedTimestamp}
          payloadsExecutedTimestamp={payloadsExecutedTimestamp}
          finishedTimestamp={payloadsExecutedTimestamp}
          failedTimestamp={
            proposal.state === ProposalState.Defeated
              ? votingClosedTimestamp
              : undefined
          }
          canceledTimestamp={
            lastPayloadCanceledAt > proposal.data.canceledAt
              ? lastPayloadCanceledAt
              : proposal.data.canceledAt
          }
          isFinished={isFinished}
          state={
            proposalStatuses.find((s) => s.value === proposal?.state)?.title ||
            ProposalStateWithName.Created
          }
        />
      </NoSSR>
    );
  };

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
            <Box component="h2" sx={{ typography: 'h1', mb: 18 }}>
              {ipfsData?.title || proposalData.proposal.data.title}
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
                        Payload id {payload.id} on{' '}
                        {getChainName(payload.chainId)} broken
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
              isStarted={!loading && proposal.state > ProposalState.Created}
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
                proposalBasicStatus={proposal.data.basicState}
                proposalStatus={proposal.state}
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
              <Timeline />
            </Box>

            <DetailsLinks
              discussionLink={ipfsData?.discussions}
              ipfsHash={proposal.data.ipfsHash}
              proposalId={proposal.data.id}
              prerender={proposal.data.prerender}
            />
          </BoxWith3D>

          <RightPanelWrapper>
            <Box
              sx={{
                display: 'none',
                [theme.breakpoints.up('sm')]: { display: 'block' },
              }}>
              <Box
                component="h2"
                sx={{
                  typography: 'h1',
                  mb: 18,
                  [theme.breakpoints.up('lg')]: { typography: 'h1', mb: 24 },
                }}>
                {ipfsData?.title || proposalData.proposal.data.title}
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
              <Timeline />
              <DetailsLinks
                discussionLink={ipfsData?.discussions}
                ipfsHash={proposal.data.ipfsHash}
                proposalId={proposal.data.id}
                prerender={proposal.data.prerender}
              />
            </Box>

            <Details ipfs={ipfsData} ipfsError={ipfsDataError} />
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

      <ProposalHistoryModal
        isOpen={isProposalHistoryModalOpen}
        setIsOpen={setIsProposalHistoryOpen}
        proposalId={proposal.data.id}
      />

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
