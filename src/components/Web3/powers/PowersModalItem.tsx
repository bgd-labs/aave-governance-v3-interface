import { Box } from '@mui/system';
import React from 'react';
import { formatUnits } from 'viem';

import { DECIMALS } from '../../../configs/configs';
import { getAssetSymbolByAddress } from '../../../helpers/getAssetName';
import { Asset, GovernancePowerType, PowersByAssets } from '../../../types';
import { FormattedNumber } from '../../FormattedNumber';
import { Divider } from '../../primitives/Divider';
import { RepresentationIcon } from '../../RepresentationIcon';
import AssetIcon from '../../Web3Icons/AssetIcon';

interface PowersModalItemProps {
  type: GovernancePowerType;
  totalValue: number;
  representativeAddress?: string;
  powersByAssets: PowersByAssets;
}

export function PowersModalItem({
  type,
  totalValue,
  representativeAddress,
  powersByAssets,
}: PowersModalItemProps) {
  const isVotingType = type === GovernancePowerType.VOTING;

  return (
    <Box
      sx={{
        mt: isVotingType ? 40 : 0,
        mb: 64,
        '&:last-of-type': {
          mb: 0,
        },
      }}>
      <Box
        sx={{
          typography: 'h2',
          display: 'flex',
          alignItems: 'flex-end',
          mb: 16,
        }}>
        Total {isVotingType ? 'Voting' : 'Proposition'} power:{' '}
        <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: 3 }}>
          {!!representativeAddress && isVotingType && (
            <RepresentationIcon
              address={representativeAddress}
              disabled={false}
            />
          )}
          <FormattedNumber
            value={totalValue}
            variant="h2"
            visibleDecimals={2}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 18,
        }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            typography: 'headline',
          }}>
          Asset
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            typography: 'headline',
          }}>
          From balance
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            flex: 1,
            typography: 'headline',
            textAlign: 'right',
          }}>
          Delegation received
        </Box>
      </Box>

      <Divider />

      {Object.values(powersByAssets).map((asset) => {
        const assetData =
          type === GovernancePowerType.VOTING
            ? asset.voting
            : asset.proposition;
        const symbol =
          getAssetSymbolByAddress(asset.underlyingAsset) ?? Asset.AAVE;

        return (
          <Box
            key={asset.underlyingAsset}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 18,
            }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <AssetIcon symbol={symbol} size={20} css={{ mr: 10 }} />
              <Box sx={{ typography: 'headline' }}>{asset.tokenName}</Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}>
              <FormattedNumber
                value={formatUnits(assetData.userBalance, DECIMALS)}
                variant="body"
                visibleDecimals={2}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                flex: 1,
              }}>
              <FormattedNumber
                value={formatUnits(assetData.delegatedPower, DECIMALS)}
                variant="body"
                visibleDecimals={2}
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
