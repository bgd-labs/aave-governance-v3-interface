import { Web3Provider as Web3BaseProvider } from '../../../lib/web3/src';
import { useStore } from '../../store';
import { appConfig, WC_PROJECT_ID } from '../../utils/appConfig';
import { chainInfoHelper, internalChains } from '../../utils/configs';

export default function Web3Provider() {
  return (
    <Web3BaseProvider
      connectorsInitProps={{
        appName: 'AAVEGovernanceV3',
        chains: internalChains,
        defaultChainId: appConfig.govCoreChainId,
        urls: chainInfoHelper.urls,
        wcProjectId: WC_PROJECT_ID,
      }}
      useStore={useStore}
    />
  );
}
