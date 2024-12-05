'use client';

import { Box, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Address } from 'viem';

import { appConfig } from '../../configs/appConfig';
import { getAssetSymbolByAddress } from '../../helpers/getAssetName';
import { Asset } from '../../types';
import { BackButton3D } from '../BackButton3D';
import { Container } from '../primitives/Container';
import { CustomSkeleton } from '../primitives/CustomSkeleton';
import { TopPanelContainer } from '../TopPanelContainer';
import { DelegateTableWrapper } from './DelegateTableWrapper';

export function DelegateLoading() {
  const theme = useTheme();
  const router = useRouter();

  const data = Object.values(appConfig.additional)
    .map((asset) => {
      if (asset !== appConfig.additional.delegationHelper) {
        return {
          underlyingAsset: asset as Address,
          symbol: (getAssetSymbolByAddress(asset) ?? Asset.AAVE) as Asset,
          amount: 0,
          votingToAddress: '',
          propositionToAddress: '',
        };
      }
    })
    .filter((data) => data !== undefined);

  return (
    <>
      <TopPanelContainer>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            [theme.breakpoints.up('sm')]: {
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexDirection: 'row',
            },
          }}>
          <BackButton3D onClick={router.back} isVisibleOnMobile />
        </Box>
      </TopPanelContainer>

      <Container>
        <DelegateTableWrapper
          loading={true}
          delegateData={data}
          isEdit={false}
          isViewChanges={false}>
          <Box sx={{ mr: 24 }}>
            <CustomSkeleton width={156} height={50} />
          </Box>
          <CustomSkeleton width={156} height={50} />
        </DelegateTableWrapper>
      </Container>
    </>
  );
}
