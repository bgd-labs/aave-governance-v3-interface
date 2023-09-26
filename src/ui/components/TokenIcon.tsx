import { SxProps } from '@mui/system';

import { Image } from '../primitives/Image';
import { setRelativePath } from '../utils/relativePath';

interface TokenIconProps {
  symbol: string;
  css?: SxProps;
}

export function TokenIcon({ symbol, css }: TokenIconProps) {
  return (
    <Image
      sx={{ borderRadius: '50%', width: 12, height: 12, ...css }}
      src={setRelativePath(`/images/tokens/${symbol.toLowerCase()}.svg`)}
      alt={`${symbol} icon`}
    />
  );
}
