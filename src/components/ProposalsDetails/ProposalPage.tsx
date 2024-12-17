import { getChainName } from '@bgd-labs/react-web3-icons/dist/utils';
import { Box, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { formatUnits, Hex } from 'viem';

import { DECIMALS } from '../../configs/configs';
import { texts } from '../../helpers/texts/texts';
import { useStore } from '../../providers/ZustandStoreProvider';
import { ActivateVotingOnVotingMachineModal } from '../../transactions/components/ActionModals/ActivateVotingOnVotingMachineModal';
import { ExecutePayloadModal } from '../../transactions/components/ActionModals/ExecutePayloadModal';
import { VoteModal } from '../../transactions/components/ActionModals/VoteModal';
import {
  ContractsConstants,
  DetailedProposalData,
  InitialPayload,
  ProposalState,
  VotedDataByUser,
  VotersData,
  VotingConfig,
  VotingDataByUser,
} from '../../types';
import { BackButton3D } from '../BackButton3D';
import { BlockWrapper } from '../BlockWrapper';
import { BoxWith3D } from '../BoxWith3D';
import NoSSR from '../primitives/NoSSR';
import { TopPanelContainer } from '../TopPanelContainer';
import { ToTopButton } from '../ToTopButton';
import { ClaimFeesButton } from './ClaimFeesButton';
import { Details } from './Details';
import { DetailsLinks } from './DetailsLinks';
import { DetailsShareLinks } from './DetailsShareLinks';
import { ProposalHistoryModal } from './History/ProposalHistoryModal';
import { LeftPanelWrapper } from './LeftPanelWrapper';
import { ProposalPayloads } from './ProposalPayloads';
import { ProposalStatusDetails } from './ProposalStatusDetails';
import { ProposalVoteInfo } from './ProposalVoteInfo';
import { ProposalVotingPower } from './ProposalVotingPower';
import { RightPanelWrapper } from './RightPanelWrapper';
import { Timeline } from './Timeline/Timeline';

interface ProposalPageProps {
  data: DetailedProposalData;
  votingConfig: VotingConfig;
  constants: ContractsConstants;
  balanceLoading: boolean;
  votingPower: bigint;
  isCreatorBalanceWarningVisible: boolean;
  userProposalData: {
    voted?: VotedDataByUser;
    voting?: VotingDataByUser[];
  };
  voters: VotersData[];
  votersInitialLoading: boolean;
  votersLoading: boolean;
}

export function ProposalPage({
  data,
  votingConfig,
  constants,
  balanceLoading,
  votingPower,
  isCreatorBalanceWarningVisible,
  userProposalData,
  voters,
  votersInitialLoading,
  votersLoading,
}: ProposalPageProps) {
  const theme = useTheme();
  const router = useRouter();

  const isProposalHistoryModalOpen = useStore(
    (store) => store.isProposalHistoryModalOpen,
  );
  const setIsProposalHistoryOpen = useStore(
    (store) => store.setIsProposalHistoryOpen,
  );

  const [
    isActivateVotingOnVotingMachineModalOpen,
    setIsActivateVotingOnVotingMachineModalOpen,
  ] = useState(false);
  const [selectedPayloadForExecute, setSelectedPayloadForExecute] = useState<
    InitialPayload | undefined
  >(undefined);
  const [isExecutePayloadModalOpen, setIsExecutePayloadModalOpen] =
    useState(false);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);

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
                {data.metadata.title ?? `Proposal ${data.proposalData.id}`}
              </Box>
              <ClaimFeesButton
                proposal={data.proposalData}
                isFinished={data.formattedData.isFinished}
              />
            </Box>

            <DetailsShareLinks
              ipfs={data.metadata}
              ipfsError={data.ipfsError}
            />
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
              {data.payloadsData.some((payload) => !payload?.data.state) && (
                <BlockWrapper toBottom contentColor="$mainAgainst">
                  {data.proposalData.payloads
                    .filter(
                      (payload) =>
                        !data.payloadsData.filter(
                          (p) =>
                            Number(p.id) === Number(payload.payloadId) &&
                            Number(p.chain) === Number(payload.chain) &&
                            p.payloadsController === payload.payloadsController,
                        )[0].data.state,
                    )
                    .map((payload) => (
                      <Box
                        key={payload.payloadId}
                        component="p"
                        sx={{
                          typography: 'descriptor',
                          color: '$light',
                          textAlign: 'center',
                        }}>
                        Cannot get data for Payload id{payload.payloadId} on{' '}
                        {getChainName({ chainId: Number(payload.chain) })}
                      </Box>
                    ))}
                </BlockWrapper>
              )}
            </NoSSR>

            <ProposalVoteInfo
              title={data.metadata.title ?? `Proposal ${data.proposalData.id}`}
              forPercent={data.formattedData.forPercent}
              forVotes={data.formattedData.forVotes}
              againstPercent={data.formattedData.againstPercent}
              againstVotes={data.formattedData.againstVotes}
              requiredForVotes={data.formattedData.requiredForVotes}
              requiredAgainstVotes={data.formattedData.requiredAgainstVotes}
              nextState={data.formattedData.nextState.state}
              isFinished={data.formattedData.isFinished}
              isStarted={data.formattedData.state.state > ProposalState.Created}
              isVotingFinished={data.formattedData.isVotingFinished}
              voters={voters}
              votersInitialLoading={votersInitialLoading}
              votersLoading={votersLoading}
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
                proposalId={data.proposalData.id}
                isProposalExecuted={data.formattedData.isProposalExecuted}
                payloads={data.payloadsData}
                setSelectedPayloadForExecute={setSelectedPayloadForExecute}
                proposalQueuingTime={data.proposalData.queuingTime}
              />
            </NoSSR>

            <Box
              sx={{
                display: 'none',
                [theme.breakpoints.up('sm')]: { display: 'block' },
              }}>
              <ProposalVotingPower
                balanceLoading={balanceLoading}
                votingPower={+formatUnits(votingPower, DECIMALS)}
                proposalId={data.proposalData.id}
                onClick={() => setIsVoteModalOpen(true)}
                userProposalData={userProposalData}
                isFinished={data.formattedData.isVotingFinished}
                isStarted={data.formattedData.isVotingStarted}
                votingChainId={data.votingData.votingChainId}
                isAnyVote={
                  data.votingData.proposalData.forVotes !== 0n ||
                  data.votingData.proposalData.againstVotes !== 0n
                }
              />
            </Box>

            <NoSSR>
              <ProposalStatusDetails
                creationTime={data.proposalData.creationTime}
                coolDownBeforeVotingStart={
                  votingConfig.coolDownBeforeVotingStart
                }
                proposalBasicStatus={data.proposalData.state}
                combineProposalStatus={data.formattedData.state.state}
                proposalId={data.proposalData.id}
                proposalResultsSent={
                  data.votingData.proposalData.sentToGovernance
                }
                proposalQueuingTime={data.proposalData.queuingTime}
                cooldownPeriod={Number(constants.cooldownPeriod)}
                underlyingAssets={data.votingData.votingAssets as Hex[]}
                blockHash={data.proposalData.snapshotBlockHash}
                votingChainId={data.votingData.votingChainId}
                hasRequiredRoots={data.votingData.hasRequiredRoots}
                votingBlockHash={data.votingData.voteConfig.l1ProposalBlockHash}
                votingStartTime={data.votingData.proposalData.startTime}
                votingClosedAndSentBlockNumber={Number(
                  data.votingData.proposalData.votingClosedAndSentBlockNumber,
                )}
                setIsActivateVotingOnVotingMachineModalOpen={
                  setIsActivateVotingOnVotingMachineModalOpen
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
              <Timeline
                data={data}
                config={votingConfig}
                expirationTime={Number(constants.expirationTime)}
              />
            </Box>

            <DetailsLinks
              discussionLink={data.metadata.discussions}
              snapshot={data.metadata?.snapshot}
              proposalId={data.proposalData.id}
              prerender={data.formattedData.isFinished}
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
                  {data.metadata.title ?? `Proposal ${data.proposalData.id}`}
                </Box>
                <ClaimFeesButton
                  proposal={data.proposalData}
                  isFinished={data.formattedData.isFinished}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 48 }}>
                <DetailsShareLinks
                  ipfs={data.metadata}
                  ipfsError={data.ipfsError}
                />
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
              <Timeline
                data={data}
                config={votingConfig}
                expirationTime={Number(constants.expirationTime)}
              />
              <DetailsLinks
                discussionLink={data.metadata.discussions}
                snapshot={data.metadata?.snapshot}
                proposalId={data.proposalData.id}
                prerender={data.formattedData.isFinished}
              />
            </Box>

            <Details
              proposalCreator={data.proposalData.creator}
              ipfs={data.metadata}
              ipfsError={data.ipfsError}
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
              votingPower={+formatUnits(votingPower, DECIMALS)}
              proposalId={data.proposalData.id}
              onClick={() => setIsVoteModalOpen(true)}
              userProposalData={userProposalData}
              isFinished={data.formattedData.isVotingFinished}
              isStarted={data.formattedData.isVotingStarted}
              votingChainId={data.votingData.votingChainId}
              isAnyVote={
                data.votingData.proposalData.forVotes !== 0n ||
                data.votingData.proposalData.againstVotes !== 0n
              }
            />
          </Box>
        </Box>
      </Box>

      <ToTopButton />

      {data.formattedData.isVotingActive && (
        <VoteModal
          isOpen={isVoteModalOpen}
          setIsOpen={setIsVoteModalOpen}
          proposalId={data.proposalData.id}
        />
      )}

      {isProposalHistoryModalOpen && (
        <ProposalHistoryModal
          proposal={data}
          isOpen={isProposalHistoryModalOpen}
          setIsOpen={setIsProposalHistoryOpen}
        />
      )}

      <ActivateVotingOnVotingMachineModal
        isOpen={isActivateVotingOnVotingMachineModalOpen}
        setIsOpen={setIsActivateVotingOnVotingMachineModalOpen}
        proposalId={data.proposalData.id}
        votingChainId={data.votingData.votingChainId}
      />

      {selectedPayloadForExecute && (
        <ExecutePayloadModal
          isOpen={isExecutePayloadModalOpen}
          setIsOpen={setIsExecutePayloadModalOpen}
          proposalId={data.proposalData.id}
          payload={selectedPayloadForExecute}
        />
      )}
    </>
  );
}
