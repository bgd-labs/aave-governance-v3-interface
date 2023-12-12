export const ROUTES = {
  main: '/',
  delegate: '/delegate',
  representations: '/representations',
  proposal: (proposalId: number, ipfsHash: string) =>
    `/proposal?proposalId=${proposalId}&ipfsHash=${ipfsHash}`,
  rpcSwitcher: '/rpc-switcher',
  proposalCreateOverview: '/proposal-create-overview',
  proposalCreateOverviewV2: '/proposal-create-overview-v2',
  payloadsExplorer: '/payloads-explorer',
};
