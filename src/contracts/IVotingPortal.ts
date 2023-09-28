/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export interface IVotingPortalInterface extends utils.Interface {
  functions: {
    "CROSS_CHAIN_CONTROLLER()": FunctionFragment;
    "GOVERNANCE()": FunctionFragment;
    "VOTING_MACHINE()": FunctionFragment;
    "VOTING_MACHINE_CHAIN_ID()": FunctionFragment;
    "decodeMessage(bytes)": FunctionFragment;
    "forwardStartVotingMessage(uint256,bytes32,uint24)": FunctionFragment;
    "getStartVotingGasLimit()": FunctionFragment;
    "receiveCrossChainMessage(address,uint256,bytes)": FunctionFragment;
    "setStartVotingGasLimit(uint128)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "CROSS_CHAIN_CONTROLLER"
      | "GOVERNANCE"
      | "VOTING_MACHINE"
      | "VOTING_MACHINE_CHAIN_ID"
      | "decodeMessage"
      | "forwardStartVotingMessage"
      | "getStartVotingGasLimit"
      | "receiveCrossChainMessage"
      | "setStartVotingGasLimit"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "CROSS_CHAIN_CONTROLLER",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "GOVERNANCE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "VOTING_MACHINE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "VOTING_MACHINE_CHAIN_ID",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "decodeMessage",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "forwardStartVotingMessage",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getStartVotingGasLimit",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "receiveCrossChainMessage",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setStartVotingGasLimit",
    values: [PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(
    functionFragment: "CROSS_CHAIN_CONTROLLER",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "GOVERNANCE", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "VOTING_MACHINE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "VOTING_MACHINE_CHAIN_ID",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "decodeMessage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "forwardStartVotingMessage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getStartVotingGasLimit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "receiveCrossChainMessage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setStartVotingGasLimit",
    data: BytesLike
  ): Result;

  events: {
    "StartVotingGasLimitUpdated(uint128)": EventFragment;
    "VoteMessageReceived(address,uint256,bool,bytes,bytes)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "StartVotingGasLimitUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "VoteMessageReceived"): EventFragment;
}

export interface StartVotingGasLimitUpdatedEventObject {
  gasLimit: BigNumber;
}
export type StartVotingGasLimitUpdatedEvent = TypedEvent<
  [BigNumber],
  StartVotingGasLimitUpdatedEventObject
>;

export type StartVotingGasLimitUpdatedEventFilter =
  TypedEventFilter<StartVotingGasLimitUpdatedEvent>;

export interface VoteMessageReceivedEventObject {
  originSender: string;
  originChainId: BigNumber;
  delivered: boolean;
  message: string;
  reason: string;
}
export type VoteMessageReceivedEvent = TypedEvent<
  [string, BigNumber, boolean, string, string],
  VoteMessageReceivedEventObject
>;

export type VoteMessageReceivedEventFilter =
  TypedEventFilter<VoteMessageReceivedEvent>;

export interface IVotingPortal extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IVotingPortalInterface;

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
    CROSS_CHAIN_CONTROLLER(overrides?: CallOverrides): Promise<[string]>;

    GOVERNANCE(overrides?: CallOverrides): Promise<[string]>;

    VOTING_MACHINE(overrides?: CallOverrides): Promise<[string]>;

    VOTING_MACHINE_CHAIN_ID(overrides?: CallOverrides): Promise<[BigNumber]>;

    decodeMessage(
      message: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber, BigNumber]>;

    forwardStartVotingMessage(
      proposalId: PromiseOrValue<BigNumberish>,
      blockHash: PromiseOrValue<BytesLike>,
      votingDuration: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getStartVotingGasLimit(overrides?: CallOverrides): Promise<[BigNumber]>;

    receiveCrossChainMessage(
      originSender: PromiseOrValue<string>,
      originChainId: PromiseOrValue<BigNumberish>,
      message: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setStartVotingGasLimit(
      gasLimit: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  CROSS_CHAIN_CONTROLLER(overrides?: CallOverrides): Promise<string>;

  GOVERNANCE(overrides?: CallOverrides): Promise<string>;

  VOTING_MACHINE(overrides?: CallOverrides): Promise<string>;

  VOTING_MACHINE_CHAIN_ID(overrides?: CallOverrides): Promise<BigNumber>;

  decodeMessage(
    message: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber, BigNumber]>;

  forwardStartVotingMessage(
    proposalId: PromiseOrValue<BigNumberish>,
    blockHash: PromiseOrValue<BytesLike>,
    votingDuration: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getStartVotingGasLimit(overrides?: CallOverrides): Promise<BigNumber>;

  receiveCrossChainMessage(
    originSender: PromiseOrValue<string>,
    originChainId: PromiseOrValue<BigNumberish>,
    message: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setStartVotingGasLimit(
    gasLimit: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    CROSS_CHAIN_CONTROLLER(overrides?: CallOverrides): Promise<string>;

    GOVERNANCE(overrides?: CallOverrides): Promise<string>;

    VOTING_MACHINE(overrides?: CallOverrides): Promise<string>;

    VOTING_MACHINE_CHAIN_ID(overrides?: CallOverrides): Promise<BigNumber>;

    decodeMessage(
      message: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber, BigNumber]>;

    forwardStartVotingMessage(
      proposalId: PromiseOrValue<BigNumberish>,
      blockHash: PromiseOrValue<BytesLike>,
      votingDuration: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    getStartVotingGasLimit(overrides?: CallOverrides): Promise<BigNumber>;

    receiveCrossChainMessage(
      originSender: PromiseOrValue<string>,
      originChainId: PromiseOrValue<BigNumberish>,
      message: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    setStartVotingGasLimit(
      gasLimit: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "StartVotingGasLimitUpdated(uint128)"(
      gasLimit?: null
    ): StartVotingGasLimitUpdatedEventFilter;
    StartVotingGasLimitUpdated(
      gasLimit?: null
    ): StartVotingGasLimitUpdatedEventFilter;

    "VoteMessageReceived(address,uint256,bool,bytes,bytes)"(
      originSender?: PromiseOrValue<string> | null,
      originChainId?: PromiseOrValue<BigNumberish> | null,
      delivered?: PromiseOrValue<boolean> | null,
      message?: null,
      reason?: null
    ): VoteMessageReceivedEventFilter;
    VoteMessageReceived(
      originSender?: PromiseOrValue<string> | null,
      originChainId?: PromiseOrValue<BigNumberish> | null,
      delivered?: PromiseOrValue<boolean> | null,
      message?: null,
      reason?: null
    ): VoteMessageReceivedEventFilter;
  };

  estimateGas: {
    CROSS_CHAIN_CONTROLLER(overrides?: CallOverrides): Promise<BigNumber>;

    GOVERNANCE(overrides?: CallOverrides): Promise<BigNumber>;

    VOTING_MACHINE(overrides?: CallOverrides): Promise<BigNumber>;

    VOTING_MACHINE_CHAIN_ID(overrides?: CallOverrides): Promise<BigNumber>;

    decodeMessage(
      message: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    forwardStartVotingMessage(
      proposalId: PromiseOrValue<BigNumberish>,
      blockHash: PromiseOrValue<BytesLike>,
      votingDuration: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getStartVotingGasLimit(overrides?: CallOverrides): Promise<BigNumber>;

    receiveCrossChainMessage(
      originSender: PromiseOrValue<string>,
      originChainId: PromiseOrValue<BigNumberish>,
      message: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setStartVotingGasLimit(
      gasLimit: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    CROSS_CHAIN_CONTROLLER(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    GOVERNANCE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    VOTING_MACHINE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    VOTING_MACHINE_CHAIN_ID(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    decodeMessage(
      message: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    forwardStartVotingMessage(
      proposalId: PromiseOrValue<BigNumberish>,
      blockHash: PromiseOrValue<BytesLike>,
      votingDuration: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getStartVotingGasLimit(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    receiveCrossChainMessage(
      originSender: PromiseOrValue<string>,
      originChainId: PromiseOrValue<BigNumberish>,
      message: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setStartVotingGasLimit(
      gasLimit: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
