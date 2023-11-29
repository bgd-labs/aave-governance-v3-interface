import {
  AaveGovernanceV2,
  IAaveGovernanceV2_ABI,
} from '@bgd-labs/aave-address-book';
import { getEventsBySteps } from '@bgd-labs/aave-governance-ui-helpers';
import { StoreSlice } from '@bgd-labs/frontend-web3-utils';
import { decodeAbiParameters, Hex } from 'viem';

import { IProposalsSlice } from '../../proposals/store/proposalsSlice';
import { IRpcSwitcherSlice } from '../../rpcSwitcher/store/rpcSwitcherSlice';
import { TransactionsSlice } from '../../transactions/store/transactionsSlice';
import { IUISlice } from '../../ui/store/uiSlice';
import { appConfig } from '../../utils/appConfig';
import { IEnsSlice } from '../../web3/store/ensSlice';
import { IWeb3Slice } from '../../web3/store/web3Slice';

type CreatedEventCallDataPayload = {
  chainId: number;
  accessLevel: number;
  payloadsController: string;
  payloadId: number;
};

export type CreatedEventData = {
  proposalId: number;
  ipfsHash: Hex;
  creator: Hex;
  payloads: Record<string, CreatedEventCallDataPayload>;
};
export interface IProposalCreateOverviewV2Slice {
  proposalCreatedEventsData: CreatedEventData[];
  getProposalCreatedEventsData: () => Promise<void>;
}

export const createProposalCreateOverviewV2Slice: StoreSlice<
  IProposalCreateOverviewV2Slice,
  IWeb3Slice &
    TransactionsSlice &
    IProposalsSlice &
    IUISlice &
    IEnsSlice &
    IRpcSwitcherSlice
> = (set, get) => ({
  proposalCreatedEventsData: [],

  getProposalCreatedEventsData: async () => {
    const govCore = get().govDataService.govCore;
    const client = get().clients[appConfig.govCoreChainId];

    const currentBlock = await client.getBlock();

    const events = async (startBlock: number, endBlock: number) =>
      await client.getContractEvents({
        address: AaveGovernanceV2.GOV,
        abi: IAaveGovernanceV2_ABI,
        eventName: 'ProposalCreated',
        fromBlock: BigInt(startBlock),
        toBlock: BigInt(endBlock),
      });

    const data = await getEventsBySteps(
      Number(currentBlock.number) - 864000 / 15, // 10 days in seconds / average eth block time (15)
      Number(currentBlock.number),
      799,
      events,
    );

    const formattedData = data
      .map((data) => data.args)
      .sort((a, b) => Number(b.id) - Number(a.id))
      .filter(
        (data) =>
          data.targets?.every(
            (target) => target.toLowerCase() === govCore.address.toLowerCase(),
          ),
      )
      .map((data) => {
        const formattedCallDatas =
          data.calldatas?.map((callData) => {
            return decodeAbiParameters(
              [
                { name: 'chainId', type: 'uint256' },
                { name: 'accessLevel', type: 'uint8' },
                { name: 'payloadsController', type: 'address' },
                { name: 'payloadId', type: 'uint40' },
              ],
              callData,
            );
          }) || [];

        const payloadsData: Record<string, CreatedEventCallDataPayload> = {};
        formattedCallDatas.forEach((data) => {
          const itemData: CreatedEventCallDataPayload = {
            chainId: Number(data[0]),
            accessLevel: data[1],
            payloadsController: data[2],
            payloadId: data[3],
          };
          payloadsData[`${itemData.payloadsController}_${itemData.payloadId}`] =
            itemData;
        });

        return {
          proposalId: Number(data.id),
          ipfsHash: data.ipfsHash,
          creator: data.creator,
          payloads: payloadsData,
        } as CreatedEventData;
      });

    set({ proposalCreatedEventsData: formattedData });
  },
});
