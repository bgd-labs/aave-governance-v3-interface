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
}: Pick<Params, 'govCoreClient'> & {
  adr: Address;
}) {
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

export async function getTotalPowers({
  adr,
  activeAdr,
  govCoreClient,
}: Params) {
  if (adr && !activeAdr) {
    const data = await getCurrentPowers({ adr, govCoreClient });
    return {
      currentPowers: data,
      currentPowersActiveWallet: data,
    };
  } else if (activeAdr && !adr) {
    const data = await getCurrentPowers({ adr: activeAdr, govCoreClient });
    return {
      currentPowers: data,
      currentPowersActiveWallet: data,
    };
  } else if (activeAdr && adr) {
    const data = await Promise.all([
      await getCurrentPowers({ adr, govCoreClient }),
      await getCurrentPowers({ adr: activeAdr, govCoreClient }),
    ]);
    return {
      currentPowers: data[0],
      currentPowersActiveWallet: data[1],
    };
  }
}
