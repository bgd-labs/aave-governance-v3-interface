'use client';

import { DynamicIcon } from '@bgd-labs/react-web3-icons';
import {
  AssetIconProps,
  getAssetIconNameAndPath,
} from '@bgd-labs/react-web3-icons/dist/utils';
import { Box, SxProps } from '@mui/system';

import { CustomSkeleton } from '../CustomSkeleton';

/**
 * Renders an asset icon specified by symbol.
 */
export const AssetIcon = ({
  size,
  css,
  ...props
}: AssetIconProps & { size?: number; css?: SxProps }) => {
  const { iconPathToRepo, iconName } = getAssetIconNameAndPath(props);
  return (
    <Box
      sx={{
        lineHeight: 0,
        borderRadius: '50%',
        width: size ?? 12,
        height: size ?? 12,
        ...css,
      }}>
      <DynamicIcon
        iconPath={iconPathToRepo}
        iconName={iconName}
        dynamicComponent={() =>
          import('@bgd-labs/react-web3-icons/dist/components/index.cjs')
        }
        loadingComponent={
          <CustomSkeleton circle width={size ?? 12} height={size ?? 12} />
        }
      />
    </Box>
  );
};
