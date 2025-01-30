import { isForIPFS } from '../configs/appConfig';
import { getProposalMetadata } from './getProposalMetadata';
import { metaTexts } from './texts/metaTexts';

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
      let ipfsTitle = '';
      try {
        ipfsTitle = (await getProposalMetadata(ipfsHash)).title;
      } catch (e) {
        console.error('Error getting proposal metadata', e);
      }
      return {
        title: `${metaTexts.main}${metaTexts.proposalId(id)}`,
        description: ipfsTitle || '',
        openGraph: {
          images: ['/metaLogo.jpg'],
          title: `${metaTexts.main}${metaTexts.proposalId(id)}`,
          description: ipfsTitle || '',
        },
      };
    }
  }
}
