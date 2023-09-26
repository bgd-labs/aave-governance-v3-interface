import { Box, useTheme } from '@mui/system';
import { useState } from 'react';

import { texts } from '../utils/texts';
import { BoxWith3D } from './BoxWith3D';

const TextBox = ({
  value,
  text,
  isHovered,
  isClicked,
  isOff,
}: {
  value: boolean;
  text: string;
  isHovered?: boolean;
  isClicked?: boolean;
  isOff?: boolean;
}) => {
  return (
    <Box
      sx={{
        typography: 'descriptor',
        color: isClicked
          ? '$textDisabled'
          : value
          ? isHovered
            ? '$textWhite'
            : isOff
            ? '$text'
            : '$textWhite'
          : '$textDisabled',
        width: 30,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 2,
        left:
          value && !isHovered && !isClicked
            ? 3
            : value && isHovered && !isClicked
            ? 1
            : 0,
        bottom:
          value && !isHovered && !isClicked
            ? 3
            : value && isHovered && !isClicked
            ? 1
            : 0,
      }}>
      {text}
    </Box>
  );
};

interface GelatoSwitcherProps {
  value: boolean;
  setValue?: (value: boolean) => void;
  disabled?: boolean;
}

export function GelatoSwitcher({
  disabled,
  value,
  setValue,
}: GelatoSwitcherProps) {
  const theme = useTheme();

  const [isHovered, setIsHoverer] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const borderSize = isClicked ? 0 : isHovered ? 2 : 4;
  const contentColor =
    isHovered || isClicked ? '$secondary' : value ? '$mainButton' : '$light';

  return (
    <Box
      onMouseOver={() => !disabled && !isClicked && setIsHoverer(true)}
      onMouseOut={() => setIsHoverer(false)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: 60,
        height: 18,
        position: 'relative',
        border: `1px solid ${theme.palette.$mainBorder}`,
        backgroundColor: '$mainLight',
        cursor: disabled ? 'default' : 'pointer',
      }}
      onClick={() => {
        if (!disabled && setValue) {
          setIsHoverer(false);
          setIsClicked(true);
          setValue(!value);
          setTimeout(() => setIsClicked(false), 700);
        }
      }}>
      <BoxWith3D
        wrapperCss={{
          position: 'absolute',
          transition: 'all 0.7s ease',
          left: value ? 30 : -1,
          bottom: -1,
          zIndex: 1,
        }}
        contentColor={contentColor}
        borderSize={borderSize}
        leftBorderColor="$buttonBorderBottom"
        bottomBorderColor="$buttonBorderLeft"
        anySize>
        <Box sx={{ width: 26, height: 16 }} />
      </BoxWith3D>

      <TextBox
        text={texts.other.off}
        value={!value}
        isOff
        isClicked={isClicked}
        isHovered={isHovered}
      />
      <TextBox
        text={texts.other.on}
        value={value}
        isClicked={isClicked}
        isHovered={isHovered}
      />
    </Box>
  );
}
