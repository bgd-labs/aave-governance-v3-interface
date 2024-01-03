import { valueToBigNumber } from '@bgd-labs/aave-governance-ui-helpers';
import {
  ClientsRecord,
  createWalletSlice,
  IWalletSlice,
  StoreSlice,
} from '@bgd-labs/frontend-web3-utils';
import dayjs from 'dayjs';
import { Draft, produce } from 'immer';
import { Hex } from 'viem';

import { TransactionsSlice } from '../../transactions/store/transactionsSlice';
import { DelegationService } from '../services/delegationService';
import { GovDataService } from '../services/govDataService';

/**
 * web3Slice is required only to have a better control over providers state i.e
 * change provider, trigger data refetch if provider changed and have globally available instances of rpcs and data providers
 */

type PowerByAsset = {
  userBalance: string;
  totalPowerBasic: string;
  totalPower: string;
  delegatedPowerBasic: string;
  delegatedPower: string;
  isWithDelegatedPower: boolean;
};

type PowersByAssets = Record<
  Hex,
  {
    tokenName: string;
    underlyingAsset: Hex;
    proposition: PowerByAsset;
    voting: PowerByAsset;
  }
>;

type CurrentPower = {
  timestamp: number;
  totalPropositionPower: number;
  totalVotingPower: number;
  yourPropositionPower: number;
  yourVotingPower: number;
  delegatedPropositionPower: number;
  delegatedVotingPower: number;
  powersByAssets: PowersByAssets;
};

export type IWeb3Slice = IWalletSlice & {
  // need for connect wallet button to not show last tx status always after connected wallet
  walletConnectedTimeLock: boolean;

  govDataService: GovDataService;
  delegationService: DelegationService;

  connectSigner: () => void;
  initDataServices: (clients: ClientsRecord) => void;

  currentPowers: Record<Hex, CurrentPower>;
  gutCurrentPowers: (address: Hex, request?: boolean) => Promise<void>;
};

export const createWeb3Slice: StoreSlice<IWeb3Slice, TransactionsSlice> = (
  set,
  get,
) => ({
  ...createWalletSlice({
    walletConnected: () => {
      get().connectSigner();
    },
  })(set, get),
  govDataService: new GovDataService({}),
  delegationService: new DelegationService({}),

  walletConnectedTimeLock: false,
  connectSigner() {
    const activeWallet = get().activeWallet;
    set({ walletConnectedTimeLock: true });
    if (activeWallet?.walletClient) {
      get().govDataService.connectSigner(activeWallet.walletClient);
      get().delegationService.connectSigner(activeWallet.walletClient);
    }
    setTimeout(() => set({ walletConnectedTimeLock: false }), 1000);
  },
  initDataServices(clients) {
    set({ delegationService: new DelegationService(clients) });
    set({ govDataService: new GovDataService(clients) });
    get().connectSigner();
  },

  currentPowers: {},
  gutCurrentPowers: async (address, request) => {
    const now = dayjs().unix();

    const requestAndSetData = async () => {
      const votingStrategy =
        await get().govDataService.getVotingStrategyContract();
      const underlyingAssets =
        (await votingStrategy.read.getVotingAssetList()) as Draft<Hex[]>;

      const powers = await get().delegationService.getUserPowers(
        address,
        underlyingAssets,
      );

      const powersByAssets: PowersByAssets = {};
      powers.forEach((asset) => {
        powersByAssets[asset.underlyingAsset] = {
          tokenName: asset.tokenName,
          underlyingAsset: asset.underlyingAsset,
          proposition: asset.proposition,
          voting: asset.voting,
        };
      });

      const totalPropositionPower = powers
        .map((power) =>
          valueToBigNumber(power.proposition.totalPower).toNumber(),
        )
        .reduce((sum, value) => sum + value, 0);
      const totalVotingPower = powers
        .map((power) => valueToBigNumber(power.voting.totalPower).toNumber())
        .reduce((sum, value) => sum + value, 0);

      const yourPropositionPower = powers
        .map((power) =>
          valueToBigNumber(power.proposition.userBalance).toNumber(),
        )
        .reduce((sum, value) => sum + value, 0);
      const yourVotingPower = powers
        .map((power) => valueToBigNumber(power.voting.userBalance).toNumber())
        .reduce((sum, value) => sum + value, 0);

      const delegatedPropositionPower = powers
        .map((power) =>
          valueToBigNumber(power.proposition.delegatedPower).toNumber(),
        )
        .reduce((sum, value) => sum + value, 0);
      const delegatedVotingPower = powers
        .map((power) =>
          valueToBigNumber(power.voting.delegatedPower).toNumber(),
        )
        .reduce((sum, value) => sum + value, 0);

      set((state) =>
        produce(state, (draft) => {
          draft.currentPowers[address] = {
            timestamp: Number(powers[0].timestamp),
            totalPropositionPower,
            totalVotingPower,
            yourPropositionPower,
            yourVotingPower,
            delegatedPropositionPower,
            delegatedVotingPower,
            powersByAssets,
          };
        }),
      );
    };

    if (!!get().delegationService && !!get().govDataService) {
      if (!!get().currentPowers[address]) {
        if (get().currentPowers[address].timestamp + 3600000 < now || request) {
          await requestAndSetData();
        }
      } else {
        await requestAndSetData();
      }
    }
  },
});
