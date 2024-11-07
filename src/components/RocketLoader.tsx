import RocketLoaderIcon from '../assets/rocketLoader.svg';
import { IconBox } from './primitives/IconBox';

interface RocketLoaderProps {
  size?: number;
}

export function RocketLoader({ size = 77 }: RocketLoaderProps) {
  return (
    <IconBox
      sx={(theme) => ({
        width: size,
        height: size,
        '> svg': {
          width: size,
          height: size,
        },
        '#rocket_fire': {
          '@keyframes rocketFire': {
            '0%': {
              opacity: 1,
            },
            '25%': {
              opacity: 0,
            },
            '50%': {
              opacity: 0,
            },
            '75%': {
              opacity: 0,
            },
            '100%': {
              opacity: 1,
            },
          },
          animation: `rocketFire 1.5s linear infinite`,
        },
        '#rocket_fire_m': {
          '@keyframes rocketFireM': {
            '0%': {
              opacity: 0,
            },
            '25%': {
              opacity: 1,
            },
            '50%': {
              opacity: 0,
            },
            '75%': {
              opacity: 1,
            },
            '100%': {
              opacity: 0,
            },
          },
          animation: `rocketFireM 1.5s linear infinite`,
        },
        '#rocket_fire_s': {
          '@keyframes rocketFireS': {
            '0%': {
              opacity: 0,
            },
            '25%': {
              opacity: 0,
            },
            '50%': {
              opacity: 1,
            },
            '75%': {
              opacity: 0,
            },
            '100%': {
              opacity: 0,
            },
          },
          animation: `rocketFireS 1.5s linear infinite`,
        },
        '.black': {
          fill: theme.palette.$mainElements,
        },
        '.white_bg_black_stroke': {
          fill: theme.palette.$textWhite,
          stroke: theme.palette.$mainElements,
        },
        '.white': {
          fill: theme.palette.$textWhite,
        },
      })}>
      <RocketLoaderIcon />
    </IconBox>
  );
}
