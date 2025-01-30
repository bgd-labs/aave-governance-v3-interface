import { IGovernanceCore_ABI } from '@bgd-labs/aave-address-book/abis';
import { ClientsRecord } from '@bgd-labs/frontend-web3-utils';
import { writeContract } from '@wagmi/core';
import { Address, Hex } from 'viem';
import { Config } from 'wagmi';

import { appConfig, isForIPFS } from '../../configs/appConfig';
import { fetchPayloads } from '../../requests/fetchPayloads';
import { api } from '../../trpc/client';
import { InitialPayloadState, ProposalInitialStruct } from '../../types';

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
  clients: ClientsRecord;
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
          payloadsControllers.map((controller) => {
            const payloadsIds = payloads
              .filter(
                (payload) =>
                  Number(payload.chain) === Number(chainId) &&
                  payload.payloadsController === controller,
              )
              .map((payload) => payload.payloadId);

            const input = {
              chainId: Number(chainId),
              payloadsIds,
            };

            return isForIPFS
              ? fetchPayloads({ input: { ...input, clients } })
              : api.payloads.getAll.query(input);
          }),
        );
      }),
    )
  )
    .flat()
    .flat();

  if (
    payloadsData.some(
      (payload) => payload.data.state === InitialPayloadState.Expired,
    )
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
