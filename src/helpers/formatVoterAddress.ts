import { VotersData } from '@bgd-labs/aave-governance-ui-helpers';

import { textCenterEllipsis } from '../styles/textCenterEllipsis';

export function formatVoterAddress(vote: VotersData, isBig?: boolean) {
  return vote.ensName
    ? vote.ensName.length > (isBig ? 18 : 10)
      ? textCenterEllipsis(vote.ensName, isBig ? 12 : 5, isBig ? 6 : 5)
      : vote.ensName
    : textCenterEllipsis(vote.address, isBig ? 8 : 5, isBig ? 8 : 5);
}
