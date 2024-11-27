import { ProposalDetailsInitializer } from '../../components/ProposalsDetails/ProposalDetailsInitializer';
import { api } from '../../trpc/server';

export const revalidate = 3600 * 3;

export default async function Page() {
  const [configs, count] = await Promise.all([
    await api.configs.get(),
    await api.configs.getProposalsCount(),
  ]);
  return <ProposalDetailsInitializer configs={configs} count={Number(count)} />;
}
