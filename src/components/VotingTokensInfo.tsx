import { Box } from '@mui/system';
import React, { useState } from 'react';
import { formatUnits } from 'viem';

import { DECIMALS } from '../configs/configs';
import { getAssetSymbolByAddress } from '../helpers/getAssetName';
import { texts } from '../helpers/texts/texts';
import { Asset, VotingDataByUser } from '../types';
import { BackButton3D } from './BackButton3D';
import { FormattedNumber } from './FormattedNumber';
import { Divider } from './primitives/Divider';
import { RepresentationIcon } from './RepresentationIcon';
import AssetIcon from './Web3Icons/AssetIcon';

interface VotingTokensInfoProps {
  setEditVotingTokens: (value: boolean) => void;
  votingTokens: VotingDataByUser[];
  localVotingTokens: VotingDataByUser[];
  setVotingTokens: (value: VotingDataByUser[]) => void;
  representativeAddress?: string;
  isRepresentativeVoteDisabled?: boolean;
  forTest?: boolean;
}

function CheckBox({ isActive }: { isActive: boolean }) {
  return (
    <Box
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        width: 14,
        height: 14,
        backgroundColor: '$disabled',
        display: 'none',
      }}>
      <Box
        sx={{
          transition: 'all 0.2s ease',
          width: 10,
          height: 10,
          backgroundColor: '$main',
          transform: isActive ? 'scale(1)' : 'scale(0)',
        }}
      />
    </Box>
  );
}

export function VotingTokensInfo({
  setEditVotingTokens,
  votingTokens,
  setVotingTokens,
  localVotingTokens,
  representativeAddress,
  isRepresentativeVoteDisabled,
  forTest,
}: VotingTokensInfoProps) {
  const objectVotingTokens = votingTokens
    .map((token) => {
      return { ...token, isActive: localVotingTokens.length <= 0 };
    })
    .reduce((a, v) => ({ ...a, [v.asset]: v }), {});
  const objectLocalVotingTokens = localVotingTokens
    .map((token) => {
      return { ...token, isActive: true };
    })
    .reduce((a, v) => ({ ...a, [v.asset]: v }), {});

  const [stateVotingTokens, setStateVotingTokens] = useState<
    Record<string, VotingDataByUser & { isActive: boolean }>
  >({ ...objectVotingTokens, ...objectLocalVotingTokens });

  const handleChange = (
    underlyingAsset: string,
    isActive: boolean,
    isAll?: boolean,
  ) => {
    if (isAll) {
      if (
        votingTokens.length ===
        Object.values(stateVotingTokens).filter((item) => item.isActive).length
      ) {
        const localObjectVotingTokens = votingTokens
          .map((token) => {
            return { ...token, isActive: false };
          })
          .reduce((a, v) => ({ ...a, [v.asset]: v }), {});

        setStateVotingTokens(localObjectVotingTokens);
        setVotingTokens([]);
      } else {
        const localObjectVotingTokens = votingTokens
          .map((token) => {
            return { ...token, isActive: true };
          })
          .reduce((a, v) => ({ ...a, [v.asset]: v }), {});

        setStateVotingTokens(localObjectVotingTokens);
        setVotingTokens(votingTokens);
      }
    } else {
      stateVotingTokens[underlyingAsset].isActive = isActive;

      setVotingTokens(
        Object.values(stateVotingTokens)
          .filter((item) => item.isActive)
          .map((item) => {
            return item;
          }),
      );
    }
  };

  const totalBalance = Object.values(stateVotingTokens)
    .filter((item) => item.isActive)
    .map((item) => item.votingPower)
    .reduce((sum, value) => sum + value, 0n);

  return (
    <>
      <Box
        sx={(theme) => ({
          minHeight: forTest ? 401 : 500,
          [theme.breakpoints.up('lg')]: {
            minHeight: forTest ? 471 : 500,
          },
          button: {
            color: '$main',
          },
        })}>
        <Box component="h2" sx={{ typography: 'h1', mb: 10 }}>
          {texts.other.votingInfo}
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 16,
          }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <Box component="p" sx={{ typography: 'body', mr: 5 }}>
              {texts.proposals.totalVotingPower}
            </Box>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {typeof representativeAddress !== 'undefined' && (
                <RepresentationIcon
                  address={representativeAddress}
                  disabled={isRepresentativeVoteDisabled || false}
                />
              )}
              <FormattedNumber
                value={formatUnits(totalBalance, DECIMALS)}
                variant="h3"
                css={{ '> p': { fontWeight: 600 } }}
                visibleDecimals={2}
              />
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mb: 16 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          {Object.values(stateVotingTokens).map((item, index) => (
            <Box
              disabled
              sx={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                mb: 20,
                cursor: 'default !important',
              }}
              component="button"
              type="button"
              onClick={() => handleChange(item.asset, !item.isActive)}
              key={index}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AssetIcon
                  symbol={getAssetSymbolByAddress(item.asset) ?? Asset.AAVE}
                  size={21}
                  css={{ mr: 10 }}
                />
                <Box component="p" sx={{ typography: 'h3', fontWeight: 600 }}>
                  {getAssetSymbolByAddress(item.asset)}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FormattedNumber
                  value={formatUnits(item.votingPower, DECIMALS)}
                  variant="body"
                  visibleDecimals={2}
                />
                <CheckBox isActive={item.isActive} />
              </Box>
            </Box>
          ))}
        </Box>

        <Box sx={{ position: 'absolute', bottom: 12, left: 12 }}>
          <BackButton3D
            isSmall
            isVisibleOnMobile
            alwaysWithBorders
            alwaysVisible
            onClick={() => setEditVotingTokens(false)}
          />
        </Box>
      </Box>
    </>
  );
}
