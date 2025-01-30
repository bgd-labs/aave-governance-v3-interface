import { IPayloadsControllerCore_ABI } from '@bgd-labs/aave-address-book/abis';
import { ClientsRecord } from '@bgd-labs/frontend-web3-utils';
import { readContract } from 'viem/actions';

import { appConfig } from '../../configs/appConfig';
import { getAvailablePayloadsIdsByChainId } from '../../helpers/getAvailablePayloadsIdsByChainId';
import { ProposalInitialStruct } from '../../types';

export async function getPayloadsCountsRPC({
  clients,
  proposalsCount,
  proposalsData,
}: {
  clients: ClientsRecord;
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
            payloadsCounts[contractAddress] = await readContract(
              clients[Number(chainId)],
              {
                abi: IPayloadsControllerCore_ABI,
                address: contractAddress,
                functionName: 'getPayloadsCount',
                args: [],
              },
            );
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
