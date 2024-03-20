import { IPayloadsControllerCore_ABI } from '@bgd-labs/aave-address-book';
import {
  BasicProposal,
  CachedDetails,
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
  TransactionsSlice,
  TxType,
} from '../../transactions/store/transactionsSlice';
import { IUISlice } from '../../ui/store/uiSlice';
import { appConfig } from '../../utils/appConfig';
import {
  cachedDetailsPath,
  cachedReturnFeesPath,
  githubStartUrl,
} from '../../utils/cacheGithubLinks';
import { selectReturnsFeesDataByCreator } from './returnFeesSelectors';
import { IWeb3Slice } from './web3Slice';

async function getPayloads(
  appClients: Record<number, AppClient>,
  proposal: BasicProposal,
  payloadsData: Record<string, Payload>,
) {
  return await Promise.all(
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

        const payloadData = await contract.read.getPayloadById([payload.id]);

        return {
          id: payload.id,
          chainId: payload.chainId,
          payloadsController: payload.payloadsController,
          ...payloadData,
        };
      }
    }),
  );
}

async function getProposalPayloads(
  appClients: Record<number, AppClient>,
  proposal: BasicProposal,
  payloadsData: Record<string, Payload>,
) {
  const resCachedDetails = await fetch(
    `${githubStartUrl}${cachedDetailsPath(proposal.id)}`,
  );

  let finalProposalPayloadsData: Payload[] = [];
  if (resCachedDetails.ok) {
    const proposalCacheData = (await resCachedDetails.json()) as CachedDetails;
    if (proposalCacheData.proposal.isFinished) {
      finalProposalPayloadsData = proposalCacheData.payloads;
    } else {
      finalProposalPayloadsData = await getPayloads(
        appClients,
        proposal,
        payloadsData,
      );
    }
  } else {
    finalProposalPayloadsData = await getPayloads(
      appClients,
      proposal,
      payloadsData,
    );
  }

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
  returnFeesProposalsCountOnRequest: number;
  returnFeesData: Record<Address, Record<number, ReturnFee>>;
  getReturnFeesData: () => Promise<void>;
  updateReturnFeesDataByCreator: (
    creator: Address,
    ids?: number[],
  ) => Promise<void>;

  dataByCreatorLength: Record<Address, number>;
  setDataByCreatorLength: (creator: Address, length: number) => void;

  returnFees: (
    creator: Address,
    proposalIds: number[],
    timestamp: number,
  ) => Promise<void>;
}

export const createReturnFeesSlice: StoreSlice<
  IReturnFeesSlice,
  IWeb3Slice &
    IProposalsSlice &
    IRpcSwitcherSlice &
    TransactionsSlice &
    IUISlice
> = (set, get) => ({
  returnFeesProposalsCountOnRequest: -1,

  returnFeesData: {},
  getReturnFeesData: async () => {
    const returnFeesResult = await fetch(
      `${githubStartUrl}/${cachedReturnFeesPath}`,
    );

    if (returnFeesResult.ok) {
      const returnFeesData = (await returnFeesResult.json()) as {
        data: Record<Address, Record<number, ReturnFee>>;
      };

      const count =
        get().totalProposalCount > 0
          ? get().totalProposalCount
          : await get().govDataService.getTotalProposalsCount();

      set((state) =>
        produce(state, (draft) => {
          draft.returnFeesProposalsCountOnRequest = count;
          draft.returnFeesData = {
            ...returnFeesData.data,
            ...draft.returnFeesData,
          };
        }),
      );
    }
  },

  updateReturnFeesDataByCreator: async (creator, ids) => {
    const govCoreConfigs = !!get().configs.length
      ? {
          contractsConstants: get().contractsConstants,
          configs: get().configs,
        }
      : await get().govDataService.getGovCoreConfigs();

    const totalProposalCount =
      get().totalProposalCount > 0
        ? get().totalProposalCount
        : await get().govDataService.getTotalProposalsCount();

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
        govCoreConfigs.configs,
        from,
        to,
        undefined,
        undefined,
        totalProposalCount,
        get().setRpcError,
      );

      const finalData = await Promise.all(
        filteredData.map(async (data) => {
          const proposal = proposalsData.find(
            (proposal) => proposal.id === data.proposalId,
          );

          if (proposal) {
            const proposalConfig = govCoreConfigs.configs.filter(
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
              precisionDivider:
                govCoreConfigs.contractsConstants.precisionDivider,
              cooldownPeriod: govCoreConfigs.contractsConstants.cooldownPeriod,
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
          }
        }),
      );

      finalData.forEach((data) => {
        if (!!data) {
          set((state) =>
            produce(state, (draft) => {
              draft.returnFeesData[creator] = {
                ...draft.returnFeesData[creator],
                [data.proposalId]: {
                  ...data,
                },
              };
            }),
          );
        }
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

  returnFees: async (creator, proposalIds, timestamp) => {
    await get().checkAndSwitchNetwork(appConfig.govCoreChainId);
    const govDataService = get().govDataService;
    const activeAddress = get().activeWallet?.address;

    if (activeAddress) {
      await get().executeTx({
        body: () => {
          get().setModalOpen(true);
          return govDataService.returnFees(proposalIds);
        },
        params: {
          type: TxType.returnFees,
          desiredChainID: appConfig.govCoreChainId,
          payload: { creator, proposalIds, timestamp },
        },
      });
    }
  },
});
