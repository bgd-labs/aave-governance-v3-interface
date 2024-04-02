import { Box, useTheme } from '@mui/system';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { zeroAddress } from 'viem';

import ReloadIcon from '/public/images/icons/reload.svg';

import { useRootStore } from '../../../store/storeProvider';
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
import { BlockTitleWithTooltip } from '../BlockTitleWithTooltip';
import { CurrentPowerItem } from './CurrentPowerItem';

export function CurrentPowers() {
  const representative = useRootStore((store) => store.representative);
  const getCurrentPowers = useRootStore((store) => store.getCurrentPowers);
  const activeWallet = useRootStore((store) => store.activeWallet);
  const setPowersInfoModalOpen = useRootStore(
    (store) => store.setPowersInfoModalOpen,
  );
  const setAccountInfoModalOpen = useRootStore(
    (store) => store.setAccountInfoModalOpen,
  );

  const currentPowersAll = useRootStore((store) => selectCurrentPowers(store));
  const currentPowersActiveWallet = useRootStore((store) =>
    selectCurrentPowersForActiveWallet(store),
  );

  const theme = useTheme();

  const [startAnim, setStartAnim] = useState(false);
  const [isInfoClicked, setClicked] = useState(
    getLocalStoragePowersInfoClicked() === 'true',
  );

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
          isPopoverVisible={!!currentPowersAll?.timestamp}
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
                  getCurrentPowers(
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
            totalValue={currentPowersAll?.totalVotingPower}
            yourValue={currentPowersAll?.yourVotingPower}
            delegatedValue={currentPowersAll?.delegatedVotingPower}
          />
          <CurrentPowerItem
            type={GovernancePowerType.PROPOSITION}
            totalValue={currentPowersActiveWallet?.totalPropositionPower}
            yourValue={currentPowersActiveWallet?.yourPropositionPower}
            delegatedValue={
              currentPowersActiveWallet?.delegatedPropositionPower
            }
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Box
            onClick={() => {
              if (!!currentPowersAll) {
                setAccountInfoModalOpen(false);
                setPowersInfoModalOpen(true);
              }
            }}
            sx={{
              typography: 'descriptorAccent',
              mt: 12,
              cursor: !currentPowersAll ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: !currentPowersAll ? '0.4' : 1,
              hover: { opacity: !currentPowersAll ? '0.4' : '0.7' },
            }}>
            Details
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
