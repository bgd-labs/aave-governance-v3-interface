'use client';

import { WalletIcon as WI } from '@bgd-labs/react-web3-icons';
import { ExternalComponentBaseProps } from '@bgd-labs/react-web3-icons/dist/utils/index';
import { Box, SxProps } from '@mui/system';

import { CustomSkeleton } from '../CustomSkeleton';

interface WalletIconProps extends ExternalComponentBaseProps {
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
      <WI
        width={size ?? 12}
        height={size ?? 12}
        walletName={walletName}
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
