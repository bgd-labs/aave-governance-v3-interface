import {
  HistoryItemType,
  ProposalWithLoadings,
  TxInfo,
} from '@bgd-labs/aave-governance-ui-helpers';
import { useRequest } from 'alova';
import React, { useEffect } from 'react';

import { RootState, useStore } from '../../../store';
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
  store: RootState,
  type: HistoryItemType,
  txInfo: TxInfo,
  proposalData: ProposalWithLoadings,
) => {
  switch (type) {
    case HistoryItemType.PAYLOADS_CREATED:
      return () => store.setPayloadsCreatedHistoryHash(proposalData, txInfo);
    case HistoryItemType.CREATED:
      return () => store.setProposalCreatedHistoryHash(proposalData, txInfo);
    case HistoryItemType.PROPOSAL_ACTIVATE:
      return () => store.setProposalActivatedHistoryHash(proposalData, txInfo);
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
  const store = useStore();

  if (!proposalData?.proposal) return null;

  return (
    <DetailsModalWrapper
      proposalId={proposalId}
      isOpen={isOpen}
      setIsOpen={setIsOpen}>
      {historyTypes.map((type) => {
        return Object.entries(store.proposalHistory).map((item) => {
          const txInfo = item[1].txInfo;
          if (txInfo) {
            const historyId = getHistoryId({
              proposalId,
              type,
              id: txInfo.id,
              chainId: txInfo.chainId,
            });
            const historyItem = store.proposalHistory[historyId];

            return (
              <React.Fragment key={item[0]}>
                {item[0] === historyId && (
                  <ProposalHistoryItem
                    proposalId={proposalId}
                    item={historyItem}
                    onClick={getHistoryLinkFunc(
                      store,
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
  const store = useStore();

  const proposalData = getProposalDataById(store, proposalId);

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
  const store = useStore();

  const proposalData = getProposalDataById(store, proposalId);
  const { loading: cacheEventsLoading, data: cacheEventsData } = useRequest(
    getProposalEventsCache(proposalId),
  );

  useEffect(() => {
    if (proposalData?.proposal && isForIPFS) {
      store.initProposalHistory(proposalData.proposal, cacheEventsData);
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
