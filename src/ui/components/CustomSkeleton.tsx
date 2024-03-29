import { Box } from '@mui/system';
import React from 'react';
import Skeleton, { SkeletonProps } from 'react-loading-skeleton';

import { useStore } from '../../store';

interface CustomSkeletonProps extends SkeletonProps {
  variant?: 'default' | 'dark';
}

export function CustomSkeleton({
  variant = 'default',
  ...rest
}: CustomSkeletonProps) {
  const isRendered = useStore((store) => store.isRendered);

  return (
    <Box
      sx={(theme) => ({
        '.react-loading-skeleton': {
          backgroundColor: isRendered
            ? `${theme.palette.$light} !important`
            : theme.palette.$light,

          '&:after': {
            backgroundImage: `linear-gradient(90deg, ${
              isRendered
                ? `${theme.palette.$light} !important`
                : theme.palette.$light
            }, ${
              isRendered
                ? `${theme.palette.$middleLight} !important`
                : theme.palette.$middleLight
            }, ${
              isRendered
                ? `${theme.palette.$light} !important`
                : theme.palette.$light
            })`,
          },
        },
      })}>
      <Skeleton borderRadius={0} {...rest} />
    </Box>
  );
}
