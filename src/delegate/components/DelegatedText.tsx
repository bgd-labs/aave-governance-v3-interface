import { Box } from '@mui/system';
import React from 'react';
import { Hex } from 'viem';

import { useStore } from '../../store';
import { textCenterEllipsis } from '../../ui/utils/text-center-ellipsis';
import { texts } from '../../ui/utils/texts';
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
  const activeAddress = activeWallet?.address || '';

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
          data.bothAddresses !== '0x0' && data.bothAddresses !== activeAddress;
        const isVotingPowerDelegated =
          data.votingToAddress !== '0x0' &&
          data.votingToAddress !== activeAddress;
        const isPropositionPowerDelegated =
          data.propositionToAddress !== '0x0' &&
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
          ? ensData[data.propositionToAddress?.toLocaleLowerCase() as Hex].name
          : data.propositionToAddress;

        const middleText =
          typeof data.bothAddresses !== 'undefined'
            ? `${texts.delegatePage.votingAndPropositionPowers} ${
                isBothPowersDelegated
                  ? `to ${
                      formattedBothAddresses?.startsWith('0x')
                        ? textCenterEllipsis(formattedBothAddresses, 6, 4)
                        : formattedBothAddresses
                    }`
                  : ''
              }`
            : typeof data.votingToAddress !== 'undefined'
            ? `${texts.delegatePage.votingPower} ${
                isVotingPowerDelegated
                  ? `to ${
                      formattedVotingToAddress?.startsWith('0x')
                        ? textCenterEllipsis(formattedVotingToAddress, 6, 4)
                        : formattedVotingToAddress
                    }`
                  : ''
              }`
            : typeof data.propositionToAddress !== 'undefined'
            ? `${texts.delegatePage.propositionPower} ${
                isPropositionPowerDelegated
                  ? `to ${
                      formattedPropositionToAddress?.startsWith('0x')
                        ? textCenterEllipsis(
                            formattedPropositionToAddress,
                            6,
                            4,
                          )
                        : formattedPropositionToAddress
                    }`
                  : ''
              }`
            : '';

        const endText = delegatedData.length - 1 !== index ? 'and ' : '';

        return (
          <Box component="span" key={index}>
            {firstText} <b>{data.symbol}</b> {middleText} {endText}
          </Box>
        );
      })}
    </>
  );
}
