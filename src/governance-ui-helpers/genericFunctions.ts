import { BigNumber } from 'bignumber.js';
import bs58 from 'bs58';
import matter from 'gray-matter';

import { blockLimit, zeroHash } from './constants';
import {
  AssetsBalanceSlots,
  BigNumberValue,
  ProposalMetadata,
} from './types';

export function baseToCidv0(hash: string) {
  return bs58.encode(Buffer.from(`1220${hash.slice(2)}`, 'hex'));
}
export function getLink(hash: string, gateway: string): string {
  return `${gateway}/${hash}`;
}

export async function getProposalMetadataBase({
  ipfsHash,
  ipfsResponse,
}: {
  ipfsHash: string;
  ipfsResponse: Response;
}) {
  const clone = ipfsResponse.clone();

  try {
    const response = await ipfsResponse.json();
    const { content, data } = matter(response.description);
    return {
      title: data.title ?? response.title ?? '',
      author: data.author ?? response.author ?? '',
      discussions: data.discussions ?? response.discussions ?? '',
      snapshot: data.snapshot ?? response.snapshot,
      ipfsHash,
      description: content,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    const parsed = matter(await clone.text());
    const fm = parsed.data as Record<string, string>;
    return {
      title: fm.title ?? '',
      author: fm.author ?? '',
      discussions: fm.discussions ?? '',
      snapshot: fm.snapshot,
      ipfsHash,
      description: parsed.content,
    };
  }
}

export async function getProposalMetadataInit(
  hash: string,
  gateway: string = 'https://cloudflare-ipfs.com/ipfs',
  fallbackGateways?: string[],
): Promise<Omit<ProposalMetadata, 'originalIpfsHash'> | undefined> {
  const ipfsHash = hash.startsWith('0x') ? baseToCidv0(hash) : hash;
  const ipfsPath = getLink(ipfsHash, gateway);
  let isRequestSuccess = false;

  try {
    const ipfsResponse = await fetch(ipfsPath);
    if (!ipfsResponse.ok) {
      console.error(`IPFS: error fetching ${ipfsPath}`);
      throw new Error(`IPFS: error fetching ${ipfsPath}`);
    } else {
      isRequestSuccess = true;
      return await getProposalMetadataBase({ ipfsHash, ipfsResponse });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    if (fallbackGateways?.length) {
      for (let i = 0; i < fallbackGateways.length && !isRequestSuccess; i++) {
        const gatewayInside = fallbackGateways[i];
        const ipfsInsidePath = getLink(ipfsHash, gatewayInside);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        try {
          const ipfsResponseInside = await fetch(ipfsInsidePath);
          if (!ipfsResponseInside.ok) {
            console.error(`IPFS: error fetching ${ipfsInsidePath}`);
            throw new Error(`IPFS: error fetching ${ipfsInsidePath}`);
          } else {
            isRequestSuccess = true;
            return await getProposalMetadataBase({
              ipfsHash,
              ipfsResponse: ipfsResponseInside,
            });
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          console.error(`IPFS: error fetching ${ipfsPath}`);
        }
      }
    }
  }
}

export async function getProposalMetadata({
  hash,
  gateway,
  setIpfsError,
  errorText,
  fallbackGateways = ['https://dweb.link/ipfs', 'https://ipfs.io/ipfs'],
}: {
  hash: string;
  gateway?: string;
  setIpfsError?: (hash: string, text?: string) => void;
  errorText?: string;
  fallbackGateways?: string[];
}): Promise<ProposalMetadata | undefined> {
  const incorectedHashses = [
    '0x0000000000000000000000000000000000000000000000000000000000000020',
    zeroHash,
  ];

  if (incorectedHashses.some((h) => hash === h)) {
    if (setIpfsError) {
      setIpfsError(hash, errorText);
    } else {
      console.error('Fetch metadata from ipfs error:', 'incorrect ipfs hash');
      throw Error('Fetch metadata from ipfs error');
    }
  } else {
    try {
      const metadata = await getProposalMetadataInit(
        hash,
        gateway,
        fallbackGateways,
      );

      return metadata
        ? {
            ...metadata,
            originalIpfsHash: hash,
          }
        : undefined;
    } catch (e) {
      if (setIpfsError) {
        setIpfsError(hash);
      } else {
        console.error('Fetch metadata from ipfs error:', e);
        throw Error('Fetch metadata from ipfs error');
      }
    }
  }
}

export function getVoteBalanceSlot(
  underlyingAsset: string,
  isWithDelegatedPower: boolean,
  aAaveAddress: string,
  slots: AssetsBalanceSlots,
) {
  return underlyingAsset.toLowerCase() === aAaveAddress.toLowerCase() &&
    isWithDelegatedPower
    ? slots[underlyingAsset.toLowerCase()].delegation || 64
    : slots[underlyingAsset.toLowerCase()].balance || 0;
}

export async function fetchWithTimeout(resource: string, timeout?: number) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout || 10000);
  const response = await fetch(resource, {
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
}

// events helpers
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
    eventsCountArray.map(async (count) => {
      const startBlockNumber = startBlock + blockLimit * count;
      const endBlockNumber = startBlock + (blockLimit * count + blockLimit);

      return await callbackFunc(
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

// universal
export function checkHash(hash: string) {
  return {
    notZero: hash !== zeroHash,
    zero: hash === zeroHash,
  };
}

export function valueToBigNumber(amount: BigNumberValue): BigNumber {
  if (amount instanceof BigNumber) {
    return amount;
  }

  return new BigNumber(amount);
}

export function normalize(n: BigNumberValue, decimals: number): string {
  return normalizeBN(n, decimals).toString(10);
}

export function normalizeBN(n: BigNumberValue, decimals: number): BigNumber {
  return valueToBigNumber(n).shiftedBy(decimals * -1);
}
