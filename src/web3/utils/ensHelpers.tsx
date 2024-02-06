import makeBlockie from 'ethereum-blockies-base64';
import { Address, Hex, isAddress } from 'viem';
import { mainnet } from 'viem/chains';
import { getEnsAddress, getEnsAvatar, getEnsName, normalize } from 'viem/ens';

import { chainInfoHelper } from '../../utils/configs';

const client = chainInfoHelper.clientInstances[mainnet.id].instance;

export const getName = async (address: Hex) => {
  try {
    const name = await getEnsName(client, { address });
    return name ? name : undefined;
  } catch (error) {
    console.error('ENS name lookup error', error);
  }
};

export const getAvatar = async (name: string, address: string) => {
  try {
    const background_image = await getEnsAvatar(client, { name });
    return !!background_image ? background_image : makeBlockie(address);
  } catch (error) {
    console.error('ENS avatar lookup error', error);
  }
};

export const getAddress = async (name: string) => {
  try {
    const address = await getEnsAddress(client, {
      name: normalize(name),
    });
    return (address ? address.toLocaleLowerCase() : undefined) as
      | Address
      | undefined;
  } catch (error) {
    console.error('ENS address lookup error', error);
  }
};

export const isEnsName = (address: string) => !isAddress(address);

export const ENS_TTL = 60 * 60 * 24; // 1 day
