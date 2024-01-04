import { Box, useTheme } from '@mui/system';
import React from 'react';

import InfoIcon from '/public/images/icons/info.svg';

import { RepresentationIcon } from '../../../proposals/components/RepresentationIcon';
import { useStore } from '../../../store';
import { Divider } from '../../../ui';
import { FormattedNumber } from '../../../ui/components/FormattedNumber';
import { TokenIcon } from '../../../ui/components/TokenIcon';
import { IconBox } from '../../../ui/primitives/IconBox';
import { getTokenName, Token } from '../../../utils/getTokenName';
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
  const store = useStore();
  const theme = useTheme();
  const isVotingType = type === GovernancePowerType.VOTING;

  return (
    <Box sx={{ mb: 28, mt: isVotingType ? 40 : 0 }}>
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
          {isVotingType && (
            <Box
              sx={{
                ml: 4,
                transition: 'all 0.2s ease',
                lineHeight: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                '> *': {
                  lineHeight: 0,
                },
                hover: { opacity: 0.6 },
              }}
              component="button"
              type="button"
              onClick={() => {
                store.setPowersInfoModalOpen(false);
                store.setIsHelpVotingPowerModalOpen(true);
                store.setIsFromCurrentPowers(true);
              }}>
              <IconBox
                sx={{
                  position: 'relative',
                  width: 14,
                  height: 14,
                  '> svg': {
                    width: 14,
                    height: 14,
                    path: {
                      fill: theme.palette.$text,
                    },
                  },
                }}>
                <InfoIcon />
              </IconBox>
            </Box>
          )}
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
          Your
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            flex: 1,
            typography: 'headline',
          }}>
          Delegated
        </Box>
      </Box>

      <Divider />

      {Object.values(powersByAssets).map((asset) => {
        const assetData =
          type === GovernancePowerType.VOTING
            ? asset.voting
            : asset.proposition;
        const symbol = getTokenName(asset.underlyingAsset) as Token;

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
              <TokenIcon
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
