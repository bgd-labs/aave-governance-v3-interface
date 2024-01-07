'use client';

import {
  baseVotingStrategyContract,
  BasicProposal,
  blockLimit,
  dataWarehouseContract,
  getBlocksForEvents,
  getDetailedProposalsData,
  getGovCoreConfigs,
  getPayloadsCreated,
  getPayloadsExecuted,
  getPayloadsQueued,
  getProposalActivated,
  getProposalActivatedOnVM,
  getProposalCreated,
  getProposalQueued,
  getProposalVotingClosed,
  getVoters,
  govCoreContract,
  govCoreDataHelperContract,
  InitialProposal,
  Payload,
  PayloadAction,
  PayloadForCreation,
  payloadsControllerContract as initPayloadControllerContract,
  payloadsControllerDataHelperContract,
  PayloadState,
  ProposalData,
  updateVotingMachineData,
  VMProposalStructOutput,
  VotersData,
  VotingConfig,
  votingMachineContract,
  votingMachineDataHelperContract,
} from '@bgd-labs/aave-governance-ui-helpers';
import { ClientsRecord } from '@bgd-labs/frontend-web3-utils';
import { GelatoRelay, SponsoredCallRequest } from '@gelatonetwork/relay-sdk';
import { BaseRelayParams } from '@gelatonetwork/relay-sdk/dist/lib/types';
import { WalletClient } from '@wagmi/core';
import {
  bytesToHex,
  encodeFunctionData,
  Hex,
  pad,
  stringToBytes,
  toHex,
  zeroAddress,
  zeroHash,
} from 'viem';

import { SetRpcErrorParams } from '../../rpcSwitcher/store/rpcSwitcherSlice';
import { appConfig, gelatoApiKeys } from '../../utils/appConfig';
import {
  formatToProofRLP,
  getExtendedBlock,
  getProof,
  getSolidityStorageSlotBytes,
  prepareBLockRLP,
} from '../utils/helperToGetProofs';
import { getVoteSignatureParams } from '../utils/signatures';

export const PAGE_SIZE = 12;

function initContracts(clients: ClientsRecord, walletClient?: WalletClient) {
  const govCore = govCoreContract({
    contractAddress: appConfig.govCoreConfig.contractAddress,
    client: clients[appConfig.govCoreChainId],
    walletClient,
  });
  const govCoreDataHelper = govCoreDataHelperContract({
    contractAddress: appConfig.govCoreConfig.dataHelperContractAddress,
    client: clients[appConfig.govCoreChainId],
    walletClient,
  });

  const votingMachines = {
    [appConfig.votingMachineChainIds[0]]: votingMachineContract({
      contractAddress:
        appConfig.votingMachineConfig[appConfig.votingMachineChainIds[0]]
          .contractAddress,
      client: clients[appConfig.votingMachineChainIds[0]],
      walletClient,
    }),
  };
  if (appConfig.votingMachineChainIds.length > 1) {
    appConfig.votingMachineChainIds.forEach((chainId) => {
      const votingMachineConfig = appConfig.votingMachineConfig[chainId];
      votingMachines[chainId] = votingMachineContract({
        contractAddress: votingMachineConfig.contractAddress,
        client: clients[chainId],
        walletClient,
      });
    });
  }

  const votingMachineDataHelpers = {
    [appConfig.votingMachineChainIds[0]]: votingMachineDataHelperContract({
      contractAddress:
        appConfig.votingMachineConfig[appConfig.votingMachineChainIds[0]]
          .dataHelperContractAddress,
      client: clients[appConfig.votingMachineChainIds[0]],
      walletClient,
    }),
  };
  if (appConfig.votingMachineChainIds.length > 1) {
    appConfig.votingMachineChainIds.forEach((chainId) => {
      const votingMachineConfig = appConfig.votingMachineConfig[chainId];
      votingMachineDataHelpers[chainId] = votingMachineDataHelperContract({
        contractAddress: votingMachineConfig.dataHelperContractAddress,
        client: clients[chainId],
        walletClient,
      });
    });
  }

  const payloadsControllerDataHelpers = {
    [appConfig.payloadsControllerChainIds[0]]:
      payloadsControllerDataHelperContract({
        contractAddress:
          appConfig.payloadsControllerConfig[
            appConfig.payloadsControllerChainIds[0]
          ].dataHelperContractAddress,
        client: clients[appConfig.payloadsControllerChainIds[0]],
        walletClient,
      }),
  };
  if (appConfig.payloadsControllerChainIds.length > 1) {
    appConfig.payloadsControllerChainIds.forEach((chainId) => {
      const payloadsControllerConfig =
        appConfig.payloadsControllerConfig[chainId];
      payloadsControllerDataHelpers[chainId] =
        payloadsControllerDataHelperContract({
          contractAddress: payloadsControllerConfig.dataHelperContractAddress,
          client: clients[chainId],
          walletClient,
        });
    });
  }

  return {
    govCore,
    govCoreDataHelper,
    votingMachines,
    votingMachineDataHelpers,
    payloadsControllerDataHelpers,
  };
}

