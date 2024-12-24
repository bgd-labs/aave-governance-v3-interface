'use client';

import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { Box, SxProps } from '@mui/system';

import { CustomSkeleton } from '../primitives/CustomSkeleton';

interface WalletIconProps {
  walletName: string;
  size?: number;
  css?: SxProps;
}

/**
 * Renders a wallet icon specified by walletName.
 */
const WalletIcon = ({ walletName, size, css, ...props }: WalletIconProps) => {
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
        walletKey={walletName}
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

export default WalletIcon;
