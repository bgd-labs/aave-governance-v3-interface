import { getChainName } from '@bgd-labs/react-web3-icons/dist/utils';
import { Box, SxProps } from '@mui/system';

import { NetworkIcon } from './NetworkIcon';

interface ChainNameWithIconProps {
  chainId: number;
  onlyIcon?: boolean;
  iconSize?: number;
  css?: SxProps;
  textCss?: SxProps;
}

export function ChainNameWithIcon({
  chainId,
  onlyIcon,
  iconSize,
  css,
  textCss,
}: ChainNameWithIconProps) {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', ...css }}>
      <NetworkIcon chainId={chainId} size={iconSize} css={{ mr: 5 }} />
      {!onlyIcon && (
        <Box className="ChainNameWithIcon__text" sx={textCss}>
          {getChainName({ chainId })}
        </Box>
      )}
    </Box>
  );
}
