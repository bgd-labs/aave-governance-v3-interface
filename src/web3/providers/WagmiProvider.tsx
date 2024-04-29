'use client';

import {
  createWagmiConfig,
  WagmiZustandSync,
} from '@bgd-labs/frontend-web3-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useMemo } from 'react';

import { useStore } from '../../store/ZustandStoreProvider';
import { appConfig, WC_PROJECT_ID } from '../../utils/appConfig';
import { CHAINS } from '../../utils/chains';

const queryClient = new QueryClient();

export default function WagmiProvider() {
  const getImpersonatedAddress = useStore(
    (store) => store.getImpersonatedAddress,
  );
  const setWagmiConfig = useStore((store) => store.setWagmiConfig);
  const setDefaultChainId = useStore((store) => store.setDefaultChainId);
  const changeActiveWalletAccount = useStore(
    (store) => store.changeActiveWalletAccount,
  );

  const config = useMemo(() => {
    return createWagmiConfig({
      chains: CHAINS,
      connectorsInitProps: {
        appName: 'AAVEGovernanceV3',
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
      },
      getImpersonatedAccount: getImpersonatedAddress,
      ssr: true,
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiZustandSync
        withAutoConnect
        wagmiConfig={config}
        defaultChainId={appConfig.govCoreChainId}
        store={{
          setWagmiConfig,
          setDefaultChainId,
          changeActiveWalletAccount,
        }}
      />
    </QueryClientProvider>
  );
}
