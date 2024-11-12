import {
  IGovernanceDataHelper_ABI,
  IPayloadsControllerDataHelper_ABI,
} from '@bgd-labs/aave-address-book';
import { Client } from 'viem';
import { readContract } from 'viem/actions';

import { appConfig } from '../../configs/appConfig';
import { PAGE_SIZE } from '../../configs/configs';

enum ProposalState {
  Null, // proposal does not exists
  Created, // created, waiting for a cooldown to initiate the balances snapshot
  Active, // balances snapshot set, voting in progress
  Queued, // voting results submitted, but proposal is under grace period when guardian can cancel it
  Executed, // results sent to the execution chain(s)
  Failed, // voting was not successful
  Cancelled, // got cancelled by guardian, or because proposition power of creator dropped below allowed minimum
  Expired,
}

enum PayloadState {
  None,
  Created,
  Queued,
  Executed,
  Cancelled,
  Expired,
}

export type GetProposalsWithPayloadsData = {
  proposalsCount?: number;
  proposalsIds?: number[];
  pageSize?: number;
  client: Client;
};

export async function getProposalsWithPayloadsData({
  proposalsCount,
  proposalsIds,
  pageSize,
  client,
}: GetProposalsWithPayloadsData) {
  const ids = proposalsCount
    ? [...Array(Number(proposalsCount)).keys()]
    : (proposalsIds ?? []);

  const fr = Math.max.apply(
    null,
    ids.map((id) => id),
  );
  const to = Math.min.apply(
    null,
    ids.map((id) => id),
  );

  const proposalsData = await readContract(client, {
    abi: IGovernanceDataHelper_ABI,
    address: appConfig.govCoreConfig.dataHelperContractAddress,
    functionName: 'getProposalsData',
    args: [
      appConfig.govCoreConfig.contractAddress,
      BigInt(fr),
      BigInt(to || 0),
      BigInt(pageSize || proposalsCount || PAGE_SIZE),
    ],
  });

  const payloadsData = (
    await Promise.all(
      proposalsData.map(async (proposal) => {
        const payloadsChains = proposal.proposalData.payloads
          .map((payload) => payload.chain)
          .filter((value, index, self) => self.indexOf(value) === index);

        return (
          await Promise.all(
            payloadsChains.map(async (chain) => {
              const payloadsByChain = proposal.proposalData.payloads.filter(
                (payload) => payload.chain === chain,
              );
              const payloadsController = payloadsByChain.map(
                (payload) => payload.payloadsController,
              )[0];

              const payloadsData = await readContract(client, {
                abi: IPayloadsControllerDataHelper_ABI,
                address:
                  appConfig.payloadsControllerConfig[Number(chain)]
                    .dataHelperContractAddress,
                functionName: 'getPayloadsData',
                args: [
                  payloadsController,
                  payloadsByChain.map((payload) => payload.payloadId),
                ],
              });

              return payloadsData.map((payload) => {
                return {
                  ...payload,
                  chain,
                  payloadsController,
                };
              });
            }),
          )
        ).flat();
      }),
    )
  ).flat();

  return proposalsData.map((proposal) => {
    const proposalPayloads = proposal.proposalData.payloads.map((payload) => {
      const data = payloadsData.find(
        (p) =>
          Number(p.id) === payload.payloadId &&
          p.chain === payload.chain &&
          p.payloadsController === payload.payloadsController,
      );
      if (data) {
        return data;
      } else {
        return payloadsData[0]; // TODO: need fix
      }
    });

    const isProposalPayloadsFinished = proposalPayloads.every(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (payload) => payload && payload?.state > PayloadState.Queued,
    );

    return {
      ...proposal,
      payloads: proposalPayloads,
      isFinished:
        proposal.proposalData.state === ProposalState.Executed
          ? isProposalPayloadsFinished
          : proposal.proposalData.state > ProposalState.Executed,
    };
  });
}
