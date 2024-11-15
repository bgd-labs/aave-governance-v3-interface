import { Box } from '@mui/system';
import React from 'react';

export function CustomSkeleton({
  width,
  height,
  circle,
  className,
}: {
  width?: number | string;
  height?: number | string;
  circle?: boolean;
  className?: string;
}) {
  return (
    <Box className={className}>
      <Box
        className="react-loading-skeleton"
        sx={(theme) => ({
          '@keyframes skeletonSlide': {
            '0%': {
              left: '-100px',
            },
            '100%': {
              left: 'calc(100% + 100px)',
            },
          },
          position: 'relative',
          backgroundColor: `${theme.palette.$light} !important`,
          width,
          height,
          borderRadius: circle ? '50%' : '0',
          overflow: 'hidden',
          '&:before': {
            content: `""`,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '0',
            height: '100%',
            boxShadow: `0 0 80px 20px ${theme.palette.$textSecondary}`,
            animation: `skeletonSlide 1s infinite ease-in-out`,
          },
        })}
      />
    </Box>
  );
}
