import { ChainIdByName } from '@bgd-labs/aave-governance-ui-helpers/src/helpers/chains';
import makeBlockie from 'ethereum-blockies-base64';
import { utils } from 'ethers';

import { chainInfoHelper } from '../../utils/configs';

const mainnetProvider =
  chainInfoHelper.providerInstances[ChainIdByName.EthereumMainnet].instance;

export const getName = async (address: string) => {
  try {
    const name = await mainnetProvider.lookupAddress(address);
    return name ? name : undefined;
  } catch (error) {
    console.error('ENS name lookup error', error);
  }
};

export const getAvatar = async (name: string, address: string) => {
  try {
    const labelHash = utils.keccak256(
      utils.toUtf8Bytes(name?.replace('.eth', '')),
    );
    const result: { background_image: string } = await (
      await fetch(
        `https://metadata.ens.domains/mainnet/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85/${labelHash}/`,
      )
    ).json();

    return result && result.background_image
      ? result.background_image
      : makeBlockie(address);
  } catch (error) {
    console.error('ENS avatar lookup error', error);
  }
};

export const getAddress = async (name: string) => {
  try {
    const address = await mainnetProvider.resolveName(name);
    return address ? address.toLocaleLowerCase() : undefined;
  } catch (error) {
    console.error('ENS address lookup error', error);
  }
};

export const isAddress = (address: string) => address.startsWith('0x');
export const isEnsName = (address: string) => !isAddress(address);

export const ENS_TTL = 60 * 60 * 24; // 1 day
