export type PayloadParams = {
  chain: number;
  accessLevel: number;
  payloadsController: string;
  payloadId: number;
};

export interface InitialParams {
  ipfsHash?: string;
  votingPortal?: string;
  payloads: PayloadParams[];
}
