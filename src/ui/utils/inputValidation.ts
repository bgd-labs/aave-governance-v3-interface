import { ethers } from 'ethers';

import { RpcSwitcherFormData } from '../../rpcSwitcher/store/providerSlice';
import { extractIndexFromInputName } from '../../rpcSwitcher/utils/validationManagement';
import { texts } from './texts';

export const required = (value: any) =>
  value || value === 0 ? undefined : texts.other.requiredValidation;

export const addressValidator = (value: any) =>
  ethers.utils.isAddress(value) || value === '' || value === undefined
    ? undefined
    : texts.other.addressValidation;

export const ensNameOrAddressValidator = (value: string) =>
  (value && (value.endsWith('.eth') || ethers.utils.isAddress(value))) ||
  value === '' ||
  value === undefined
    ? undefined
    : texts.other.ensNameValidation;

export const composeValidators =
  (...validators: any) =>
  (value: any) =>
    validators.reduce(
      (error: any, validator: any) => error || validator(value),
      undefined,
    );

const incorrectFields = new Map();

export const rpcUrlValidator = async (
  value: string,
  initialForm: RpcSwitcherFormData,
  inputName: string,
) => {
  if (!Array.isArray(initialForm)) return undefined;
  const index = extractIndexFromInputName(inputName || '');

  if (index === null || index >= initialForm.length) return undefined;

  const item = initialForm[index];

  if (item && item.rpcUrl !== value) {
    try {
      const provider = new ethers.providers.StaticJsonRpcProvider(
        value,
        item.chainId,
      );
      await provider.getBlockNumber();

      if (incorrectFields.has(item.chainId)) {
        incorrectFields.delete(item.chainId);
      }
      return undefined;
    } catch {
      incorrectFields.set(item.chainId, true);
      return texts.other.rpcUrlValidation;
    }
  }

  if (incorrectFields.has(item.chainId)) {
    return texts.other.rpcUrlValidation;
  }

  return undefined;
};
