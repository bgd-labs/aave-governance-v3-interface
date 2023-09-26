import { Box, useTheme } from '@mui/system';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';

import {
  BasicProposalState,
  checkHash,
  InitialPayload,
  Payload,
  PayloadState,
  ProposalState,
  VotingMachineProposalState,
} from '../../../../lib/helpers/src';
import { selectLastTxByTypeAndPayload } from '../../../../lib/web3/src';
import { useStore } from '../../../store';
import { TransactionUnion } from '../../../transactions/store/transactionsSlice';
import { BigButton, BoxWith3D, Timer } from '../../../ui';
import { getChainName } from '../../../ui/utils/getChainName';
import { texts } from '../../../ui/utils/texts';
import { appConfig } from '../../../utils/appConfig';
import { getTokenName } from '../../../utils/getTokenName';
import { getVoteBalanceSlot } from '../../../web3/utils/helperToGetProofs';
import { ActivateVotingModal } from '../actionModals/ActivateVotingModal';
import { CloseVotingModal } from '../actionModals/CloseVotingModal';
import { ExecuteProposalModal } from '../actionModals/ExecuteProposalModal';
import { SendProofsModal } from '../actionModals/SendProofsModal';

type AssetForProof = {
  underlyingAsset: string;
  withSlot: boolean;
  baseBalanceSlotRaw: number;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
};

interface ProposalStatusDetailsProps {
  blockHash: string;
  votingBlockHash: string;
  creationTime: number;
  coolDownBeforeVotingStart: number;
  proposalBasicStatus: BasicProposalState;
  proposalStatus: ProposalState;
  votingMachineState: VotingMachineProposalState;
  proposalId: number;
  proposalResultsSent: boolean;
  proposalQueuingTime: number;
  cooldownPeriod: number;
  executionPayloadTime: number;
  payloads: Payload[];
  underlyingAssets: string[];
  votingChainId: number;
  hasRequiredRoots: boolean;
  setSelectedPayloadForExecute: (payload: InitialPayload | undefined) => void;
}

