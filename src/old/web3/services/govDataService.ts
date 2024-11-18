'use client';

import {
  IDataWarehouse_ABI,
  IGovernanceCore_ABI,
  IGovernanceDataHelper_ABI,
  IPayloadsControllerCore_ABI,
  IPayloadsControllerDataHelper_ABI,
  IVotingMachineDataHelper_ABI,
  IVotingMachineWithProofs_ABI,
} from '@bgd-labs/aave-address-book/abis';
import {
  BasicProposal,
  blockLimit,
  formatToProofRLP,
  getBlocksForEvents,
  getDetailedProposalsData,
  getExtendedBlock,
  getGovCoreConfigs,
  getPayloadsCreated,
  getPayloadsExecuted,
  getPayloadsQueued,
  getProposalActivated,
  getProposalActivatedOnVM,
  getProposalCreated,
  getProposalQueued,
  getProposalVotingClosed,
  getSolidityStorageSlotBytes,
  getVoters,
  InitialProposal,
  Payload,
  PayloadAction,
  PayloadForCreation,
  PayloadState,
  prepareBLockRLP,
  ProposalData,
  updateVotingMachineData,
  VMProposalStructOutput,
  VotersData,
  VotingConfig,
} from '@bgd-labs/aave-governance-ui-helpers';
import { IBaseVotingStrategy_ABI } from '@bgd-labs/aave-governance-ui-helpers/dist/abis/IBaseVotingStrategy';
import { ClientsRecord } from '@bgd-labs/frontend-web3-utils';
import {
  GelatoRelay,
  SponsoredCallRequest,
} from '@gelatonetwork/relay-sdk-viem';
import { BaseRelayParams } from '@gelatonetwork/relay-sdk-viem/dist/lib/types';
import { writeContract } from '@wagmi/core';
import { Draft } from 'immer';
import {
  Address,
  Block,
  bytesToHex,
  encodeFunctionData,
  getContract,
  Hex,
  pad,
  stringToBytes,
  toHex,
  zeroAddress,
  zeroHash,
} from 'viem';
import { getBlockNumber, getProof, readContract } from 'viem/actions';
import { Config } from 'wagmi';

import { SetRpcErrorParams } from '../../rpcSwitcher/store/rpcSwitcherSlice';
import { appConfig, gelatoApiKeys } from '../../utils/appConfig';
import { getVoteSignatureParams } from '../utils/signatures';

export const PAGE_SIZE = 12;

