export const ROUTES = {
  main: '/',
  delegate: '/delegate',
  representations: '/representations',
  proposal: (proposalId: number, ipfsHash: string) =>
    `/proposal?proposalId=${proposalId}&ipfsHash=${ipfsHash}`,
  proposalWithoutIpfs: (proposalId: number) =>
    `/proposal?proposalId=${proposalId}`,
  rpcSwitcher: '/rpc-switcher',
  proposalCreateOverview: '/proposal-create-overview',
  payloadsExplorer: '/payloads-explorer',
  adi: 'https://adi.onaave.com/',
};
