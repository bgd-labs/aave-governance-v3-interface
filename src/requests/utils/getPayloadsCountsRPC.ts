import { IPayloadsControllerCore_ABI } from '@bgd-labs/aave-address-book/abis';
import { Client } from 'viem';
import { readContract } from 'viem/actions';

import { appConfig } from '../../configs/appConfig';
import { getAvailablePayloadsIdsByChainId } from '../../helpers/getAvailablePayloadsIdsByChainId';
import { ProposalInitialStruct } from '../../types';

export async function getPayloadsCountsRPC({
  clients,
  proposalsCount,
  proposalsData,
}: {
  clients: Record<number, Client>;
  proposalsCount: bigint;
  proposalsData: ProposalInitialStruct[];
}) {
  const payloadsCounts: Record<string, number> = {};
  const payloadsAvailableIds: Record<string, number[]> = {};
  await Promise.all(
    Object.entries(appConfig.payloadsControllerConfig).map(
      async ([chainId, config]) => {
        await Promise.all(
          config.contractAddresses.map(async (contractAddress) => {
            const count = await readContract(clients[Number(chainId)], {
              abi: IPayloadsControllerCore_ABI,
              address: contractAddress,
              functionName: 'getPayloadsCount',
              args: [],
            });

            payloadsCounts[contractAddress] = count;
            payloadsAvailableIds[contractAddress] =
              getAvailablePayloadsIdsByChainId({
                chainId: Number(chainId),
                payloadsCount: payloadsCounts,
                proposalsCount: Number(proposalsCount),
                proposalsData,
              });
          }),
        );
      },
    ),
  );
  return {
    payloadsCounts,
    payloadsAvailableIds,
  };
}
