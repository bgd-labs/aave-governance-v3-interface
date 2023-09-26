export const ROUTES = {
  main: '/',
  delegate: '/delegate',
  representations: '/representations',
  proposal: (proposalId: number, ipfsHash: string) =>
    `/proposal?proposalId=${proposalId}&ipfsHash=${ipfsHash}`,
};
