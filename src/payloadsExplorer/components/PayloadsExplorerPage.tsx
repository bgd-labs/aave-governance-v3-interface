'use client';

import { Box, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Hex } from 'viem';

import { useStore } from '../../store';
import { BackButton3D, Container, Pagination } from '../../ui';
import { InputWrapper } from '../../ui/components/InputWrapper';
import { SelectField } from '../../ui/components/SelectField';
import { TopPanelContainer } from '../../ui/components/TopPanelContainer';
import { texts } from '../../ui/utils/texts';
import { appConfig } from '../../utils/appConfig';
import { PayloadExploreItem } from './PayloadExploreItem';
import { PayloadsControllerSelect } from './PayloadsControllerSelect';

export function PayloadsExplorerPage() {
  const theme = useTheme();
  const router = useRouter();

  const {
    getPayloadsExploreData,
    payloadsExploreData,
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
        <TopPanelContainer withoutContainer>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <BackButton3D
              onClick={router.back}
              alwaysVisible
              alwaysWithBorders
            />
            <Box
              sx={{
                position: 'relative',
                zIndex: 5,
                maxWidth: '100%',
                width: '100%',
                [theme.breakpoints.up('sm')]: { maxWidth: 250 },
              }}>
              <InputWrapper>
                <SelectField
                  withChainIcon
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
          </Box>
        </TopPanelContainer>

        <TopPanelContainer withoutContainer>
          <PayloadsControllerSelect
            chainId={chainId}
            controllerAddress={controllerAddress}
            setControllerAddress={setControllerAddress}
          />
        </TopPanelContainer>

        <Box
          sx={{
            mt: 18,
            [theme.breakpoints.up('lg')]: {
              mt: 24,
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
