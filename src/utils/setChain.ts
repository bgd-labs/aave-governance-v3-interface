import { gnosis, mainnet } from 'viem/chains';

import { CreateViemClientParams } from './createClient';

export function setChain({
  chain,
  initialRpcUrls,
}: Pick<CreateViemClientParams, 'chain' | 'initialRpcUrls'>) {
  return {
    ...chain,
    rpcUrls: {
      ...chain.rpcUrls,
      default: {
        ...chain.rpcUrls.default,
        http: initialRpcUrls[chain.id],
      },
    },
    blockExplorers: {
      ...chain.blockExplorers,
      default:
        chain.id === gnosis.id
          ? { name: 'Gnosis chain explorer', url: 'https://gnosisscan.io' }
          : chain.blockExplorers?.default || mainnet.blockExplorers.default,
    },
  };
}
