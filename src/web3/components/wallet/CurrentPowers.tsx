import { Box } from '@mui/system';

import { useStore } from '../../../store';
import { selectCurrentPowers } from '../../store/web3Selectors';

export function CurrentPowers() {
  const store = useStore();

  const currentPowers = selectCurrentPowers(store);

  // if currentPowers undefined than loading
  console.log(currentPowers);

  return (
    <Box>
      <h1>Current powers</h1>
    </Box>
  );
}
