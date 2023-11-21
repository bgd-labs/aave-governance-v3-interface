'use client';

import { WagmiProvider as BaseWagmiProvider } from '@bgd-labs/frontend-web3-utils';

import { useStore } from '../../store';
import { appConfig, WC_PROJECT_ID } from '../../utils/appConfig';
import { CHAINS } from '../../utils/chains';

export default function WagmiProvider() {
  return (
    <BaseWagmiProvider
      connectorsInitProps={{
        appName: 'AAVEGovernanceV3',
        chains: CHAINS,
        defaultChainId: appConfig.govCoreChainId,
        wcParams: {
          projectId: WC_PROJECT_ID,
          metadata: {
            name: 'Aave governance',
            description:
              'User interface to interact with the Aave governance v3 smart contracts',
            url: 'https://vote.onaave.com',
            icons: [
              'https://imagedelivery.net/_aTEfDRm7z3tKgu9JhfeKA/c54c2635-3522-4d32-0e97-2329a733ee00/lg',
            ],
          },
        },
      }}
      useStore={useStore}
    />
  );
}
