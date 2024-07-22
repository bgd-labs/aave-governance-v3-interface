'use client';

import { Web3DynamicIcon } from '@bgd-labs/react-web3-icons';
import {
  AssetIconProps,
  ChainType,
  ComponentsFallback,
  getAssetIconNameAndPath,
  getChainIconNameAndPath,
  getWalletIconNameAndPath,
  IconInfo,
  WalletType,
  Web3IconType,
} from '@bgd-labs/react-web3-icons/dist/utils';
import { Box, SxProps } from '@mui/system';
import { useMemo } from 'react';

import { CustomSkeleton } from './CustomSkeleton';

interface Web3IconProps {
  iconInfo:
    | IconInfo<AssetIconProps>
    | IconInfo<Pick<ChainType, 'chainId' | 'variant'>>
    | IconInfo<Pick<WalletType, 'name' | 'variant'>>;
  size?: number;
  css?: SxProps;
}
/**
 * Renders an asset or chain or wallet icon specified by icon type and props.
 */
export const Web3Icon = ({ size, css, ...props }: Web3IconProps) => {
  let iconPath = undefined;
  let componentsFallback: ComponentsFallback | undefined = undefined;
  useMemo(() => {
    if (props.iconInfo.type === Web3IconType.asset) {
      const assetInfo = getAssetIconNameAndPath(
        props.iconInfo.info as AssetIconProps,
      );
      iconPath = assetInfo.iconPathToRepo;
      componentsFallback = {
        name: assetInfo.iconName,
        path: () =>
          import('@bgd-labs/react-web3-icons/dist/components/index.cjs'),
      };
    } else if (props.iconInfo.type === Web3IconType.chain) {
      const chainInfo = getChainIconNameAndPath(
        props.iconInfo.info as Pick<ChainType, 'chainId' | 'variant'>,
      );
      iconPath = chainInfo.iconPathToRepo;
      componentsFallback = {
        name: chainInfo.iconName,
        path: () =>
          import('@bgd-labs/react-web3-icons/dist/components/chains/index.cjs'),
      };
    } else if (props.iconInfo.type === Web3IconType.wallet) {
      const walletInfo = getWalletIconNameAndPath(
        props.iconInfo.info as Pick<WalletType, 'name' | 'variant'>,
      );
      iconPath = walletInfo.iconPathToRepo;
      componentsFallback = {
        name: walletInfo.iconName,
        path: () =>
          import(
            '@bgd-labs/react-web3-icons/dist/components/wallets/index.cjs'
          ),
      };
    }
  }, [props]);

  if (!iconPath || !componentsFallback) {
    return (
      <Box
        sx={{
          lineHeight: 0,
          width: size ?? 12,
          height: size ?? 12,
          ...css,
        }}>
        <CustomSkeleton circle width={size ?? 12} height={size ?? 12} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        lineHeight: 0,
        width: size ?? 12,
        height: size ?? 12,
        ...css,
      }}>
      <Web3DynamicIcon
        width={size ?? 12}
        height={size ?? 12}
        src={iconPath}
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
      />
    </Box>
  );
};
