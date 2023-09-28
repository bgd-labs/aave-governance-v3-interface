/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export declare namespace IVotingMachineDataHelper {
  export type InitialProposalStruct = {
    id: PromiseOrValue<BigNumberish>;
    snapshotBlockHash: PromiseOrValue<BytesLike>;
  };

  export type InitialProposalStructOutput = [BigNumber, string] & {
    id: BigNumber;
    snapshotBlockHash: string;
  };

  export type VotedInfoStruct = {
    support: PromiseOrValue<boolean>;
    votingPower: PromiseOrValue<BigNumberish>;
  };

  export type VotedInfoStructOutput = [boolean, BigNumber] & {
    support: boolean;
    votingPower: BigNumber;
  };

  export type ProposalStruct = {
    proposalData: IVotingMachineWithProofs.ProposalWithoutVotesStruct;
    votedInfo: IVotingMachineDataHelper.VotedInfoStruct;
    strategy: PromiseOrValue<string>;
    dataWarehouse: PromiseOrValue<string>;
    votingAssets: PromiseOrValue<string>[];
    hasRequiredRoots: PromiseOrValue<boolean>;
    voteConfig: IVotingMachineWithProofs.ProposalVoteConfigurationStruct;
    state: PromiseOrValue<BigNumberish>;
  };

  export type ProposalStructOutput = [
    IVotingMachineWithProofs.ProposalWithoutVotesStructOutput,
    IVotingMachineDataHelper.VotedInfoStructOutput,
    string,
    string,
    string[],
    boolean,
    IVotingMachineWithProofs.ProposalVoteConfigurationStructOutput,
    number
  ] & {
    proposalData: IVotingMachineWithProofs.ProposalWithoutVotesStructOutput;
    votedInfo: IVotingMachineDataHelper.VotedInfoStructOutput;
    strategy: string;
    dataWarehouse: string;
    votingAssets: string[];
    hasRequiredRoots: boolean;
    voteConfig: IVotingMachineWithProofs.ProposalVoteConfigurationStructOutput;
    state: number;
  };
}

export declare namespace IVotingMachineWithProofs {
  export type ProposalWithoutVotesStruct = {
    id: PromiseOrValue<BigNumberish>;
    sentToGovernance: PromiseOrValue<boolean>;
    startTime: PromiseOrValue<BigNumberish>;
    endTime: PromiseOrValue<BigNumberish>;
    votingClosedAndSentTimestamp: PromiseOrValue<BigNumberish>;
    forVotes: PromiseOrValue<BigNumberish>;
    againstVotes: PromiseOrValue<BigNumberish>;
    creationBlockNumber: PromiseOrValue<BigNumberish>;
    votingClosedAndSentBlockNumber: PromiseOrValue<BigNumberish>;
  };

  export type ProposalWithoutVotesStructOutput = [
    BigNumber,
    boolean,
    number,
    number,
    number,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber
  ] & {
    id: BigNumber;
    sentToGovernance: boolean;
    startTime: number;
    endTime: number;
    votingClosedAndSentTimestamp: number;
    forVotes: BigNumber;
    againstVotes: BigNumber;
    creationBlockNumber: BigNumber;
    votingClosedAndSentBlockNumber: BigNumber;
  };

  export type ProposalVoteConfigurationStruct = {
    votingDuration: PromiseOrValue<BigNumberish>;
    l1ProposalBlockHash: PromiseOrValue<BytesLike>;
  };

  export type ProposalVoteConfigurationStructOutput = [number, string] & {
    votingDuration: number;
    l1ProposalBlockHash: string;
  };
}

export interface IVotingMachineDataHelperInterface extends utils.Interface {
  functions: {
    "getProposalsData(address,(uint256,bytes32)[],address)": FunctionFragment;
  };

  getFunction(nameOrSignatureOrTopic: "getProposalsData"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getProposalsData",
    values: [
      PromiseOrValue<string>,
      IVotingMachineDataHelper.InitialProposalStruct[],
      PromiseOrValue<string>
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "getProposalsData",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IVotingMachineDataHelper extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IVotingMachineDataHelperInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    getProposalsData(
      votingMachine: PromiseOrValue<string>,
      initialProposals: IVotingMachineDataHelper.InitialProposalStruct[],
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[IVotingMachineDataHelper.ProposalStructOutput[]]>;
  };

  getProposalsData(
    votingMachine: PromiseOrValue<string>,
    initialProposals: IVotingMachineDataHelper.InitialProposalStruct[],
    user: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<IVotingMachineDataHelper.ProposalStructOutput[]>;

  callStatic: {
    getProposalsData(
      votingMachine: PromiseOrValue<string>,
      initialProposals: IVotingMachineDataHelper.InitialProposalStruct[],
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<IVotingMachineDataHelper.ProposalStructOutput[]>;
  };

  filters: {};

  estimateGas: {
    getProposalsData(
      votingMachine: PromiseOrValue<string>,
      initialProposals: IVotingMachineDataHelper.InitialProposalStruct[],
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getProposalsData(
      votingMachine: PromiseOrValue<string>,
      initialProposals: IVotingMachineDataHelper.InitialProposalStruct[],
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
