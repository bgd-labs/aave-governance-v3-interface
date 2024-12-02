import {
  selectLastTxByTypeAndPayload,
  TransactionStatus,
} from '@bgd-labs/frontend-web3-utils';
import { Box, useTheme } from '@mui/system';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { zeroHash } from 'viem';

import { appConfig } from '../../configs/appConfig';
import { getVoteBalanceSlot } from '../../helpers/getVoteBalanceSlot';
import { texts } from '../../helpers/texts/texts';
import { useStore } from '../../providers/ZustandStoreProvider';
import { TransactionUnion, TxType } from '../../store/transactionsSlice';
import { InitialProposalState, ProposalState } from '../../types';
import { BigButton } from '../BigButton';
import { BoxWith3D } from '../BoxWith3D';
import { Timer } from '../Timer';

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
  votingStartTime: number;
  votingClosedAndSentBlockNumber: number;
  proposalBasicStatus: InitialProposalState;
  combineProposalStatus: ProposalState;
  proposalId: number;
  proposalResultsSent: boolean;
  proposalQueuingTime: number;
  cooldownPeriod: number;
  underlyingAssets: string[];
  votingChainId: number;
  hasRequiredRoots: boolean;
  setIsActivateVotingOnVotingMachineModalOpen: (value: boolean) => void;
}

export function ProposalStatusDetails({
  blockHash,
  votingBlockHash,
  creationTime,
  coolDownBeforeVotingStart,
  votingStartTime,
  proposalBasicStatus,
  combineProposalStatus,
  proposalId,
  proposalResultsSent,
  proposalQueuingTime,
  cooldownPeriod,
  underlyingAssets,
  hasRequiredRoots,
  votingClosedAndSentBlockNumber,
  setIsActivateVotingOnVotingMachineModalOpen,
}: ProposalStatusDetailsProps) {
  const theme = useTheme();

  const transactionsPool = useStore((store) => store.transactionsPool);
  const activeWallet = useStore((store) => store.activeWallet);
  const appMode = useStore((store) => store.appMode);
  const getProposalDetails = useStore((store) => store.getProposalDetails);
  const setConnectWalletModalOpen = useStore(
    (store) => store.setConnectWalletModalOpen,
  );

  const [isActivateVotingModalOpen, setIsActivateVotingModalOpen] =
    useState(false);
  const [isSendAAAVEProofModalOpen, setIsSendAAAVEProofModalOpen] =
    useState(false);
  const [isSendAAVEProofModalOpen, setIsSendAAVEProofModalOpen] =
    useState(false);
  const [isSendSTKAAVEProofModalOpen, setIsSendSTKAAVEProofModalOpen] =
    useState(false);
  const [isSendSTKAAVESlotModalOpen, setIsSendSTKAAVESlotModalOpen] =
    useState(false);
  const [
    isSendRepresentationsProofModalOpen,
    setIsSendRepresentationsProofModalOpen,
  ] = useState(false);
  const [isCloseVotingModalOpen, setCloseVotingModalOpen] = useState(false);
  const [isExecuteProposalModalOpen, setExecuteProposalModalOpen] =
    useState(false);

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
    combineProposalStatus === ProposalState.Expired ||
    combineProposalStatus === ProposalState.Executed ||
    combineProposalStatus === ProposalState.Canceled ||
    combineProposalStatus === ProposalState.Failed;

  if (
    combineProposalStatus === ProposalState.Voting ||
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
        transactionsPool,
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
      tx.type !== TxType.claimFees &&
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
      tx.type !== TxType.claimFees &&
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
      baseBalanceSlotRaw: getVoteBalanceSlot(asset),
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
      ),
      isModalOpen: isSendRepresentationsProofModalOpen,
      setIsModalOpen: setIsSendRepresentationsProofModalOpen,
    });
  }

  const actions = () => {
    if (activeWallet?.isActive) {
      if (
        proposalBasicStatus === InitialProposalState.Created &&
        votingStartTime === 0 &&
        blockHash === zeroHash
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
                    expiryTimestamp={creationTime + coolDownBeforeVotingStart}
                    onExpire={() => getProposalDetails(proposalId)}
                  />{' '}
                  {texts.proposalActions.activateVotingTimer}
                </Box>
              )}
            </>
          ),
        };
      } else if (
        proposalBasicStatus <= InitialProposalState.Active &&
        votingStartTime === 0 &&
        blockHash !== zeroHash &&
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
                  {/*Send {getAssetName(asset.underlyingAsset)}{' '}*/}
                  {asset.withSlot ? 'slot' : 'root'}
                </BigButton>
              ))}
            </>
          ),
        };
      } else if (
        proposalBasicStatus <= InitialProposalState.Active &&
        votingStartTime === 0 &&
        blockHash !== zeroHash &&
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
      } else if (votingClosedAndSentBlockNumber === 0 && !isExecuted) {
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
        proposalBasicStatus !== InitialProposalState.Executed &&
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
                  expiryTimestamp={proposalQueuingTime + cooldownPeriod}
                  onExpire={() => getProposalDetails(proposalId)}
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

      {/*<ActivateVotingModal*/}
      {/*  isOpen={isActivateVotingModalOpen}*/}
      {/*  setIsOpen={setIsActivateVotingModalOpen}*/}
      {/*  proposalId={proposalId}*/}
      {/*/>*/}

      {/*{assetsForProofs.map((asset, index) => (*/}
      {/*  <SendProofsModal*/}
      {/*    key={index}*/}
      {/*    isOpen={asset.isModalOpen}*/}
      {/*    setIsOpen={asset.setIsModalOpen}*/}
      {/*    proposalId={proposalId}*/}
      {/*    blockHash={blockHash}*/}
      {/*    underlyingAsset={asset.underlyingAsset}*/}
      {/*    baseBalanceSlotRaw={asset.baseBalanceSlotRaw}*/}
      {/*    withSlot={asset.withSlot}*/}
      {/*    votingChainId={votingChainId}*/}
      {/*  />*/}
      {/*))}*/}

      {/*<CloseVotingModal*/}
      {/*  isOpen={isCloseVotingModalOpen}*/}
      {/*  setIsOpen={setCloseVotingModalOpen}*/}
      {/*  proposalId={proposalId}*/}
      {/*  votingChainId={votingChainId}*/}
      {/*/>*/}

      {/*<ExecuteProposalModal*/}
      {/*  isOpen={isExecuteProposalModalOpen}*/}
      {/*  setIsOpen={setExecuteProposalModalOpen}*/}
      {/*  proposalId={proposalId}*/}
      {/*/>*/}
    </>
  );
}
