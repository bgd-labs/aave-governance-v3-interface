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
  const height = 60;

  return (
    <Box
      sx={{
        width: width,
        minHeight: height,
        position: 'relative',
        backgroundColor: '$paper',
        border: `1px solid ${theme.palette.$main}`,
        mb: 20,
        ...css,
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
            css={{ height }}
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
            minHeight: height,
            color: !value ? '$textWhite' : '$text',
            transform: !value ? 'translate(1px, -2px)' : 'unset',
            hover: {
              color: !value ? theme.palette.$textWhite : theme.palette.$mainFor,
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
            minHeight: height,
            color: value ? '$textWhite' : '$text',
            transform: value ? 'translate(4px, -2px)' : 'unset',
            hover: {
              color: value
                ? theme.palette.$textWhite
                : theme.palette.$mainAgainst,
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
