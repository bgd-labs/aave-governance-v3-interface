import { Address, Client, zeroAddress } from 'viem';

import { isForIPFS } from '../../configs/appConfig';
import { api } from '../../trpc/client';
import { fetchCurrentUserPowers } from '../fetchCurrentUserPowers';

type Params = {
  activeAdr: Address;
  adr: Address;
  govCoreClient: Client;
};

async function getCurrentPowers({
  adr,
  govCoreClient,
}: Pick<Params, 'adr' | 'govCoreClient'>) {
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
  if (adr === zeroAddress && activeAdr !== zeroAddress) {
    const data = await getCurrentPowers({
      adr: activeAdr,
      govCoreClient,
    });
    return {
      currentPowers: data,
      currentPowersActiveWallet: data,
    };
  } else if (adr !== zeroAddress && activeAdr !== zeroAddress) {
    const data = await Promise.allSettled([
      getCurrentPowers({ adr, govCoreClient }),
      getCurrentPowers({
        adr: activeAdr,
        govCoreClient,
      }),
    ]);

    const currentPowersActiveWallet =
      data[1].status === 'fulfilled' ? data[1].value : undefined;
    const currentPowers =
      data[0].status === 'fulfilled'
        ? data[0].value
        : currentPowersActiveWallet;

    return {
      currentPowers,
      currentPowersActiveWallet,
    };
  }

  const data = await getCurrentPowers({
    adr,
    govCoreClient,
  });

  return {
    currentPowers: data,
    currentPowersActiveWallet: data,
  };
}
