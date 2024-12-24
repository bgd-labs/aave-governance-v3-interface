import { Address, Hex } from 'viem';

import { PayloadFromServer } from '../../types';

export function formatPayloadFromServer(payload: PayloadFromServer) {
  return {
    id: BigInt(payload?.payloadId ?? 0),
    chain: BigInt(payload?.chainId ?? 1),
    payloadsController: payload.payloadsController as Address,
    data: {
      ...payload,
      creator: payload.creator as Address,
      payloadsController: payload.payloadsController as Address,
      expirationTime: payload.expirationTime ?? 0,
      maximumAccessLevelRequired: payload.maximumAccessLevelRequired ?? 1,
      executedAt: payload.executedAt ?? 0,
      cancelledAt: payload.cancelledAt ?? 0,
      queuedAt: payload.queuedAt ?? 0,
      actions: payload.actions.map((action) => {
        return {
          ...action,
          target: action.target as Address,
          callData: action.callData as Hex,
          value: BigInt(action?.value ?? 0),
        };
      }),
    },
  };
}
