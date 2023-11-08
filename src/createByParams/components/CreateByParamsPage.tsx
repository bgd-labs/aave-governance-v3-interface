'use client';

import { Box } from '@mui/system';
import { useRouter } from 'next/navigation';
import React from 'react';

import { useStore } from '../../store';
import { BackButton3D, Container } from '../../ui';
import { InitialParams } from '../types';

interface CreateByParamsPageProps {
  initialParams: InitialParams;
}

export function CreateByParamsPage({ initialParams }: CreateByParamsPageProps) {
  const router = useRouter();
  const store = useStore();

  console.log('initialParams', initialParams);

  return (
    <>
      <Container>
        <Box sx={{ mb: 12 }}>
          <BackButton3D onClick={router.back} isVisibleOnMobile />
        </Box>
      </Container>

      <Container>
        <h1>Hello create by params page</h1>
      </Container>
    </>
  );
}
