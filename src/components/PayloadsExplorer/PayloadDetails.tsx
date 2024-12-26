'use client';

import { Box, useTheme } from '@mui/system';
import { useRouter } from 'nextjs-toploader/app';
import React from 'react';
import useSWR from 'swr';

import { ROUTES } from '../../configs/routes';
import { useStore } from '../../providers/ZustandStoreProvider';
import { payloadByIdFetcher } from '../../requests/fetchers/payloadByIdFetcher';
import { selectAppClients } from '../../store/selectors/rpcSwitcherSelectors';
import { InitialPayloadState, PayloadWithHashes } from '../../types';
import { BackButton3D } from '../BackButton3D';
import { BigButton } from '../BigButton';
import { BoxWith3D } from '../BoxWith3D';
import { Link } from '../Link';
import { Container } from '../primitives/Container';
import { TopPanelContainer } from '../TopPanelContainer';
import { PayloadDetailsContent } from './PayloadDetailsContent';

export function PayloadDetails({ payload }: { payload: PayloadWithHashes }) {
  const router = useRouter();
  const theme = useTheme();

  const clients = useStore((store) => selectAppClients(store));
  const { data } = useSWR(
    {
      chainWithController: `${Number(payload.chain)}_${payload.payloadsController}`,
      payloadId: payload.id,
      clients,
    },
    payloadByIdFetcher,
    {
      refreshInterval:
        payload.data.state >= InitialPayloadState.Executed ? 0 : 10_000,
    },
  );

  const updatedPayload = data ?? payload;

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
          className="NoDataWrapper"
          contentColor="$mainLight"
          wrapperCss={{
            '> div, .BoxWith3D__content': {
              height: '100%',
              maxWidth: 450,
              minWidth: 350,
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
          <PayloadDetailsContent payload={updatedPayload} withExecute />
        </BoxWith3D>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 24,
        }}>
        <Link
          href={ROUTES.payloadsExplorerPages(
            Number(updatedPayload.chain),
            updatedPayload.payloadsController,
            0,
          )}>
          <BigButton>Go to explorer</BigButton>
        </Link>
      </Box>
    </Container>
  );
}
