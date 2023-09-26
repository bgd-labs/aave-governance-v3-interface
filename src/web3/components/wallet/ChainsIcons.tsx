import { Box } from '@mui/system';

import { NetworkIcon } from '../../../ui/components/NetworkIcon';

interface ChainsIconsProps {
  chains: number[];
  alwaysVisible?: boolean;
}

export function ChainsIcons({ chains, alwaysVisible }: ChainsIconsProps) {
  if (chains.length <= 1 && !alwaysVisible) return null;

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {chains.map((chainId, index) => (
        <NetworkIcon
          key={chainId}
          chainId={chainId}
          size={12}
          css={{
            position: 'relative',
            zIndex: index,
            ml: -3,
            '&:first-of-type': { ml: 0 },
          }}
        />
      ))}
    </Box>
  );
}
