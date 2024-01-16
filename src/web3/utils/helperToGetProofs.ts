import {
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
import { getBlock } from 'viem/actions';

import { appConfig } from '../../utils/appConfig';

export type Proof = {
  balance: Hex; //QUANTITY - the balance of the account. Seeeth_getBalance
  codeHash: Hex; //DATA, 32 Bytes - hash of the code of the account. For a simple Account without code it will return "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470"
  nonce: Hex; //QUANTITY, - nonce of the account. See eth_getTransactionCount
  storageHash: Hex; //DATA, 32 Bytes - SHA3 of the StorageRoot. All storage will deliver a MerkleProof starting with this rootHash.
  accountProof: Hex[]; //ARRAY - Array of rlp-serialized MerkleTree-Nodes, starting with the stateRoot-Node, following the path of the SHA3 (address) as key.
  storageProof: {
    //ARRAY - Array of storage-entries as requested. Each entry is an object with these properties:
    key: Hex; //QUANTITY - the requested storage key
    value: Hex; //QUANTITY - the storage value
    proof: Hex[]; //ARRAY - Array of rlp-serialized MerkleTree-Nodes, starting with the storageHash-Node, following the path of the SHA3 (key) as path.
  }[];
};

export const slots = {
  [appConfig.additional.stkAAVEAddress.toLowerCase()]: {
    balance: 0,
    exchangeRate: 81,
  },
  [appConfig.additional.aAaveAddress.toLowerCase()]: {
    balance: 52,
    delegation: 64,
  },
  [appConfig.additional.aaveAddress.toLowerCase()]: {
    balance: 0,
  },
  [appConfig.govCoreConfig.contractAddress.toLowerCase()]: {
    balance: 9,
  },
};

export const formatToProofRLP = (rawData: Hex[]) => {
  return toRlp(rawData.map((d: Hex) => fromRlp(d, 'hex')));
};

export const getProof = async (
  client: Client,
  address: Hex,
  storageKeys: string[],
  blockNumber: number,
) => {
  return (await client.request({
    method: 'eth_getProof' as any,
    params: [address, storageKeys, toHex(blockNumber)] as any,
  })) as unknown as Proof;
};

export const getExtendedBlock = async (
  client: Client,
  blockNumber: number,
): Promise<Block> => {
  return (await getBlock(client, {
    blockNumber: BigInt(blockNumber),
    includeTransactions: false,
  })) as Block;
};

// IMPORTANT valid only for post-Shapella blocks, as it includes `withdrawalsRoot`
export const prepareBLockRLP = (rawBlock: Block) => {
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
  voter: Hex,
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

export function getVoteBalanceSlot(
  underlyingAsset: string,
  isWithDelegatedPower: boolean,
) {
  return underlyingAsset.toLowerCase() ===
    appConfig.additional.aAaveAddress.toLowerCase() && isWithDelegatedPower
    ? slots[underlyingAsset.toLowerCase()].delegation || 64
    : slots[underlyingAsset.toLowerCase()].balance || 0;
}
