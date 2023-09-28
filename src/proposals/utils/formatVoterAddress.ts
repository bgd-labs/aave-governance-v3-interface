import { VotersData } from 'aave-governance-ui-helpers';

import { textCenterEllipsis } from '../../ui/utils/text-center-ellipsis';

export function formatVoterAddress(vote: VotersData) {
  return vote.ensName
    ? vote.ensName.length > 10
      ? textCenterEllipsis(vote.ensName, 5, 5)
      : vote.ensName
    : textCenterEllipsis(vote.address, 5, 4);
}
