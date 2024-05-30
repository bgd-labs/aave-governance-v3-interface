import {
  getProposalMetadata as baseGetProposalMetadata,
  ProposalMetadata,
} from '@bgd-labs/aave-governance-ui-helpers';
import matter from 'gray-matter';

import { texts } from '../ui/utils/texts';
import { cachedIPFSDataPath, githubStartUrl } from './cacheGithubLinks';
import { fallbackGateways, ipfsGateway } from './configs';

export async function getProposalMetadata({
  hash,
  setIpfsError,
}: {
  hash: string;
  setIpfsError?: (ipfsHash: string, text?: string, remove?: boolean) => void;
}): Promise<ProposalMetadata | undefined> {
  try {
    const request = await fetch(`${githubStartUrl}${cachedIPFSDataPath(hash)}`);
    if (request.ok) {
      const response = await request.json();
      const { content, data } = matter(response.description);
      return {
        ...response,
        ipfsHash: hash,
        description: content,
        ...data,
      };
    } else {
      return await baseGetProposalMetadata({
        hash,
        gateway: ipfsGateway,
        setIpfsError,
        errorText: texts.other.fetchFromIpfsError,
        fallbackGateways,
      });
    }
  } catch (e) {
    console.error("Can't fetch cached ipfs data. Try to fetch from IPFS");
    return await baseGetProposalMetadata({
      hash,
      gateway: ipfsGateway,
      setIpfsError,
      errorText: texts.other.fetchFromIpfsError,
      fallbackGateways,
    });
  }
}
