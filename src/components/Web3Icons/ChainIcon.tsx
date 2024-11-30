'use client';

import { StaticChainIcon as CI } from '@bgd-labs/react-web3-icons';
import { ExternalComponentBaseProps } from '@bgd-labs/react-web3-icons/dist/utils';
import { Box, SxProps } from '@mui/system';

import { CustomSkeleton } from '../primitives/CustomSkeleton';

interface ChainIconProps extends ExternalComponentBaseProps {
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
      className="ChainIcon"
      sx={{
        lineHeight: 0,
        width: size ?? 12,
        height: size ?? 12,
        ...css,
      }}>
      <CI
        width={size ?? 12}
        height={size ?? 12}
        chainId={chainId}
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