export class GovDataService {
  public govCore;
  private govCoreDataHelper;

  private votingMachines;
  private votingMachineDataHelpers;
  private payloadsControllerDataHelpers;

  private walletClient: WalletClient | undefined = undefined;
  private clients: ClientsRecord;

  constructor(clients: ClientsRecord) {
    this.clients = clients;
    // contracts
    // core
    this.govCore = initContracts(this.clients).govCore;
    this.govCoreDataHelper = initContracts(this.clients).govCoreDataHelper;
    // voting
    this.votingMachines = initContracts(this.clients).votingMachines;
    this.votingMachineDataHelpers = initContracts(
      this.clients,
    ).votingMachineDataHelpers;
    // payloads controllers
    this.payloadsControllerDataHelpers = initContracts(
      this.clients,
    ).payloadsControllerDataHelpers;
  }

  connectSigner(walletClient: WalletClient) {
    this.walletClient = walletClient;
    // contracts
    // core
    this.govCore = initContracts(this.clients, this.walletClient).govCore;
    this.govCoreDataHelper = initContracts(
      this.clients,
      this.walletClient,
    ).govCoreDataHelper;
    // voting
    this.votingMachines = initContracts(
      this.clients,
      this.walletClient,
    ).votingMachines;
    this.votingMachineDataHelpers = initContracts(
      this.clients,
      this.walletClient,
    ).votingMachineDataHelpers;
    // payloads controllers
    this.payloadsControllerDataHelpers = initContracts(
      this.clients,
      this.walletClient,
    ).payloadsControllerDataHelpers;
  }

  async getGovCoreConfigs(
    setRpcError?: ({ isError, rpcUrl, chainId }: SetRpcErrorParams) => void,
  ) {
    const rpcUrl =
      this.clients[appConfig.govCoreChainId].chain.rpcUrls.default.http[0];

    const govCoreConfigs = await getGovCoreConfigs({
      client: this.clients[appConfig.govCoreChainId],
      govCoreContractAddress: this.govCore.address,
      govCoreDataHelperContractAddress: this.govCoreDataHelper.address,
    });

    if (
      !!setRpcError &&
      govCoreConfigs.contractsConstants.expirationTime > 1000
    ) {
      setRpcError({
        isError: false,
        rpcUrl,
        chainId: appConfig.govCoreChainId,
      });
    } else if (
      !!setRpcError &&
      govCoreConfigs.contractsConstants.expirationTime <= 1000
    ) {
      setRpcError({
        isError: true,
        rpcUrl,
        chainId: appConfig.govCoreChainId,
      });
    }

    return govCoreConfigs;
  }

