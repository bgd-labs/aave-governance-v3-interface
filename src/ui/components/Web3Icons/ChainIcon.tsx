'use client';

import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { chainsIconsPack } from '@bgd-labs/react-web3-icons/dist/iconsPacks/chainsIconsPack';
import { Box, SxProps } from '@mui/system';

import { CustomSkeleton } from '../CustomSkeleton';

interface ChainIconProps {
  chainId: number;
  size?: number;
  css?: SxProps;
}
/**
 * Renders a chain icon specified by chainId.
 */
const ChainIcon = ({ chainId, size, css, ...props }: ChainIconProps) => {
  return (
    <Box
      sx={{
        lineHeight: 0,
        width: size ?? 12,
        height: size ?? 12,
        ...css,
      }}>
      <Web3Icon
        width={size ?? 12}
        height={size ?? 12}
        chainId={chainId}
        iconsPack={chainsIconsPack}
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

export default ChainIcon;
