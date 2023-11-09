import { Hex } from 'viem';

export type PayloadParams = {
  chainId: number;
  accessLevel: number;
  payloadsController: Hex;
  payloadId: number;
};

export interface InitialParams {
  ipfsHash?: Hex;
  votingPortal?: Hex;
  payloads: PayloadParams[];
}