  async getTotalProposalsCount(
    prevProposalCount?: number,
    setRpcError?: ({ isError, rpcUrl, chainId }: SetRpcErrorParams) => void,
  ): Promise<number> {
    const rpcUrl =
      this.clients[appConfig.govCoreChainId].chain.rpcUrls.default.http[0];

    try {
      const proposalsCount = await this.govCore.read.getProposalsCount();
      if (!!setRpcError) {
        setRpcError({
          isError: false,
          rpcUrl,
          chainId: appConfig.govCoreChainId,
        });
      }
      return Number(proposalsCount);
    } catch {
      if (!!setRpcError) {
        setRpcError({
          isError: true,
          rpcUrl,
          chainId: appConfig.govCoreChainId,
        });
      }
      if (prevProposalCount) {
        return prevProposalCount;
      } else {
        return 0;
      }
    }
  }

  async getTotalPayloadsCount(
    payloadsController: Hex,
    chainId: number,
    setRpcError?: ({ isError, rpcUrl, chainId }: SetRpcErrorParams) => void,
  ): Promise<number> {
    const rpcUrl = this.clients[chainId].chain.rpcUrls.default.http[0];

    try {
      const payloadsControllerContract = initPayloadControllerContract({
        client: this.clients[chainId],
        contractAddress: payloadsController,
      });

      const payloadsCount =
        await payloadsControllerContract.read.getPayloadsCount();
      if (!!setRpcError) {
        setRpcError({
          isError: false,
          rpcUrl,
          chainId: chainId,
        });
      }
      return Number(payloadsCount);
    } catch {
      if (!!setRpcError) {
        setRpcError({
          isError: true,
          rpcUrl,
          chainId: chainId,
        });
      }
      return 0;
    }
  }

  async getPayloads(
    chainId: number,
    payloadsController: Hex,
    payloadsIds: number[],
  ): Promise<Payload[]> {
    const payloadsControllerDataHelper =
      this.payloadsControllerDataHelpers[chainId];

    const initialPayloadsData =
      (await payloadsControllerDataHelper.read.getPayloadsData([
        payloadsController,
        payloadsIds,
      ])) || [];

    return initialPayloadsData.map((payload) => {
      return {
        creator: payload.data.creator,
        id: Number(payload.id),
        chainId,
        maximumAccessLevelRequired: payload.data.maximumAccessLevelRequired,
        state: payload.data.state,
        createdAt: payload.data.createdAt,
        queuedAt: payload.data.queuedAt,
        executedAt: payload.data.executedAt,
        cancelledAt: payload.data.cancelledAt,
        expirationTime: payload.data.expirationTime,
        delay: payload.data.delay,
        gracePeriod: payload.data.gracePeriod,
        actionAddresses: payload.data.actions.map((action) => action.target),
        payloadsController,
      };
    });
  }

  async getVotingData(
    initialProposals: InitialProposal[],
    userAddress?: Hex,
    representative?: Hex,
    setRpcError?: ({ isError, rpcUrl, chainId }: SetRpcErrorParams) => void,
  ) {
    const votingMachineChainIds = initialProposals
      .map((data) => data.votingChainId)
      .filter((value, index, self) => self.indexOf(value) === index);

    const data = await Promise.all(
      votingMachineChainIds.map(async (chainId) => {
        const votingMachineDataHelper = this.votingMachineDataHelpers[chainId];

        const formattedInitialProposals = initialProposals
          .filter((proposal) => proposal.votingChainId === chainId)
          .map((proposal) => {
            return {
              id: proposal.id,
              snapshotBlockHash: proposal.snapshotBlockHash,
            };
          });

        const rpcUrl = this.clients[chainId].chain.rpcUrls.default.http[0];

        try {
          if (!!setRpcError) {
            setRpcError({ isError: false, rpcUrl, chainId });
          }
          if (representative && userAddress) {
            if (userAddress) {
              return (
                (await votingMachineDataHelper.read.getProposalsData([
                  this.votingMachines[chainId].address,
                  formattedInitialProposals,
                  representative || userAddress || zeroAddress,
                ])) || []
              );
            }
          }
          return (
            (await votingMachineDataHelper.read.getProposalsData([
              this.votingMachines[chainId].address,
              formattedInitialProposals,
              userAddress || zeroAddress,
            ])) || []
          );
        } catch {
          if (!!setRpcError) {
            setRpcError({ isError: true, rpcUrl, chainId });
          }
          return;
        }
      }),
    );

    return data.flat();
  }

