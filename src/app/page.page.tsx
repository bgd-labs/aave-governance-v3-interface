// TODO: just for test

import { Metadata } from 'next';

import { ActiveItem } from '../components/ProposalsList/ActiveItem';
import { FinishedItem } from '../components/ProposalsList/FinishedItem';
import { PAGE_SIZE } from '../configs/configs';
import { metaTexts } from '../helpers/texts/metaTexts';
import { api } from '../trpc/server';

export const metadata: Metadata = {
  title: `${metaTexts.ipfsTitle}`,
  description: metaTexts.proposalListMetaDescription,
  openGraph: {
    images: ['/metaLogo.jpg'],
    title: `${metaTexts.ipfsTitle}`,
    description: metaTexts.proposalListMetaDescription,
  },
};

export default async function Page() {
  const { contractsConstants, totalProposalsCount, configs } =
    await api.configs.get();

  const proposalsData = await api.proposalsList.getAll({
    ...contractsConstants,
    votingConfigs: configs,
    proposalsCount: totalProposalsCount,
    pageSize: PAGE_SIZE,
  });

  return (
    <div>
      {proposalsData.activeProposalsData.map((proposal) => {
        return <ActiveItem proposalData={proposal} key={proposal.proposalId} />;
      })}
      {proposalsData.finishedProposalsData.map((proposal) => {
        return <FinishedItem data={proposal} key={proposal.proposalId} />;
      })}
    </div>
  );
}
