import { isAddress } from 'viem';

import { texts } from './texts';

export const required = (value: any) =>
  value || value === 0 ? undefined : texts.other.requiredValidation;

export const addressValidator = (value: any) =>
  isAddress(value) || value === '' || value === undefined
    ? undefined
    : texts.other.addressValidation;

export const ensNameOrAddressValidator = (value: string) =>
  (value && (value.endsWith('.eth') || isAddress(value))) ||
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

export const rpcUrlValidator = (value: string) => {
  if (value && value.startsWith('https://')) {
    try {
      new URL(value);
      return undefined;
    } catch {
      return texts.other.rpcUrlValidation;
    }
  }
  return texts.other.rpcUrlValidation;
};
