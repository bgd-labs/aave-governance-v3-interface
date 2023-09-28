import { StaticJsonRpcBatchProvider } from '@bgd-labs/frontend-web3-utils';
import { BigNumber, BytesLike, ethers, utils } from 'ethers';
import {
  defaultAbiCoder,
  hexStripZeros,
  hexZeroPad,
  keccak256,
} from 'ethers/lib/utils.js';

import { appConfig } from '../../utils/appConfig';

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

export function formatToProofRLP(rawData: string[]): string {
  return ethers.utils.RLP.encode(
    rawData.map((d) => ethers.utils.RLP.decode(d)),
  );
}

export const getProof = async (
  provider: ethers.providers.JsonRpcBatchProvider,
  address: string,
  storageKeys: string[],
  blockNumber: number,
) => {
  return await provider.send('eth_getProof', [
    address,
    storageKeys,
    BigNumber.from(blockNumber).toHexString(),
  ]);
};

export const getExtendedBlock = async (
  provider: ethers.providers.JsonRpcBatchProvider,
  blockNumber: number,
) => {
  return provider.send('eth_getBlockByNumber', [
    BigNumber.from(blockNumber).toHexString(),
    false,
  ]);
};

// IMPORTANT valid only for post-London blocks, as it includes `baseFeePerGas`
export function prepareBLockRLP(rawBlock: any) {
  const rawData = [
    rawBlock.parentHash,
    rawBlock.sha3Uncles,
    rawBlock.miner,
    rawBlock.stateRoot,
    rawBlock.transactionsRoot,
    rawBlock.receiptsRoot,
    rawBlock.logsBloom,
    '0x', //BigNumber.from(rawBlock.difficulty).toHexString(),
    BigNumber.from(rawBlock.number).toHexString(),
    BigNumber.from(rawBlock.gasLimit).toHexString(),
    rawBlock.gasUsed === '0x0'
      ? '0x'
      : BigNumber.from(rawBlock.gasUsed).toHexString(),
    BigNumber.from(rawBlock.timestamp).toHexString(),
    rawBlock.extraData,
    rawBlock.mixHash,
    rawBlock.nonce,
    BigNumber.from(rawBlock.baseFeePerGas).toHexString(),
    rawBlock.withdrawalsRoot,
  ];
  console.log('raw data array: ', rawData);
  return ethers.utils.RLP.encode(rawData);
}

export function getSolidityStorageSlotBytes(
  mappingSlot: BytesLike,
  key: string,
) {
  const slot = hexZeroPad(mappingSlot, 32);
  return hexStripZeros(
    keccak256(defaultAbiCoder.encode(['address', 'uint256'], [key, slot])),
  );
}

export function getSolidityTwoLevelStorageSlotHash(
  rawSlot: string,
  voter: string,
  chainId: number,
) {
  const abiCoder = new ethers.utils.AbiCoder();
  // ABI Encode the first level of the mapping
  // abi.encode(address(voter), uint256(MAPPING_SLOT))
  // The keccak256 of this value will be the "slot" of the inner mapping
  const firstLevelEncoded = abiCoder.encode(
    ['address', 'uint256'],
    [voter, ethers.BigNumber.from(rawSlot)],
  );

  // ABI Encode the second level of the mapping
  // abi.encode(uint256(chainId))
  const secondLevelEncoded = abiCoder.encode(
    ['uint256'],
    [ethers.BigNumber.from(chainId)],
  );

  // Compute the storage slot of [address][uint256]
  // keccak256(abi.encode(uint256(chainId)) . abi.encode(address(voter), uint256(MAPPING_SLOT)))
  return ethers.utils.keccak256(
    ethers.utils.concat([
      secondLevelEncoded,
      ethers.utils.keccak256(firstLevelEncoded),
    ]),
  );
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

const generateProofs = async (
  provider: StaticJsonRpcBatchProvider,
  token: string,
  slot: string,
  blockNumber: number,
) => {
  const rawAccountProofData = await getProof(
    provider,
    token,
    [slot],
    blockNumber,
  );

  // storageProofRLP
  return formatToProofRLP(rawAccountProofData.storageProof[0].proof);
};

export const generateProofsRepresentativeByChain = async (
  provider: StaticJsonRpcBatchProvider,
  token: string,
  rawSlot: number,
  voter: string,
  chainId: number,
  blockNumber: number,
) => {
  const hexSlot = utils.hexlify(rawSlot);
  const slot = getSolidityTwoLevelStorageSlotHash(hexSlot, voter, chainId);

  // storageProofRLP
  return generateProofs(provider, token, slot, blockNumber);
};
