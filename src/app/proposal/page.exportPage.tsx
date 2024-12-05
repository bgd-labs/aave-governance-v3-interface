import { ProposalDetailsInitializer } from '../../components/ProposalsDetails/ProposalDetailsInitializer';
import { api } from '../../trpc/server';

export const revalidate = 3600 * 3;

export default async function Page() {
  const configs = await api.configs.get();
  return <ProposalDetailsInitializer configs={configs} />;
}
