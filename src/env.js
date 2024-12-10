import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    RPC_MAINNET: z.string().or(z.undefined()),
    RPC_POLYGON: z.string().or(z.undefined()),
    RPC_AVALANCHE: z.string().or(z.undefined()),
    RPC_OPTIMISM: z.string().or(z.undefined()),
    RPC_ARBITRUM: z.string().or(z.undefined()),
    RPC_METIS: z.string().or(z.undefined()),
    RPC_BASE: z.string().or(z.undefined()),
    RPC_GNOSIS: z.string().or(z.undefined()),
    RPC_BNB: z.string().or(z.undefined()),
    RPC_ZKSYNC: z.string().or(z.undefined()),
    RPC_SCROLL: z.string().or(z.undefined()),
  },
  client: {
    NEXT_PUBLIC_DEPLOY_FOR_IPFS: z.string().or(z.undefined()),
    NEXT_PUBLIC_TERMS_AND_CONDITIONS_VISIBLE: z.string().or(z.undefined()),
    NEXT_PUBLIC_WC_PROJECT_ID: z.string().or(z.undefined()),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    RPC_MAINNET: process.env.RPC_MAINNET,
    RPC_POLYGON: process.env.RPC_POLYGON,
    RPC_AVALANCHE: process.env.RPC_AVALANCHE,
    RPC_OPTIMISM: process.env.RPC_OPTIMISM,
    RPC_ARBITRUM: process.env.RPC_ARBITRUM,
    RPC_METIS: process.env.RPC_METIS,
    RPC_BASE: process.env.RPC_BASE,
    RPC_GNOSIS: process.env.RPC_GNOSIS,
    RPC_BNB: process.env.RPC_BNB,
    RPC_ZKSYNC: process.env.RPC_ZKSYNC,
    RPC_SCROLL: process.env.RPC_SCROLL,
    NEXT_PUBLIC_DEPLOY_FOR_IPFS: process.env.NEXT_PUBLIC_DEPLOY_FOR_IPFS,
    NEXT_PUBLIC_TERMS_AND_CONDITIONS_VISIBLE: process.env.NEXT_PUBLIC_TERMS_AND_CONDITIONS_VISIBLE,
    NEXT_PUBLIC_WC_PROJECT_ID: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
