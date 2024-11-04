import { Box, useTheme } from '@mui/system';

import { NetworkIcon } from '../../ui/components/NetworkIcon';

interface ChainsIconsProps {
  chains: number[];
  alwaysVisible?: boolean;
}

export function ChainsIcons({ chains, alwaysVisible }: ChainsIconsProps) {
  const theme = useTheme();

  if (chains.length <= 1 && !alwaysVisible) return null;

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {chains.map((chainId, index) => (
        <NetworkIcon
          key={chainId}
          chainId={chainId}
          css={{
            position: 'relative',
            zIndex: index,
            ml: -3,
            '&:first-of-type': { ml: 0 },
            width: 12,
            height: 12,
            [theme.breakpoints.up('sm')]: {
              width: 16,
              height: 16,
            },
          }}
        />
      ))}
    </Box>
  );
}
