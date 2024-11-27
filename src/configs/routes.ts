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
  payloadsExplorer: '/payloads-explorer/',
  createProposal: '/create-proposal/',
  create: '/create/',
  adi: 'https://adi.onaave.com/',
};
