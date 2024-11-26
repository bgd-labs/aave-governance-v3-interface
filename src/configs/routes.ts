export const ROUTES = {
  main: '/',
  delegate: '/delegate/',
  representations: '/representations/',
  proposal: (proposalId: number, isNew?: boolean) =>
    isNew ? `/proposal/?proposalId=${proposalId}` : `/proposal/${proposalId}/`,
  rpcSwitcher: '/rpc-switcher/',
  proposalCreateOverview: '/proposal-create-overview/',
  payloadsExplorer: '/payloads-explorer/',
  createProposal: '/create-proposal/',
  create: '/create/',
  adi: 'https://adi.onaave.com/',
};
