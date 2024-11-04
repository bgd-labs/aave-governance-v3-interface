import { Box, styled, SxProps, useTheme } from '@mui/system';

import { texts } from '../utils/texts';
import { BoxWith3D } from './BoxWith3D';

export interface ToggleButtonProps {
  value: boolean;
  onToggle: (value: boolean) => void;
  css?: SxProps;
}

const Button = styled('button')({
  width: '50%',
  position: 'relative',
  zIndex: 4,
  transition: 'all 0.4s ease',
  display: 'inline-block',
  border: 'none',
  background: 'transparent',
});

export function ToggleButton({ value, onToggle, css }: ToggleButtonProps) {
  const theme = useTheme();
  const width = '100%';
  const mobileHeight = 52;
  const height = 60;

  return (
    <Box
      sx={{
        width: width,
        minHeight: mobileHeight,
        position: 'relative',
        backgroundColor: '$paper',
        border: `1px solid ${theme.palette.$main}`,
        mb: 18,
        ...css,
        [theme.breakpoints.up('lg')]: {
          minHeight: height,
          mb: 24,
        },
      }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Box
          className="ToggleButton__point--wrapper"
          sx={{
            transform: `translateX(${value ? 'calc(100% + 4px)' : 0})`,
            position: 'absolute',
            left: !value ? -2 : 0,
            top: -3,
            width: '50%',
            height: '100%',
            transition: 'all 0.4s ease',
            zIndex: 3,
          }}>
          <BoxWith3D
            alwaysWithBorders
            borderSize={4}
            css={{
              height: mobileHeight,
              [theme.breakpoints.up('lg')]: { height },
            }}
            contentColor={value ? '$mainAgainst' : '$mainFor'}
            bottomBorderColor={value ? '$secondaryAgainst' : '$secondaryFor'}
            leftBorderColor={value ? '$secondaryAgainst' : '$secondaryFor'}>
            <></>
          </BoxWith3D>
        </Box>

        <Button
          onClick={() => onToggle(false)}
          type="button"
          sx={{
            minHeight: mobileHeight,
            color: !value ? '$textWhite' : '$secondaryBorder',
            transform: !value ? 'translate(1px, -2px)' : 'unset',
            hover: {
              color: !value ? theme.palette.$textWhite : theme.palette.$mainFor,
            },
            [theme.breakpoints.up('lg')]: {
              minHeight: height,
            },
          }}>
          <Box component="p" sx={{ typography: 'buttonLarge' }}>
            {texts.other.toggleFor}
          </Box>
        </Button>
        <Button
          onClick={() => onToggle(true)}
          type="button"
          sx={{
            minHeight: mobileHeight,
            color: value ? '$textWhite' : '$secondaryBorder',
            transform: value ? 'translate(4px, -2px)' : 'unset',
            hover: {
              color: value
                ? theme.palette.$textWhite
                : theme.palette.$mainAgainst,
            },
            [theme.breakpoints.up('lg')]: {
              minHeight: height,
            },
          }}>
          <Box component="p" sx={{ typography: 'buttonLarge' }}>
            {texts.other.toggleAgainst}
          </Box>
        </Button>
      </Box>
    </Box>
  );
}
