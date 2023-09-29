import {
  getVotingMachineProposalState,
  ProposalData,
} from '@bgd-labs/aave-governance-ui-helpers/src';
import { useRequest } from 'alova';
import React, { useEffect } from 'react';

import { useStore } from '../../../store';
import { getProposalDetailsCache } from '../../../utils/githubCacheRequests';
import { ProposalLoading } from './ProposalLoading';
import { ProposalPageWrapper } from './ProposalPageWrapper';

interface ProposalPageWrapperWithCacheProps {
  id: number;
}

export function ProposalPageWrapperWithCache({
  id,
}: ProposalPageWrapperWithCacheProps) {
  const store = useStore();

  const {
    loading: detailsLoading,
    data: detailsData,
    error: detailsError,
  } = useRequest(getProposalDetailsCache(id));

  useEffect(() => {
    if (!detailsLoading && !detailsError) {
      const detailedProposalsData: Record<number, ProposalData> = {};

      if (detailsData) {
        detailedProposalsData[id] = {
          ...detailsData.proposal,
          votingMachineState: getVotingMachineProposalState(
            detailsData.proposal,
          ),
          payloads: detailsData.payloads || [],
          title: detailsData.ipfs.title || `Proposal #${id}`,
          prerender: true,
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
    }
  }, [detailsLoading, detailsError, detailsData]);

  if (detailsLoading && !detailsData) return <ProposalLoading />;

  return <ProposalPageWrapper id={id} />;
}