  async getDetailedProposalsData(
    configs: VotingConfig[],
    from: number,
    to?: number,
    userAddress?: Hex,
    representative?: Hex,
    pageSize?: number,
    setRpcError?: ({ isError, rpcUrl, chainId }: SetRpcErrorParams) => void,
  ): Promise<BasicProposal[]> {
    try {
      const govCoreDataHelperData =
        await this.govCoreDataHelper.read.getProposalsData([
          this.govCore.address,
          BigInt(from),
          BigInt(to || 0),
          BigInt(pageSize || PAGE_SIZE),
        ]);

      const initialProposals = govCoreDataHelperData.map((proposal) => {
        return {
          id: proposal.id,
          votingChainId: Number(proposal.votingChainId),
          snapshotBlockHash: proposal.proposalData.snapshotBlockHash,
        };
      });

      const votingMachineDataHelperData = await this.getVotingData(
        initialProposals,
        userAddress,
        representative,
        setRpcError,
      );

      const proposalsIds = govCoreDataHelperData.map((proposal) =>
        Number(proposal.id),
      );

      return getDetailedProposalsData(
        configs,
        govCoreDataHelperData,
        votingMachineDataHelperData as VMProposalStructOutput[],
        proposalsIds,
      );
    } catch {
      const rpcUrl =
        this.clients[appConfig.govCoreChainId].chain.rpcUrls.default.http[0];

      if (!!setRpcError) {
        setRpcError({
          isError: false,
          rpcUrl,
          chainId: appConfig.govCoreChainId,
        });
      }

      return [];
    }
  }

  async getOnlyVotingMachineData(
    configs: VotingConfig[],
    proposals: ProposalData[],
    userAddress?: Hex,
    representative?: Hex,
    setRpcError?: ({ isError, rpcUrl, chainId }: SetRpcErrorParams) => void,
  ) {
    const initialProposals = proposals.map((proposal) => {
      return {
        id: BigInt(proposal?.id || 0),
        votingChainId: proposal?.votingChainId || appConfig.govCoreChainId,
        snapshotBlockHash: (proposal?.snapshotBlockHash as Hex) || zeroHash,
      };
    });

    const votingMachineDataHelperData = await this.getVotingData(
      initialProposals,
      userAddress,
      representative,
      setRpcError,
    );

    const proposalsIds = initialProposals.map((proposal) =>
      Number(proposal.id),
    );

    return updateVotingMachineData(
      configs,
      proposals,
      votingMachineDataHelperData as VMProposalStructOutput[],
      proposalsIds,
    );
  }

  async getVoters(
    votingChainId: number,
    startBlockNumber: number,
    endBlockNumber: number | undefined,
    lastBlockNumber: number | undefined,
  ): Promise<VotersData[]> {
    const currentBlock =
      (await this.clients[votingChainId].getBlockNumber()) || 0;

    const { startBlock, endBlock } = getBlocksForEvents(
      Number(currentBlock),
      startBlockNumber,
      endBlockNumber,
      lastBlockNumber,
    );

    const voters: VotersData[] = [];

    if (!!endBlock) {
      const newVoters = await getVoters({
        contractAddress: this.votingMachines[votingChainId].address,
        client: this.clients[votingChainId],
        endBlock,
        startBlock,
        blockLimit,
        chainId: votingChainId,
      });

      voters.push(...newVoters);
    }

    return voters;
  }

  // voting strategy contract
  async getVotingStrategyContract() {
    const votingStrategyAddress = await this.govCore.read.getPowerStrategy();

    return baseVotingStrategyContract({
      client: this.clients[appConfig.govCoreChainId],
      contractAddress: votingStrategyAddress,
    });
  }

  // representations
  async getRepresentationData(address: Hex) {
    const data = await this.govCoreDataHelper.read.getRepresentationData([
      appConfig.govCoreConfig.contractAddress,
      address,
      appConfig.votingMachineChainIds.map((chainId) => BigInt(chainId)),
    ]);

    return {
      representative: data[0],
      represented: data[1],
    };
  }

