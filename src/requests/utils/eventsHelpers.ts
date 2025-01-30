import { Address, Client } from 'viem';

export type InitEvent = {
  contractAddress: Address;
  client: Client;
  startBlock: number;
  endBlock: number;
};

export type InitEventWithChainId = InitEvent & {
  chainId: number;
};

// block limit for getting events for mostly all public RPC's = 1024 blocks
export const blockLimit = 1023;

export function getBlocksForEvents(
  currentBlock: number,
  startBlockNumber: number,
  endBlockNumber: number | undefined,
  lastBlockNumber: number | undefined,
): { startBlock: number; endBlock: number } {
  const endBlock =
    endBlockNumber && endBlockNumber > 0 && endBlockNumber < currentBlock
      ? endBlockNumber
      : currentBlock;

  const startBlock =
    !!lastBlockNumber &&
    isFinite(lastBlockNumber) &&
    lastBlockNumber > startBlockNumber &&
    lastBlockNumber < currentBlock &&
    lastBlockNumber < endBlock
      ? lastBlockNumber
      : startBlockNumber < currentBlock
        ? startBlockNumber
        : currentBlock - blockLimit;

  return { startBlock, endBlock };
}

export async function getEventsBySteps<T>(
  startBlock: number,
  endBlock: number,
  blockLimit: number,
  callbackFunc: (startBlock: number, endBlock: number) => Promise<T>,
  defaultValue: T,
) {
  const blockSteps = Math.ceil((endBlock - startBlock) / blockLimit);

  const eventsCountArray = new Array(blockSteps);
  for (let i = 0; i < blockSteps; i++) {
    eventsCountArray[i] = i;
  }

  const results = await Promise.allSettled(
    eventsCountArray.map((count) => {
      const startBlockNumber = startBlock + blockLimit * count;
      const endBlockNumber = startBlock + (blockLimit * count + blockLimit);

      return callbackFunc(
        startBlockNumber,
        endBlock > endBlockNumber ? endBlockNumber : endBlock,
      );
    }),
  );

  const formattedResults = results.map((item) =>
    item.status === 'fulfilled' ? item.value : defaultValue,
  );

  return formattedResults.flat();
}
