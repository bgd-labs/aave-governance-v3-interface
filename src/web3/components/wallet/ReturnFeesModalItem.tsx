// TODO: styles in progress

import { ReturnFee } from '@bgd-labs/aave-governance-ui-helpers';
import { Box } from '@mui/system';

interface ReturnFeesModalItemProps {
  data: ReturnFee;
}

export function ReturnFeesModalItem({ data }: ReturnFeesModalItemProps) {
  const { title, ipfsHash, status, proposalId, proposalStatus } = data;

  return (
    <Box>
      <h1>{title}</h1>
    </Box>
  );
}
