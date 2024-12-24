import bs58 from 'bs58';
import matter from 'gray-matter';

import { ipfsGateway } from '../configs/configs';

export function baseToCidv0(hash: string) {
  return bs58.encode(Buffer.from(`1220${hash.slice(2)}`, 'hex'));
}

export function getLink(hash: string, gateway: string): string {
  return `${gateway}/${hash}`;
}

export async function getProposalMetadata(
  hash: string,
  gateway: string = ipfsGateway,
) {
  const ipfsHash = hash.startsWith('0x') ? baseToCidv0(hash) : hash;
  const ipfsPath = getLink(ipfsHash, gateway);
  const ipfsResponse = await fetch(ipfsPath);
  if (!ipfsResponse.ok) throw Error(`IPFS: error fetching ${ipfsPath}`);
  const clone = ipfsResponse.clone();
  try {
    const response = await ipfsResponse.json();
    const { content, data } = matter(response.description);
    return {
      ...response,
      ipfsHash,
      description: String(JSON.parse(JSON.stringify(content))),
      ...data,
    };
  } catch (e) {
    console.error(e);
    const { content, data } = matter(await clone.text());
    return {
      ...ipfsResponse,
      ipfsHash,
      description: String(JSON.parse(JSON.stringify(content))),
      ...(data as { title: string; discussions: string; author: string }),
    };
  }
}
