'use client';

import { Box, useTheme } from '@mui/system';
import { useRouter } from 'nextjs-toploader/app';
import React from 'react';

import { PayloadWithHashes } from '../../types';
import { BackButton3D } from '../BackButton3D';
import { BoxWith3D } from '../BoxWith3D';
import { Container } from '../primitives/Container';
import { TopPanelContainer } from '../TopPanelContainer';
import { PayloadDetailsContent } from './PayloadDetailsContent';

export function PayloadDetails({ payload }: { payload: PayloadWithHashes }) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Container>
      <TopPanelContainer withoutContainer>
        <BackButton3D onClick={router.back} />
      </TopPanelContainer>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <BoxWith3D
          contentColor="$mainLight"
          wrapperCss={{
            '> div, .BoxWith3D__content': {
              height: '100%',
              maxWidth: 450,
            },
          }}
          css={{
            display: 'flex',
            flexDirection: 'column',
            p: '12px 8px',
            [theme.breakpoints.up('sm')]: {
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              p: '18px 24px',
            },
            [theme.breakpoints.up('lg')]: {
              p: '14px 12px',
            },
          }}>
          <PayloadDetailsContent payload={payload} withExecute />
        </BoxWith3D>
      </Box>
    </Container>
  );
}
