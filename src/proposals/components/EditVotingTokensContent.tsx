import {
  Balance,
  valueToBigNumber,
} from '@bgd-labs/aave-governance-ui-helpers/src';
import { Box } from '@mui/system';
import React, { useState } from 'react';

import { BackButton3D, Divider } from '../../ui';
import { FormattedNumber } from '../../ui/components/FormattedNumber';
import { TokenIcon } from '../../ui/components/TokenIcon';
import { texts } from '../../ui/utils/texts';
import { RepresentationIcon } from './RepresentationIcon';

interface EditVotingTokensContentProps {
  setEditVotingTokens: (value: boolean) => void;
  votingTokens: Balance[];
  localVotingTokens: Balance[];
  setVotingTokens: (value: Balance[]) => void;
  representativeAddress?: string;
  isRepresentativeVoteDisabled?: boolean;
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

export function EditVotingTokensContent({
  setEditVotingTokens,
  votingTokens,
  setVotingTokens,
  localVotingTokens,
  representativeAddress,
  isRepresentativeVoteDisabled,
}: EditVotingTokensContentProps) {
  const objectVotingTokens = votingTokens
    .map((token) => {
      return { ...token, isActive: localVotingTokens.length <= 0 };
    })
    .reduce((a, v) => ({ ...a, [v.underlyingAsset]: v }), {});
  const objectLocalVotingTokens = localVotingTokens
    .map((token) => {
      return { ...token, isActive: true };
    })
    .reduce((a, v) => ({ ...a, [v.underlyingAsset]: v }), {});

  const [stateVotingTokens, setStateVotingTokens] = useState<
    Record<string, Balance & { isActive: boolean }>
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
          .reduce((a, v) => ({ ...a, [v.underlyingAsset]: v }), {});

        setStateVotingTokens(localObjectVotingTokens);
        setVotingTokens([]);
      } else {
        const localObjectVotingTokens = votingTokens
          .map((token) => {
            return { ...token, isActive: true };
          })
          .reduce((a, v) => ({ ...a, [v.underlyingAsset]: v }), {});

        setStateVotingTokens(localObjectVotingTokens);
        setVotingTokens(votingTokens);
      }
    } else {
      stateVotingTokens[underlyingAsset].isActive = isActive;

      setVotingTokens(
        Object.values(stateVotingTokens)
          .filter((item) => item.isActive)
          .map((item) => {
            return {
              underlyingAsset: item.underlyingAsset,
              value: item.value,
              basicValue: item.basicValue,
              blockHash: item.blockHash,
              tokenName: item.tokenName,
              isWithDelegatedPower: item.isWithDelegatedPower,
              userBalance: item.userBalance,
            };
          }),
      );
    }
  };

  const totalBalance = Object.values(stateVotingTokens)
    .filter((item) => item.isActive)
    .map((item) => valueToBigNumber(item.value).toNumber())
    .reduce((sum, value) => sum + value, 0);

  return (
    <>
      <Box
        sx={(theme) => ({
          height: 180,
          [theme.breakpoints.up('lg')]: { height: 227 },
        })}
      />

      <Box
        sx={{
          p: '65px 50px 60px',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 3,
          button: {
            color: '$main',
          },
        }}>
        <Box component="h2" sx={{ typography: 'h1', mb: 10 }}>
          {/*{texts.other.edit}*/}
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
                value={totalBalance}
                variant="h3"
                css={{ '> p': { fontWeight: 600 } }}
                visibleDecimals={2}
              />
            </Box>
          </Box>
          {/*<Box*/}
          {/*  disabled*/}
          {/*  component="button"*/}
          {/*  type="button"*/}
          {/*  onClick={() => handleChange('', false, true)}*/}
          {/*  sx={{*/}
          {/*    display: 'flex',*/}
          {/*    alignItems: 'center',*/}
          {/*    cursor: 'default !important',*/}
          {/*  }}>*/}
          {/*  <Box component="p" sx={{ typography: 'body', mr: 10 }}>*/}
          {/*    {texts.other.all}*/}
          {/*  </Box>*/}
          {/*  <CheckBox*/}
          {/*    isActive={*/}
          {/*      votingTokens.length ===*/}
          {/*      Object.values(stateVotingTokens).filter((item) => item.isActive)*/}
          {/*        .length*/}
          {/*    }*/}
          {/*  />*/}
          {/*</Box>*/}
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
              onClick={() => handleChange(item.underlyingAsset, !item.isActive)}
              key={index}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TokenIcon
                  symbol={item.tokenName}
                  css={{ width: 21, height: 21, mr: 10 }}
                />
                <Box component="p" sx={{ typography: 'h3', fontWeight: 600 }}>
                  {item.tokenName}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FormattedNumber
                  value={item.value}
                  variant="body"
                  visibleDecimals={2}
                  // css={{ mr: 10 }}
                />
                <CheckBox isActive={item.isActive} />
              </Box>
            </Box>
          ))}
        </Box>

        <Box sx={{ position: 'absolute', bottom: 40, left: 50 }}>
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