  async updateRepresentatives({
    data,
  }: {
    data: { representative: Hex; chainId: bigint }[];
  }) {
    return this.govCore.write.updateRepresentativesForChain([data], {
      // TODO: need for gnosis safe wallet for now (https://github.com/safe-global/safe-apps-sdk/issues/480)
      value: BigInt(0) as any,
    });
  }
  // end representations

  // tx's
  activateVoting(proposalId: number) {
    return this.govCore.write.activateVoting([BigInt(proposalId)]);
  }

  async sendProofs(
    user: Hex,
    blockNumber: number,
    asset: string,
    chainId: number,
    baseBalanceSlotRaw: number,
    withSlot?: boolean,
  ) {
    if (this.walletClient) {
      const blockData = await getExtendedBlock(
        this.clients[appConfig.govCoreChainId],
        blockNumber,
      );
      const blockHeaderRLP = prepareBLockRLP(blockData);

      const slot = getSolidityStorageSlotBytes(
        pad(toHex(baseBalanceSlotRaw), { size: 32 }),
        user,
      );
      const exchangeRateSlot = pad('0x51', { size: 32 });
      const delegatedStateSlot = pad('0x40', { size: 32 });

      const connectedDataWarehouse = dataWarehouseContract({
        contractAddress:
          appConfig.votingMachineConfig[chainId].dataWarehouseAddress,
        client: this.clients[chainId],
        walletClient: this.walletClient,
      });

      const AAVEAddress =
        asset.toLowerCase() === appConfig.additional.aaveAddress.toLowerCase()
          ? appConfig.additional.aaveAddress
          : undefined;
      const aAAVEAddress =
        asset.toLowerCase() === appConfig.additional.aAaveAddress.toLowerCase()
          ? appConfig.additional.aAaveAddress
          : undefined;
      const STKAAVEAddress =
        asset.toLowerCase() ===
        appConfig.additional.stkAAVEAddress.toLowerCase()
          ? appConfig.additional.stkAAVEAddress
          : undefined;
      const RepresentationsAddress =
        asset.toLowerCase() ===
        appConfig.govCoreConfig.contractAddress.toLowerCase()
          ? appConfig.govCoreConfig.contractAddress
          : undefined;

      if (AAVEAddress) {
        const rawAccountProofData = await getProof(
          this.clients[appConfig.govCoreChainId],
          AAVEAddress,
          [slot],
          blockNumber,
        );

        const accountStateProofRLP = formatToProofRLP(
          rawAccountProofData.accountProof,
        );

        return connectedDataWarehouse.write.processStorageRoot([
          AAVEAddress,
          blockData.hash as Hex,
          blockHeaderRLP,
          accountStateProofRLP,
        ]);
      }

      if (aAAVEAddress) {
        const rawAccountProofData = await getProof(
          this.clients[appConfig.govCoreChainId],
          aAAVEAddress,
          [slot, delegatedStateSlot],
          blockNumber,
        );

        const accountStateProofRLP = formatToProofRLP(
          rawAccountProofData.accountProof,
        );

        return connectedDataWarehouse.write.processStorageRoot([
          aAAVEAddress,
          blockData.hash as Hex,
          blockHeaderRLP,
          accountStateProofRLP,
        ]);
      }

      if (STKAAVEAddress && !withSlot) {
        const rawAccountProofData = await getProof(
          this.clients[appConfig.govCoreChainId],
          STKAAVEAddress,
          [slot, exchangeRateSlot],
          blockNumber,
        );

        const accountStateProofRLP = formatToProofRLP(
          rawAccountProofData.accountProof,
        );

        return connectedDataWarehouse.write.processStorageRoot([
          STKAAVEAddress,
          blockData.hash as Hex,
          blockHeaderRLP,
          accountStateProofRLP,
        ]);
      }

      if (STKAAVEAddress && withSlot) {
        const slotProof = await getProof(
          this.clients[appConfig.govCoreChainId],
          STKAAVEAddress,
          [exchangeRateSlot],
          blockNumber,
        );

        const slotProofRLP = formatToProofRLP(slotProof.storageProof[0].proof);

        return connectedDataWarehouse.write.processStorageSlot([
          STKAAVEAddress,
          blockData.hash as Hex,
          exchangeRateSlot,
          slotProofRLP,
        ]);
      }

      if (RepresentationsAddress) {
        const representationsSlot = pad(toHex(baseBalanceSlotRaw), {
          size: 32,
        });

        const rawAccountProofData = await getProof(
          this.clients[appConfig.govCoreChainId],
          RepresentationsAddress,
          [representationsSlot],
          blockNumber,
        );

        const accountStateProofRLP = formatToProofRLP(
          rawAccountProofData.accountProof,
        );

        return connectedDataWarehouse.write.processStorageRoot([
          RepresentationsAddress,
          blockData.hash as Hex,
          blockHeaderRLP,
          accountStateProofRLP,
        ]);
      }
    }
  }

