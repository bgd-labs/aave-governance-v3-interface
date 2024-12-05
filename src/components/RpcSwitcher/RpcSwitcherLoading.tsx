'use client';

import { Box, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';

import { appUsedNetworks } from '../../configs/appConfig';
import { AppClientsStorage } from '../../types';
import { BackButton3D } from '../BackButton3D';
import { Container } from '../primitives/Container';
import { CustomSkeleton } from '../primitives/CustomSkeleton';
import { TopPanelContainer } from '../TopPanelContainer';
import { RpcSwitcherTableWrapper } from './RpcSwitcherTableWrapper';

export function RpcSwitcherLoading() {
  const theme = useTheme();
  const router = useRouter();

  const appClients: Record<number, AppClientsStorage> = {};
  appUsedNetworks.forEach((id) => {
    appClients[id] = {
      rpcUrl: '',
    };
  });

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
        <RpcSwitcherTableWrapper
          loading={true}
          rpcSwitcherData={appClients}
          isEdit={false}
          isViewChanges={false}>
          <Box sx={{ mr: 24 }}>
            <CustomSkeleton width={156} height={50} />
          </Box>
          <CustomSkeleton width={156} height={50} />
        </RpcSwitcherTableWrapper>
      </Container>
    </>
  );
}
