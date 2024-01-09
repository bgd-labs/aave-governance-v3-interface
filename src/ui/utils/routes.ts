export const ROUTES = {
  main: '/',
  delegate: '/delegate',
  representations: '/representations',
  proposal: (proposalId: number, ipfsHash: string) =>
    `/proposal?proposalId=${proposalId}&ipfsHash=${ipfsHash}`,
  rpcSwitcher: '/rpc-switcher',
  proposalCreateOverview: '/proposal-create-overview',
  payloadsExplorer: '/payloads-explorer',
};
