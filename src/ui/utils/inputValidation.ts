import { ethers } from 'ethers';

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
