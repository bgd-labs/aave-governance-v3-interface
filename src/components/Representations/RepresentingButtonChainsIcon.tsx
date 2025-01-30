import { Box, useTheme } from '@mui/system';
import React from 'react';

import MultichainIcon from '../../assets/representation/multichain.svg';
import { NetworkIcon } from '../NetworkIcon';
import { IconBox } from '../primitives/IconBox';

interface RepresentingButtonChainsIconProps {
  chains: number[];
}

export function RepresentingButtonChainsIcon({
  chains,
}: RepresentingButtonChainsIconProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: -2,
        right: -3,
        [theme.breakpoints.up('lg')]: {
          bottom: -4,
          right: -5,
        },
        '.NetworkIcon': {
          width: 10,
          height: 10,
          [theme.breakpoints.up('lg')]: {
            width: 14,
            height: 14,
          },
        },
      }}>
      {chains.length > 1 ? (
        <IconBox
          sx={{
            width: 10,
            height: 10,
            [theme.breakpoints.up('lg')]: {
              width: 14,
              height: 14,
            },
            path: {
              stroke: theme.palette.$disabled,
            },
            circle: {
              fill: theme.palette.$disabled,
            },
            '> svg': {
              width: 10,
              height: 10,
              [theme.breakpoints.up('lg')]: {
                width: 14,
                height: 14,
              },
            },
          }}>
          <MultichainIcon />
        </IconBox>
      ) : (
        <NetworkIcon chainId={chains[0]} />
      )}
    </Box>
  );
}