  activateVotingOnVotingMachine(votingChainId: number, proposalId: number) {
    let connectedVotingMachine = this.votingMachines[votingChainId];
    return connectedVotingMachine.write.startProposalVote([BigInt(proposalId)]);
  }

  // proofs for vote
  async getCoreBlockNumber(blockHash: Hex) {
    return Number(
      (await this.clients[appConfig.govCoreChainId].getBlock({ blockHash }))
        .number,
    );
  }

  async getProofs({
    underlyingAsset,
    slot,
    blockNumber,
  }: {
    underlyingAsset: Hex;
    slot: string;
    blockNumber: number;
  }) {
    const rawProofData = await getProof(
      this.clients[appConfig.govCoreChainId],
      underlyingAsset,
      [slot],
      blockNumber,
    );

    return formatToProofRLP(rawProofData.storageProof[0].proof);
  }

  async getAndFormatProof({
    userAddress,
    underlyingAsset,
    blockNumber,
    baseBalanceSlotRaw,
  }: {
    userAddress: Hex;
    underlyingAsset: Hex;
    blockNumber: number;
    baseBalanceSlotRaw: number;
  }) {
    const hashedHolderSlot = getSolidityStorageSlotBytes(
      pad(toHex(baseBalanceSlotRaw), { size: 32 }),
      userAddress,
    );

    const proof = await this.getProofs({
      underlyingAsset,
      slot: hashedHolderSlot,
      blockNumber,
    });

    return {
      underlyingAsset,
      slot: BigInt(baseBalanceSlotRaw),
      proof,
    };
  }
  // end proofs

  async vote({
    votingChainId,
    proposalId,
    support,
    proofs,
    voterAddress,
    proofOfRepresentation,
  }: {
    votingChainId: number;
    proposalId: number;
    support: boolean;
    proofs: {
      underlyingAsset: Hex;
      slot: bigint;
      proof: Hex;
    }[];
    voterAddress?: Hex;
    proofOfRepresentation?: Hex;
  }) {
    let connectedVotingMachine = this.votingMachines[votingChainId];
    return !!voterAddress && !!proofOfRepresentation
      ? connectedVotingMachine.write.submitVoteAsRepresentative(
          [
            BigInt(proposalId),
            support,
            voterAddress,
            proofOfRepresentation,
            proofs,
          ],
          {
            // TODO: need for gnosis safe wallet for now (https://github.com/safe-global/safe-apps-sdk/issues/480)
            value: BigInt(0) as any,
          },
        )
      : connectedVotingMachine.write.submitVote(
          [BigInt(proposalId), support, proofs],
          {
            // TODO: need for gnosis safe wallet for now (https://github.com/safe-global/safe-apps-sdk/issues/480)
            value: BigInt(0) as any,
          },
        );
  }

