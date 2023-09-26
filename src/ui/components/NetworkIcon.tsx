import { SxProps } from '@mui/system';

import { ChainIdByName } from '../../../lib/helpers/src';
import { chainInfoHelper } from '../../utils/configs';
import { Image } from '../primitives/Image';
import { setRelativePath } from '../utils/relativePath';

interface NetworkIconProps {
  chainId: number;
  size?: number;
  css?: SxProps;
}

const getIconNetworkName = (chainId: number) => {
  switch (chainId) {
    case ChainIdByName.EthereumMainnet:
      return 'ethereum';
    case ChainIdByName.Sepolia:
      return 'ethereum';
    case ChainIdByName.Goerli:
      return 'ethereum';
    case ChainIdByName.Polygon:
      return 'polygon';
    case ChainIdByName.Mumbai:
      return 'polygon';
    case ChainIdByName.Avalanche:
      return 'avalanche';
    case ChainIdByName.AvalancheFuji:
      return 'avalanche';
    case ChainIdByName.Binance:
      return 'bsc';
    case ChainIdByName.BnbTest:
      return 'bsc';
    case ChainIdByName.Base:
      return 'base';
    case ChainIdByName.Arbitrum:
      return 'arbitrum';
    case ChainIdByName.Metis:
      return 'metis';
    case ChainIdByName.Optimism:
      return 'optimism';
    default:
      return 'ethereum';
  }
};

export function NetworkIcon({ chainId, size, css }: NetworkIconProps) {
  const networkIconName = getIconNetworkName(chainId);

  return (
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
      alt={`${chainInfoHelper.getChainParameters(chainId).chainName} icon`}
    />
  );
}
