import { Box } from '@mui/system';
import React from 'react';

import { RepresentationIcon } from '../../../proposals/components/RepresentationIcon';
import { Divider } from '../../../ui';
import { FormattedNumber } from '../../../ui/components/FormattedNumber';
import { AssetIcon } from '../../../ui/components/Web3Icons/AssetIcon';
import { getAssetName } from '../../../utils/getAssetName';
import { GovernancePowerType } from '../../services/delegationService';
import { PowersByAssets } from '../../store/web3Slice';

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
        const symbol = getAssetName(asset.underlyingAsset);

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
              <AssetIcon
                symbol={symbol}
                css={{ mr: 10, width: 20, height: 20 }}
              />
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
                value={assetData.userBalance}
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
                value={assetData.delegatedPower}
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
