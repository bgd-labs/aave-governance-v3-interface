import React, { useEffect } from 'react';

import { useStore } from '../../../store';
import { HistoryItemType, TxInfo } from '../../store/proposalsHistorySlice';
import { getProposalDataById } from '../../store/proposalsSelectors';
import { DetailsModalWrapper } from '../DetailsModalWrapper';
import { ProposalHistoryItem } from './ProposalHistoryItem';

interface ProposalHistoryModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  proposalId: number;
}

export function ProposalHistoryModal({
  isOpen,
  setIsOpen,
  proposalId,
}: ProposalHistoryModalProps) {
  const store = useStore();

  const proposalData = useStore((store) =>
    getProposalDataById(store, proposalId),
  );

  useEffect(() => {
    if (proposalData?.proposal) {
      store.initProposalHistory(proposalData.proposal);
    }
  }, [isOpen, proposalId, proposalData?.loading]);

  if (!proposalData?.proposal) return null;

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

  const getHistoryId = (type: HistoryItemType, txInfo: TxInfo) => {
    if (
      type === HistoryItemType.PAYLOADS_CREATED ||
      type === HistoryItemType.PAYLOADS_QUEUED ||
      type === HistoryItemType.PAYLOADS_EXECUTED ||
      type === HistoryItemType.PAYLOADS_EXPIRED
    ) {
      return `${proposalId}_${type}_${txInfo.id}_${txInfo.chainId}`;
    } else {
      return `${proposalId}_${type}`;
    }
  };

  const getHistoryLinkFunc = (type: HistoryItemType, txInfo: TxInfo) => {
    switch (type) {
      case HistoryItemType.PAYLOADS_CREATED:
        return () => store.setPayloadsCreatedHistoryHash(proposalData, txInfo);
      case HistoryItemType.CREATED:
        return () => store.setProposalCreatedHistoryHash(proposalData, txInfo);
      case HistoryItemType.PROPOSAL_ACTIVATE:
        return () =>
          store.setProposalActivatedHistoryHash(proposalData, txInfo);
      case HistoryItemType.OPEN_TO_VOTE:
        return () =>
          store.setProposalActivatedOnVMHistoryHash(proposalData, txInfo);
      case HistoryItemType.VOTING_CLOSED:
        return () =>
          store.setProposalVotingClosedHistoryHash(proposalData, txInfo);
      case HistoryItemType.PROPOSAL_QUEUED:
        return () => store.setProposalQueuedHistoryHash(proposalData, txInfo);
      case HistoryItemType.PAYLOADS_QUEUED:
        return () => store.setPayloadsQueuedHistoryHash(proposalData, txInfo);
      case HistoryItemType.PAYLOADS_EXECUTED:
        return () => store.setPayloadsExecutedHistoryHash(proposalData, txInfo);

      default:
        return undefined;
    }
  };

  return (
    <DetailsModalWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
      {historyTypes.map((type) => {
        return Object.entries(store.proposalHistory).map((item) => {
          const txInfo = item[1].txInfo;
          if (txInfo) {
            const historyId = getHistoryId(type, txInfo);
            const historyItem = store.proposalHistory[historyId];

            return (
              <React.Fragment key={item[0]}>
                {item[0] === historyId && (
                  <ProposalHistoryItem
                    proposalId={proposalId}
                    item={historyItem}
                    onClick={getHistoryLinkFunc(type, txInfo)}
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
