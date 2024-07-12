import { Box, SxProps } from '@mui/system';
import { useEffect, useState } from 'react';
import { toHex } from 'viem';

import { chainInfoHelper } from '../../utils/configs';
import { Tooltip } from './Tooltip';
import { ChainIcon } from './Web3Icons/ChainIcon';

interface NetworkIconProps {
  chainId: number;
  size?: number;
  css?: SxProps;
  withTooltip?: boolean;
}

export function NetworkIcon({
  chainId,
  size,
  css,
  withTooltip,
}: NetworkIconProps) {
  const [chain, setChain] = useState(
    chainInfoHelper.getChainParameters(chainId),
  );

  useEffect(() => {
    if (chainId) {
      setChain(chainInfoHelper.getChainParameters(chainId));
    }
  }, [chainId]);

  return (
    <>
      {withTooltip ? (
        <Tooltip
          tooltipContent={
            <Box
              sx={{
                py: 2,
                px: 4,
                typography: 'descriptor',
                whiteSpace: 'nowrap',
                textAlign: 'center',
              }}>
              {chain.name}: {chain.id} <br /> ({toHex(chain.id)})
            </Box>
          }>
          <ChainIcon chainId={chainId} size={size} css={css} />
        </Tooltip>
      ) : (
        <ChainIcon chainId={chainId} size={size} css={css} />
      )}
    </>
  );
}
