import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    ALCHEMY_API_KEY: z.string().or(z.undefined()),
  },
  client: {
    NEXT_PUBLIC_DEPLOY_FOR_IPFS: z.string().or(z.undefined()),
    NEXT_PUBLIC_TERMS_AND_CONDITIONS_VISIBLE: z.string().or(z.undefined()),
    NEXT_PUBLIC_WC_PROJECT_ID: z.string().or(z.undefined()),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_DEPLOY_FOR_IPFS: process.env.NEXT_PUBLIC_DEPLOY_FOR_IPFS,
    NEXT_PUBLIC_TERMS_AND_CONDITIONS_VISIBLE: process.env.NEXT_PUBLIC_TERMS_AND_CONDITIONS_VISIBLE,
    NEXT_PUBLIC_WC_PROJECT_ID: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
