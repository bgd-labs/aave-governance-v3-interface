import React, { useEffect } from 'react';

import { useStore } from '../../../providers/ZustandStoreProvider';
import {
  DetailedProposalData,
  HistoryItemType,
  ProposalHistoryItem as IProposalHistoryItem,
  TxInfo,
} from '../../../types';
import { DetailsModalWrapper } from './DetailsModalWrapper';
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
    proposal: DetailedProposalData,
    txInfo: TxInfo,
  ) => void,
  setProposalCreatedHistoryHash: (
    proposal: DetailedProposalData,
    txInfo: TxInfo,
  ) => void,
  setProposalActivatedHistoryHash: (
    proposal: DetailedProposalData,
    txInfo: TxInfo,
  ) => void,
  setProposalActivatedOnVMHistoryHash: (
    proposal: DetailedProposalData,
    txInfo: TxInfo,
  ) => void,
  setProposalVotingClosedHistoryHash: (
    proposal: DetailedProposalData,
    txInfo: TxInfo,
  ) => void,
  setProposalQueuedHistoryHash: (
    proposal: DetailedProposalData,
    txInfo: TxInfo,
  ) => void,
  setPayloadsQueuedHistoryHash: (
    proposal: DetailedProposalData,
    txInfo: TxInfo,
  ) => void,
  setPayloadsExecutedHistoryHash: (
    proposal: DetailedProposalData,
    txInfo: TxInfo,
  ) => void,
  type: HistoryItemType,
  txInfo: TxInfo,
  proposalData: DetailedProposalData,
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
  proposal: DetailedProposalData;
  eventsData?: Record<string, IProposalHistoryItem>;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

function ProposalHistoryModalInit({
  isOpen,
  setIsOpen,
  proposal,
}: ProposalHistoryModalProps) {
  const proposalHistory = useStore((store) => store.proposalHistory);
  const setPayloadsCreatedHistoryHash = useStore(
    (store) => store.setPayloadsCreatedHistoryHash,
  );
  const setProposalCreatedHistoryHash = useStore(
    (store) => store.setProposalCreatedHistoryHash,
  );
  const setProposalActivatedHistoryHash = useStore(
    (store) => store.setProposalActivatedHistoryHash,
  );
  const setProposalActivatedOnVMHistoryHash = useStore(
    (store) => store.setProposalActivatedOnVMHistoryHash,
  );
  const setProposalVotingClosedHistoryHash = useStore(
    (store) => store.setProposalVotingClosedHistoryHash,
  );
  const setProposalQueuedHistoryHash = useStore(
    (store) => store.setProposalQueuedHistoryHash,
  );
  const setPayloadsQueuedHistoryHash = useStore(
    (store) => store.setPayloadsQueuedHistoryHash,
  );
  const setPayloadsExecutedHistoryHash = useStore(
    (store) => store.setPayloadsExecutedHistoryHash,
  );

  if (!proposal.metadata.title) return null;

  return (
    <DetailsModalWrapper
      proposalId={proposal.proposalData.id}
      isOpen={isOpen}
      setIsOpen={setIsOpen}>
      {historyTypes.map((type) => {
        return Object.entries(proposalHistory).map((item) => {
          const txInfo = item[1].txInfo;
          if (txInfo) {
            const historyId = getHistoryId({
              proposalId: proposal.proposalData.id,
              type,
              id: txInfo.id,
              chainId: txInfo.chainId,
            });
            const historyItem = proposalHistory[historyId];

            return (
              <React.Fragment key={item[0]}>
                {item[0] === historyId && (
                  <ProposalHistoryItem
                    proposal={proposal}
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
                      proposal,
                    )}
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

export function ProposalHistoryModal({
  proposal,
  eventsData,
  isOpen,
  setIsOpen,
}: ProposalHistoryModalProps) {
  const initProposalHistory = useStore((store) => store.initProposalHistory);

  useEffect(() => {
    if (proposal.proposalData.title) {
      initProposalHistory(proposal, eventsData);
    }
  }, [
    isOpen,
    proposal.proposalData.id,
    Object.values(eventsData ?? {}).length,
  ]);

  return (
    <ProposalHistoryModalInit
      proposal={proposal}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
}
