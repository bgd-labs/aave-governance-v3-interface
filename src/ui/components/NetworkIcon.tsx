import {
  IconVariant,
  Web3IconType,
} from '@bgd-labs/react-web3-icons/dist/utils';
import { Box, SxProps } from '@mui/system';
import { useEffect, useMemo, useState } from 'react';
import { toHex } from 'viem';

import { chainInfoHelper } from '../../utils/configs';
import { Tooltip } from './Tooltip';
import { Web3Icon } from './Web3Icon';

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
          <Web3Icon
            iconInfo={{
              type: Web3IconType.chain,
              info: { chainId: chainId, variant: IconVariant.Full },
            }}
            size={size ?? 16}
            css={css}
          />
        </Tooltip>
      ) : (
        <Web3Icon
          iconInfo={{
            type: Web3IconType.chain,
            info: { chainId: chainId, variant: IconVariant.Full },
          }}
          size={size ?? 16}
          css={css}
        />
      )}
    </>
  );
}
