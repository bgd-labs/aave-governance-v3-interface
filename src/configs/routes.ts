import { appConfig } from './appConfig';

export const ROUTES = {
  main: '/',
  delegate: '/delegate/',
  representations: '/representations/',
  proposal: (proposalId: number, ipfsHash: string, isActive?: boolean) =>
    isActive
      ? `/proposal/?proposalId=${proposalId}_${ipfsHash}`
      : `/proposal/${proposalId}_${ipfsHash}/`,
  rpcSwitcher: '/rpc-switcher/',
  proposalCreateOverview: '/proposal-create-overview/',
  payloadsExplorer: `/payloads-explorer/${appConfig.govCoreChainId}_${appConfig.payloadsControllerConfig[appConfig.govCoreChainId].contractAddresses[0]}_0`,
  createProposal: '/create-proposal/',
  create: '/create/',
  payload: (id: number, chainId: number, payloadsController: string) =>
    `/payload/${id}_${chainId}_${payloadsController}`,
  payloadsExplorerPages: (
    chainId: number,
    payloadsController: string,
    activePage: string | number,
  ) => `/payloads-explorer/${chainId}_${payloadsController}_${activePage}`,
  adi: 'https://adi.onaave.com/',
};
