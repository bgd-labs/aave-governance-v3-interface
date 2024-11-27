import { isForIPFS } from '../configs/appConfig';
import { getProposalMetadata } from '../requests/utils/getProposalMetadata';
import { metaTexts } from './texts/metaTexts';
import { texts } from './texts/texts';

export async function generateDetailsMetadata({
  params,
}: {
  params: { proposalId: string };
}) {
  const proposalId = params['proposalId']
    ? String(params['proposalId'])
    : undefined;
  if (isForIPFS) {
    return {
      title: metaTexts.ipfsTitle,
      description: metaTexts.ipfsDescription,
      openGraph: {
        images: ['/metaLogo.jpg'],
        title: metaTexts.ipfsTitle,
        description: metaTexts.ipfsDescription,
      },
    };
  } else {
    if (proposalId) {
      const id = proposalId.split('_')[0];
      const ipfsHash = proposalId.split('_')[1];
      try {
        const ipfsData = await getProposalMetadata({
          hash: ipfsHash,
        });
        return {
          title: `${metaTexts.main}${metaTexts.proposalId(id)}`,
          description: ipfsData?.title || '',
          openGraph: {
            images: ['/metaLogo.jpg'],
            title: `${metaTexts.main}${metaTexts.proposalId(id)}`,
            description: ipfsData?.title || '',
          },
        };
      } catch (e) {
        return {
          title: texts.other.fetchFromIpfsError,
          description: metaTexts.ipfsDescription,
          openGraph: {
            images: ['/metaLogo.jpg'],
            title: `${texts.other.fetchFromIpfsError}`,
            description: metaTexts.ipfsDescription,
          },
        };
      }
    }
  }
}