  async voteBySignature({
    votingChainId,
    proposalId,
    support,
    votingAssetsWithSlot,
    proofs,
    signerAddress,
    voterAddress,
    proofOfRepresentation,
  }: {
    votingChainId: number;
    proposalId: number;
    support: boolean;
    votingAssetsWithSlot: { underlyingAsset: Hex; slot: number }[];
    proofs: {
      underlyingAsset: Hex;
      slot: bigint;
      proof: Hex;
    }[];
    signerAddress: Hex;
    voterAddress?: Hex;
    proofOfRepresentation?: Hex;
  }) {
    const relay = new GelatoRelay();
    let connectedVotingMachine = this.votingMachines[votingChainId];
    if (this.walletClient) {
      const signatureParams = !!voterAddress
        ? await getVoteSignatureParams({
            walletClient: this.walletClient,
            votingChainId,
            proposalId,
            voterAddress,
            representativeAddress: signerAddress,
            support,
            votingAssetsWithSlot,
          })
        : await getVoteSignatureParams({
            walletClient: this.walletClient,
            votingChainId,
            proposalId,
            voterAddress: signerAddress,
            support,
            votingAssetsWithSlot,
          });

      const gelatoApiKey = gelatoApiKeys[votingChainId];

      const data =
        !!voterAddress && !!proofOfRepresentation
          ? encodeFunctionData({
              abi: connectedVotingMachine.abi,
              functionName: 'submitVoteAsRepresentativeBySignature',
              args: [
                BigInt(proposalId),
                voterAddress,
                signerAddress,
                support,
                proofOfRepresentation,
                proofs,
                {
                  ...signatureParams,
                  v: Number(signatureParams.v),
                },
              ],
            })
          : encodeFunctionData({
              abi: connectedVotingMachine.abi,
              functionName: 'submitVoteBySignature',
              args: [
                BigInt(proposalId),
                signerAddress,
                support,
                proofs,
                Number(signatureParams.v),
                signatureParams.r,
                signatureParams.s,
              ],
            });

      const request: SponsoredCallRequest = {
        chainId: BigInt(votingChainId),
        target: appConfig.votingMachineConfig[votingChainId].contractAddress,
        data: data as BaseRelayParams['data'],
      };

      return relay.sponsoredCall(request, gelatoApiKey);
    } else {
      return connectedVotingMachine.write.submitVote([
        BigInt(proposalId),
        support,
        proofs,
      ]);
    }
  }

  closeAndSendVote(votingChainId: number, proposalId: number) {
    let connectedVotingMachine = this.votingMachines[votingChainId];
    return connectedVotingMachine.write.closeAndSendVote([BigInt(proposalId)]);
  }

  executeProposal(proposalId: number) {
    return this.govCore.write.executeProposal([BigInt(proposalId)]);
  }

  executePayload(chainId: number, payloadId: number, payloadsController: Hex) {
    const payloadsControllerContract = initPayloadControllerContract({
      client: this.clients[chainId],
      contractAddress: payloadsController,
      walletClient: this.walletClient,
    });
    return payloadsControllerContract.write.executePayload([payloadId], {
      // TODO: need for gnosis safe wallet for now (https://github.com/safe-global/safe-apps-sdk/issues/480)
      value: BigInt(0) as any,
    });
  }

  async createPayload(
    chainId: number,
    payloadActions: PayloadAction[],
    payloadsController: Hex,
  ) {
    const payloadsControllerContract = initPayloadControllerContract({
      client: this.clients[chainId],
      contractAddress: payloadsController,
      walletClient: this.walletClient,
    });

    const formattedPayloadActions = payloadActions.map((payloadData) => {
      return {
        target: payloadData.payloadAddress,
        withDelegateCall: payloadData.withDelegateCall,
        accessLevel: payloadData.accessLevel,
        value: BigInt(payloadData.value),
        signature: payloadData.signature,
        callData: bytesToHex(stringToBytes(payloadData.callData || '')),
      };
    });

    return payloadsControllerContract.write.createPayload([
      formattedPayloadActions,
    ]);
  }

