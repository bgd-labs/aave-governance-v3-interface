import { configsRouter } from './routers/configs';
import { payloadsRouter } from './routers/payloads';
import { proposalsRouter } from './routers/proposals';
import { proposalsListRouter } from './routers/proposalsList';
import { createCallerFactory, createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  configs: configsRouter,
  proposalsList: proposalsListRouter,
  proposals: proposalsRouter,
  payloads: payloadsRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
