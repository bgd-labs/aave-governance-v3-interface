'use client';

import {
  BasicProposal,
  blockLimit,
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
  InitialProposal,
  Payload,
  PayloadAction,
  PayloadForCreation,
  ProposalData,
  updateVotingMachineData,
  VotersData,
} from '@bgd-labs/aave-governance-ui-helpers/src';
import { IBaseVotingStrategy__factory } from '@bgd-labs/aave-governance-ui-helpers/src/contracts/IBaseVotingStrategy__factory';
import { IDataWarehouse__factory } from '@bgd-labs/aave-governance-ui-helpers/src/contracts/IDataWarehouse__factory';
import { IGovernanceCore } from '@bgd-labs/aave-governance-ui-helpers/src/contracts/IGovernanceCore';
import { IGovernanceCore__factory } from '@bgd-labs/aave-governance-ui-helpers/src/contracts/IGovernanceCore__factory';
import { IGovernanceDataHelper } from '@bgd-labs/aave-governance-ui-helpers/src/contracts/IGovernanceDataHelper';
import { IGovernanceDataHelper__factory } from '@bgd-labs/aave-governance-ui-helpers/src/contracts/IGovernanceDataHelper__factory';
import { IPayloadsControllerCore__factory } from '@bgd-labs/aave-governance-ui-helpers/src/contracts/IPayloadsControllerCore__factory';
import { IPayloadsControllerDataHelper } from '@bgd-labs/aave-governance-ui-helpers/src/contracts/IPayloadsControllerDataHelper';
import { IPayloadsControllerDataHelper__factory } from '@bgd-labs/aave-governance-ui-helpers/src/contracts/IPayloadsControllerDataHelper__factory';
import { IVotingMachineDataHelper } from '@bgd-labs/aave-governance-ui-helpers/src/contracts/IVotingMachineDataHelper';
import { IVotingMachineDataHelper__factory } from '@bgd-labs/aave-governance-ui-helpers/src/contracts/IVotingMachineDataHelper__factory';
import { IVotingMachineWithProofs } from '@bgd-labs/aave-governance-ui-helpers/src/contracts/IVotingMachineWithProofs';
import { IVotingMachineWithProofs__factory } from '@bgd-labs/aave-governance-ui-helpers/src/contracts/IVotingMachineWithProofs__factory';
import { GelatoRelay, SponsoredCallRequest } from '@gelatonetwork/relay-sdk';
import { BaseRelayParams } from '@gelatonetwork/relay-sdk/dist/lib/types';
import {
  BigNumber,
  BigNumberish,
  BytesLike,
  constants,
  ethers,
  providers,
  utils,
} from 'ethers';
import { hexZeroPad } from 'ethers/lib/utils';

import {
  formatToProofRLP,
  getExtendedBlock,
  getProof,
  getSolidityStorageSlotBytes,
  prepareBLockRLP,
} from '../utils/helperToGetProofs';
import { getVoteSignatureParams } from '../utils/signatures';

import RepresentativeInputStruct = IGovernanceCore.RepresentativeInputStruct;

import { StaticJsonRpcBatchProvider } from '@bgd-labs/frontend-web3-utils/src';

import { appConfig, isTestnet } from '../../utils/appConfig';

export const PAGE_SIZE = 10;

export class GovDataService {
  private readonly govCore: IGovernanceCore;
  private govCoreDataHelper: IGovernanceDataHelper;

  private readonly votingMachines: Record<number, IVotingMachineWithProofs>;
  private readonly votingMachineDataHelpers: Record<
    number,
    IVotingMachineDataHelper
  >;
  private readonly payloadsControllerDataHelpers: Record<
    number,
    IPayloadsControllerDataHelper
  >;

  private signer: providers.JsonRpcSigner | undefined;
  private providers: Record<number, StaticJsonRpcBatchProvider>;

