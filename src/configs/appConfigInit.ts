import {
  AaveSafetyModule,
  AaveV3Ethereum,
  GovernanceV3Arbitrum,
  GovernanceV3Avalanche,
  GovernanceV3Base,
  GovernanceV3BNB,
  GovernanceV3Ethereum,
  GovernanceV3Gnosis,
  GovernanceV3Metis,
  GovernanceV3Optimism,
  GovernanceV3Polygon,
  GovernanceV3Scroll,
  GovernanceV3ZkSync,
} from '@bgd-labs/aave-address-book';
import { Hex } from 'viem';
import {
  arbitrum,
  avalanche,
  avalancheFuji,
  base,
  bsc,
  gnosis,
  mainnet,
  metis,
  optimism,
  polygon,
  scroll,
  sepolia,
  zkSync,
} from 'viem/chains';

export type CoreNetworkName = 'mainnet' | 'sepolia';

type Config = {
  contractAddress: Hex;
  dataHelperContractAddress: Hex;
};

export const govCoreConfig: Record<
  CoreNetworkName,
  Config & { votingPortals: Record<number, Hex> }
> = {
  mainnet: {
    contractAddress: GovernanceV3Ethereum.GOVERNANCE,
    dataHelperContractAddress: GovernanceV3Ethereum.GOV_DATA_HELPER,
    votingPortals: {
      [mainnet.id]: GovernanceV3Ethereum.VOTING_PORTAL_ETH_ETH,
      [polygon.id]: GovernanceV3Ethereum.VOTING_PORTAL_ETH_POL,
      [avalanche.id]: GovernanceV3Ethereum.VOTING_PORTAL_ETH_AVAX,
    },
  },
  // testnets
  sepolia: {
    contractAddress: '0xc4ABF658C3Dda84225cF8A07d7D5Bb6Aa41d9E59',
    dataHelperContractAddress: '0x863f9De2f82AB502612E8B7d4f4863c8535cb8cA',
    votingPortals: {
      [sepolia.id]: '0x1079bAa48E56065d43b4344866B187a485cb0A92',
      [avalancheFuji.id]: '0x4f47EdF2577995aBd7B875Eed75b3F28a20E696F',
    },
  },
};

export const payloadsControllerConfig: Record<
  CoreNetworkName,
  Record<
    number,
    Pick<Config, 'dataHelperContractAddress'> & {
      contractAddresses: Hex[];
      payloadAddress?: Hex;
    }
  >
> = {
  mainnet: {
    [mainnet.id]: {
      dataHelperContractAddress: GovernanceV3Ethereum.PC_DATA_HELPER,
      contractAddresses: [GovernanceV3Ethereum.PAYLOADS_CONTROLLER],
    },
    [polygon.id]: {
      dataHelperContractAddress: GovernanceV3Polygon.PC_DATA_HELPER,
      contractAddresses: [GovernanceV3Polygon.PAYLOADS_CONTROLLER],
    },
    [avalanche.id]: {
      dataHelperContractAddress: GovernanceV3Avalanche.PC_DATA_HELPER,
      contractAddresses: [GovernanceV3Avalanche.PAYLOADS_CONTROLLER],
    },
    [base.id]: {
      dataHelperContractAddress: GovernanceV3Base.PC_DATA_HELPER,
      contractAddresses: [GovernanceV3Base.PAYLOADS_CONTROLLER],
    },
    [arbitrum.id]: {
      dataHelperContractAddress: GovernanceV3Arbitrum.PC_DATA_HELPER,
      contractAddresses: [GovernanceV3Arbitrum.PAYLOADS_CONTROLLER],
    },
    [metis.id]: {
      dataHelperContractAddress: GovernanceV3Metis.PC_DATA_HELPER,
      contractAddresses: [GovernanceV3Metis.PAYLOADS_CONTROLLER],
    },
    [optimism.id]: {
      dataHelperContractAddress: GovernanceV3Optimism.PC_DATA_HELPER,
      contractAddresses: [GovernanceV3Optimism.PAYLOADS_CONTROLLER],
    },
    [gnosis.id]: {
      dataHelperContractAddress: GovernanceV3Gnosis.PC_DATA_HELPER,
      contractAddresses: [GovernanceV3Gnosis.PAYLOADS_CONTROLLER],
    },
    [bsc.id]: {
      dataHelperContractAddress: GovernanceV3BNB.PC_DATA_HELPER,
      contractAddresses: [GovernanceV3BNB.PAYLOADS_CONTROLLER],
    },
    [scroll.id]: {
      dataHelperContractAddress: GovernanceV3Scroll.PC_DATA_HELPER,
      contractAddresses: [GovernanceV3Scroll.PAYLOADS_CONTROLLER],
    },
    [zkSync.id]: {
      dataHelperContractAddress: GovernanceV3ZkSync.PC_DATA_HELPER,
      contractAddresses: [GovernanceV3ZkSync.PAYLOADS_CONTROLLER],
    },
  },
  // testnets
  sepolia: {
    [sepolia.id]: {
      dataHelperContractAddress: '0x6B9AF21B95FE20b5a878b43670c23124841ec31A',
      contractAddresses: ['0x7E314a46AA6dF79c51869967B9b8e9f8Bb20781d'],
      payloadAddress: '0xf19de078dbac9db382caf8015cb208667ec581c0', // only for test
    },
    [avalancheFuji.id]: {
      dataHelperContractAddress: '0x6B9AF21B95FE20b5a878b43670c23124841ec31A',
      contractAddresses: ['0x1fad4eac642D8CAFb7fC5d38973D1C2764202da5'],
      payloadAddress: '0xdf9f39247c553485ac3bf974418947d9b2f969e5', // only for test
    },
  },
};

