import {
  CachedDetails,
  getGovCoreConfigs,
  getProposalMetadata,
  getProposalState,
  getVotingMachineProposalState,
  ProposalWithLoadings,
} from '@bgd-labs/aave-governance-ui-helpers';
import { IGovernanceCore__factory } from '@bgd-labs/aave-governance-ui-helpers/src/contracts/IGovernanceCore__factory';
import { IGovernanceDataHelper__factory } from '@bgd-labs/aave-governance-ui-helpers/src/contracts/IGovernanceDataHelper__factory';
import type { Metadata } from 'next';
import React from 'react';

import { ProposalClientPageSSR } from '../../src/proposals/components/proposal/ProposalClientPageSSR';
import { metaTexts } from '../../src/ui/utils/metaTexts';
import { appConfig } from '../../src/utils/appConfig';
import {
  cachedDetailsPath,
  cachedProposalsIdsPath,
  cachedVotesPath,
  githubStartUrl,
} from '../../src/utils/cacheGithubLinks';

export const revalidate = 0;

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const proposalId = !!searchParams['proposalId']
    ? String(searchParams['proposalId'])
    : undefined;
  const ipfsHash = !!searchParams['ipfsHash']
    ? String(searchParams['ipfsHash'])
    : undefined;

  if (ipfsHash && proposalId) {
    const ipfsData = await getProposalMetadata(ipfsHash);

    return {
      title: `${metaTexts.main}${metaTexts.proposalId(proposalId)}`,
      description: ipfsData.title,
      openGraph: {
        images: ['/metaLogo.jpg'],
        title: `${metaTexts.main}${metaTexts.proposalId(proposalId)}`,
        description: ipfsData.title,
      },
    };
  }

  return {
    title: `${metaTexts.ipfsTitle}`,
    description: metaTexts.ipfsDescription,
    openGraph: {
      images: ['/metaLogo.jpg'],
    },
  };
}

export default async function ProposalPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // params
  const proposalId = !!searchParams['proposalId']
    ? String(searchParams['proposalId'])
    : undefined;
  const ipfsHash = !!searchParams['ipfsHash']
    ? String(searchParams['ipfsHash'])
    : undefined;
  const id = Number(proposalId);

  // contracts
  const govCore = IGovernanceCore__factory.connect(
    appConfig.govCoreConfig.contractAddress,
    appConfig.providers[appConfig.govCoreChainId],
  );
  const govCoreDataHelper = IGovernanceDataHelper__factory.connect(
    appConfig.govCoreConfig.dataHelperContractAddress,
    appConfig.providers[appConfig.govCoreChainId],
  );

  // cached data
  const resCachedProposalsIds = await fetch(
    `${githubStartUrl}${cachedProposalsIdsPath}`,
  );
  const cachedProposalsIdsData = resCachedProposalsIds.ok
    ? ((await resCachedProposalsIds.json()) as {
        cachedProposalsIds: number[];
      })
    : { cachedProposalsIds: [] };

  const resCachedDetails = await fetch(
    `${githubStartUrl}${cachedDetailsPath(id)}`,
  );
  const cachedDetailsData = resCachedDetails.ok
    ? ((await resCachedDetails.json()) as CachedDetails)
    : undefined;

  const resCachedVotes = await fetch(`${githubStartUrl}${cachedVotesPath(id)}`);
  const cachedVotesData = resCachedVotes.ok
    ? await resCachedVotes.json()
    : undefined;

  // data from contracts
  const { configs, contractsConstants } = await getGovCoreConfigs(
    govCoreDataHelper,
    appConfig.govCoreConfig.contractAddress,
  );

  const proposalsCountInitial = await govCore.getProposalsCount();
  const proposalCount = proposalsCountInitial.toNumber();

  // format data
  const proposalConfig = configs.filter(
    (config) => config.accessLevel === cachedDetailsData?.proposal.accessLevel,
  )[0];

  const executionPayloadTime = Math.max.apply(
    null,
    cachedDetailsData?.payloads.map((payload) => payload.delay) || [0],
  );

  let proposalDataSSR: ProposalWithLoadings | undefined = undefined;
  if (cachedDetailsData) {
    const basicProposalData = {
      ...cachedDetailsData.proposal,
      votingMachineState: getVotingMachineProposalState(
        cachedDetailsData.proposal,
      ),
      payloads: cachedDetailsData.payloads || [],
      title: cachedDetailsData.ipfs.title || `Proposal #${id}`,
      prerender: true,
    };

    const proposalDataWithoutState = {
      data: basicProposalData,
      precisionDivider: contractsConstants.precisionDivider,
      balances: [],
      config: proposalConfig,
      timings: {
        cooldownPeriod: contractsConstants.cooldownPeriod,
        expirationTime: contractsConstants.expirationTime,
        executionPayloadTime,
      },
    };

    const state = getProposalState({
      proposalData: proposalDataWithoutState.data,
      quorum: proposalDataWithoutState.config.quorum,
      differential: proposalDataWithoutState.config.differential,
      precisionDivider: proposalDataWithoutState.precisionDivider,
      cooldownPeriod: proposalDataWithoutState.timings.cooldownPeriod,
      executionPayloadTime:
        proposalDataWithoutState.timings.executionPayloadTime,
    });

    proposalDataSSR = {
      loading: false,
      balanceLoading: true,
      proposal: {
        ...proposalDataWithoutState,
        state,
      },
    } as ProposalWithLoadings;
  }

  const ipfsDataSSR = cachedDetailsData?.ipfs
    ? undefined
    : ipfsHash
    ? await getProposalMetadata(ipfsHash)
    : undefined;

  return (
    <ProposalClientPageSSR
      idSSR={id}
      cachedProposalsIdsData={cachedProposalsIdsData}
      cachedDetailsData={cachedDetailsData}
      cachedVotesData={cachedVotesData}
      govCoreConfigs={configs}
      contractsConstants={contractsConstants}
      proposalCount={proposalCount}
      proposalDataSSR={proposalDataSSR}
      ipfsDataSSR={ipfsDataSSR}
    />
  );
}
