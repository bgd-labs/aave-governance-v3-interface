'use client';

import { Box, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { BackButton3D } from '../../components/BackButton3D';
import { CreateFormWrapper } from '../../components/Create/CreateFormWrapper';
import { Container } from '../../components/primitives/Container';
import { CustomSkeleton } from '../../components/primitives/CustomSkeleton';
import { TopPanelContainer } from '../../components/TopPanelContainer';
import { texts } from '../../helpers/texts/texts';

export default function LoadingPage() {
  const theme = useTheme();
  const router = useRouter();
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  return (
    <>
      <TopPanelContainer>
        <BackButton3D onClick={router.back} isVisibleOnMobile />
      </TopPanelContainer>

      <Container>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            [theme.breakpoints.up('md')]: { flexDirection: 'row' },
          }}>
          <CreateFormWrapper title={texts.createPage.createPayloadTitle}>
            <CustomSkeleton width="100%" height="250px" />
          </CreateFormWrapper>
          <CreateFormWrapper title={texts.createPage.createProposalTitle}>
            <CustomSkeleton width="100%" height="250px" />
          </CreateFormWrapper>
        </Box>
      </Container>
    </>
  );
}