export function ProposalStatusDetails({
  blockHash,
  votingBlockHash,
  creationTime,
  coolDownBeforeVotingStart,
  proposalBasicStatus,
  proposalStatus,
  proposalId,
  votingMachineState,
  proposalResultsSent,
  proposalQueuingTime,
  cooldownPeriod,
  executionPayloadTime,
  payloads,
  underlyingAssets,
  votingChainId,
  hasRequiredRoots,
  setSelectedPayloadForExecute,
}: ProposalStatusDetailsProps) {
  const theme = useTheme();
  const store = useStore();

  const {
    activeWallet,
    isActivateVotingModalOpen,
    setIsActivateVotingModalOpen,
    isSendAAAVEProofModalOpen,
    setIsSendAAAVEProofModalOpen,
    isSendAAVEProofModalOpen,
    setIsSendAAVEProofModalOpen,
    isSendSTKAAVEProofModalOpen,
    setIsSendSTKAAVEProofModalOpen,
    isSendSTKAAVESlotModalOpen,
    setIsSendSTKAAVESlotModalOpen,
    isSendRepresentationsProofModalOpen,
    setIsSendRepresentationsProofModalOpen,
    setIsActivateVotingOnVotingMachineModalOpen,
    isCloseVotingModalOpen,
    setCloseVotingModalOpen,
    isExecuteProposalModalOpen,
    setExecuteProposalModalOpen,
    setExecutePayloadModalOpen,
    setConnectWalletModalOpen,
    getProposalDataWithIpfsById,
    appMode,
  } = store;

  useEffect(() => {
    return () => {
      setIsActivateVotingModalOpen(false);
      setIsSendAAVEProofModalOpen(false);
      setIsSendAAAVEProofModalOpen(false);
      setIsSendSTKAAVEProofModalOpen(false);
      setIsSendSTKAAVESlotModalOpen(false);
      setCloseVotingModalOpen(false);
      setExecuteProposalModalOpen(false);
    };
  }, []);

  const isExpertMode = appMode === 'expert';

  const isExecuted =
    proposalStatus === ProposalState.Expired ||
    proposalStatus === ProposalState.Executed ||
    proposalStatus === ProposalState.Canceled ||
    proposalStatus === ProposalState.Defeated;

  if (proposalStatus === ProposalState.Active || isExecuted || !isExpertMode)
    return null;

  const lastPayloadQueuedAt = Math.max.apply(
    null,
    payloads.map((payload) => payload?.queuedAt || 0),
  );

  const getTxStatus = ({
    type,
    payload,
  }: Pick<TransactionUnion, 'type' | 'payload'>) => {
    const tx = selectLastTxByTypeAndPayload<TransactionUnion>(
      store,
      activeWallet?.accounts[0] || '',
      type,
      payload,
    );

    const isPending =
      tx &&
      tx.type !== 'delegate' &&
      tx.type !== 'test' &&
      tx.type !== 'createPayload' &&
      tx.type !== 'cancelProposal' &&
      tx.type !== 'representations' &&
      tx.type === type &&
      tx.payload.proposalId === proposalId &&
      tx.pending;

    const isSuccess =
      tx &&
      tx.type !== 'delegate' &&
      tx.type !== 'test' &&
      tx.type !== 'createPayload' &&
      tx.type !== 'cancelProposal' &&
      tx.type !== 'representations' &&
      tx.type === type &&
      tx.payload.proposalId === proposalId &&
      tx.status === 1;

    return { isPending, isSuccess };
  };

  const assetsForProofs: AssetForProof[] = underlyingAssets.map((asset) => {
    const isSTKAAVEToken =
      asset.toLowerCase() === appConfig.additional.stkAAVEAddress.toLowerCase();
    const isAAAVEToken =
      asset.toLowerCase() === appConfig.additional.aAaveAddress.toLowerCase();

    return {
      underlyingAsset: asset,
      withSlot: false,
      baseBalanceSlotRaw: getVoteBalanceSlot(asset, false),
      isModalOpen: isSTKAAVEToken
        ? isSendSTKAAVEProofModalOpen
        : isAAAVEToken
        ? isSendAAAVEProofModalOpen
        : isSendAAVEProofModalOpen,
      setIsModalOpen: isSTKAAVEToken
        ? setIsSendSTKAAVEProofModalOpen
        : isAAAVEToken
        ? setIsSendAAAVEProofModalOpen
        : setIsSendAAVEProofModalOpen,
    };
  });
  const isAssetsForProofsHasSTKAAVE = assetsForProofs.find(
    (asset) =>
      asset.underlyingAsset.toLowerCase() ===
      appConfig.additional.stkAAVEAddress.toLowerCase(),
  );
  if (isAssetsForProofsHasSTKAAVE) {
    assetsForProofs.push({
      underlyingAsset: appConfig.additional.stkAAVEAddress,
      withSlot: true,
      baseBalanceSlotRaw: 0,
      isModalOpen: isSendSTKAAVESlotModalOpen,
      setIsModalOpen: setIsSendSTKAAVESlotModalOpen,
    });
  }
  if (appConfig.govCoreConfig.contractAddress) {
    assetsForProofs.push({
      underlyingAsset: appConfig.govCoreConfig.contractAddress,
      withSlot: false,
      baseBalanceSlotRaw: getVoteBalanceSlot(
        appConfig.govCoreConfig.contractAddress,
        false,
      ),
      isModalOpen: isSendRepresentationsProofModalOpen,
      setIsModalOpen: setIsSendRepresentationsProofModalOpen,
    });
  }

  const actions = () => {
    if (activeWallet?.isActive) {
      if (
        proposalBasicStatus === BasicProposalState.Created &&
        votingMachineState === VotingMachineProposalState.NotCreated &&
        checkHash(blockHash).zero
      ) {
        const now = dayjs().unix();

        return {
          title: texts.proposalActions.proposalCreated,
          button: () => (
            <>
              {now > creationTime + coolDownBeforeVotingStart ? (
                <BigButton
                  loading={
                    getTxStatus({
                      type: 'activateVoting',
                      payload: { proposalId },
                    }).isPending
                  }
                  disabled={
                    getTxStatus({
                      type: 'activateVoting',
                      payload: { proposalId },
                    }).isSuccess
                  }
                  onClick={() => setIsActivateVotingModalOpen(true)}>
                  {texts.proposalActions.activateVoting}
                </BigButton>
              ) : (
                <Box
                  sx={{
                    typography: 'body',
                    textAlign: 'center',
                    color: '$textSecondary',
                  }}>
                  <Timer
                    timestamp={creationTime + coolDownBeforeVotingStart}
                    callbackFuncWhenTimerFinished={() =>
                      getProposalDataWithIpfsById(proposalId)
                    }
                  />{' '}
                  {texts.proposalActions.activateVotingTimer}
                </Box>
              )}
            </>
          ),
        };
      } else if (
        proposalBasicStatus <= BasicProposalState.Active &&
        votingMachineState === VotingMachineProposalState.NotCreated &&
        checkHash(blockHash).notZero &&
        !hasRequiredRoots
      ) {
        return {
          title: texts.proposalActions.proposalActivated,
          button: () => (
            <>
              {assetsForProofs.map((asset, index) => (
                <BigButton
                  css={{ mb: 8, '&:last-of-type': { mb: 0 } }}
                  key={index}
                  loading={
                    getTxStatus({
                      type: 'sendProofs',
                      payload: {
                        proposalId,
                        blockHash: blockHash,
                        underlyingAsset: asset.underlyingAsset,
                        withSlot: asset.withSlot,
                      },
                    }).isPending
                  }
                  disabled={
                    getTxStatus({
                      type: 'sendProofs',
                      payload: {
                        proposalId,
                        blockHash: blockHash,
                        underlyingAsset: asset.underlyingAsset,
                        withSlot: asset.withSlot,
                      },
                    }).isSuccess
                  }
                  onClick={() => asset.setIsModalOpen(true)}>
                  Send {getTokenName(asset.underlyingAsset)}{' '}
                  {asset.withSlot ? 'slot' : 'root'}
                </BigButton>
              ))}
            </>
          ),
        };
      } else if (
        proposalBasicStatus <= BasicProposalState.Active &&
        votingMachineState === VotingMachineProposalState.NotCreated &&
        checkHash(blockHash).notZero &&
        hasRequiredRoots
      ) {
        const returnObject = {
          title: texts.proposalActions.proofsSent,
        };

        if (blockHash === votingBlockHash) {
          return {
            ...returnObject,
            button: () => (
              <BigButton
                disabled={
                  getTxStatus({
                    type: 'activateVotingOnVotingMachine',
                    payload: { proposalId },
                  }).isSuccess
                }
                loading={
                  getTxStatus({
                    type: 'activateVotingOnVotingMachine',
                    payload: { proposalId },
                  }).isPending
                }
                onClick={() =>
                  setIsActivateVotingOnVotingMachineModalOpen(true)
                }>
                {texts.proposalActions.activateVoting}
              </BigButton>
            ),
          };
        } else {
          return {
            ...returnObject,
            button: () => (
              <Box
                sx={{
                  typography: 'body',
                  textAlign: 'center',
                  color: '$textSecondary',
                }}>
                {texts.proposalActions.waitForBridging}
              </Box>
            ),
          };
        }
      } else if (
        votingMachineState === VotingMachineProposalState.Finished &&
        !isExecuted
      ) {
        return {
          title: texts.proposalActions.votingPassed,
          button: () => (
            <BigButton
              disabled={
                getTxStatus({
                  type: 'closeAndSendVote',
                  payload: { proposalId },
                }).isSuccess
              }
              loading={
                getTxStatus({
                  type: 'closeAndSendVote',
                  payload: { proposalId },
                }).isPending
              }
              onClick={() => setCloseVotingModalOpen(true)}>
              {texts.proposalActions.closeVoting}
            </BigButton>
          ),
        };
      } else if (
        proposalResultsSent &&
        proposalQueuingTime === 0 &&
        !isExecuted
      ) {
        return {
          title: texts.proposalActions.votingClosedResultsSent,
          button: () => (
            <Box
              sx={{
                typography: 'body',
                textAlign: 'center',
                color: '$textSecondary',
              }}>
              {texts.proposalActions.proposalTimeLocked}
            </Box>
          ),
        };
      } else if (
        proposalResultsSent &&
        proposalQueuingTime !== 0 &&
        proposalBasicStatus !== BasicProposalState.Executed &&
        !isExecuted
      ) {
        const returnObject = {
          title: texts.proposalActions.proposalTimeLocked,
        };

        if (
          dayjs().unix() > proposalQueuingTime + cooldownPeriod &&
          !isExecuted
        ) {
          return {
            ...returnObject,
            button: () => (
              <BigButton
                disabled={
                  getTxStatus({
                    type: 'executeProposal',
                    payload: { proposalId },
                  }).isSuccess
                }
                loading={
                  getTxStatus({
                    type: 'executeProposal',
                    payload: { proposalId },
                  }).isPending
                }
                onClick={() => setExecuteProposalModalOpen(true)}>
                {texts.proposalActions.executeProposal}
              </BigButton>
            ),
          };
        } else {
          return {
            ...returnObject,
            button: () => (
              <Box
                sx={{
                  typography: 'body',
                  textAlign: 'center',
                  color: '$textSecondary',
                }}>
                <Timer
                  timestamp={proposalQueuingTime + cooldownPeriod}
                  callbackFuncWhenTimerFinished={() =>
                    getProposalDataWithIpfsById(proposalId)
                  }
                />{' '}
                {texts.proposalActions.executeProposalTimer}
              </Box>
            ),
          };
        }
      } else if (
        proposalBasicStatus === BasicProposalState.Executed &&
        lastPayloadQueuedAt === 0 &&
        !isExecuted
      ) {
        return {
          title: texts.proposalActions.proposalExecuted,
          button: () => (
            <Box
              sx={{
                typography: 'body',
                textAlign: 'center',
                color: '$textSecondary',
              }}>
              {texts.proposalActions.payloadsTimeLocked}
            </Box>
          ),
        };
      } else if (
        payloads.some(
          (payload) => payload?.state && payload.state === PayloadState.Queued,
        ) &&
        !isExecuted
      ) {
        const returnObject = {
          title: texts.proposalActions.payloadsTimeLocked,
        };

        if (
          dayjs().unix() > lastPayloadQueuedAt + executionPayloadTime &&
          !isExecuted
        ) {
          return {
            ...returnObject,
            button: () => (
              <>
                {payloads.map((payload) => (
                  <Box
                    key={`${payload.id}_${payload.chainId}`}
                    sx={{ mb: 8, textAlign: 'center' }}>
                    <BigButton
                      css={{ mb: 4 }}
                      disabled={
                        getTxStatus({
                          type: 'executePayload',
                          payload: {
                            proposalId,
                            payloadId: payload.id,
                            chainId: payload.chainId,
                          },
                        }).isSuccess || payload.state === PayloadState.Expired
                      }
                      loading={
                        getTxStatus({
                          type: 'executePayload',
                          payload: {
                            proposalId,
                            payloadId: payload.id,
                            chainId: payload.chainId,
                          },
                        }).isPending
                      }
                      onClick={() => {
                        setSelectedPayloadForExecute({
                          chainId: payload.chainId,
                          payloadsController: payload.payloadsController,
                          id: payload.id,
                        });
                        setExecutePayloadModalOpen(true);
                      }}>
                      {texts.proposalActions.executePayload} {payload.id}
                    </BigButton>
                    <Box component="p" sx={{ typography: 'descriptor' }}>
                      on {getChainName(payload.chainId)}
                    </Box>
                    {payload.state === PayloadState.Expired && (
                      <Box component="p" sx={{ typography: 'body' }}>
                        {texts.proposalActions.expiredPayload}
                      </Box>
                    )}
                  </Box>
                ))}
              </>
            ),
          };
        } else {
          return {
            ...returnObject,
            button: () => (
              <Box
                sx={{
                  typography: 'body',
                  textAlign: 'center',
                  color: '$textSecondary',
                }}>
                <Timer
                  timestamp={lastPayloadQueuedAt + executionPayloadTime}
                  callbackFuncWhenTimerFinished={() =>
                    getProposalDataWithIpfsById(proposalId)
                  }
                />{' '}
                {texts.proposalActions.executePayloadsTimer}
              </Box>
            ),
          };
        }
      }
    } else {
      return {
        title: texts.proposalActions.noWalletTitle,
        button: () => (
          <BigButton onClick={() => setConnectWalletModalOpen(true)}>
            {texts.proposalActions.noWalletButtonTitle}
          </BigButton>
        ),
      };
    }
  };

  return (
    <>
      {actions() && (
        <BoxWith3D
          borderSize={10}
          contentColor="$mainLight"
          wrapperCss={{
            mt: 16,
            [theme.breakpoints.up('sm')]: {
              mt: 20,
            },
          }}
          css={{
            display: 'flex',
            p: 20,
            flexDirection: 'column',
            alignItems: 'flex-start',
            minHeight: 71,
            flexWrap: 'wrap',
            [theme.breakpoints.up('sm')]: {
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              minHeight: 95,
            },
            [theme.breakpoints.up('lg')]: {
              minHeight: 118,
            },
          }}>
          <Box
            component="h3"
            sx={{
              typography: 'h3',
              mb: 12,
              fontWeight: 600,
              [theme.breakpoints.up('sm')]: {
                typography: 'h3',
                fontWeight: 600,
                mb: 16,
                textAlign: 'center',
              },
              [theme.breakpoints.up('lg')]: {
                typography: 'h3',
                fontWeight: 600,
                mb: 22,
              },
            }}>
            {actions()?.title}
          </Box>
          {actions()?.button()}
        </BoxWith3D>
      )}

      <ActivateVotingModal
        isOpen={isActivateVotingModalOpen}
        setIsOpen={setIsActivateVotingModalOpen}
        proposalId={proposalId}
      />

      {assetsForProofs.map((asset, index) => (
        <SendProofsModal
          key={index}
          isOpen={asset.isModalOpen}
          setIsOpen={asset.setIsModalOpen}
          proposalId={proposalId}
          blockHash={blockHash}
          underlyingAsset={asset.underlyingAsset}
          baseBalanceSlotRaw={asset.baseBalanceSlotRaw}
          withSlot={asset.withSlot}
          votingChainId={votingChainId}
        />
      ))}

      <CloseVotingModal
        isOpen={isCloseVotingModalOpen}
        setIsOpen={setCloseVotingModalOpen}
        proposalId={proposalId}
        votingChainId={votingChainId}
      />

      <ExecuteProposalModal
        isOpen={isExecuteProposalModalOpen}
        setIsOpen={setExecuteProposalModalOpen}
        proposalId={proposalId}
      />
    </>
  );
}
