import { Asset } from '@bgd-labs/aave-governance-ui-helpers';
import { Box } from '@mui/system';
import React from 'react';
import { Address } from 'viem';

import { useStore } from '../../store';
import { Link } from '../../ui';
import { CopyAndExternalIconsSet } from '../../ui/components/CopyAndExternalIconsSet';
import { textCenterEllipsis } from '../../ui/utils/text-center-ellipsis';
import { texts } from '../../ui/utils/texts';
import { getAssetName } from '../../utils/getAssetName';
import { getScanLink } from '../../utils/getScanLink';
import { ENSDataExists } from '../../web3/store/ensSelectors';
import { EnsDataItem, ENSProperty } from '../../web3/store/ensSlice';
import { isEnsName } from '../../web3/utils/ensHelpers';
import { DelegateData, DelegateItem, TxDelegateData } from '../types';

function getPreText({
  condition,
  isBeforeTx,
}: {
  condition: boolean;
  isBeforeTx: boolean;
}) {
  if (condition) {
    if (isBeforeTx) {
      return texts.delegatePage.willDelegate;
    } else {
      return texts.delegatePage.delegated;
    }
  } else {
    if (isBeforeTx) {
      return texts.delegatePage.receiveBack;
    } else {
      return texts.delegatePage.receivedBack;
    }
  }
}

function getFirstText({
  data,
  isPropositionPowerDelegated,
  isVotingPowerDelegated,
  isBothPowersDelegated,
  isBeforeTx,
}: {
  data: TxDelegateData;
  isBothPowersDelegated: boolean;
  isVotingPowerDelegated: boolean;
  isPropositionPowerDelegated: boolean;
  isBeforeTx?: boolean;
}) {
  if (typeof data.bothAddresses !== 'undefined') {
    return getPreText({
      condition: isBothPowersDelegated,
      isBeforeTx: isBeforeTx || false,
    });
  } else if (typeof data.votingToAddress !== 'undefined') {
    return getPreText({
      condition: isVotingPowerDelegated,
      isBeforeTx: isBeforeTx || false,
    });
  } else if (typeof data.propositionToAddress !== 'undefined') {
    return getPreText({
      condition: isPropositionPowerDelegated,
      isBeforeTx: isBeforeTx || false,
    });
  }
  return '';
}

function getFormattedAddress({
  ensData,
  address,
}: {
  ensData: Record<`0x${string}`, EnsDataItem>;
  address: Address | string;
}) {
  if (isEnsName(address)) {
    return address;
  } else {
    if (address && ENSDataExists(ensData, address, ENSProperty.NAME)) {
      return ensData[address.toLowerCase() as Address].name;
    } else {
      return address;
    }
  }
}

function getVisibleAddressByType({
  condition,
  address,
}: {
  condition: boolean;
  address: string;
}) {
  if (condition) {
    if (address.startsWith('0x')) {
      return textCenterEllipsis(address, 6, 4);
    } else {
      return address;
    }
  }
  return '';
}

function getVisibleAddress({
  data,
  formattedBothAddresses,
  formattedVotingToAddress,
  formattedPropositionToAddress,
  isPropositionPowerDelegated,
  isVotingPowerDelegated,
  isBothPowersDelegated,
}: {
  data: TxDelegateData;
  formattedBothAddresses: string;
  formattedVotingToAddress: string;
  formattedPropositionToAddress: string;
  isBothPowersDelegated: boolean;
  isVotingPowerDelegated: boolean;
  isPropositionPowerDelegated: boolean;
}) {
  if (typeof data.bothAddresses !== 'undefined') {
    return getVisibleAddressByType({
      condition: isBothPowersDelegated,
      address: formattedBothAddresses,
    });
  } else if (typeof data.votingToAddress !== 'undefined') {
    return getVisibleAddressByType({
      condition: isVotingPowerDelegated,
      address: formattedVotingToAddress,
    });
  } else if (typeof data.propositionToAddress !== 'undefined') {
    return getVisibleAddressByType({
      condition: isPropositionPowerDelegated,
      address: formattedPropositionToAddress,
    });
  }
  return '';
}

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
  const activeWallet = useStore((store) => store.activeWallet);
  const ensData = useStore((store) => store.ensData);
  const activeAddress = activeWallet?.address;

  const delegatedData: TxDelegateData[] = [];
  for (const formDelegateItem of formDelegateData) {
    const { votingToAddress, propositionToAddress, underlyingAsset } =
      formDelegateItem;
    const symbol = getAssetName(underlyingAsset) || Asset.AAVE;

    // get previous delegation data for current asset
    const delegateDataLocal: DelegateItem = delegateData.filter(
      (data) => data.underlyingAsset === underlyingAsset,
    )[0];

    const isAddressSame =
      votingToAddress.toLowerCase() === propositionToAddress.toLowerCase();
    const isInitialAddressSame =
      delegateDataLocal.propositionToAddress.toLowerCase() ===
      delegateDataLocal.votingToAddress.toLowerCase();
    const isVotingToAddressSame =
      delegateDataLocal.votingToAddress.toLowerCase() ===
      votingToAddress.toLowerCase();
    const isPropositionToAddressSame =
      delegateDataLocal.propositionToAddress.toLowerCase() ===
      propositionToAddress.toLowerCase();

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

        const firstText = getFirstText({
          data,
          isPropositionPowerDelegated,
          isVotingPowerDelegated,
          isBothPowersDelegated,
          isBeforeTx,
        });

        const formattedBothAddresses = getFormattedAddress({
          ensData,
          address: data.bothAddresses || '',
        });
        const formattedVotingToAddress = getFormattedAddress({
          ensData,
          address: data.votingToAddress || '',
        });
        const formattedPropositionToAddress = getFormattedAddress({
          ensData,
          address: data.propositionToAddress || '',
        });

        const address = getVisibleAddress({
          data,
          formattedBothAddresses: formattedBothAddresses || '',
          formattedVotingToAddress: formattedVotingToAddress || '',
          formattedPropositionToAddress: formattedPropositionToAddress || '',
          isBothPowersDelegated,
          isVotingPowerDelegated,
          isPropositionPowerDelegated,
        });

        const middleText =
          typeof data.bothAddresses !== 'undefined'
            ? `${texts.delegatePage.votingAndPropositionPowers}`
            : typeof data.votingToAddress !== 'undefined'
              ? `${texts.delegatePage.votingPower}`
              : typeof data.propositionToAddress !== 'undefined'
                ? `${texts.delegatePage.propositionPower}`
                : '';

        const endText = delegatedData.length - 1 !== index ? 'and ' : '';

        const link =
          typeof data.bothAddresses !== 'undefined' && data.bothAddresses !== ''
            ? getScanLink({
                address: data.bothAddresses,
              })
            : typeof data.votingToAddress !== 'undefined' &&
                data.votingToAddress !== ''
              ? getScanLink({
                  address: data.votingToAddress,
                })
              : typeof data.propositionToAddress !== 'undefined' &&
                  data.propositionToAddress !== ''
                ? getScanLink({
                    address: data.propositionToAddress,
                  })
                : undefined;

        return (
          <Box sx={{ display: 'inline' }} key={index}>
            {firstText} <b>{data.symbol}</b> {middleText}{' '}
            {!!link && (
              <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                to
                <Link
                  href={link}
                  css={{
                    color: '$textSecondary',
                    ml: 3,
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
