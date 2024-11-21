import { IGovernanceCore_ABI } from '@bgd-labs/aave-address-book/abis';
import { PayloadState } from '@bgd-labs/aave-governance-ui-helpers';
import { writeContract } from '@wagmi/core';
import { Address, Client, Hex } from 'viem';
import { Config } from 'wagmi';

import { isForIPFS } from '../../../configs/appConfig';
import { appConfig } from '../../../old/utils/appConfig';
import { fetchPayloads } from '../../../requests/fetchPayloads';
import { api } from '../../../trpc/client';
import { ProposalInitialStruct } from '../../../types';

export async function createProposal({
  wagmiConfig,
  votingPortalAddress,
  ipfsHash,
  cancellationFee,
  payloads,
  clients,
}: {
  wagmiConfig?: Config;
  votingPortalAddress: Address;
  ipfsHash: Hex;
  cancellationFee: string;
  clients: Record<number, Client>;
} & Pick<ProposalInitialStruct, 'payloads'>) {
  const payloadsChainIds = payloads
    .map((payload) => payload.chain)
    .filter((value, index, self) => self.indexOf(value) === index);

  const payloadsControllers = payloads
    .map((payload) => payload.payloadsController)
    .filter((value, index, self) => self.indexOf(value) === index);

  const payloadsData = (
    await Promise.all(
      payloadsChainIds.map(async (chainId) => {
        return await Promise.all(
          payloadsControllers.map(async (controller) => {
            const payloadsIds = payloads
              .filter(
                (payload) =>
                  Number(payload.chain) === Number(chainId) &&
                  payload.payloadsController === controller,
              )
              .flat()
              .map((payload) => payload.payloadId);

            const input = {
              chainId: Number(chainId),
              payloadsIds,
            };

            return await (isForIPFS
              ? fetchPayloads({ input: { ...input, clients } })
              : api.payloads.getAll.query(input));
          }),
        );
      }),
    )
  )
    .flat()
    .flat();

  if (
    payloadsData.some((payload) => payload.data.state === PayloadState.Expired)
  ) {
    throw new Error('One ore multiple payloads has expired status');
  }

  const formattedPayloads = payloadsData.map((payload) => {
    return {
      chain: payload.chain,
      accessLevel: payload.data.maximumAccessLevelRequired,
      payloadsController: payload.payloadsController,
      payloadId: Number(payload.id),
    };
  });

  if (wagmiConfig) {
    return writeContract(wagmiConfig, {
      abi: IGovernanceCore_ABI,
      address: appConfig.govCoreConfig.contractAddress,
      functionName: 'createProposal',
      args: [formattedPayloads, votingPortalAddress, ipfsHash],
      value: BigInt(cancellationFee),
      chainId: appConfig.govCoreChainId,
    });
  }
  return undefined;
}