  constructor(providers: Record<number, StaticJsonRpcBatchProvider>) {
    this.providers = providers;
    // contracts
    // core
    this.govCore = IGovernanceCore__factory.connect(
      appConfig.govCoreConfig.contractAddress,
      this.providers[appConfig.govCoreChainId],
    );
    this.govCoreDataHelper = IGovernanceDataHelper__factory.connect(
      appConfig.govCoreConfig.dataHelperContractAddress,
      this.providers[appConfig.govCoreChainId],
    );
    // voting
    const initialVotingMachineContracts: Record<
      number,
      IVotingMachineWithProofs
    > = {};
    appConfig.votingMachineChainIds.forEach((chainId) => {
      const votingMachineConfig = appConfig.votingMachineConfig[chainId];
      initialVotingMachineContracts[chainId] =
        IVotingMachineWithProofs__factory.connect(
          votingMachineConfig.contractAddress,
          this.providers[chainId],
        );
    });
    this.votingMachines = initialVotingMachineContracts;
    const initialVotingMachineDataHelperContracts: Record<
      number,
      IVotingMachineDataHelper
    > = {};
    appConfig.votingMachineChainIds.forEach((chainId) => {
      const votingMachineConfig = appConfig.votingMachineConfig[chainId];
      initialVotingMachineDataHelperContracts[chainId] =
        IVotingMachineDataHelper__factory.connect(
          votingMachineConfig.dataHelperContractAddress,
          this.providers[chainId],
        );
    });
    this.votingMachineDataHelpers = initialVotingMachineDataHelperContracts;
    // payloads controllers
    const initialPayloadsControllerDataHelperContracts: Record<
      number,
      IPayloadsControllerDataHelper
    > = {};
    appConfig.payloadsControllerChainIds.forEach((chainId) => {
      const payloadsControllerConfig =
        appConfig.payloadsControllerConfig[chainId];
      initialPayloadsControllerDataHelperContracts[chainId] =
        IPayloadsControllerDataHelper__factory.connect(
          payloadsControllerConfig.dataHelperContractAddress,
          this.providers[chainId],
        );
    });
    this.payloadsControllerDataHelpers =
      initialPayloadsControllerDataHelperContracts;
  }

  connectSigner(signer: providers.JsonRpcSigner) {
    this.signer = signer;
  }

  async getGovCoreConfigs() {
    return await getGovCoreConfigs(
      this.govCoreDataHelper,
      appConfig.govCoreConfig.contractAddress,
    );
  }

  async getTotalProposalsCount(): Promise<number> {
    const proposalsCount = await this.govCore.getProposalsCount();
    return proposalsCount.toNumber();
  }

  async getTotalPayloadsCount(
    payloadsController: string,
    chainId: number,
  ): Promise<number> {
    const payloadsControllerContract = IPayloadsControllerCore__factory.connect(
      payloadsController,
      this.providers[chainId],
    );

    return await payloadsControllerContract.getPayloadsCount();
  }

  async getPayloads(
    chainId: number,
    payloadsController: string,
    payloadsIds: number[],
  ): Promise<Payload[]> {
    const payloadsControllerDataHelper =
      this.payloadsControllerDataHelpers[chainId];

    const initialPayloadsData =
      (await payloadsControllerDataHelper.getPayloadsData(
        payloadsController,
        payloadsIds,
      )) || [];

    return initialPayloadsData.map((payload) => {
      return {
        id: payload.id.toNumber(),
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
    userAddress?: string,
    representative?: string,
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

        if (representative && userAddress) {
          if (userAddress) {
            return (
              (await votingMachineDataHelper.getProposalsData(
                appConfig.votingMachineConfig[chainId].contractAddress,
                formattedInitialProposals,
                representative || userAddress || constants.AddressZero,
              )) || []
            );
          }
        }
        return (
          (await votingMachineDataHelper.getProposalsData(
            appConfig.votingMachineConfig[chainId].contractAddress,
            formattedInitialProposals,
            userAddress || constants.AddressZero,
          )) || []
        );
      }),
    );

    return data.flat();
  }

