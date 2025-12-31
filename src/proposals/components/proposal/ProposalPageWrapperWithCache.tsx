import {
  getVotingMachineProposalState,
  ProposalData,
} from '@bgd-labs/aave-governance-ui-helpers';
import React, { useEffect } from 'react';

import { useProposalDetailsCache } from '../../../queries/proposalQueries';
import { useStore } from '../../../store/ZustandStoreProvider';
import { ProposalLoading } from './ProposalLoading';
import { ProposalPageWrapper } from './ProposalPageWrapper';

interface ProposalPageWrapperWithCacheProps {
  id: number;
}

export function ProposalPageWrapperWithCache({
  id,
}: ProposalPageWrapperWithCacheProps) {
  const setDetailedPayloadsData = useStore(
    (store) => store.setDetailedPayloadsData,
  );
  const setIpfsData = useStore((store) => store.setIpfsData);
  const setDetailedProposalsData = useStore(
    (store) => store.setDetailedProposalsData,
  );

  const {
    isLoading: detailsLoading,
    data: detailsData,
    error: detailsError,
  } = useProposalDetailsCache(id);

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
          isFinished: true,
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
    }
  }, [detailsLoading, detailsError, detailsData]);

  if (detailsLoading && !detailsData) return <ProposalLoading />;

  return <ProposalPageWrapper id={id} />;
}
