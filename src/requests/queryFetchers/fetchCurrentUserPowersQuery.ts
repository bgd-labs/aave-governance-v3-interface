import { useQuery } from '@tanstack/react-query';
import { Address, Client } from 'viem';

import { isForIPFS } from '../../configs/appConfig';
import { api } from '../../trpc/client';
import { fetchCurrentUserPowers } from '../fetchCurrentUserPowers';

type Params = {
  activeAdr?: Address;
  adr?: Address;
  govCoreClient: Client;
};

async function getCurrentPowers({
  adr,
  govCoreClient,
}: Pick<Params, 'adr' | 'govCoreClient'>) {
  if (adr) {
    return await (isForIPFS
      ? fetchCurrentUserPowers({
          input: {
            walletAddress: adr,
            govCoreClient,
          },
        })
      : api.wallet.getCurrentPowers.query({
          walletAddress: adr,
        }));
  }
}

export function useGetCurrentPowersQuery({
  ...params
}: Params & { enabled?: boolean; withoutCache?: boolean }) {
  const { data: currentPowers, refetch: refetchCurrent } = useQuery({
    queryKey: ['currentPowers', params.adr],
    queryFn: async () => await getCurrentPowers(params),
    enabled: params.enabled ?? false,
    gcTime: params.withoutCache ? undefined : 3600000,
  });

  const { data: currentPowersActiveWallet, refetch: refetchActive } = useQuery({
    queryKey: ['currentPowers', params.activeAdr],
    queryFn: async () =>
      await getCurrentPowers({
        adr: params.activeAdr,
        govCoreClient: params.govCoreClient,
      }),
    enabled: params.enabled ?? false,
    gcTime: params.withoutCache ? undefined : 3600000,
  });

  return {
    refetchCurrent,
    refetchActive,
    currentPowers: params.adr ? currentPowers : currentPowersActiveWallet,
    currentPowersActiveWallet,
  };
}
