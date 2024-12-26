import { Box, useTheme } from '@mui/system';
import { useRouter } from 'nextjs-toploader/app';
import React from 'react';

import { appConfig } from '../../configs/appConfig';
import { ROUTES } from '../../configs/routes';
import { texts } from '../../helpers/texts/texts';
import { BackButton3D } from '../BackButton3D';
import { BigButton } from '../BigButton';
import { BoxWith3D } from '../BoxWith3D';
import { Link } from '../Link';
import { Container } from '../primitives/Container';
import { CustomSkeleton } from '../primitives/CustomSkeleton';
import { TopPanelContainer } from '../TopPanelContainer';

export function PayloadDetailsLoading() {
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
          <Box sx={{ pt: 20 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'center',
                mb: 30,
              }}>
              <Box
                sx={{
                  typography: 'h2',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                {texts.proposals.payloadsDetails.payload}{' '}
                <Box sx={{ ml: 4 }}>
                  <CustomSkeleton width="30px" height="18px" />
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                mb: 12,
                typography: 'headline',
                display: 'flex',
                alignItems: 'center',
              }}>
              Id(Hex):{' '}
              <Box sx={{ ml: 4 }}>
                <CustomSkeleton width="40px" height="18px" />
              </Box>
            </Box>

            <Box
              sx={{
                mb: 12,
                typography: 'headline',
                display: 'flex',
                alignItems: 'center',
              }}>
              {texts.proposals.payloadsDetails.accessLevel}:{' '}
              <Box sx={{ ml: 4 }}>
                <CustomSkeleton width="40px" height="18px" />
              </Box>
            </Box>

            <Box
              sx={{
                mb: 12,
                typography: 'headline',
                display: 'flex',
                alignItems: 'center',
              }}>
              {texts.proposals.payloadsDetails.details}:{' '}
              <Box sx={{ ml: 4 }}>
                <CustomSkeleton width="40px" height="18px" />
              </Box>
            </Box>

            <Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}>
                {texts.proposals.payloadsDetails.creator}:{' '}
                <Box sx={{ ml: 4 }}>
                  <CustomSkeleton width="50px" height="21px" />
                </Box>
              </Box>
            </Box>

            <Box sx={{ my: 12 }}>
              <CustomSkeleton width="80px" height="18px" />
            </Box>

            <Box>
              <CustomSkeleton width="102px" height="22px" />
            </Box>

            <Box sx={{ mt: 30 }}>
              <Box sx={{ typography: 'headline', mb: 4 }}>
                {texts.proposals.payloadsDetails.actions(0)}:
              </Box>
              <CustomSkeleton width="300px" height="16px" />
              <Box sx={{ mt: 4 }}>
                <CustomSkeleton width="300px" height="16px" />
              </Box>
            </Box>
          </Box>
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
            Number(appConfig.govCoreChainId),
            appConfig.payloadsControllerConfig[appConfig.govCoreChainId]
              .contractAddresses[0],
            0,
          )}>
          <BigButton>Go to explorer</BigButton>
        </Link>
      </Box>
    </Container>
  );
}
