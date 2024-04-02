import { Box, useTheme } from '@mui/system';
import makeBlockie from 'ethereum-blockies-base64';
import React, { useEffect, useState } from 'react';
import { Hex } from 'viem';

import LinkIcon from '/public/images/icons/linkIcon.svg';

import { useRootStore } from '../../../store/storeProvider';
import { Image, Link, Tooltip } from '../../../ui';
import { IconBox } from '../../../ui/primitives/IconBox';
import { texts } from '../../../ui/utils/texts';
import { getScanLink } from '../../../utils/getScanLink';
import { ENSDataExists, selectENSAvatar } from '../../store/ensSelectors';
import { ENSProperty } from '../../store/ensSlice';
import { ChainsIcons } from '../ChainsIcons';
import { RepresentingButtonChainsIcon } from './RepresentingButtonChainsIcon';

export function RepresentingButton() {
  const theme = useTheme();

  const setAccountInfoModalOpen = useRootStore(
    (store) => store.setAccountInfoModalOpen,
  );
  const representative = useRootStore((store) => store.representative);
  const fetchEnsNameByAddress = useRootStore(
    (store) => store.fetchEnsNameByAddress,
  );
  const fetchEnsAvatarByAddress = useRootStore(
    (store) => store.fetchEnsAvatarByAddress,
  );
  const ensData = useRootStore((store) => store.ensData);

  const isENSDataExists = ENSDataExists(
    ensData,
    representative.address as Hex,
    ENSProperty.NAME,
  );

  const [shownAvatar, setShownAvatar] = useState<string | undefined>(undefined);
  const [isAvatarExists, setIsAvatarExists] = useState<boolean | undefined>(
    undefined,
  );
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  useEffect(() => {
    const activeAddress = representative.address;
    if (activeAddress) {
      fetchEnsNameByAddress(activeAddress).then(() => {
        selectENSAvatar({
          ensData,
          fetchEnsAvatarByAddress,
          address: activeAddress,
          setAvatar: setShownAvatar,
          setIsAvatarExists,
        });
      });
    }
  }, [ensData, representative.address]);

  useEffect(() => {
    setIsTooltipVisible(true);
    setTimeout(() => setIsTooltipVisible(false), 2000);
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ml: 11,
        '.Tooltip__wrapper': {
          right: 0,
          top: 'calc(100% + 1px)',
          [theme.breakpoints.up('sm')]: {
            top: 'calc(100% + 3px)',
          },
        },
      }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          left: -15,
          '&:after, &:before': {
            content: "''",
            backgroundColor: '$disabled',
          },
          '&:before': {
            height: 2,
            width: 12,
          },
          '&:after': {
            width: 6,
            height: 6,
            borderRadius: '50%',
            position: 'absolute',
            left: 0,
          },
        }}
      />
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: '$light',
          border: `2px solid ${theme.palette.$disabled}`,
          position: 'absolute',
          left: -2,
          zIndex: 2,
        }}
      />
      <Tooltip
        color="light"
        tooltipCss={{
          display: 'none',
          [theme.breakpoints.up('md')]: {
            display: 'block',
            opacity: isTooltipVisible ? 1 : undefined,
            zIndex: isTooltipVisible ? 1 : undefined,
            visibility: isTooltipVisible ? 'visible' : undefined,
          },
        }}
        tooltipContent={
          <Box
            sx={{
              typography: 'descriptor',
              flexDirection: 'row',
              flexWrap: 'wrap',
              p: 2,
              display: 'none',
              [theme.breakpoints.up('md')]: { p: 5, display: 'inline-flex' },
            }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                mb: 2,
                whiteSpace: 'no-wrap',
                minWidth: 150,
              }}>
              {texts.walletConnect.representative}
              <Box sx={{ ml: 3 }}>
                <ChainsIcons chains={representative.chainsIds} />
              </Box>
            </Box>
            <br />
            <Link
              inNewWindow
              css={{
                display: 'inline-flex',
                alignItems: 'center',
                hover: {
                  color: theme.palette.$textSecondary,
                  path: { stroke: theme.palette.$textSecondary },
                },
              }}
              href={getScanLink({
                address: representative.address,
              })}>
              <Box>
                {isENSDataExists
                  ? ensData[representative.address.toLocaleLowerCase() as Hex]
                      .name
                  : representative.address}
              </Box>
              <IconBox
                sx={{
                  ml: 3,
                  width: 10,
                  height: 10,
                  '> svg': {
                    width: 10,
                    height: 10,
                    path: { stroke: theme.palette.$text },
                  },
                }}>
                <LinkIcon />
              </IconBox>
            </Link>
          </Box>
        }>
        <Box
          onClick={() => setAccountInfoModalOpen(true)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            backgroundColor: '$light',
            cursor: 'pointer',
            position: 'relative',
            [theme.breakpoints.up('lg')]: {
              width: 32,
              height: 32,
            },
            hover: {
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? theme.palette.$mainButton
                  : theme.palette.$middleLight,
            },
          }}>
          <RepresentingButtonChainsIcon chains={representative.chainsIds} />
          <Image
            src={
              !isAvatarExists
                ? makeBlockie(
                    representative.address !== ''
                      ? representative.address
                      : 'default',
                  )
                : shownAvatar
            }
            alt=""
            sx={{
              height: 16,
              width: 16,
              borderRadius: '50%',
              [theme.breakpoints.up('lg')]: {
                height: 20,
                width: 20,
              },
            }}
          />
        </Box>
      </Tooltip>
    </Box>
  );
}
