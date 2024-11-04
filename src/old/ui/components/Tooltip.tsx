import { Box, SxProps } from '@mui/system';
import { ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  tooltipContent: ReactNode;
  color?: 'light' | 'dark';
  position?: 'top';
  tooltipCss?: SxProps;
}

export function Tooltip({
  children,
  tooltipContent,
  color = 'light',
  position,
  tooltipCss,
}: TooltipProps) {
  return (
    <Box
      sx={{
        lineHeight: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        '&:hover': {
          '.Tooltip__wrapper': { opacity: 1, zIndex: 1, visibility: 'visible' },
        },
      }}>
      <Box sx={{ lineHeight: 0 }}>{children}</Box>

      <Box
        className="Tooltip__wrapper"
        sx={{
          visibility: 'hidden',
          opacity: 0,
          zIndex: -1,
          transition: 'all 0.2s ease',
          position: 'absolute',
          top: position === 'top' ? 'auto' : 'calc(100% + 3px)',
          bottom: position === 'top' ? 'calc(100% + 3px)' : 'auto',
          padding: '2px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 45,
          backgroundColor: color === 'light' ? '$light' : '$secondary',
          color: color === 'light' ? '$text' : '$textWhite',
          ...tooltipCss,
        }}>
        {tooltipContent}
      </Box>
    </Box>
  );
}