  async createProposal(
    votingPortalAddress: Hex,
    payloads: {
      chain: number;
      accessLevel: number;
      id: number;
      payloadsController: Hex;
    }[],
    ipfsHash: Hex,
    cancellationFee: string,
  ) {
    const payloadsChainIds = payloads
      .map((payload) => payload.chain)
      .filter((value, index, self) => self.indexOf(value) === index);

    const payloadsControllers = payloads
      .map((payload) => payload.payloadsController)
      .filter((value, index, self) => self.indexOf(value) === index);

    const payloadsData = await Promise.all(
      payloadsChainIds.map(async (chainId) => {
        return await Promise.all(
          payloadsControllers.map(async (controller) => {
            const payloadsIds = payloads
              .filter(
                (payload) =>
                  payload.chain === chainId &&
                  payload.payloadsController === controller,
              )
              .flat()
              .map((payload) => payload.id);

            return await this.getPayloads(chainId, controller, payloadsIds);
          }),
        );
      }),
    );

    if (
      payloadsData
        .flat()
        .flat()
        .some((payload) => payload.state === PayloadState.Expired)
    ) {
      throw new Error('One ore multiple payloads has expired status');
    }

    const formattedPayloads = payloads.map((payload) => {
      return {
        chain: BigInt(payload.chain),
        accessLevel: payload.accessLevel,
        payloadsController: payload.payloadsController,
        payloadId: payload.id,
      } as PayloadForCreation;
    });

    return this.govCore.write.createProposal(
      [formattedPayloads, votingPortalAddress, ipfsHash],
      {
        value: BigInt(cancellationFee),
      },
    );
  }

  // only for admin
  async cancelProposal(proposalId: number) {
    return this.govCore.write.cancelProposal([BigInt(proposalId)]);
  }

  // history events
  async getPayloadsCreatedEvents(
    chainId: number,
    address: Hex,
    startBlock: number,
    endBlock: number,
  ) {
    return getPayloadsCreated({
      contractAddress: address,
      client: this.clients[chainId],
      startBlock,
      endBlock,
      chainId,
    });
  }

  async getProposalCreatedEvents(startBlock: number, endBlock: number) {
    return getProposalCreated({
      contractAddress: this.govCore.address,
      client: this.clients[appConfig.govCoreChainId],
      startBlock,
      endBlock,
    });
  }
  async getProposalActivatedEvents(startBlock: number, endBlock: number) {
    return getProposalActivated({
      contractAddress: this.govCore.address,
      client: this.clients[appConfig.govCoreChainId],
      startBlock,
      endBlock,
    });
  }

  async getProposalActivatedOnVMEvents(
    votingChainId: number,
    startBlock: number,
    endBlock: number,
  ) {
    const votingMachine = this.votingMachines[votingChainId];
    return getProposalActivatedOnVM({
      contractAddress: votingMachine.address,
      client: this.clients[votingChainId],
      startBlock,
      endBlock,
    });
  }

  async getProposalVotingClosed(
    votingChainId: number,
    startBlock: number,
    endBlock: number,
  ) {
    const votingMachine = this.votingMachines[votingChainId];
    return getProposalVotingClosed({
      contractAddress: votingMachine.address,
      client: this.clients[votingChainId],
      startBlock,
      endBlock,
    });
  }

  async getProposalQueuedEvents(startBlock: number, endBlock: number) {
    return getProposalQueued({
      contractAddress: this.govCore.address,
      client: this.clients[appConfig.govCoreChainId],
      startBlock,
      endBlock,
    });
  }

  async getPayloadsQueuedEvents(
    chainId: number,
    address: Hex,
    startBlock: number,
    endBlock: number,
  ) {
    return getPayloadsQueued({
      contractAddress: address,
      client: this.clients[chainId],
      startBlock,
      endBlock,
      chainId,
    });
  }

  async getPayloadsExecutedEvents(
    chainId: number,
    address: Hex,
    startBlock: number,
    endBlock: number,
  ) {
    return getPayloadsExecuted({
      contractAddress: address,
      client: this.clients[chainId],
      startBlock,
      endBlock,
      chainId,
    });
  }
}
