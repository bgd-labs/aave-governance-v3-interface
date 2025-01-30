'use client';

import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { Box, SxProps } from '@mui/system';

import { Asset } from '../../types';
import { CustomSkeleton } from '../primitives/CustomSkeleton';

/**
 * Renders an asset icon specified by symbol.
 */
const AssetIcon = ({
  symbol,
  size,
  css,
  ...props
}: {
  symbol: string;
  size?: number;
  css?: SxProps;
}) => {
  return (
    <Box
      sx={{
        lineHeight: 0,
        width: size ?? 12,
        height: size ?? 12,
        img: {
          width: size ?? 12,
          height: size ?? 12,
        },
        ...css,
      }}>
      <Web3Icon
        width={size ?? 12}
        height={size ?? 12}
        symbol={symbol === Asset.AAAVE ? Asset.AAVE : symbol}
        assetTag={symbol === Asset.AAAVE ? 'a' : undefined}
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
