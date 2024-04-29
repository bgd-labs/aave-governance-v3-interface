import { IGovernanceCore_ABI } from '@bgd-labs/aave-address-book';
import {
  CachedDetails,
  getGovCoreConfigs,
  getProposalMetadata,
  getProposalState,
  getVotingMachineProposalState,
  ProposalMetadata,
  ProposalWithLoadings,
} from '@bgd-labs/aave-governance-ui-helpers';
import type { Metadata } from 'next';
import React from 'react';
import { getContract } from 'viem';

import { ProposalClientPageSSR } from '../../src/proposals/components/proposal/ProposalClientPageSSR';
import { metaTexts } from '../../src/ui/utils/metaTexts';
import { texts } from '../../src/ui/utils/texts';
import { appConfig } from '../../src/utils/appConfig';
import {
  cachedDetailsPath,
  cachedEventsPath,
  cachedProposalsIdsPath,
  cachedVotesPath,
  githubStartUrl,
} from '../../src/utils/cacheGithubLinks';
import { initialClients } from '../../src/utils/initialClients';

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
    try {
      const ipfsData = await getProposalMetadata(ipfsHash);

      return {
        title: `${metaTexts.main}${metaTexts.proposalId(proposalId)}`,
        description: ipfsData?.title || '',
        openGraph: {
          images: ['/metaLogo.jpg'],
          title: `${metaTexts.main}${metaTexts.proposalId(proposalId)}`,
          description: ipfsData?.title || '',
        },
      };
    } catch (e) {
      return {
        title: texts.other.fetchFromIpfsError,
        description: metaTexts.ipfsDescription,
        openGraph: {
          images: ['/metaLogo.jpg'],
          title: `${texts.other.fetchFromIpfsError}`,
          description: metaTexts.ipfsDescription,
        },
      };
    }
  }

  return {
    title: `${metaTexts.ipfsTitle}`,
    description: metaTexts.ipfsDescription,
    openGraph: {
      images: ['/metaLogo.jpg'],
      title: `${metaTexts.ipfsTitle}`,
      description: metaTexts.ipfsDescription,
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
  const govCore = getContract({
    address: appConfig.govCoreConfig.contractAddress,
    abi: IGovernanceCore_ABI,
    client: initialClients[appConfig.govCoreChainId],
  });

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

  const resCachedEvents = await fetch(
    `${githubStartUrl}${cachedEventsPath(id)}`,
  );
  const cachedEventsData = resCachedEvents.ok
    ? await resCachedEvents.json()
    : undefined;

  // data from contracts
  const { configs, contractsConstants } = await getGovCoreConfigs({
    client: initialClients[appConfig.govCoreChainId],
    govCoreContractAddress: appConfig.govCoreConfig.contractAddress,
    govCoreDataHelperContractAddress:
      appConfig.govCoreConfig.dataHelperContractAddress,
  });

  const proposalsCountInitial = await govCore.read.getProposalsCount();
  const proposalCount = Number(proposalsCountInitial);

  // format data
  const proposalConfig = configs.filter(
    (config) => config.accessLevel === cachedDetailsData?.proposal.accessLevel,
  )[0];

  const executionDelay = Math.max.apply(
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
        executionDelay,
      },
    };

    const combineState = getProposalState({
      proposalData: proposalDataWithoutState.data,
      quorum: proposalDataWithoutState.config.quorum,
      differential: proposalDataWithoutState.config.differential,
      precisionDivider: proposalDataWithoutState.precisionDivider,
      cooldownPeriod: proposalDataWithoutState.timings.cooldownPeriod,
      executionDelay: proposalDataWithoutState.timings.executionDelay,
    });

    proposalDataSSR = {
      loading: false,
      balanceLoading: true,
      proposal: {
        ...proposalDataWithoutState,
        combineState,
      },
    };
  }

  let ipfsDataSSR: ProposalMetadata | undefined;
  try {
    ipfsDataSSR =
      cachedDetailsData?.ipfs ??
      (ipfsHash ? await getProposalMetadata(ipfsHash) : undefined);
  } catch (e) {
    ipfsDataSSR = cachedDetailsData?.ipfs;
  }

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
      cachedProposalEvents={cachedEventsData}
    />
  );
}
