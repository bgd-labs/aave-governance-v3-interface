import { configsRouter } from './routers/configs';
import { createProposalRouter } from './routers/createProposal';
import { payloadsRouter } from './routers/payloads';
import { proposalsRouter } from './routers/proposals';
import { proposalsListRouter } from './routers/proposalsList';
import { createCallerFactory, createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  configs: configsRouter,
  proposalsList: proposalsListRouter,
  proposals: proposalsRouter,
  payloads: payloadsRouter,
  createProposal: createProposalRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
