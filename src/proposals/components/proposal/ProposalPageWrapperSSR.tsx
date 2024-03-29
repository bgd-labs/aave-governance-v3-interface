import {
  CachedDetails,
  getVotingMachineProposalState,
  ProposalData,
  ProposalHistoryItem,
  ProposalWithLoadings,
  VotersData,
} from '@bgd-labs/aave-governance-ui-helpers';
import React, { useEffect } from 'react';

import { useStore } from '../../../store';
import { setProposalDetailsVoters } from '../../store/proposalsSelectors';
import { ProposalPageWrapper } from './ProposalPageWrapper';

interface ProposalPageWrapperSSRProps {
  id: number;
  detailsData?: CachedDetails;
  votesData?: {
    votes: VotersData[];
  };
  proposalDataSSR?: ProposalWithLoadings;
  cachedProposalsIds?: number[];
  cachedProposalEvents?: Record<string, ProposalHistoryItem>;
}

export function ProposalPageWrapperSSR({
  id,
  detailsData,
  votesData,
  proposalDataSSR,
  cachedProposalsIds,
  cachedProposalEvents,
}: ProposalPageWrapperSSRProps) {
  const store = useStore();

  useEffect(() => {
    const detailedProposalsData: Record<number, ProposalData> = {};

    if (detailsData) {
      detailedProposalsData[id] = {
        ...detailsData.proposal,
        votingMachineState: getVotingMachineProposalState(detailsData.proposal),
        payloads: detailsData.payloads || [],
        title: detailsData.ipfs.title || `Proposal #${id}`,
        isFinished: detailsData.proposal.isFinished,
      };

      detailsData.payloads.forEach((payload) => {
        if (payload) {
          store.setDetailedPayloadsData(
            `${payload.payloadsController}_${payload.id}`,
            payload,
          );
        }
      });
      store.setIpfsData(detailsData.proposal.ipfsHash, detailsData.ipfs);
      store.setDetailedProposalsData(id, detailedProposalsData[id]);
    }
  }, []);

  useEffect(() => {
    if (votesData) {
      setProposalDetailsVoters(store, votesData.votes);
    }
  }, []);

  return (
    <ProposalPageWrapper
      id={id}
      proposalDataSSR={proposalDataSSR}
      ipfsDataSSR={detailsData?.ipfs}
      cachedProposalsIds={cachedProposalsIds}
      cachedProposalEvents={cachedProposalEvents}
    />
  );
}
