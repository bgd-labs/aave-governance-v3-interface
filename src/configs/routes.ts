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
  payloadsExplorer: `/payloads-explorer/${appConfig.govCoreChainId}_${appConfig.payloadsControllerConfig[appConfig.govCoreChainId].contractAddresses[0]}/0`,
  createProposal: '/create-proposal/',
  create: '/create/',
  adi: 'https://adi.onaave.com/',
};
