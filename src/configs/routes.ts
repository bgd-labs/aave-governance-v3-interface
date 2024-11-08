export const ROUTES = {
  main: '/',
  delegate: '/delegate',
  representations: '/representations',
  proposal: (proposalId: number, ipfsHash: string) =>
    `/proposal/${proposalId}-${ipfsHash}`,
  rpcSwitcher: '/rpc-switcher',
  proposalCreateOverview: '/proposal-create-overview',
  payloadsExplorer: '/payloads-explorer',
  createProposal: '/create-proposal',
  adi: 'https://adi.onaave.com/',
};
