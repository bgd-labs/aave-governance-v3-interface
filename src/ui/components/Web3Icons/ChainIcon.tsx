'use client';

import { DynamicIcon } from '@bgd-labs/react-web3-icons';
import {
  ChainType,
  getChainIconNameAndPath,
  IconVariant,
} from '@bgd-labs/react-web3-icons/dist/utils';
import { Box, SxProps } from '@mui/system';

import { CustomSkeleton } from '../CustomSkeleton';

/**
 * Renders a chain icon specified by chain id.
 */
export const ChainIcon = ({
  size,
  css,
  ...props
}: Pick<ChainType, 'chainId'> & {
  variant?: IconVariant;
  size?: number;
  css?: SxProps;
}) => {
  const { iconName, iconPathToRepo } = getChainIconNameAndPath(props);
  return (
    <Box
      sx={{
        lineHeight: 0,
        borderRadius: '50%',
        width: size ?? 16,
        height: size ?? 16,
        ...css,
      }}>
      <DynamicIcon
        iconPath={iconPathToRepo}
        iconName={iconName}
        dynamicComponent={() =>
          import('@bgd-labs/react-web3-icons/dist/components/chains/index.cjs')
        }
        loadingComponent={
          <CustomSkeleton circle width={size ?? 16} height={size ?? 16} />
        }
      />
    </Box>
  );
};
