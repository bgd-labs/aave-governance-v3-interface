'use client';

import { Box, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { appUsedNetworks } from '../../configs/appConfig';
import { RepresentationDataItem } from '../../types';
import { BackButton3D } from '../BackButton3D';
import { Container } from '../primitives/Container';
import { CustomSkeleton } from '../primitives/CustomSkeleton';
import { TopPanelContainer } from '../TopPanelContainer';
import { RepresentationsTableWrapper } from './RepresentationsTableWrapper';

export function RepresentationsLoading() {
  const theme = useTheme();
  const router = useRouter();

  const data: Record<number, RepresentationDataItem> = {};
  appUsedNetworks.forEach((id) => {
    data[id] = {
      representative: '',
      represented: [],
    };
  });

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <>
      <TopPanelContainer>
        <BackButton3D onClick={router.back} isVisibleOnMobile />
      </TopPanelContainer>

      <Container
        sx={{
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
          paddingLeft: 12,
          paddingRight: 12,
          maxWidth: 860,
          [theme.breakpoints.up('sm')]: { paddingLeft: 20, paddingRight: 20 },
          [theme.breakpoints.up('lg')]: {
            maxWidth: 900,
          },
        }}>
        <RepresentationsTableWrapper
          loading={true}
          isEdit={false}
          isViewChanges={false}
          representationData={data}>
          <Box sx={{ mr: 24 }}>
            <CustomSkeleton width={156} height={50} />
          </Box>
          <CustomSkeleton width={156} height={50} />
        </RepresentationsTableWrapper>
      </Container>
    </>
  );
}
