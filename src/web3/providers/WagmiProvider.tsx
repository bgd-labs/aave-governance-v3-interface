'use client';

import { WagmiProvider as BaseWagmiProvider } from '@bgd-labs/frontend-web3-utils';

import { useStore } from '../../store';
import { appConfig, WC_PROJECT_ID } from '../../utils/appConfig';
import { internalChains } from '../../utils/configs';

export default function WagmiProvider() {
  console.log('here');

  return (
    <BaseWagmiProvider
      connectorsInitProps={{
        appName: 'AAVEGovernanceV3',
        chains: internalChains,
        defaultChainId: appConfig.govCoreChainId,
        // wcParams: {
        //   projectId: WC_PROJECT_ID,
        //   // TODO: need change metadata for wallet connect
        //   metadata: {
        //     name: 'wagmi',
        //     description: 'my wagmi app',
        //     url: 'https://wagmi.sh',
        //     icons: ['https://wagmi.sh/icon.png'],
        //   },
        // },
      }}
      useStore={useStore}
    />
  );
}
