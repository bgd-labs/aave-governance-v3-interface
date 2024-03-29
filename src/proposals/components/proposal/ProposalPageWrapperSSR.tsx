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
  const setDetailedPayloadsData = useStore(
    (store) => store.setDetailedPayloadsData,
  );
  const setIpfsData = useStore((store) => store.setIpfsData);
  const setDetailedProposalsData = useStore(
    (store) => store.setDetailedProposalsData,
  );
  const setVoters = useStore((store) => store.setVoters);

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
          setDetailedPayloadsData(
            `${payload.payloadsController}_${payload.id}`,
            payload,
          );
        }
      });
      setIpfsData(detailsData.proposal.ipfsHash, detailsData.ipfs);
      setDetailedProposalsData(id, detailedProposalsData[id]);
    }
  }, []);

  useEffect(() => {
    if (votesData) {
      setProposalDetailsVoters(setVoters, votesData.votes);
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
