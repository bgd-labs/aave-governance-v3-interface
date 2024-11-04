import { Address, Hex } from 'viem';

export type PayloadParams = {
  chainId: number;
  accessLevel: number;
  payloadsController: Address;
  payloadId: number;
};

export interface InitialParams {
  proposalId?: number;
  ipfsHash?: Hex;
  votingPortal?: Address;
  payloads: PayloadParams[];
}
