import { IDataWarehouse_ABI } from '@bgd-labs/aave-address-book/abis';
import { writeContract } from '@wagmi/core';
import { Address, Block, Client, Hex, pad, toHex } from 'viem';
import { getProof } from 'viem/actions';
import { Config } from 'wagmi';

import { appConfig } from '../../configs/appConfig';
import {
  formatToProofRLP,
  getExtendedBlock,
  getSolidityStorageSlotBytes,
  prepareBLockRLP,
} from '../../helpers/proofsHelpers';

export async function sendProofs({
  govCoreClient,
  wagmiConfig,
  user,
  blockNumber,
  asset,
  chainId,
  baseBalanceSlotRaw,
  withSlot,
}: {
  govCoreClient: Client;
  wagmiConfig?: Config;
  user: string;
  blockNumber: number;
  asset: string;
  chainId: number;
  baseBalanceSlotRaw: number;
  withSlot?: boolean;
}) {
  if (wagmiConfig) {
    const blockData = (await getExtendedBlock(
      govCoreClient,
      blockNumber,
    )) as Block & { parentBeaconBlockRoot: Hex };
    const blockHeaderRLP = prepareBLockRLP(blockData);

    const slot = getSolidityStorageSlotBytes(
      pad(toHex(baseBalanceSlotRaw), { size: 32 }),
      user as Address,
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
      asset.toLowerCase() === appConfig.additional.stkAAVEAddress.toLowerCase()
        ? appConfig.additional.stkAAVEAddress
        : undefined;
    const RepresentationsAddress =
      asset.toLowerCase() ===
      appConfig.govCoreConfig.contractAddress.toLowerCase()
        ? appConfig.govCoreConfig.contractAddress
        : undefined;

    if (AAVEAddress) {
      const rawAccountProofData = await getProof(govCoreClient, {
        address: AAVEAddress,
        storageKeys: [slot],
        blockNumber: BigInt(blockNumber),
      });

      const accountStateProofRLP = formatToProofRLP(
        rawAccountProofData.accountProof,
      );

      return writeContract(wagmiConfig, {
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
      const rawAccountProofData = await getProof(govCoreClient, {
        address: aAAVEAddress,
        storageKeys: [slot, delegatedStateSlot],
        blockNumber: BigInt(blockNumber),
      });

      const accountStateProofRLP = formatToProofRLP(
        rawAccountProofData.accountProof,
      );

      return writeContract(wagmiConfig, {
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
      const rawAccountProofData = await getProof(govCoreClient, {
        address: STKAAVEAddress,
        storageKeys: [slot, exchangeRateSlot],
        blockNumber: BigInt(blockNumber),
      });

      const accountStateProofRLP = formatToProofRLP(
        rawAccountProofData.accountProof,
      );

      return writeContract(wagmiConfig, {
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
      const slotProof = await getProof(govCoreClient, {
        address: STKAAVEAddress,
        storageKeys: [exchangeRateSlot],
        blockNumber: BigInt(blockNumber),
      });

      const slotProofRLP = formatToProofRLP(slotProof.storageProof[0].proof);

      return writeContract(wagmiConfig, {
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

      const rawAccountProofData = await getProof(govCoreClient, {
        address: RepresentationsAddress,
        storageKeys: [representationsSlot],
        blockNumber: BigInt(blockNumber),
      });

      const accountStateProofRLP = formatToProofRLP(
        rawAccountProofData.accountProof,
      );

      return writeContract(wagmiConfig, {
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
