import bs58 from 'bs58';
import matter from 'gray-matter';
import { zeroHash } from 'viem';

import { fallbackGateways, ipfsGateway } from '../../configs/configs';
import { texts } from '../../helpers/texts/texts';

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
      ...response,
      ipfsHash,
      description: content,
      ...data,
    };
  } catch (e) {
    const data = matter(await clone.text());
    return {
      ...ipfsResponse,
      ipfsHash,
      description: data.content,
      ...(data.data as {
        title: string;
        discussions: string;
        author: string;
      }),
    };
  }
}

export async function getProposalMetadataInit(
  hash: string,
  gateway: string = 'https://cloudflare-ipfs.com/ipfs',
  fallbackGateways?: string[],
) {
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
        } catch (e) {
          console.error(`IPFS: error fetching ${ipfsPath}`);
        }
      }
    }
  }
}

export async function getProposalMetadataReady({
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
}) {
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

export async function getProposalMetadata({
  hash,
  setIpfsError,
}: {
  hash: string;
  setIpfsError?: (ipfsHash: string, text?: string, remove?: boolean) => void;
}) {
  // TODO: without cache for now
  // try {
  //   const request = await fetch(`${githubStartUrl}${cachedIPFSDataPath(hash)}`);
  //   if (request.ok) {
  //     const response = await request.json();
  //     const { content, data } = matter(response.description);
  //     return {
  //       ...response,
  //       ipfsHash: hash,
  //       description: content,
  //       ...data,
  //     };
  //   } else {
  //     console.error(
  //       "Can't fetch cached ipfs data. Try to fetch from IPFS gateway",
  //     );
  //     return await getProposalMetadataReady({
  //       hash,
  //       gateway: ipfsGateway,
  //       setIpfsError,
  //       errorText: texts.other.fetchFromIpfsError,
  //       fallbackGateways,
  //     });
  //   }
  // } catch (e) {
  //   console.error(
  //     'An error occurred while fetching proposal metadata from IPFS, trying to request one more time.',
  //   );
  //   return await getProposalMetadataReady({
  //     hash,
  //     gateway: ipfsGateway,
  //     setIpfsError,
  //     errorText: texts.other.fetchFromIpfsError,
  //     fallbackGateways,
  //   });
  // }

  return await getProposalMetadataReady({
    hash,
    gateway: ipfsGateway,
    setIpfsError,
    errorText: texts.other.fetchFromIpfsError,
    fallbackGateways,
  });
}
