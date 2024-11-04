import { HistoryItemType } from '@bgd-labs/aave-governance-ui-helpers';

export function getHistoryId({
  proposalId,
  type,
  id,
  chainId,
}: {
  proposalId: number;
  type: HistoryItemType;
  id: number;
  chainId: number;
}) {
  if (
    type === HistoryItemType.PAYLOADS_CREATED ||
    type === HistoryItemType.PAYLOADS_QUEUED ||
    type === HistoryItemType.PAYLOADS_EXECUTED ||
    type === HistoryItemType.PAYLOADS_EXPIRED
  ) {
    return `${proposalId}_${type}_${id}_${chainId}`;
  } else {
    return `${proposalId}_${type}`;
  }
}