const votingMachineConfig: Record<
  CoreNetworkName,
  Record<number, Config & { dataWarehouseAddress: Hex }>
> = {
  mainnet: {
    [mainnet.id]: {
      contractAddress: GovernanceV3Ethereum.VOTING_MACHINE,
      dataHelperContractAddress: GovernanceV3Ethereum.VM_DATA_HELPER,
      dataWarehouseAddress: GovernanceV3Ethereum.DATA_WAREHOUSE,
    },
    [polygon.id]: {
      contractAddress: GovernanceV3Polygon.VOTING_MACHINE,
      dataHelperContractAddress: GovernanceV3Polygon.VM_DATA_HELPER,
      dataWarehouseAddress: GovernanceV3Polygon.DATA_WAREHOUSE,
    },
    [avalanche.id]: {
      contractAddress: GovernanceV3Avalanche.VOTING_MACHINE,
      dataHelperContractAddress: GovernanceV3Avalanche.VM_DATA_HELPER,
      dataWarehouseAddress: GovernanceV3Avalanche.DATA_WAREHOUSE,
    },
  },
  // testnets
  sepolia: {
    [sepolia.id]: {
      contractAddress: '0xA1995F1d5A8A247c064a76F336E1C2ecD24Ef0D9',
      dataHelperContractAddress: '0x133210F3fe2deEB34e65deB6861ee3dF87393977',
      dataWarehouseAddress: '0xACd2b1bA0B85FaF0f45D4974Ba8ee538E157fBc6',
    },
    [avalancheFuji.id]: {
      contractAddress: '0x767AA57554690D23D1E0594E8746271C97e1A1e4',
      dataHelperContractAddress: '0x133210F3fe2deEB34e65deB6861ee3dF87393977',
      dataWarehouseAddress: '0x2F4bc3128D0D52ef954552FfEC28BC523462dc02',
    },
  },
};

const govCoreChainId: Record<CoreNetworkName, number> = {
  mainnet: mainnet.id,
  // testnets
  sepolia: sepolia.id,
};

const aditionalsAddresses: Record<CoreNetworkName, Record<string, Hex>> = {
  mainnet: {
    aaveAddress: AaveV3Ethereum.ASSETS.AAVE.UNDERLYING,
    aAaveAddress: AaveV3Ethereum.ASSETS.AAVE.A_TOKEN,
    stkAAVEAddress: AaveSafetyModule.STK_AAVE,
    // for delegation
    delegationHelper: GovernanceV3Ethereum.META_DELEGATE_HELPER,
  },
  // testnets
  sepolia: {
    aaveAddress: '0xdaEcee477B931b209e8123401EA37582ACB3811d',
    aAaveAddress: '0x26aAB2aE39897338c2d91491C46c14a8c2a67919',
    stkAAVEAddress: '0x354032B31339853A3D682613749F183328d07275',
    delegationHelper: '0x7cc468E937ec7B06A2816B33AC159BC1273dF4A3',
  },
};

export const payloadsControllerChainIds: Record<CoreNetworkName, number[]> = {
  mainnet: [
    mainnet.id,
    polygon.id,
    avalanche.id,
    base.id,
    arbitrum.id,
    metis.id,
    optimism.id,
    bsc.id,
    gnosis.id,
    scroll.id,
    zkSync.id,
  ],
  sepolia: [sepolia.id, avalancheFuji.id],
};

export const votingMachineChainIds: Record<CoreNetworkName, number[]> = {
  mainnet: [mainnet.id, polygon.id, avalanche.id],
  sepolia: [sepolia.id, avalancheFuji.id],
};

export const appConfigInit = (coreNetwork: CoreNetworkName) => {
  return {
    govCoreChainId: govCoreChainId[coreNetwork],
    govCoreConfig: govCoreConfig[coreNetwork],
    votingMachineConfig: votingMachineConfig[coreNetwork],
    votingMachineChainIds: votingMachineChainIds[coreNetwork],
    payloadsControllerConfig: payloadsControllerConfig[coreNetwork],
    payloadsControllerChainIds: payloadsControllerChainIds[coreNetwork],

    additional: aditionalsAddresses[coreNetwork],
  };
};
