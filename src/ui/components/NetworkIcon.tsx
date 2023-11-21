import { SxProps } from '@mui/system';
import {
  arbitrum,
  avalanche,
  avalancheFuji,
  base,
  bsc,
  bscTestnet,
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

interface NetworkIconProps {
  chainId: number;
  size?: number;
  css?: SxProps;
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
      alt={`${chainInfoHelper.getChainParameters(chainId).name} icon`}
    />
  );
}
