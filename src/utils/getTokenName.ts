import { appConfig } from './appConfig';

export enum Token {
  AAVE = 'AAVE',
  STKAAVE = 'stkAAVE',
  AAAVE = 'aAAVE',
  GOVCORE = 'Gov core',
}

export function getTokenName(tokenAddress: string) {
  switch (tokenAddress.toLowerCase()) {
    case appConfig.additional.aaveAddress.toLowerCase():
      return Token.AAVE;
    case appConfig.additional.stkAAVEAddress.toLowerCase():
      return Token.STKAAVE;
    case appConfig.additional.aAaveAddress.toLowerCase():
      return Token.AAAVE;
    case appConfig.govCoreConfig.contractAddress.toLowerCase():
      return Token.GOVCORE;

    default:
      console.error('Token address incorrect');
      return '';
  }
}