  async getDetailedProposalsData(
    from: number,
    to?: number,
    userAddress?: string,
    representative?: string,
    pageSize?: number,
  ): Promise<BasicProposal[]> {
    const govCoreDataHelperData = await this.govCoreDataHelper.getProposalsData(
      appConfig.govCoreConfig.contractAddress,
      from,
      to || 0,
      pageSize || PAGE_SIZE,
    );

    const initialProposals = govCoreDataHelperData.map((proposal) => {
      return {
        id: proposal.id.toNumber(),
        votingChainId: proposal.votingChainId.toNumber(),
        snapshotBlockHash: proposal.proposalData.snapshotBlockHash.toString(),
      };
    });

    const votingMachineDataHelperData = await this.getVotingData(
      initialProposals,
      userAddress,
      representative,
    );

    const proposalsIds = govCoreDataHelperData.map((proposal) =>
      proposal.id.toNumber(),
    );

    return getDetailedProposalsData(
      govCoreDataHelperData,
      votingMachineDataHelperData,
      proposalsIds,
    );
  }

  async getOnlyVotingMachineData(
    proposals: ProposalData[],
    userAddress?: string,
    representative?: string,
  ) {
    const initialProposals = proposals.map((proposal) => {
      return {
        id: proposal?.id || 0,
        votingChainId: proposal?.votingChainId || appConfig.govCoreChainId,
        snapshotBlockHash: proposal?.snapshotBlockHash || constants.HashZero,
      };
    });

    const votingMachineDataHelperData = await this.getVotingData(
      initialProposals,
      userAddress,
      representative,
    );

    const proposalsIds = initialProposals.map((proposal) => proposal.id);

    return updateVotingMachineData(
      proposals,
      votingMachineDataHelperData,
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
      (await this.providers[votingChainId].getBlockNumber()) || 0;

    const { startBlock, endBlock } = getBlocksForEvents(
      currentBlock,
      startBlockNumber,
      endBlockNumber,
      lastBlockNumber,
    );

    const voters: VotersData[] = [];

    if (!!endBlock) {
      const newVoters = await getVoters(
        endBlock,
        startBlock,
        blockLimit,
        this.votingMachines[votingChainId],
        votingChainId,
      );

      voters.push(...newVoters);
    }

    return voters;
  }

  // voting strategy contract
  async getVotingStrategyContract() {
    const votingStrategyAddress = await this.govCore.getPowerStrategy();

    return IBaseVotingStrategy__factory.connect(
      votingStrategyAddress,
      this.providers[appConfig.govCoreChainId],
    );
  }

  // representations
  async getRepresentationData(address: string) {
    const data = await this.govCoreDataHelper.getRepresentationData(
      appConfig.govCoreConfig.contractAddress,
      address,
      appConfig.votingMachineChainIds,
    );

    return {
      representative: data[0],
      represented: data[1],
    };
  }

  async updateRepresentatives({ data }: { data: RepresentativeInputStruct[] }) {
    let connectedGovCore = this.govCore;
    if (this.signer) {
      connectedGovCore = this.govCore.connect(this.signer);
    }
    return connectedGovCore.updateRepresentativesForChain(data);
  }
  // end representations

  // tx's
  activateVoting(proposalId: number) {
    let connectedGovCore = this.govCore;
    if (this.signer) {
      connectedGovCore = this.govCore.connect(this.signer);
    }
    return connectedGovCore.activateVoting(proposalId);
  }

  async sendProofs(
    user: string,
    blockNumber: number,
    asset: string,
    chainId: number,
    baseBalanceSlotRaw: number,
    withSlot?: boolean,
  ) {
    if (this.signer) {
      const blockData = await getExtendedBlock(
        this.providers[appConfig.govCoreChainId],
        blockNumber,
      );
      const blockHeaderRLP = prepareBLockRLP(blockData);

      const slot = getSolidityStorageSlotBytes(
        hexZeroPad(utils.hexlify(baseBalanceSlotRaw), 32),
        user,
      );
      const exchangeRateSlot = hexZeroPad('0x51', 32);
      const delegatedStateSlot = hexZeroPad('0x40', 32);

      const connectedDataWarehouse = new ethers.Contract(
        appConfig.votingMachineConfig[chainId].dataWarehouseAddress,
        IDataWarehouse__factory.abi,
      ).connect(this.signer);

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
          this.providers[appConfig.govCoreChainId],
          AAVEAddress,
          [slot],
          blockNumber,
        );

        const accountStateProofRLP = formatToProofRLP(
          rawAccountProofData.accountProof,
        );

        return connectedDataWarehouse.processStorageRoot(
          AAVEAddress,
          blockData.hash,
          blockHeaderRLP,
          accountStateProofRLP,
        );
      }

      if (aAAVEAddress) {
        const rawAccountProofData = await getProof(
          this.providers[appConfig.govCoreChainId],
          aAAVEAddress,
          [slot, delegatedStateSlot],
          blockNumber,
        );

        const accountStateProofRLP = formatToProofRLP(
          rawAccountProofData.accountProof,
        );

        return connectedDataWarehouse.processStorageRoot(
          aAAVEAddress,
          blockData.hash,
          blockHeaderRLP,
          accountStateProofRLP,
        );
      }

      if (STKAAVEAddress && !withSlot) {
        const rawAccountProofData = await getProof(
          this.providers[appConfig.govCoreChainId],
          STKAAVEAddress,
          [slot, exchangeRateSlot],
          blockNumber,
        );

        const accountStateProofRLP = formatToProofRLP(
          rawAccountProofData.accountProof,
        );

        return connectedDataWarehouse.processStorageRoot(
          STKAAVEAddress,
          blockData.hash,
          blockHeaderRLP,
          accountStateProofRLP,
        );
      }

      if (STKAAVEAddress && withSlot) {
        const slotProof = await getProof(
          this.providers[appConfig.govCoreChainId],
          STKAAVEAddress,
          [exchangeRateSlot],
          blockNumber,
        );

        const slotProofRLP = formatToProofRLP(slotProof.storageProof[0].proof);

        return connectedDataWarehouse.processStorageSlot(
          STKAAVEAddress,
          blockData.hash,
          exchangeRateSlot,
          slotProofRLP,
        );
      }

      if (RepresentationsAddress) {
        const representationsSlot = hexZeroPad(
          utils.hexlify(baseBalanceSlotRaw),
          32,
        );

        const rawAccountProofData = await getProof(
          this.providers[appConfig.govCoreChainId],
          RepresentationsAddress,
          [representationsSlot],
          blockNumber,
        );

        const accountStateProofRLP = formatToProofRLP(
          rawAccountProofData.accountProof,
        );

        return connectedDataWarehouse.processStorageRoot(
          RepresentationsAddress,
          blockData.hash,
          blockHeaderRLP,
          accountStateProofRLP,
        );
      }
    }
  }

  activateVotingOnVotingMachine(votingChainId: number, proposalId: number) {
    let connectedVotingMachine = this.votingMachines[votingChainId];
    if (this.signer) {
      connectedVotingMachine = connectedVotingMachine.connect(this.signer);
    }
    return connectedVotingMachine.startProposalVote(proposalId);
  }

  // proofs for vote
  async getCoreBlockNumber(blockHash: string) {
    return (await this.providers[appConfig.govCoreChainId].getBlock(blockHash))
      .number;
  }

  async getProofs({
    underlyingAsset,
    slot,
    blockNumber,
  }: {
    underlyingAsset: string;
    slot: string;
    blockNumber: number;
  }) {
    const rawProofData = await this.providers[
      appConfig.govCoreChainId
    ].send('eth_getProof', [
      underlyingAsset,
      [slot],
      BigNumber.from(blockNumber).toHexString(),
    ]);

    return formatToProofRLP(rawProofData.storageProof[0].proof);
  }

  async getAndFormatProof({
    userAddress,
    underlyingAsset,
    blockNumber,
    baseBalanceSlotRaw,
  }: {
    userAddress: string;
    underlyingAsset: string;
    blockNumber: number;
    baseBalanceSlotRaw: number;
  }) {
    const hashedHolderSlot = getSolidityStorageSlotBytes(
      hexZeroPad(utils.hexlify(baseBalanceSlotRaw), 32),
      userAddress,
    );

    const proof = await this.getProofs({
      underlyingAsset,
      slot: hashedHolderSlot,
      blockNumber,
    });

    return {
      underlyingAsset,
      slot: ethers.BigNumber.from(baseBalanceSlotRaw),
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
      underlyingAsset: string;
      slot: BigNumberish;
      proof: BytesLike;
    }[];
    voterAddress?: string;
    proofOfRepresentation?: string;
  }) {
    let connectedVotingMachine = this.votingMachines[votingChainId];
    if (this.signer) {
      connectedVotingMachine = connectedVotingMachine.connect(this.signer);
    }
    return !!voterAddress && !!proofOfRepresentation
      ? connectedVotingMachine.submitVoteAsRepresentative(
          proposalId,
          support,
          voterAddress,
          proofOfRepresentation,
          proofs,
        )
      : connectedVotingMachine.submitVote(proposalId, support, proofs);
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
    votingAssetsWithSlot: { underlyingAsset: string; slot: number }[];
    proofs: {
      underlyingAsset: string;
      slot: BigNumberish;
      proof: BytesLike;
    }[];
    signerAddress: string;
    voterAddress?: string;
    proofOfRepresentation?: string;
  }) {
    const relay = new GelatoRelay();
    let connectedVotingMachine = this.votingMachines[votingChainId];
    if (this.signer) {
      connectedVotingMachine = connectedVotingMachine.connect(this.signer);

      const signatureParams = !!voterAddress
        ? await getVoteSignatureParams({
            signer: this.signer,
            votingChainId,
            proposalId,
            voterAddress,
            representativeAddress: signerAddress,
            support,
            votingAssetsWithSlot,
          })
        : await getVoteSignatureParams({
            signer: this.signer,
            votingChainId,
            proposalId,
            voterAddress: signerAddress,
            support,
            votingAssetsWithSlot,
          });

      const gelatoApiKey = isTestnet
        ? appConfig.gelatoApiKeys.testnet
        : appConfig.gelatoApiKeys.mainnet;

      const { data } =
        !!voterAddress && !!proofOfRepresentation
          ? await connectedVotingMachine.populateTransaction.submitVoteAsRepresentativeBySignature(
              proposalId,
              voterAddress,
              signerAddress,
              support,
              proofOfRepresentation,
              proofs,
              signatureParams,
            )
          : await connectedVotingMachine.populateTransaction.submitVoteBySignature(
              proposalId,
              signerAddress,
              support,
              proofs,
              signatureParams.v,
              signatureParams.r,
              signatureParams.s,
            );

      const request: SponsoredCallRequest = {
        chainId: BigInt(votingChainId),
        target: appConfig.votingMachineConfig[votingChainId].contractAddress,
        data: data as BaseRelayParams['data'],
      };

      return relay.sponsoredCall(request, gelatoApiKey);
    } else {
      return connectedVotingMachine.submitVote(proposalId, support, proofs);
    }
  }

  closeAndSendVote(votingChainId: number, proposalId: number) {
    let connectedVotingMachine = this.votingMachines[votingChainId];
    if (this.signer) {
      connectedVotingMachine = connectedVotingMachine.connect(this.signer);
    }
    return connectedVotingMachine.closeAndSendVote(proposalId);
  }

  executeProposal(proposalId: number) {
    let connectedGovCore = this.govCore;
    if (this.signer) {
      connectedGovCore = this.govCore.connect(this.signer);
    }
    return connectedGovCore.executeProposal(proposalId);
  }

  executePayload(
    chainId: number,
    payloadId: number,
    payloadsController: string,
  ) {
    let connectedPayloadsController = IPayloadsControllerCore__factory.connect(
      payloadsController,
      this.providers[chainId],
    );
    if (this.signer) {
      connectedPayloadsController = connectedPayloadsController.connect(
        this.signer,
      );
    }
    return connectedPayloadsController.executePayload(payloadId);
  }

  async createPayload(
    chainId: number,
    payloadActions: PayloadAction[],
    payloadsController: string,
  ) {
    let connectedPayloadsController = IPayloadsControllerCore__factory.connect(
      payloadsController,
      this.providers[chainId],
    );

    const formattedPayloadActions = payloadActions.map((payloadData) => {
      return {
        target: payloadData.payloadAddress,
        withDelegateCall: payloadData.withDelegateCall,
        accessLevel: payloadData.accessLevel,
        value: payloadData.value,
        signature: payloadData.signature,
        callData: utils.toUtf8Bytes(payloadData.callData || ''),
      };
    });

    if (this.signer) {
      connectedPayloadsController = connectedPayloadsController.connect(
        this.signer,
      );
    }
    return connectedPayloadsController.createPayload(formattedPayloadActions);
  }

  async createProposal(
    votingPortalAddress: string,
    payloads: {
      chain: number;
      accessLevel: number;
      id: number;
      payloadsController: string;
    }[],
    ipfsHash: string,
    cancellationFee: string,
  ) {
    let connectedGovCore = this.govCore;
    const formattedPayloads = payloads.map((payload) => {
      return {
        chain: payload.chain,
        accessLevel: payload.accessLevel,
        payloadsController: payload.payloadsController,
        payloadId: payload.id,
      } as PayloadForCreation;
    });

    if (this.signer) {
      connectedGovCore = this.govCore.connect(this.signer);
    }
    return connectedGovCore.createProposal(
      formattedPayloads,
      votingPortalAddress,
      ipfsHash,
      {
        value: cancellationFee,
      },
    );
  }

  // only for admin
  async cancelProposal(proposalId: number) {
    let connectedGovCore = this.govCore;
    if (this.signer) {
      connectedGovCore = this.govCore.connect(this.signer);
    }
    return connectedGovCore.cancelProposal(proposalId);
  }

  // history events
  async getPayloadsCreatedEvents(
    chainId: number,
    address: string,
    startBlock: number,
    endBlock: number,
  ) {
    const payloadsController = IPayloadsControllerCore__factory.connect(
      address,
      this.providers[chainId],
    );

    return getPayloadsCreated(
      startBlock,
      endBlock,
      payloadsController,
      address,
      chainId,
    );
  }

  async getProposalCreatedEvents(startBlock: number, endBlock: number) {
    return getProposalCreated(startBlock, endBlock, this.govCore);
  }
  async getProposalActivatedEvents(startBlock: number, endBlock: number) {
    return getProposalActivated(startBlock, endBlock, this.govCore);
  }

  async getProposalActivatedOnVMEvents(
    votingChainId: number,
    startBlock: number,
    endBlock: number,
  ) {
    const votingMachine = this.votingMachines[votingChainId];
    return getProposalActivatedOnVM(startBlock, endBlock, votingMachine);
  }

  async getProposalVotingClosed(
    votingChainId: number,
    startBlock: number,
    endBlock: number,
  ) {
    const votingMachine = this.votingMachines[votingChainId];
    return getProposalVotingClosed(startBlock, endBlock, votingMachine);
  }

  async getProposalQueuedEvents(startBlock: number, endBlock: number) {
    return getProposalQueued(startBlock, endBlock, this.govCore);
  }

  async getPayloadsQueuedEvents(
    chainId: number,
    address: string,
    startBlock: number,
    endBlock: number,
  ) {
    const payloadsController = IPayloadsControllerCore__factory.connect(
      address,
      this.providers[chainId],
    );

    return getPayloadsQueued(
      startBlock,
      endBlock,
      payloadsController,
      address,
      chainId,
    );
  }

  async getPayloadsExecutedEvents(
    chainId: number,
    address: string,
    startBlock: number,
    endBlock: number,
  ) {
    const payloadsController = IPayloadsControllerCore__factory.connect(
      address,
      this.providers[chainId],
    );

    return getPayloadsExecuted(
      startBlock,
      endBlock,
      payloadsController,
      address,
      chainId,
    );
  }
}
