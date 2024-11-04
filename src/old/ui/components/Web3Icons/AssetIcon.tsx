'use client';

import { AssetIcon as AI } from '@bgd-labs/react-web3-icons';
import {
  AssetIconProps,
  ExternalComponentBaseProps,
} from '@bgd-labs/react-web3-icons/dist/utils';
import { Box, SxProps } from '@mui/system';

import { CustomSkeleton } from '../CustomSkeleton';

/**
 * Renders an asset icon specified by symbol.
 */
const AssetIcon = ({
  symbol,
  size,
  css,
  ...props
}: AssetIconProps &
  ExternalComponentBaseProps & {
    size?: number;
    css?: SxProps;
  }) => {
  return (
    <Box
      sx={{
        lineHeight: 0,
        width: size ?? 12,
        height: size ?? 12,
        ...css,
      }}>
      <AI
        width={size ?? 12}
        height={size ?? 12}
        symbol={symbol}
        loader={
          <Box
            sx={{
              lineHeight: 0,
              width: size ?? 12,
              height: size ?? 12,
              ...css,
            }}>
            <CustomSkeleton circle width={size ?? 12} height={size ?? 12} />
          </Box>
        }
        {...props}
      />
    </Box>
  );
};

export default AssetIcon;
