import { useTheme } from '@mui/system';
import React from 'react';

import RepresentationVotingPowerIcon from '../assets/representation/representationVotingPower.svg';
import { IconBox } from './primitives/IconBox';

interface RepresentationIconProps {
  address: string;
  disabled: boolean;
}

export function RepresentationIcon({
  address,
  disabled,
}: RepresentationIconProps) {
  const theme = useTheme();

  if (!address) return null;

  const color = disabled ? theme.palette.$textDisabled : theme.palette.$text;

  return (
    <IconBox
      sx={{
        mr: 3,
        width: 14,
        height: 14,
        '> svg': {
          width: 14,
          height: 14,
          path: { stroke: color },
          '.borders': {
            stroke: color,
          },
          '.filled': {
            fill: color,
            stroke: color,
          },
        },
      }}>
      <RepresentationVotingPowerIcon />
    </IconBox>
  );
}
