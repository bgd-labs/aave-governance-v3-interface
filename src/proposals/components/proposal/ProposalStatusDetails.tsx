import {
  checkHash,
  CombineProposalState,
  getVoteBalanceSlot,
  ProposalState,
  VotingMachineProposalState,
} from '@bgd-labs/aave-governance-ui-helpers';
import {
  selectLastTxByTypeAndPayload,
  TransactionStatus,
} from '@bgd-labs/frontend-web3-utils';
import { Box, useTheme } from '@mui/system';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';

import { useStore } from '../../../store';
import {
  TransactionUnion,
  TxType,
} from '../../../transactions/store/transactionsSlice';
import { BigButton, BoxWith3D, Timer } from '../../../ui';
import { texts } from '../../../ui/utils/texts';
import { appConfig } from '../../../utils/appConfig';
import { getAssetName } from '../../../utils/getAssetName';
import { assetsBalanceSlots } from '../../../web3/utils/assetsBalanceSlots';
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
  proposalBasicStatus: ProposalState;
  combineProposalStatus: CombineProposalState;
  votingMachineState: VotingMachineProposalState;
  proposalId: number;
  proposalResultsSent: boolean;
  proposalQueuingTime: number;
  cooldownPeriod: number;
  underlyingAssets: string[];
  votingChainId: number;
  hasRequiredRoots: boolean;
}

export function ProposalStatusDetails({
  blockHash,
  votingBlockHash,
  creationTime,
  coolDownBeforeVotingStart,
  proposalBasicStatus,
  combineProposalStatus,
  proposalId,
  votingMachineState,
  proposalResultsSent,
  proposalQueuingTime,
  cooldownPeriod,
  underlyingAssets,
  votingChainId,
  hasRequiredRoots,
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
    combineProposalStatus === CombineProposalState.Expired ||
    combineProposalStatus === CombineProposalState.Executed ||
    combineProposalStatus === CombineProposalState.Canceled ||
    combineProposalStatus === CombineProposalState.Failed;

  if (
    combineProposalStatus === CombineProposalState.Active ||
    isExecuted ||
    !isExpertMode
  )
    return null;

  const getTxStatus = ({
    type,
    payload,
  }: Pick<TransactionUnion, 'type' | 'payload'>) => {
    const tx =
      activeWallet &&
      selectLastTxByTypeAndPayload<TransactionUnion>(
        store,
        activeWallet.address,
        type,
        payload,
      );

    const isPending =
      tx &&
      tx.type !== TxType.delegate &&
      tx.type !== TxType.test &&
      tx.type !== TxType.createPayload &&
      tx.type !== TxType.cancelProposal &&
      tx.type !== TxType.representations &&
      tx.type === type &&
      tx.payload.proposalId === proposalId &&
      tx.pending;

    const isSuccess =
      tx &&
      tx.type !== TxType.delegate &&
      tx.type !== TxType.test &&
      tx.type !== TxType.createPayload &&
      tx.type !== TxType.cancelProposal &&
      tx.type !== TxType.representations &&
      tx.type === type &&
      tx.payload.proposalId === proposalId &&
      tx.status === TransactionStatus.Success;

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
      baseBalanceSlotRaw: getVoteBalanceSlot(
        asset,
        false,
        appConfig.additional.aAaveAddress,
        assetsBalanceSlots,
      ),
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
        appConfig.additional.aAaveAddress,
        assetsBalanceSlots,
      ),
      isModalOpen: isSendRepresentationsProofModalOpen,
      setIsModalOpen: setIsSendRepresentationsProofModalOpen,
    });
  }

  const actions = () => {
    if (activeWallet?.isActive) {
      if (
        proposalBasicStatus === ProposalState.Created &&
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
                      type: TxType.activateVoting,
                      payload: { proposalId },
                    }).isPending
                  }
                  disabled={
                    getTxStatus({
                      type: TxType.activateVoting,
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
        proposalBasicStatus <= ProposalState.Active &&
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
                      type: TxType.sendProofs,
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
                      type: TxType.sendProofs,
                      payload: {
                        proposalId,
                        blockHash: blockHash,
                        underlyingAsset: asset.underlyingAsset,
                        withSlot: asset.withSlot,
                      },
                    }).isSuccess
                  }
                  onClick={() => asset.setIsModalOpen(true)}>
                  Send {getAssetName(asset.underlyingAsset)}{' '}
                  {asset.withSlot ? 'slot' : 'root'}
                </BigButton>
              ))}
            </>
          ),
        };
      } else if (
        proposalBasicStatus <= ProposalState.Active &&
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
                    type: TxType.activateVotingOnVotingMachine,
                    payload: { proposalId },
                  }).isSuccess
                }
                loading={
                  getTxStatus({
                    type: TxType.activateVotingOnVotingMachine,
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
                  type: TxType.closeAndSendVote,
                  payload: { proposalId },
                }).isSuccess
              }
              loading={
                getTxStatus({
                  type: TxType.closeAndSendVote,
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
        proposalBasicStatus !== ProposalState.Executed &&
        !isExecuted
      ) {
        const returnObject = {
          title: texts.proposalActions.proposalCanBeExecuted,
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
                    type: TxType.executeProposal,
                    payload: { proposalId },
                  }).isSuccess
                }
                loading={
                  getTxStatus({
                    type: TxType.executeProposal,
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
            my: 18,
            [theme.breakpoints.up('lg')]: {
              my: 24,
            },
          }}
          css={{
            display: 'flex',
            p: 18,
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
              p: '24px 30px',
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
                mb: 18,
                textAlign: 'center',
              },
              [theme.breakpoints.up('lg')]: {
                typography: 'h3',
                fontWeight: 600,
                mb: 24,
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
