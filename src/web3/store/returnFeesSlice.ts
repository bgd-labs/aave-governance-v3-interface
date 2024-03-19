import { IPayloadsControllerCore_ABI } from '@bgd-labs/aave-address-book';
import {
  BasicProposal,
  CombineProposalState,
  getProposalState,
  getVotingMachineProposalState,
  Payload,
  ReturnFee,
  ReturnFeeState,
} from '@bgd-labs/aave-governance-ui-helpers';
import { StoreSlice } from '@bgd-labs/frontend-web3-utils';
import { produce } from 'immer';
import { Address, getContract } from 'viem';

import { IProposalsSlice } from '../../proposals/store/proposalsSlice';
import {
  AppClient,
  IRpcSwitcherSlice,
} from '../../rpcSwitcher/store/rpcSwitcherSlice';
import {
  cachedDetailsPath,
  cachedReturnFeesPath,
  githubStartUrl,
} from '../../utils/cacheGithubLinks';
import { selectReturnsFeesDataByCreator } from './returnFeesSelectors';
import { IWeb3Slice } from './web3Slice';

async function getProposalPayloads(
  appClients: Record<number, AppClient>,
  proposal: BasicProposal,
  payloadsData: Record<string, Payload>,
) {
  const resCachedDetails = await fetch(
    `${githubStartUrl}${cachedDetailsPath(proposal.id)}`,
  );

  const finalProposalPayloadsData: Payload[] = resCachedDetails.ok
    ? ((await resCachedDetails.json()).payloads as Payload[])
    : await Promise.all(
        proposal.initialPayloads.map(async (payload) => {
          const dataFromStore =
            payloadsData[`${payload.payloadsController}_${payload.id}`];

          if (dataFromStore) {
            return dataFromStore;
          } else {
            const contract = getContract({
              abi: IPayloadsControllerCore_ABI,
              client: appClients[payload.chainId].instance,
              address: payload.payloadsController as Address,
            });

            const payloadData = await contract.read.getPayloadById([
              payload.id,
            ]);

            return {
              id: payload.id,
              chainId: payload.chainId,
              payloadsController: payload.payloadsController,
              ...payloadData,
            };
          }
        }),
      );

  // maximum delay from all payloads in proposal for finished timestamp
  const executionDelay = Math.max.apply(
    0,
    finalProposalPayloadsData.map((payload) => payload?.delay || 0),
  );
  return {
    proposalPayloadsData: finalProposalPayloadsData.filter(
      (payload) => typeof payload !== 'undefined',
    ),
    executionDelay,
  };
}

export interface IReturnFeesSlice {
  returnFeesData: {
    proposalsCountOnRequest: number;
    data: Record<Address, Record<number, ReturnFee>>;
  };
  getReturnFeesData: () => Promise<void>;
  updateReturnFeesDataByCreator: (
    creator: Address,
    ids?: number[],
  ) => Promise<void>;

  dataByCreatorLength: Record<Address, number>;
  setDataByCreatorLength: (creator: Address, length: number) => void;
}

export const createReturnFeesSlice: StoreSlice<
  IReturnFeesSlice,
  IWeb3Slice & IProposalsSlice & IRpcSwitcherSlice
> = (set, get) => ({
  returnFeesData: {
    proposalsCountOnRequest: -1,
    data: {},
  },
  getReturnFeesData: async () => {
    const returnFeesResult = await fetch(
      `${githubStartUrl}/${cachedReturnFeesPath}`,
    );

    if (returnFeesResult.ok) {
      const returnFeesData = (await returnFeesResult.json()) as {
        data: Record<Address, Record<number, ReturnFee>>;
      };

      set((state) =>
        produce(state, (draft) => {
          draft.returnFeesData.proposalsCountOnRequest =
            get().totalProposalCount;
          draft.returnFeesData.data = {
            ...returnFeesData.data,
            ...draft.returnFeesData.data,
          };
        }),
      );
    }
  },

  // TODO: test update for not all creator proposals
  updateReturnFeesDataByCreator: async (creator, ids) => {
    const creatorReturnFeesData = selectReturnsFeesDataByCreator(
      get(),
      creator,
    );

    if (creatorReturnFeesData) {
      const filteredData = Object.values(creatorReturnFeesData)
        .filter((data) => data.status < ReturnFeeState.RETURNED)
        .filter((data) => (!!ids ? ids.includes(data.proposalId) : true));

      const from = Math.max(...filteredData.map((data) => data.proposalId));
      const to = Math.min(...filteredData.map((data) => data.proposalId));

      const proposalsData = await get().govDataService.getDetailedProposalsData(
        get().configs,
        from,
        to,
        undefined,
        undefined,
        get().totalProposalCount,
        get().setRpcError,
      );

      const finalData = await Promise.all(
        filteredData.map(async (data) => {
          const proposal = proposalsData.filter(
            (proposal) => proposal.id === data.proposalId,
          )[0];

          const proposalConfig = get().configs.filter(
            (config) => config.accessLevel === proposal.accessLevel,
          )[0];

          const { proposalPayloadsData, executionDelay } =
            await getProposalPayloads(
              get().appClients,
              proposal,
              get().detailedPayloadsData,
            );

          const formattedProposalData = {
            ...proposal,
            payloads: proposalPayloadsData,
            title: data.title || `Proposal ${proposal.id}`,
            votingMachineState: getVotingMachineProposalState(proposal),
          };

          const proposalState = getProposalState({
            proposalData: formattedProposalData,
            quorum: proposalConfig.quorum,
            differential: proposalConfig.differential,
            precisionDivider: get().contractsConstants.precisionDivider,
            cooldownPeriod: get().contractsConstants.cooldownPeriod,
            executionDelay,
          });

          let status = ReturnFeeState.LATER;
          if (
            proposalState === CombineProposalState.Executed &&
            proposal.cancellationFee > 0
          ) {
            status = ReturnFeeState.AVAILABLE;
          } else if (
            proposalState === CombineProposalState.Executed &&
            proposal.cancellationFee <= 0
          ) {
            status = ReturnFeeState.RETURNED;
          } else if (proposalState > CombineProposalState.Executed) {
            status = ReturnFeeState.NOT_AVAILABLE;
          } else {
            status = ReturnFeeState.LATER;
          }

          return {
            ...data,
            status,
          };
        }),
      );

      finalData.forEach((data) => {
        set((state) =>
          produce(state, (draft) => {
            draft.returnFeesData.data[creator] = {
              ...draft.returnFeesData.data[creator],
              ...data,
            };
          }),
        );
      });
    }
  },

  dataByCreatorLength: {},
  setDataByCreatorLength: (creator, length) => {
    if (get().dataByCreatorLength[creator] !== length) {
      set((state) =>
        produce(state, (draft) => {
          draft.dataByCreatorLength[creator] = length;
        }),
      );
    }
  },
});
