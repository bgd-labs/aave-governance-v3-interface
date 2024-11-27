'use client';

import { useEffect, useState } from 'react';

import { useStore } from '../../providers/ZustandStoreProvider';
import { ContractsConstants, VotingConfig } from '../../types';
import { Container } from '../primitives/Container';

export function ProposalDetailsInitializer({
  proposalId,
  configs,
  count,
}: {
  proposalId?: string;
  configs: {
    configs: VotingConfig[];
    contractsConstants: ContractsConstants;
  };
  count: number;
}) {
  const initializeConfigs = useStore((store) => store.initializeConfigs);
  const initializeProposalsCount = useStore(
    (store) => store.initializeProposalsCount,
  );

  const [idFromQuery, setIdFromQuery] = useState<string | null>(null);

  useEffect(() => {
    initializeConfigs(configs);
  }, [configs]);
  useEffect(() => {
    initializeProposalsCount(count);
  }, [count]);

  useEffect(() => {
    const search =
      typeof window !== 'undefined' ? window.location.search.substr(1) : '';
    const queryParams = new URLSearchParams(search);
    for (const [key, value] of queryParams.entries()) {
      if (value) {
        if (key === 'proposalId') {
          setIdFromQuery(value);
        }
      }
    }
  }, []);

  const id = proposalId?.split('_')[0] ?? idFromQuery?.split('_')[0] ?? -1;

  return (
    <Container>
      <h1>Proposal {id}</h1>
    </Container>
  );
}