function initContracts(clients: ClientsRecord) {
  const govCore = getContract({
    address: appConfig.govCoreConfig.contractAddress,
    abi: IGovernanceCore_ABI,
    client: clients[appConfig.govCoreChainId],
  });

  const govCoreDataHelper = getContract({
    address: appConfig.govCoreConfig.dataHelperContractAddress,
    abi: IGovernanceDataHelper_ABI,
    client: clients[appConfig.govCoreChainId],
  });

  const votingMachines = {
    [appConfig.votingMachineChainIds[0]]: getContract({
      abi: IVotingMachineWithProofs_ABI,
      address:
        appConfig.votingMachineConfig[appConfig.votingMachineChainIds[0]]
          .contractAddress,
      client: clients[appConfig.votingMachineChainIds[0]],
    }),
  };
  if (appConfig.votingMachineChainIds.length > 1) {
    appConfig.votingMachineChainIds.forEach((chainId) => {
      const votingMachineConfig = appConfig.votingMachineConfig[chainId];
      votingMachines[chainId] = getContract({
        abi: IVotingMachineWithProofs_ABI,
        address: votingMachineConfig.contractAddress,
        client: clients[chainId],
      });
    });
  }

  const votingMachineDataHelpers = {
    [appConfig.votingMachineChainIds[0]]: getContract({
      abi: IVotingMachineDataHelper_ABI,
      address:
        appConfig.votingMachineConfig[appConfig.votingMachineChainIds[0]]
          .dataHelperContractAddress,
      client: clients[appConfig.votingMachineChainIds[0]],
    }),
  };
  if (appConfig.votingMachineChainIds.length > 1) {
    appConfig.votingMachineChainIds.forEach((chainId) => {
      const votingMachineConfig = appConfig.votingMachineConfig[chainId];
      votingMachineDataHelpers[chainId] = getContract({
        abi: IVotingMachineDataHelper_ABI,
        address: votingMachineConfig.dataHelperContractAddress,
        client: clients[chainId],
      });
    });
  }

  const payloadsControllerDataHelpers = {
    [appConfig.payloadsControllerChainIds[0]]: getContract({
      abi: IPayloadsControllerDataHelper_ABI,
      address:
        appConfig.payloadsControllerConfig[
          appConfig.payloadsControllerChainIds[0]
        ].dataHelperContractAddress,
      client: clients[appConfig.payloadsControllerChainIds[0]],
    }),
  };
  if (appConfig.payloadsControllerChainIds.length > 1) {
    appConfig.payloadsControllerChainIds.forEach((chainId) => {
      const payloadsControllerConfig =
        appConfig.payloadsControllerConfig[chainId];
      payloadsControllerDataHelpers[chainId] = getContract({
        abi: IPayloadsControllerDataHelper_ABI,
        address: payloadsControllerConfig.dataHelperContractAddress,
        client: clients[chainId],
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

  private wagmiConfig: Config | undefined = undefined;
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

  connectSigner(wagmiConfig: Config) {
    this.wagmiConfig = wagmiConfig;
  }

  async getGovCoreConfigs(
    setRpcError?: ({ isError, rpcUrl, chainId }: SetRpcErrorParams) => void,
  ) {
    const rpcUrl =
      this.clients[appConfig.govCoreChainId].chain?.rpcUrls.default.http[0];

    const govCoreConfigs = await getGovCoreConfigs({
      client: this.clients[appConfig.govCoreChainId],
      govCoreContractAddress: this.govCore.address,
      govCoreDataHelperContractAddress: this.govCoreDataHelper.address,
    });

    if (
      !!setRpcError &&
      govCoreConfigs.contractsConstants.expirationTime > 1000 &&
      rpcUrl
    ) {
      setRpcError({
        isError: false,
        rpcUrl,
        chainId: appConfig.govCoreChainId,
      });
    } else if (
      !!setRpcError &&
      govCoreConfigs.contractsConstants.expirationTime <= 1000 &&
      rpcUrl
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
      this.clients[appConfig.govCoreChainId].chain?.rpcUrls.default.http[0];

    try {
      const proposalsCount = await this.govCore.read.getProposalsCount();
      if (!!setRpcError && rpcUrl) {
        setRpcError({
          isError: false,
          rpcUrl,
          chainId: appConfig.govCoreChainId,
        });
      }
      return Number(proposalsCount);
    } catch {
      if (!!setRpcError && rpcUrl) {
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
    payloadsController: Address,
    chainId: number,
    setRpcError?: ({ isError, rpcUrl, chainId }: SetRpcErrorParams) => void,
  ): Promise<number> {
    const rpcUrl = this.clients[chainId]?.chain?.rpcUrls.default.http[0];

    try {
      const payloadsCount = await readContract(this.clients[chainId], {
        abi: IPayloadsControllerCore_ABI,
        address: payloadsController,
        functionName: 'getPayloadsCount',
      });

      if (!!setRpcError && rpcUrl) {
        setRpcError({
          isError: false,
          rpcUrl,
          chainId: chainId,
        });
      }
      return Number(payloadsCount);
    } catch {
      if (!!setRpcError && rpcUrl) {
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
    payloadsController: Address,
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
        ...payload.data,
        id: Number(payload.id),
        chainId,
        payloadsController,
      };
    });
  }

  async getVotingData(
    initialProposals: InitialProposal[],
    userAddress?: Address,
    representative?: Address,
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
        const rpcUrl = this.clients[chainId].chain?.rpcUrls.default.http[0];
        try {
          if (!!setRpcError && rpcUrl) {
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
          if (!!setRpcError && rpcUrl) {
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
    userAddress?: Address,
    representative?: Address,
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
        this.clients[appConfig.govCoreChainId].chain?.rpcUrls.default.http[0];

      if (!!setRpcError && rpcUrl) {
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
    userAddress?: Address,
    representative?: Address,
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
      (await getBlockNumber(this.clients[votingChainId])) || 0;

    const { startBlock, endBlock } = getBlocksForEvents(
      Number(currentBlock),
      startBlockNumber,
      endBlockNumber,
      lastBlockNumber,
    );

    const voters: VotersData[] = [];

    if (endBlock) {
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

    return getContract({
      abi: IBaseVotingStrategy_ABI,
      address: votingStrategyAddress,
      client: this.clients[appConfig.govCoreChainId],
    });
  }

  // representations
  async getRepresentationData(address: Address) {
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
    data: { representative: Address; chainId: bigint }[];
  }) {
    if (this.wagmiConfig) {
      return await writeContract(this.wagmiConfig, {
        abi: this.govCore.abi,
        address: this.govCore.address,
        functionName: 'updateRepresentativesForChain',
        args: [data],
        chainId: appConfig.govCoreChainId,
      });
    }
    return undefined;
  }
  // end representations

  // tx's
  async activateVoting(proposalId: number) {
    if (this.wagmiConfig) {
      return writeContract(this.wagmiConfig, {
        abi: this.govCore.abi,
        address: this.govCore.address,
        functionName: 'activateVoting',
        args: [BigInt(proposalId)],
        chainId: appConfig.govCoreChainId,
      });
    }
    return undefined;
  }

  async sendProofs(
    user: Address,
    blockNumber: number,
    asset: string,
    chainId: number,
    baseBalanceSlotRaw: number,
    withSlot?: boolean,
  ) {
    if (this.wagmiConfig) {
      const blockData = (await getExtendedBlock(
        this.clients[appConfig.govCoreChainId],
        blockNumber,
      )) as Block & { parentBeaconBlockRoot: Hex };
      const blockHeaderRLP = prepareBLockRLP(blockData);

      const slot = getSolidityStorageSlotBytes(
        pad(toHex(baseBalanceSlotRaw), { size: 32 }),
        user,
      );
      const exchangeRateSlot = pad('0x51', { size: 32 });
      const delegatedStateSlot = pad('0x40', { size: 32 });

      const dataWarehouse = {
        abi: IDataWarehouse_ABI,
        address: appConfig.votingMachineConfig[chainId].dataWarehouseAddress,
      };

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
          {
            address: AAVEAddress,
            storageKeys: [slot],
            blockNumber: BigInt(blockNumber),
          },
        );

        const accountStateProofRLP = formatToProofRLP(
          rawAccountProofData.accountProof,
        );

        return writeContract(this.wagmiConfig, {
          abi: dataWarehouse.abi,
          address: dataWarehouse.address,
          functionName: 'processStorageRoot',
          args: [
            AAVEAddress,
            blockData.hash as Hex,
            blockHeaderRLP,
            accountStateProofRLP,
          ],
          chainId,
        });
      }

      if (aAAVEAddress) {
        const rawAccountProofData = await getProof(
          this.clients[appConfig.govCoreChainId],
          {
            address: aAAVEAddress,
            storageKeys: [slot, delegatedStateSlot],
            blockNumber: BigInt(blockNumber),
          },
        );

        const accountStateProofRLP = formatToProofRLP(
          rawAccountProofData.accountProof,
        );

        return writeContract(this.wagmiConfig, {
          abi: dataWarehouse.abi,
          address: dataWarehouse.address,
          functionName: 'processStorageRoot',
          args: [
            aAAVEAddress,
            blockData.hash as Hex,
            blockHeaderRLP,
            accountStateProofRLP,
          ],
          chainId,
        });
      }

      if (STKAAVEAddress && !withSlot) {
        const rawAccountProofData = await getProof(
          this.clients[appConfig.govCoreChainId],
          {
            address: STKAAVEAddress,
            storageKeys: [slot, exchangeRateSlot],
            blockNumber: BigInt(blockNumber),
          },
        );

        const accountStateProofRLP = formatToProofRLP(
          rawAccountProofData.accountProof,
        );

        return writeContract(this.wagmiConfig, {
          abi: dataWarehouse.abi,
          address: dataWarehouse.address,
          functionName: 'processStorageRoot',
          args: [
            STKAAVEAddress,
            blockData.hash as Hex,
            blockHeaderRLP,
            accountStateProofRLP,
          ],
          chainId,
        });
      }

      if (STKAAVEAddress && withSlot) {
        const slotProof = await getProof(
          this.clients[appConfig.govCoreChainId],
          {
            address: STKAAVEAddress,
            storageKeys: [exchangeRateSlot],
            blockNumber: BigInt(blockNumber),
          },
        );

        const slotProofRLP = formatToProofRLP(slotProof.storageProof[0].proof);

        return writeContract(this.wagmiConfig, {
          abi: dataWarehouse.abi,
          address: dataWarehouse.address,
          functionName: 'processStorageSlot',
          args: [
            STKAAVEAddress,
            blockData.hash as Hex,
            exchangeRateSlot,
            slotProofRLP,
          ],
          chainId,
        });
      }

      if (RepresentationsAddress) {
        const representationsSlot = pad(toHex(baseBalanceSlotRaw), {
          size: 32,
        });

        const rawAccountProofData = await getProof(
          this.clients[appConfig.govCoreChainId],
          {
            address: RepresentationsAddress,
            storageKeys: [representationsSlot],
            blockNumber: BigInt(blockNumber),
          },
        );

        const accountStateProofRLP = formatToProofRLP(
          rawAccountProofData.accountProof,
        );

        return writeContract(this.wagmiConfig, {
          abi: dataWarehouse.abi,
          address: dataWarehouse.address,
          functionName: 'processStorageRoot',
          args: [
            RepresentationsAddress,
            blockData.hash as Hex,
            blockHeaderRLP,
            accountStateProofRLP,
          ],
          chainId,
        });
      }
    }
    return undefined;
  }

  async activateVotingOnVotingMachine(
    votingChainId: number,
    proposalId: number,
  ) {
    if (this.wagmiConfig) {
      return writeContract(this.wagmiConfig, {
        abi: this.votingMachines[votingChainId].abi,
        address: this.votingMachines[votingChainId].address,
        functionName: 'startProposalVote',
        args: [BigInt(proposalId)],
        chainId: votingChainId,
      });
    }
    return undefined;
  }

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
      underlyingAsset: Address;
      slot: bigint;
      proof: Hex;
    }[];
    voterAddress?: Address;
    proofOfRepresentation?: Hex;
  }) {
    const votingMachine = this.votingMachines[votingChainId];
    if (this.wagmiConfig) {
      return !!voterAddress && !!proofOfRepresentation
        ? writeContract(this.wagmiConfig, {
            abi: votingMachine.abi,
            address: votingMachine.address,
            functionName: 'submitVoteAsRepresentative',
            args: [
              BigInt(proposalId),
              support,
              voterAddress,
              proofOfRepresentation,
              proofs,
            ],
            chainId: votingChainId,
          })
        : writeContract(this.wagmiConfig, {
            abi: votingMachine.abi,
            address: votingMachine.address,
            functionName: 'submitVote',
            args: [BigInt(proposalId), support, proofs],
            chainId: votingChainId,
          });
    }
    return undefined;
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
    votingAssetsWithSlot: { underlyingAsset: Address; slot: number }[];
    proofs: {
      underlyingAsset: Address;
      slot: bigint;
      proof: Hex;
    }[];
    signerAddress: Address;
    voterAddress?: Address;
    proofOfRepresentation?: Hex;
  }) {
    const relay = new GelatoRelay();
    const votingMachine = this.votingMachines[votingChainId];

    if (this.wagmiConfig) {
      const signatureParams = voterAddress
        ? await getVoteSignatureParams({
            wagmiConfig: this.wagmiConfig,
            votingChainId,
            proposalId,
            voterAddress,
            representativeAddress: signerAddress,
            support,
            votingAssetsWithSlot,
          })
        : await getVoteSignatureParams({
            wagmiConfig: this.wagmiConfig,
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
              abi: votingMachine.abi,
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
              abi: votingMachine.abi,
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
        target: votingMachine.address,
        data: data as BaseRelayParams['data'],
      };

      return relay.sponsoredCall(request, gelatoApiKey);
    }
    return undefined;
  }

  async closeAndSendVote(votingChainId: number, proposalId: number) {
    if (this.wagmiConfig) {
      return writeContract(this.wagmiConfig, {
        abi: this.votingMachines[votingChainId].abi,
        address: this.votingMachines[votingChainId].address,
        functionName: 'closeAndSendVote',
        args: [BigInt(proposalId)],
        chainId: votingChainId,
      });
    }
    return undefined;
  }

  async executeProposal(proposalId: number) {
    if (this.wagmiConfig) {
      return writeContract(this.wagmiConfig, {
        abi: this.govCore.abi,
        address: this.govCore.address,
        functionName: 'executeProposal',
        args: [BigInt(proposalId)],
        chainId: appConfig.govCoreChainId,
      });
    }
    return undefined;
  }

  async executePayload(
    chainId: number,
    payloadId: number,
    payloadsController: Address,
  ) {
    if (this.wagmiConfig) {
      return writeContract(this.wagmiConfig, {
        abi: IPayloadsControllerCore_ABI,
        address: payloadsController,
        functionName: 'executePayload',
        chainId,
        args: [payloadId],
      });
    }
    return undefined;
  }

  async createPayload(
    chainId: number,
    payloadActions: PayloadAction[],
    payloadsController: Address,
  ) {
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

    if (this.wagmiConfig) {
      return writeContract(this.wagmiConfig, {
        abi: IPayloadsControllerCore_ABI,
        address: payloadsController,
        functionName: 'createPayload',
        chainId,
        args: [formattedPayloadActions],
      });
    }
    return undefined;
  }

  async createProposal(
    votingPortalAddress: Address,
    payloads: {
      chain: number;
      accessLevel: number;
      id: number;
      payloadsController: Address;
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
      } as Draft<PayloadForCreation>;
    });

    if (this.wagmiConfig) {
      return writeContract(this.wagmiConfig, {
        abi: this.govCore.abi,
        address: this.govCore.address,
        functionName: 'createProposal',
        args: [formattedPayloads, votingPortalAddress, ipfsHash],
        value: BigInt(cancellationFee),
        chainId: appConfig.govCoreChainId,
      });
    }
    return undefined;
  }

  async redeemCancellationFee(proposalIds: number[]) {
    if (this.wagmiConfig) {
      return writeContract(this.wagmiConfig, {
        abi: this.govCore.abi,
        address: this.govCore.address,
        functionName: 'redeemCancellationFee',
        args: [proposalIds.map((id) => BigInt(id))],
        chainId: appConfig.govCoreChainId,
      });
    }
    return undefined;
  }

  // only for admin
  async cancelProposal(proposalId: number) {
    if (this.wagmiConfig) {
      return writeContract(this.wagmiConfig, {
        abi: this.govCore.abi,
        address: this.govCore.address,
        functionName: 'cancelProposal',
        args: [BigInt(proposalId)],
        chainId: appConfig.govCoreChainId,
      });
    }
    return undefined;
  }

  // history events
  async getPayloadsCreatedEvents(
    chainId: number,
    address: Address,
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
    address: Address,
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
    address: Address,
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
