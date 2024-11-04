import {
  FinishedProposalForList,
  getGovCoreConfigs,
} from '@bgd-labs/aave-governance-ui-helpers';
import { Metadata } from 'next';

import { ProposalPageSSR } from '../src/old/proposals/components/proposalList/ProposalPageSSR';
import { metaTexts } from '../src/old/ui/utils/metaTexts';
import { appConfig } from '../src/old/utils/appConfig';
import {
  githubStartUrl,
  listViewPath,
} from '../src/old/utils/cacheGithubLinks';
import { initialClients } from '../src/old/utils/initialClients';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: `${metaTexts.ipfsTitle}`,
  description: metaTexts.proposalListMetaDescription,
  openGraph: {
    images: ['/metaLogo.jpg'],
    title: `${metaTexts.ipfsTitle}`,
    description: metaTexts.proposalListMetaDescription,
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
  const activePage = searchParams['activePage']
    ? Number(searchParams['activePage']) - 1
    : 0;

  const res = await fetch(`${githubStartUrl}/${listViewPath}`);
  const data = res.ok
    ? ((await res.json()) as PageServerSideData)
    : { totalProposalCount: -1, proposals: [] };
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

  const { configs, contractsConstants } = await getGovCoreConfigs({
    client: initialClients[appConfig.govCoreChainId],
    govCoreContractAddress: appConfig.govCoreConfig.contractAddress,
    govCoreDataHelperContractAddress:
      appConfig.govCoreConfig.dataHelperContractAddress,
  });

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
        combineState: proposal.combineState,
      },
    };
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
