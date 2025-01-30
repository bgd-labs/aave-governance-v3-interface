import {
  Address,
  Block,
  Client,
  concat,
  encodeAbiParameters,
  fromRlp,
  Hex,
  keccak256,
  pad,
  parseAbiParameters,
  toHex,
  toRlp,
} from 'viem';
import { getBlock, getProof } from 'viem/actions';

import { appConfig } from '../configs/appConfig';
import { VotingDataByUser } from '../types';
import { getVoteBalanceSlot } from './getVoteBalanceSlot';

export const formatToProofRLP = (rawData: Hex[]) => {
  return toRlp(rawData.map((d: Hex) => fromRlp(d, 'hex')));
};

// IMPORTANT valid only for post-Dancun blocks:
// https://eips.ethereum.org/EIPS/eip-4844#header-extension
// https://eips.ethereum.org/EIPS/eip-4788#block-structure-and-validity
export const prepareBLockRLP = (
  rawBlock: Block & { parentBeaconBlockRoot: Hex },
) => {
  const rawData: Hex[] = [
    rawBlock.parentHash,
    rawBlock.sha3Uncles,
    rawBlock.miner,
    rawBlock.stateRoot,
    rawBlock.transactionsRoot,
    rawBlock.receiptsRoot,
    rawBlock.logsBloom as Hex,
    '0x', //toHex(rawBlock.difficulty),
    toHex(rawBlock.number || 0), // 0 to account for type null
    toHex(rawBlock.gasLimit),
    toHex(rawBlock.gasUsed),
    toHex(rawBlock.timestamp),
    rawBlock.extraData,
    rawBlock.mixHash,
    rawBlock.nonce as Hex,
    toHex(rawBlock.baseFeePerGas || 0), // 0 to account for type null
    rawBlock.withdrawalsRoot as Hex,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    rawBlock.blobGasUsed === '0x0' ? '0x' : toHex(rawBlock.blobGasUsed),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    rawBlock.excessBlobGas === '0x0' ? '0x' : toHex(rawBlock.excessBlobGas),
    rawBlock.parentBeaconBlockRoot,
  ];
  return toRlp(rawData);
};

export const getSolidityStorageSlotBytes = (mappingSlot: Hex, key: Hex) => {
  const slot = pad(mappingSlot).toString();
  return (
    //hexStripZeros
    keccak256(
      encodeAbiParameters(parseAbiParameters('address, uint256'), [
        key,
        BigInt(slot),
      ]),
    )
  );
};

export function getSolidityTwoLevelStorageSlotHash(
  rawSlot: Hex,
  voter: Address,
  chainId: number,
) {
  // ABI Encode the first level of the mapping
  // abi.encode(address(voter), uint256(MAPPING_SLOT))
  // The keccak256 of this value will be the "slot" of the inner mapping
  const firstLevelEncoded = encodeAbiParameters(
    [
      { name: 'voter', type: 'address' },
      { name: 'rawSlot', type: 'uint256' },
    ],
    [voter, BigInt(rawSlot)],
  );
  // ABI Encode the second level of the mapping
  // abi.encode(uint256(chainId))
  const secondLevelEncoded = encodeAbiParameters(
    [{ name: 'chainId', type: 'uint256' }],
    [BigInt(chainId)],
  );
  // Compute the storage slot of [address][uint256]
  // keccak256(abi.encode(uint256(chainId)) . abi.encode(address(voter), uint256(MAPPING_SLOT)))
  return keccak256(concat([secondLevelEncoded, keccak256(firstLevelEncoded)]));
}

export const getExtendedBlock = async (
  client: Client,
  blockNumber: number,
): Promise<Block> => {
  return (await getBlock(client, {
    blockNumber: BigInt(blockNumber),
    includeTransactions: false,
  })) as Block;
};

export async function getBlockNumberByBlockHash(
  client: Client,
  blockHash: Hex,
) {
  return Number((await getBlock(client, { blockHash })).number);
}

export async function getAndFormatProof({
  client,
  userAddress,
  underlyingAsset,
  blockNumber,
  baseBalanceSlotRaw,
}: {
  client: Client; // gov core client
  userAddress: Address;
  underlyingAsset: Address;
  blockNumber: number;
  baseBalanceSlotRaw: number;
}) {
  const hashedHolderSlot = getSolidityStorageSlotBytes(
    pad(toHex(baseBalanceSlotRaw), { size: 32 }),
    userAddress,
  );

  const rawProofData = await getProof(client, {
    address: underlyingAsset,
    storageKeys: [hashedHolderSlot],
    blockNumber: BigInt(blockNumber),
  });

  const proof = formatToProofRLP(rawProofData.storageProof[0].proof);

  return {
    underlyingAsset,
    slot: BigInt(baseBalanceSlotRaw),
    proof,
  };
}

export async function getVotingProofs({
  client,
  blockHash,
  address,
  balances,
}: {
  client: Client; // gov core client
  blockHash: Hex;
  address: Address;
  balances: VotingDataByUser[];
}) {
  const blockNumber = await getBlockNumberByBlockHash(client, blockHash);
  return await Promise.all(
    balances
      .filter((balance) => balance.votingPower !== 0n)
      .map((balance) => {
        const balanceSlotRaw = getVoteBalanceSlot(
          balance.asset,
          balance.isWithDelegatedPower,
        );
        return getAndFormatProof({
          client,
          userAddress: address,
          underlyingAsset: balance.asset as Hex,
          baseBalanceSlotRaw: balanceSlotRaw,
          blockNumber: blockNumber,
        });
      }),
  );
}

export async function getProofOfRepresentative({
  client,
  blockHash,
  address,
  chainId,
}: {
  client: Client; // gov core client
  blockHash: Hex;
  address: Address;
  chainId: number;
}) {
  const blockNumber = await getBlockNumberByBlockHash(client, blockHash);
  const balanceSlotRaw = getVoteBalanceSlot(
    appConfig.govCoreConfig.contractAddress,
    false,
  );
  const hexSlot = toHex(balanceSlotRaw);
  const slot = getSolidityTwoLevelStorageSlotHash(hexSlot, address, chainId);
  const rawProofData = await getProof(client, {
    address: appConfig.govCoreConfig.contractAddress,
    storageKeys: [slot],
    blockNumber: BigInt(blockNumber),
  });
  return formatToProofRLP(rawProofData.storageProof[0].proof);
}
