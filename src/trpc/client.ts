import { createTRPCClient, httpBatchLink } from '@trpc/client';
import SuperJSON from 'superjson';

import { AppRouter } from '../server/api/root';

export const api = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
      transformer: SuperJSON,
    }),
  ],
});
