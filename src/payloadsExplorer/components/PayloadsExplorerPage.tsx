'use client';

import { Box, useTheme } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { Hex } from 'viem';

import { useStore } from '../../store';
import { Container } from '../../ui';
import { InputWrapper } from '../../ui/components/InputWrapper';
import { SelectField } from '../../ui/components/SelectField';
import { texts } from '../../ui/utils/texts';
import { appConfig } from '../../utils/appConfig';
import { PayloadExploreItem } from './PayloadExploreItem';

export function PayloadsExplorerPage() {
  const theme = useTheme();
  const {
    getPayloadsExploreData,
    payloadsExploreData,
    getPaginatedPayloadsExploreData,
    totalPayloadsCountByAddress,
    payloadsExplorePagination,
  } = useStore();

  const [chainId, setChainId] = useState<number>(appConfig.govCoreChainId);

  useEffect(() => {
    getPayloadsExploreData(chainId);
  }, [chainId]);

  const payloadsData = payloadsExploreData[chainId];

  if (!payloadsData) return null;

  return (
    <>
      <Container>
        <Box sx={{ p: 12, backgroundColor: '$light' }}>
          <InputWrapper
            label={texts.other.payloadsNetwork}
            css={{ mb: 25, zIndex: 6 }}>
            <SelectField
              withChainName
              placeholder={texts.other.payloadsNetwork}
              value={chainId}
              onChange={(event) => {
                setChainId(event);
              }}
              options={appConfig.payloadsControllerChainIds}
            />
          </InputWrapper>
        </Box>

        <Box sx={{ typography: 'h1', my: 24 }}>Payloads</Box>
        {Object.entries(payloadsData).map((value) => {
          const sortedPayloads = value[1]
            .map((payload) => payload)
            .sort((a, b) => a.id - b.id);

          return (
            <Box key={value[0]}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  wordBreak: 'break-word',
                }}>
                <Box sx={{ typography: 'h2' }}>
                  Payloads controller: {value[0]}
                </Box>
                <Box sx={{ typography: 'h2' }}>
                  Count: {totalPayloadsCountByAddress[value[0] as Hex]}
                </Box>
              </Box>

              <Box
                sx={{
                  mt: 24,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(1, 1fr)',
                  gridGap: 6,
                  [theme.breakpoints.up('xsm')]: {
                    gridTemplateColumns: 'repeat(2, 1fr)',
                  },
                  [theme.breakpoints.up('sm')]: {
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gridGap: 12,
                  },
                  [theme.breakpoints.up('lg')]: {
                    gridTemplateColumns: 'repeat(4, 1fr)',
                  },
                }}>
                {sortedPayloads
                  .slice(
                    payloadsExplorePagination[value[0] as Hex]
                      ? -payloadsExplorePagination[value[0] as Hex]
                          .currentStepSize
                      : undefined,
                  )
                  .sort((a, b) => b.id - a.id)
                  .map((payload) => (
                    <PayloadExploreItem
                      key={`${payload.id}_${payload.chainId}`}
                      payload={payload}
                    />
                  ))}
              </Box>

              {payloadsExplorePagination[value[0] as Hex] &&
                !payloadsExplorePagination[value[0] as Hex].isEnd && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mt: 24,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      hover: {
                        color: theme.palette.$textSecondary,
                      },
                    }}
                    onClick={() =>
                      getPaginatedPayloadsExploreData(chainId, value[0] as Hex)
                    }>
                    <h1>Show more</h1>
                  </Box>
                )}
            </Box>
          );
        })}
      </Container>
    </>
  );
}
