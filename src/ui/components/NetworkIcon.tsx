import { Box, SxProps } from '@mui/system';
import { toHex } from 'viem';
import {
  arbitrum,
  avalanche,
  avalancheFuji,
  base,
  bsc,
  bscTestnet,
  gnosis,
  goerli,
  mainnet,
  metis,
  optimism,
  polygon,
  polygonMumbai,
  sepolia,
} from 'viem/chains';

import { chainInfoHelper } from '../../utils/configs';
import { Image } from '../primitives/Image';
import { setRelativePath } from '../utils/relativePath';
import { Tooltip } from './Tooltip';

interface NetworkIconProps {
  chainId: number;
  size?: number;
  css?: SxProps;
  withTooltip?: boolean;
}

const getIconNetworkName = (chainId: number) => {
  switch (chainId) {
    case mainnet.id:
      return 'ethereum';
    case sepolia.id:
      return 'ethereum';
    case goerli.id:
      return 'ethereum';
    case polygon.id:
      return 'polygon';
    case polygonMumbai.id:
      return 'polygon';
    case avalanche.id:
      return 'avalanche';
    case avalancheFuji.id:
      return 'avalanche';
    case bsc.id:
      return 'bsc';
    case bscTestnet.id:
      return 'bsc';
    case base.id:
      return 'base';
    case arbitrum.id:
      return 'arbitrum';
    case metis.id:
      return 'metis';
    case optimism.id:
      return 'optimism';
    case gnosis.id:
      return 'gnosis';
    default:
      return 'ethereum';
  }
};

export function NetworkIcon({
  chainId,
  size,
  css,
  withTooltip,
}: NetworkIconProps) {
  const networkIconName = getIconNetworkName(chainId);
  const chain = chainInfoHelper.getChainParameters(chainId);

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
          <Image
            className="NetworkIcon"
            sx={{
              borderRadius: '50%',
              width: size || 16,
              height: size || 16,
              ...css,
            }}
            src={setRelativePath(
              `/images/networks/${networkIconName.toLowerCase()}.svg`,
            )}
            alt={`${chainInfoHelper.getChainParameters(chainId).name} icon`}
          />
        </Tooltip>
      ) : (
        <Image
          className="NetworkIcon"
          sx={{
            borderRadius: '50%',
            width: size || 16,
            height: size || 16,
            ...css,
          }}
          src={setRelativePath(
            `/images/networks/${networkIconName.toLowerCase()}.svg`,
          )}
          alt={`${chainInfoHelper.getChainParameters(chainId).name} icon`}
        />
      )}
    </>
  );
}
