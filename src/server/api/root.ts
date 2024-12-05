import { configsRouter } from './routers/configs';
import { createProposalRouter } from './routers/createProposal';
import { delegationRouter } from './routers/delegation';
import { payloadsRouter } from './routers/payloads';
import { proposalsRouter } from './routers/proposals';
import { proposalsListRouter } from './routers/proposalsList';
import { representationsRouter } from './routers/representations';
import { createCallerFactory, createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  configs: configsRouter,
  proposalsList: proposalsListRouter,
  proposals: proposalsRouter,
  payloads: payloadsRouter,
  createProposal: createProposalRouter,
  representations: representationsRouter,
  delegation: delegationRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
