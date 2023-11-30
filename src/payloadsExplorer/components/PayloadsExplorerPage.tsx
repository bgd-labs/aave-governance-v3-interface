'use client';

import { Box, useTheme } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { Hex } from 'viem';

import { useStore } from '../../store';
import { Container, Pagination } from '../../ui';
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
    totalPayloadsCountByAddress,
    payloadsExplorePagination,
    setPayloadsExploreActivePage,
  } = useStore();

  const [chainId, setChainId] = useState<number>(appConfig.govCoreChainId);
  const [controllerAddress, setControllerAddress] = useState<Hex>(
    appConfig.payloadsControllerConfig[chainId].contractAddresses[0],
  );

  useEffect(() => {
    setControllerAddress(
      appConfig.payloadsControllerConfig[chainId].contractAddresses[0],
    );
  }, [chainId]);

  useEffect(() => {
    getPayloadsExploreData(chainId, controllerAddress);
  }, [chainId, controllerAddress]);

  const payloadsDataByChain = payloadsExploreData[chainId];
  if (!payloadsDataByChain) return null;
  const payloadsData = payloadsDataByChain[controllerAddress];
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            wordBreak: 'break-word',
          }}>
          <Box sx={{ typography: 'h2' }}>
            Payloads controller: {controllerAddress}
          </Box>
          <Box sx={{ typography: 'h2' }}>
            Count: {totalPayloadsCountByAddress[controllerAddress]}
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
          {Object.values(payloadsData)
            .filter((payload) =>
              payloadsExplorePagination[controllerAddress].currentIds.some(
                (id) => id === payload.id,
              ),
            )
            .sort((a, b) => b.id - a.id)
            .map((payload) => (
              <PayloadExploreItem
                key={`${payload.id}_${payload.chainId}`}
                payload={payload}
              />
            ))}
        </Box>

        <Pagination
          forcePage={payloadsExplorePagination[controllerAddress].activePage}
          pageCount={payloadsExplorePagination[controllerAddress].pageCount}
          onPageChange={(value) =>
            setPayloadsExploreActivePage(value, chainId, controllerAddress)
          }
          withoutQuery
        />
      </Container>
    </>
  );
}
