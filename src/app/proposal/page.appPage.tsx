import { ProposalDetailsInitializer } from '../../components/ProposalsDetails/ProposalDetailsInitializer';
import { generateDetailsMetadata } from '../../helpers/generateDetailsMetadata';
import { api } from '../../trpc/server';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { proposalId: string };
}) {
  return await generateDetailsMetadata({ params: searchParams });
}

export const revalidate = 3600 * 3;

export default async function Page() {
  const configs = await api.configs.get();
  return <ProposalDetailsInitializer configs={configs} />;
}
