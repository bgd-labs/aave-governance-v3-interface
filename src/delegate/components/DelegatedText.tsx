import { Box } from '@mui/system';
import React from 'react';
import { Hex } from 'viem';

import { useStore } from '../../store';
import { Link } from '../../ui';
import { CopyAndExternalIconsSet } from '../../ui/components/CopyAndExternalIconsSet';
import { textCenterEllipsis } from '../../ui/utils/text-center-ellipsis';
import { texts } from '../../ui/utils/texts';
import { appConfig } from '../../utils/appConfig';
import { chainInfoHelper } from '../../utils/configs';
import { getTokenName, Token } from '../../utils/getTokenName';
import { ENSDataExists } from '../../web3/store/ensSelectors';
import { ENSProperty } from '../../web3/store/ensSlice';
import { isEnsName } from '../../web3/utils/ensHelpers';
import { DelegateData, DelegateItem, TxDelegateData } from '../types';

interface DelegatedTextProps {
  delegateData: DelegateItem[];
  formDelegateData: DelegateData[];
  isBeforeTx?: boolean;
}

export function DelegatedText({
  delegateData,
  formDelegateData,
  isBeforeTx,
}: DelegatedTextProps) {
  const store = useStore();
  const { activeWallet, ensData } = store;
  const activeAddress = activeWallet?.address;

  const delegatedData: TxDelegateData[] = [];
  for (const formDelegateItem of formDelegateData) {
    const { votingToAddress, propositionToAddress, underlyingAsset } =
      formDelegateItem;
    const symbol = getTokenName(underlyingAsset) || Token.AAVE;

    // get previous delegation data for current asset
    const delegateDataLocal: DelegateItem = delegateData.filter(
      (data) => data.underlyingAsset === underlyingAsset,
    )[0];

    const isAddressSame = votingToAddress === propositionToAddress;
    const isInitialAddressSame =
      delegateDataLocal?.propositionToAddress ===
      delegateDataLocal?.votingToAddress;

    const isVotingToAddressSame =
      delegateDataLocal?.votingToAddress === votingToAddress;
    const isPropositionToAddressSame =
      delegateDataLocal?.propositionToAddress === propositionToAddress;

    // check if delegationTo is the same address and not equal to previous delegation
    if (
      isAddressSame &&
      (!isInitialAddressSame ||
        votingToAddress !== delegateDataLocal?.votingToAddress)
    ) {
      delegatedData.push({
        symbol,
        underlyingAsset,
        bothAddresses: votingToAddress,
      });
    } else {
      // if delegationTo are different addresses
      // check if need to re-delegate voting
      if (!isVotingToAddressSame) {
        delegatedData.push({
          symbol,
          underlyingAsset,
          votingToAddress,
        });
      }
      // check if need to re-delegate proposition
      if (!isPropositionToAddressSame) {
        delegatedData.push({
          symbol,
          underlyingAsset,
          propositionToAddress,
        });
      }
    }
  }

  return (
    <>
      {delegatedData.map((data, index) => {
        const isBothPowersDelegated =
          data.bothAddresses !== '' && data.bothAddresses !== activeAddress;
        const isVotingPowerDelegated =
          data.votingToAddress !== '' && data.votingToAddress !== activeAddress;
        const isPropositionPowerDelegated =
          data.propositionToAddress !== '' &&
          data.propositionToAddress !== activeAddress;

        const firstText =
          typeof data.bothAddresses !== 'undefined'
            ? isBothPowersDelegated
              ? isBeforeTx
                ? texts.delegatePage.willDelegate
                : texts.delegatePage.delegated
              : isBeforeTx
                ? texts.delegatePage.receiveBack
                : texts.delegatePage.receivedBack
            : typeof data.votingToAddress !== 'undefined'
              ? isVotingPowerDelegated
                ? isBeforeTx
                  ? texts.delegatePage.willDelegate
                  : texts.delegatePage.delegated
                : isBeforeTx
                  ? texts.delegatePage.receiveBack
                  : texts.delegatePage.receivedBack
              : typeof data.propositionToAddress !== 'undefined'
                ? isPropositionPowerDelegated
                  ? isBeforeTx
                    ? texts.delegatePage.willDelegate
                    : texts.delegatePage.delegated
                  : isBeforeTx
                    ? texts.delegatePage.receiveBack
                    : texts.delegatePage.receivedBack
                : '';

        // TODO: maybe simplify this, but will be not readable
        const formattedBothAddresses = isEnsName(data.bothAddresses || '')
          ? data.bothAddresses
          : data.bothAddresses &&
              ENSDataExists(store, data.bothAddresses, ENSProperty.NAME)
            ? ensData[data.bothAddresses?.toLocaleLowerCase() as Hex].name
            : data.bothAddresses;
        const formattedVotingToAddress = isEnsName(data.votingToAddress || '')
          ? data.votingToAddress
          : data.votingToAddress &&
              ENSDataExists(store, data.votingToAddress, ENSProperty.NAME)
            ? ensData[data.votingToAddress?.toLocaleLowerCase() as Hex].name
            : data.votingToAddress;
        const formattedPropositionToAddress = isEnsName(
          data.propositionToAddress || '',
        )
          ? data.propositionToAddress
          : data.propositionToAddress &&
              ENSDataExists(store, data.propositionToAddress, ENSProperty.NAME)
            ? ensData[data.propositionToAddress?.toLocaleLowerCase() as Hex]
                .name
            : data.propositionToAddress;

        const address =
          typeof data.bothAddresses !== 'undefined'
            ? isBothPowersDelegated
              ? formattedBothAddresses?.startsWith('0x')
                ? textCenterEllipsis(formattedBothAddresses, 6, 4)
                : formattedBothAddresses
              : ''
            : typeof data.votingToAddress !== 'undefined'
              ? isVotingPowerDelegated
                ? formattedVotingToAddress?.startsWith('0x')
                  ? textCenterEllipsis(formattedVotingToAddress, 6, 4)
                  : formattedVotingToAddress
                : ''
              : typeof data.propositionToAddress !== 'undefined'
                ? isPropositionPowerDelegated
                  ? formattedPropositionToAddress?.startsWith('0x')
                    ? textCenterEllipsis(formattedPropositionToAddress, 6, 4)
                    : formattedPropositionToAddress
                  : ''
                : '';

        const middleText =
          typeof data.bothAddresses !== 'undefined'
            ? `${texts.delegatePage.votingAndPropositionPowers} ${
                !!address ? 'to' : ''
              }`
            : typeof data.votingToAddress !== 'undefined'
              ? `${texts.delegatePage.votingPower} ${!!address ? 'to' : ''}`
              : typeof data.propositionToAddress !== 'undefined'
                ? `${texts.delegatePage.propositionPower} ${
                    !!address ? 'to' : ''
                  }`
                : '';

        const endText = delegatedData.length - 1 !== index ? 'and ' : '';

        const link =
          typeof data.bothAddresses !== 'undefined' && data.bothAddresses !== ''
            ? `${chainInfoHelper.getChainParameters(appConfig.govCoreChainId)
                .blockExplorers?.default.url}/address/${data.bothAddresses}`
            : typeof data.votingToAddress !== 'undefined' &&
                data.votingToAddress !== ''
              ? `${chainInfoHelper.getChainParameters(appConfig.govCoreChainId)
                  .blockExplorers?.default.url}/address/${data.votingToAddress}`
              : typeof data.propositionToAddress !== 'undefined' &&
                  data.propositionToAddress !== ''
                ? `${chainInfoHelper.getChainParameters(
                    appConfig.govCoreChainId,
                  ).blockExplorers?.default.url}/address/${
                    data.propositionToAddress
                  }`
                : undefined;

        return (
          <Box sx={{ display: 'inline' }} key={index}>
            {firstText} <b>{data.symbol}</b> {middleText}{' '}
            {!!link && (
              <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                <Link
                  href={link}
                  css={{
                    color: '$textSecondary',
                    hover: { opacity: '0.7 !important' },
                  }}
                  inNewWindow>
                  {address}
                </Link>
                <CopyAndExternalIconsSet
                  iconSize={10}
                  externalLink={link}
                  sx={{ '.CopyAndExternalIconsSet__link': { ml: 3 } }}
                />
              </Box>
            )}{' '}
            {endText}
          </Box>
        );
      })}
    </>
  );
}
