import { Metadata } from 'next';
import React from 'react';

import {
  CachedProposalDataItemWithId,
  FinishedProposalForList,
  getGovCoreConfigs,
} from '../lib/helpers/src';
import { IGovernanceDataHelper__factory } from '../lib/helpers/src/contracts/IGovernanceDataHelper__factory';
import { ProposalPageSSR } from '../src/proposals/components/proposalList/ProposalPageSSR';
import { texts } from '../src/ui/utils/texts';
import { appConfig } from '../src/utils/appConfig';
import { githubStartUrl, listViewPath } from '../src/utils/cacheGithubLinks';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: `${texts.meta.main}${texts.meta.proposalListMetaTitle}`,
  description: texts.meta.proposalListMetaDescription,
  openGraph: {
    title: `${texts.meta.main}${texts.meta.proposalListMetaTitle}`,
    description: texts.meta.proposalListMetaDescription,
  },
};

export interface PageServerSideData {
  totalProposalCount: number;
  proposals: FinishedProposalForList[];
}

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const activePage = !!searchParams['activePage']
    ? Number(searchParams['activePage']) - 1
    : 0;

  const res = await fetch(`${githubStartUrl}/${listViewPath}`);
  const data = res.ok
    ? ((await res.json()) as PageServerSideData)
    : ({ totalProposalCount: -1, proposals: [] } as PageServerSideData);
  const cachedIds = data.proposals.map((data) => data.id);
  const totalIds =
    data.totalProposalCount >= 0
      ? Array.from(Array(data.totalProposalCount).keys()).sort((a, b) => b - a)
      : [];
  const startIndex = activePage * 10; // PAGE_SIZE
  let endIndex = startIndex + 10; // PAGE_SIZE

  if (endIndex > totalIds.length) {
    endIndex = totalIds.length;
  }
  const idsByPage = totalIds.slice(startIndex, endIndex);

  const activeIds: number[] = [];
  for (let i = 0; i < idsByPage.length; i++) {
    let found = false;
    for (let j = 0; j < cachedIds.length; j++) {
      if (idsByPage[i] === cachedIds[j]) {
        found = true;
        break;
      }
    }

    if (!found) {
      activeIds.push(idsByPage[i]);
    }
  }

  const cachedIdsByPage: number[] = [];
  for (let i = 0; i < idsByPage.length; i++) {
    let found = false;
    for (let j = 0; j < activeIds.length; j++) {
      if (idsByPage[i] === activeIds[j]) {
        found = true;
        break;
      }
    }

    if (!found) {
      cachedIdsByPage.push(idsByPage[i]);
    }
  }

  const govCoreDataHelper = IGovernanceDataHelper__factory.connect(
    appConfig.govCoreConfig.dataHelperContractAddress,
    appConfig.providers[appConfig.govCoreChainId],
  );

  const { configs, contractsConstants } = await getGovCoreConfigs(
    govCoreDataHelper,
    appConfig.govCoreConfig.contractAddress,
  );

  const cachedProposalsData = cachedIdsByPage.map((id) => {
    const proposal = data.proposals.filter((proposal) => proposal.id === id)[0];

    return {
      id: proposal.id,
      proposal: {
        data: {
          id: proposal.id,
          finishedTimestamp: proposal.finishedTimestamp,
          title: proposal.title,
          ipfsHash: proposal.ipfsHash,
        },
        state: proposal.state,
      },
    } as CachedProposalDataItemWithId;
  });

  return (
    <ProposalPageSSR
      cachedProposals={data.proposals}
      cachedTotalProposalCount={data.totalProposalCount}
      govCoreConfigs={configs}
      contractsConstants={contractsConstants}
      cachedProposalsData={cachedProposalsData}
      cachedActiveIds={activeIds}
    />
  );
}
