import makeBlockie from 'ethereum-blockies-base64';
import { Hex, isAddress } from 'viem';
import { mainnet } from 'viem/chains';
import { normalize } from 'viem/ens';

import { chainInfoHelper } from '../../utils/configs';

const client = chainInfoHelper.clientInstances[mainnet.id].instance;

export const getName = async (address: Hex) => {
  try {
    const name = await client.getEnsName({ address });
    return name ? name : undefined;
  } catch (error) {
    console.error('ENS name lookup error', error);
  }
};

export const getAvatar = async (name: string, address: string) => {
  try {
    const background_image = await client.getEnsAvatar({ name });
    return !!background_image ? background_image : makeBlockie(address);
  } catch (error) {
    console.error('ENS avatar lookup error', error);
  }
};

export const getAddress = async (name: string) => {
  try {
    const address = await client.getEnsAddress({
      name: normalize(name),
    });
    return address ? address.toLocaleLowerCase() : undefined;
  } catch (error) {
    console.error('ENS address lookup error', error);
  }
};

export const isEnsName = (address: string) => !isAddress(address);

export const ENS_TTL = 60 * 60 * 24; // 1 day
