import {
  HistoryItemType,
  ProposalWithLoadings,
  TxInfo,
} from '@bgd-labs/aave-governance-ui-helpers';
import { useRequest } from 'alova';
import React, { useEffect } from 'react';

import { useRootStore } from '../../../store/storeProvider';
import { isForIPFS } from '../../../utils/appConfig';
import { getProposalEventsCache } from '../../../utils/githubCacheRequests';
import { getProposalDataById } from '../../store/proposalsSelectors';
import { DetailsModalWrapper } from '../DetailsModalWrapper';
import { getHistoryId } from './helpers';
import { ProposalHistoryItem } from './ProposalHistoryItem';

const historyTypes = [
  HistoryItemType.PAYLOADS_CREATED,
  HistoryItemType.CREATED,
  HistoryItemType.PROPOSAL_ACTIVATE,
  HistoryItemType.OPEN_TO_VOTE,
  HistoryItemType.VOTING_OVER,
  HistoryItemType.VOTING_CLOSED,
  HistoryItemType.RESULTS_SENT,
  HistoryItemType.PROPOSAL_QUEUED,
  HistoryItemType.PROPOSAL_EXECUTED,
  HistoryItemType.PAYLOADS_QUEUED,
  HistoryItemType.PAYLOADS_EXECUTED,
  HistoryItemType.PROPOSAL_CANCELED,
  HistoryItemType.PAYLOADS_EXPIRED,
  HistoryItemType.PROPOSAL_EXPIRED,
];

const getHistoryLinkFunc = (
  setPayloadsCreatedHistoryHash: (
    proposal: ProposalWithLoadings,
    txInfo: TxInfo,
  ) => void,
  setProposalCreatedHistoryHash: (
    proposal: ProposalWithLoadings,
    txInfo: TxInfo,
  ) => void,
  setProposalActivatedHistoryHash: (
    proposal: ProposalWithLoadings,
    txInfo: TxInfo,
  ) => void,
  setProposalActivatedOnVMHistoryHash: (
    proposal: ProposalWithLoadings,
    txInfo: TxInfo,
  ) => void,
  setProposalVotingClosedHistoryHash: (
    proposal: ProposalWithLoadings,
    txInfo: TxInfo,
  ) => void,
  setProposalQueuedHistoryHash: (
    proposal: ProposalWithLoadings,
    txInfo: TxInfo,
  ) => void,
  setPayloadsQueuedHistoryHash: (
    proposal: ProposalWithLoadings,
    txInfo: TxInfo,
  ) => void,
  setPayloadsExecutedHistoryHash: (
    proposal: ProposalWithLoadings,
    txInfo: TxInfo,
  ) => void,
  type: HistoryItemType,
  txInfo: TxInfo,
  proposalData: ProposalWithLoadings,
) => {
  switch (type) {
    case HistoryItemType.PAYLOADS_CREATED:
      return () => setPayloadsCreatedHistoryHash(proposalData, txInfo);
    case HistoryItemType.CREATED:
      return () => setProposalCreatedHistoryHash(proposalData, txInfo);
    case HistoryItemType.PROPOSAL_ACTIVATE:
      return () => setProposalActivatedHistoryHash(proposalData, txInfo);
    case HistoryItemType.OPEN_TO_VOTE:
      return () => setProposalActivatedOnVMHistoryHash(proposalData, txInfo);
    case HistoryItemType.VOTING_CLOSED:
      return () => setProposalVotingClosedHistoryHash(proposalData, txInfo);
    case HistoryItemType.PROPOSAL_QUEUED:
      return () => setProposalQueuedHistoryHash(proposalData, txInfo);
    case HistoryItemType.PAYLOADS_QUEUED:
      return () => setPayloadsQueuedHistoryHash(proposalData, txInfo);
    case HistoryItemType.PAYLOADS_EXECUTED:
      return () => setPayloadsExecutedHistoryHash(proposalData, txInfo);

    default:
      return undefined;
  }
};

interface ProposalHistoryModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  proposalId: number;
}

