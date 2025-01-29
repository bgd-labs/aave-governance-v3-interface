import { Box, useTheme } from '@mui/system';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Address } from 'viem';

import ReloadIcon from '../../../assets/icons/reload.svg';
import { appConfig } from '../../../configs/appConfig';
import {
  getLocalStoragePowersInfoClicked,
  setLocalStoragePowersInfoClicked,
} from '../../../configs/localStorage';
import { texts } from '../../../helpers/texts/texts';
import { useStore } from '../../../providers/ZustandStoreProvider';
import { getTotalPowers } from '../../../requests/queryHelpers/getTotalPower';
import { selectAppClients } from '../../../store/selectors/rpcSwitcherSelectors';
import { GovernancePowerType } from '../../../types';
import { Divider } from '../../primitives/Divider';
import { IconBox } from '../../primitives/IconBox';
import { Spinner } from '../../Spinner';
import { BlockTitleWithTooltip } from '../BlockTitleWithTooltip';
import { CurrentPowerItem } from './CurrentPowerItem';

export function CurrentPowers() {
  const representative = useStore((store) => store.representative);
  const activeWallet = useStore((store) => store.activeWallet);
  const setPowersInfoModalOpen = useStore(
    (store) => store.setPowersInfoModalOpen,
  );
  const setAccountInfoModalOpen = useStore(
    (store) => store.setAccountInfoModalOpen,
  );
  const clients = useStore((store) => selectAppClients(store));

  const theme = useTheme();

  const [startAnim, setStartAnim] = useState(false);
  const [isInfoClicked, setClicked] = useState(
    getLocalStoragePowersInfoClicked() === 'true',
  );

  const { data, refetch } = useQuery({
    queryKey: ['currentPowers', representative.address, activeWallet?.address],
    queryFn: () =>
      getTotalPowers({
        adr: representative.address as Address,
        activeAdr: activeWallet?.address,
        govCoreClient: clients[appConfig.govCoreChainId],
      }),
    enabled: false,
  });

  return (
    <Box
      sx={{
        display: 'flex',
        mt: 20,
        alignItems: 'center',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 8,
        [theme.breakpoints.up('sm')]: {
          mt: 24,
        },
      }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          position: 'relative',
          zIndex: 3,
        }}>
        <BlockTitleWithTooltip
          title={texts.walletConnect.currentPower}
          description={texts.walletConnect.currentPowerDescription}
          isPopoverVisible={!!data?.currentPowers?.timestamp}
          isClicked={isInfoClicked}
          onClick={() => {
            setLocalStoragePowersInfoClicked('true');
            setClicked(true);
          }}
          isRed
        />

        <Box
          sx={{
            position: 'relative',
            top: 3,
            typography: 'descriptor',
            color: '$textDisabled',
          }}>
          {data?.currentPowers?.timestamp ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Box component="p">
                on{' '}
                {dayjs
                  .unix(data.currentPowers.timestamp)
                  .format('HH:mm DD.MM.YYYY')}
              </Box>
              <Box
                component="button"
                type="button"
                sx={{
                  p: 6,
                  transition: 'all 0.2s ease',
                  '@keyframes rotate': {
                    '0%': {
                      transform: 'rotate(0deg)',
                    },
                    '100%': {
                      transform: 'rotate(180deg)',
                    },
                  },
                  animation: startAnim ? `rotate 0.5s linear` : undefined,
                  hover: { opacity: 0.6 },
                }}
                onClick={() => {
                  setStartAnim(true);
                  setTimeout(() => setStartAnim(false), 500);
                  refetch();
                }}>
                <IconBox
                  sx={{
                    width: 12,
                    height: 12,
                    '> svg': {
                      width: 12,
                      height: 12,
                      path: {
                        '&:first-of-type': {
                          fill: theme.palette.$textDisabled,
                        },
                        '&:last-of-type': {
                          stroke: theme.palette.$textDisabled,
                        },
                      },
                      ellipse: {
                        fill: theme.palette.$textDisabled,
                      },
                    },
                  }}>
                  <ReloadIcon />
                </IconBox>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                minHeight: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                lineHeight: 0,
                backgroundColor: '$paper',
              }}>
              <Spinner
                size={14}
                loaderLineColor="$paper"
                loaderCss={{ backgroundColor: '$main' }}
              />
            </Box>
          )}
        </Box>
      </Box>

      <Divider
        sx={{
          my: 14,
          borderBottomColor: theme.palette.$secondaryBorder,
          width: '100%',
        }}
      />

      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            width: '100%',
            flexDirection: 'column',
            [theme.breakpoints.up('sm')]: { flexDirection: 'row' },
          }}>
          <CurrentPowerItem
            type={GovernancePowerType.VOTING}
            representativeAddress={representative.address}
            totalValue={data?.currentPowers?.totalVotingPower}
            yourValue={data?.currentPowers?.yourVotingPower}
            delegatedValue={data?.currentPowers?.delegatedVotingPower}
          />
          <CurrentPowerItem
            type={GovernancePowerType.PROPOSITION}
            totalValue={data?.currentPowersActiveWallet?.totalPropositionPower}
            yourValue={data?.currentPowersActiveWallet?.yourPropositionPower}
            delegatedValue={
              data?.currentPowersActiveWallet?.delegatedPropositionPower
            }
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Box
            onClick={() => {
              if (data?.currentPowers) {
                setAccountInfoModalOpen(false);
                setPowersInfoModalOpen(true);
              }
            }}
            sx={{
              typography: 'descriptorAccent',
              mt: 12,
              cursor: !data?.currentPowers ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: !data?.currentPowers ? '0.4' : 1,
              hover: { opacity: !data?.currentPowers ? '0.4' : '0.7' },
            }}>
            Details
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
