import { SxProps } from '@mui/system';

import { Image } from '../primitives/Image';

interface TokenIconProps {
  symbol: string;
  css?: SxProps;
}

export function TokenIcon({ symbol, css }: TokenIconProps) {
  return (
    <Image
      sx={{ borderRadius: '50%', width: 12, height: 12, ...css }}
      src={
        symbol.toLowerCase() === 'aaave'
          ? `https://raw.githubusercontent.com/bgd-labs/aave-address-book/main/assets/aToken/aave.svg`
          : `https://raw.githubusercontent.com/bgd-labs/aave-address-book/main/assets/underlying/${symbol.toLowerCase()}.svg`
      }
      alt={`${symbol} icon`}
    />
  );
}