function ProposalHistoryModalInit({
  isOpen,
  setIsOpen,
  proposalId,
  proposalData,
}: ProposalHistoryModalProps & {
  proposalData?: ProposalWithLoadings;
}) {
  const proposalHistory = useRootStore((store) => store.proposalHistory);
  const setPayloadsCreatedHistoryHash = useRootStore(
    (store) => store.setPayloadsCreatedHistoryHash,
  );
  const setProposalCreatedHistoryHash = useRootStore(
    (store) => store.setProposalCreatedHistoryHash,
  );
  const setProposalActivatedHistoryHash = useRootStore(
    (store) => store.setProposalActivatedHistoryHash,
  );
  const setProposalActivatedOnVMHistoryHash = useRootStore(
    (store) => store.setProposalActivatedOnVMHistoryHash,
  );
  const setProposalVotingClosedHistoryHash = useRootStore(
    (store) => store.setProposalVotingClosedHistoryHash,
  );
  const setProposalQueuedHistoryHash = useRootStore(
    (store) => store.setProposalQueuedHistoryHash,
  );
  const setPayloadsQueuedHistoryHash = useRootStore(
    (store) => store.setPayloadsQueuedHistoryHash,
  );
  const setPayloadsExecutedHistoryHash = useRootStore(
    (store) => store.setPayloadsExecutedHistoryHash,
  );

  if (!proposalData?.proposal) return null;

  return (
    <DetailsModalWrapper
      proposalId={proposalId}
      isOpen={isOpen}
      setIsOpen={setIsOpen}>
      {historyTypes.map((type) => {
        return Object.entries(proposalHistory).map((item) => {
          const txInfo = item[1].txInfo;
          if (txInfo) {
            const historyId = getHistoryId({
              proposalId,
              type,
              id: txInfo.id,
              chainId: txInfo.chainId,
            });
            const historyItem = proposalHistory[historyId];

            return (
              <React.Fragment key={item[0]}>
                {item[0] === historyId && (
                  <ProposalHistoryItem
                    proposalId={proposalId}
                    item={historyItem}
                    onClick={getHistoryLinkFunc(
                      setPayloadsCreatedHistoryHash,
                      setProposalCreatedHistoryHash,
                      setProposalActivatedHistoryHash,
                      setProposalActivatedOnVMHistoryHash,
                      setProposalVotingClosedHistoryHash,
                      setProposalQueuedHistoryHash,
                      setPayloadsQueuedHistoryHash,
                      setPayloadsExecutedHistoryHash,
                      type,
                      txInfo,
                      proposalData,
                    )}
                    proposalData={proposalData}
                  />
                )}
              </React.Fragment>
            );
          } else {
            return null;
          }
        });
      })}
    </DetailsModalWrapper>
  );
}

function ProposalHistoryModalSSR({
  isOpen,
  setIsOpen,
  proposalId,
}: ProposalHistoryModalProps) {
  const detailedProposalsData = useRootStore(
    (store) => store.detailedProposalsData,
  );
  const configs = useRootStore((store) => store.configs);
  const contractsConstants = useRootStore((store) => store.contractsConstants);
  const representativeLoading = useRootStore(
    (store) => store.representativeLoading,
  );
  const activeWallet = useRootStore((store) => store.activeWallet);
  const representative = useRootStore((store) => store.representative);
  const blockHashBalanceLoadings = useRootStore(
    (store) => store.blockHashBalanceLoadings,
  );
  const blockHashBalance = useRootStore((store) => store.blockHashBalance);

  const proposalData = getProposalDataById({
    detailedProposalsData,
    configs,
    contractsConstants,
    representativeLoading,
    activeWallet,
    representative,
    blockHashBalanceLoadings,
    blockHashBalance,
    proposalId,
  });

  return (
    <ProposalHistoryModalInit
      proposalId={proposalId}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      proposalData={proposalData}
    />
  );
}

function ProposalHistoryModalIPFS({
  isOpen,
  setIsOpen,
  proposalId,
}: ProposalHistoryModalProps) {
  const detailedProposalsData = useRootStore(
    (store) => store.detailedProposalsData,
  );
  const initProposalHistory = useRootStore(
    (store) => store.initProposalHistory,
  );
  const configs = useRootStore((store) => store.configs);
  const contractsConstants = useRootStore((store) => store.contractsConstants);
  const representativeLoading = useRootStore(
    (store) => store.representativeLoading,
  );
  const activeWallet = useRootStore((store) => store.activeWallet);
  const representative = useRootStore((store) => store.representative);
  const blockHashBalanceLoadings = useRootStore(
    (store) => store.blockHashBalanceLoadings,
  );
  const blockHashBalance = useRootStore((store) => store.blockHashBalance);

  const proposalData = getProposalDataById({
    detailedProposalsData,
    configs,
    contractsConstants,
    representativeLoading,
    activeWallet,
    representative,
    blockHashBalanceLoadings,
    blockHashBalance,
    proposalId,
  });

  const { loading: cacheEventsLoading, data: cacheEventsData } = useRequest(
    getProposalEventsCache(proposalId),
  );

  useEffect(() => {
    if (proposalData?.proposal && isForIPFS) {
      initProposalHistory(proposalData.proposal, cacheEventsData);
    }
  }, [isOpen, proposalId, proposalData?.loading, cacheEventsLoading]);

  return (
    <ProposalHistoryModalInit
      proposalId={proposalId}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      proposalData={proposalData}
    />
  );
}

export function ProposalHistoryModal({
  isOpen,
  setIsOpen,
  proposalId,
}: ProposalHistoryModalProps) {
  return isForIPFS ? (
    <ProposalHistoryModalIPFS
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      proposalId={proposalId}
    />
  ) : (
    <ProposalHistoryModalSSR
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      proposalId={proposalId}
    />
  );
}
