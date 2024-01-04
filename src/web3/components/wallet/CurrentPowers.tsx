import { Box, useTheme } from '@mui/system';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { zeroAddress } from 'viem';

import InfoIcon from '/public/images/icons/info.svg';
import ReloadIcon from '/public/images/icons/reload.svg';

import { useStore } from '../../../store';
import { Divider, Spinner } from '../../../ui';
import { IconBox } from '../../../ui/primitives/IconBox';
import { texts } from '../../../ui/utils/texts';
import {
  getLocalStoragePowersInfoClicked,
  setLocalStoragePowersInfoClicked,
} from '../../../utils/localStorage';
import { GovernancePowerType } from '../../services/delegationService';
import {
  selectCurrentPowers,
  selectCurrentPowersForActiveWallet,
} from '../../store/web3Selectors';
import { CurrentPowerItem } from './CurrentPowerItem';

export function CurrentPowers() {
  const store = useStore();
  const {
    representative,
    activeWallet,
    setPowersInfoModalOpen,
    setAccountInfoModalOpen,
  } = store;
  const theme = useTheme();

  const currentPowersAll = selectCurrentPowers(store);
  const currentPowersActiveWallet = selectCurrentPowersForActiveWallet(store);

  const [startAnim, setStartAnim] = useState(false);

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
        }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}>
          <Box
            component="h2"
            sx={{
              typography: 'h2',
              textAlign: 'center',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            {texts.walletConnect.currentPower}
          </Box>
          {currentPowersAll?.timestamp && (
            <Box
              sx={{
                ml: 4,
                transition: 'all 0.2s ease',
                lineHeight: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 23,
                '> *': {
                  lineHeight: 0,
                },
                hover: { opacity: 0.6 },
              }}
              component="button"
              type="button"
              onClick={() => {
                setAccountInfoModalOpen(false);
                setPowersInfoModalOpen(true);
                setLocalStoragePowersInfoClicked('true');
              }}>
              <IconBox
                sx={{
                  position: 'relative',
                  top: 1,
                  width: 14,
                  height: 14,
                  '> svg': {
                    width: 14,
                    height: 14,
                    path: {
                      fill:
                        getLocalStoragePowersInfoClicked() === 'true'
                          ? theme.palette.$text
                          : theme.palette.$error,
                    },
                  },
                }}>
                <InfoIcon />
              </IconBox>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            position: 'relative',
            top: 3,
            typography: 'descriptor',
            color: '$textDisabled',
          }}>
          {currentPowersAll?.timestamp ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Box component="p">
                on{' '}
                {dayjs
                  .unix(currentPowersAll.timestamp)
                  .format(' hh:mm DD.MM.YYYY')}
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
                  store.getCurrentPowers(
                    !!representative.address
                      ? representative.address
                      : activeWallet?.address || zeroAddress,
                    true,
                  );
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
          totalValue={currentPowersAll?.totalVotingPower}
          yourValue={currentPowersAll?.yourVotingPower}
          delegatedValue={currentPowersAll?.delegatedVotingPower}
        />
        <CurrentPowerItem
          type={GovernancePowerType.PROPOSITION}
          totalValue={currentPowersActiveWallet?.totalPropositionPower}
          yourValue={currentPowersActiveWallet?.yourPropositionPower}
          delegatedValue={currentPowersActiveWallet?.delegatedPropositionPower}
        />
      </Box>
    </Box>
  );
}
