import { Draft } from 'immer';
import { Chain, createClient, fallback, http } from 'viem';

import { setChain } from './setChain';

export type CreateViemClientParams = {
  chain: Chain;
  rpcUrl?: string;
  withoutFallback?: boolean;
  initialRpcUrls: Record<number, string[]>;
};

const fallBackConfig = {
  rank: false,
  retryDelay: 30,
  retryCount: 3,
};

export const createViemClient = ({
  chain,
  initialRpcUrls,
  withoutFallback,
  rpcUrl,
}: {
  chain: Chain;
  initialRpcUrls: Record<number, string[]>;
  withoutFallback?: boolean;
  rpcUrl?: string;
}) =>
  createClient({
    batch: {
      multicall: true,
    },
    chain: setChain({ chain, initialRpcUrls }) as Draft<Chain>,
    transport: withoutFallback
      ? rpcUrl
        ? http(rpcUrl)
        : http(initialRpcUrls[chain.id][0])
      : fallback(
          rpcUrl
            ? [
                http(rpcUrl),
                ...initialRpcUrls[chain.id].map((url) => http(url)),
              ]
            : initialRpcUrls[chain.id].map((url) => http(url)),
          fallBackConfig,
        ),
  });
