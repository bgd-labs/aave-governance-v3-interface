import { Box } from '@mui/system';
import React, { useEffect } from 'react';
import { Hex } from 'viem';

import { getScanLink } from '../../helpers/getScanLink';
import { texts } from '../../helpers/texts/texts';
import { useStore } from '../../providers/ZustandStoreProvider';
import { ENSDataExists } from '../../store/selectors/ensSelectors';
import { ENSProperty, ProposalMetadata } from '../../types';
import { BoxWith3D } from '../BoxWith3D';
import { CopyAndExternalIconsSet } from '../CopyAndExternalIconsSet';
import { MarkdownContainer } from '../MarkdownContainer';
import { CustomSkeleton } from '../primitives/CustomSkeleton';
import NoSSR from '../primitives/NoSSR';
import { SmallButton } from '../SmallButton';

interface DetailsProps {
  proposalCreator?: string;
  ipfs?: ProposalMetadata;
  ipfsError?: string;
  onClick?: () => void;
}

export function Details({
  proposalCreator,
  ipfs,
  ipfsError,
  onClick,
}: DetailsProps) {
  const ensData = useStore((store) => store.ensData);
  const fetchEnsNameByAddress = useStore(
    (store) => store.fetchEnsNameByAddress,
  );

  useEffect(() => {
    if (
      proposalCreator &&
      !ENSDataExists(ensData, proposalCreator as Hex, ENSProperty.NAME)
    ) {
      fetchEnsNameByAddress(proposalCreator as Hex);
    }
  }, [proposalCreator, ensData]);

  if (!ipfs && !ipfsError)
    return (
      <>
        <Box
          sx={(theme) => ({
            mb: 18,
            [theme.breakpoints.up('lg')]: {
              mb: 24,
            },
          })}>
          <Box sx={{ mb: 8 }}>
            <CustomSkeleton width={100} height={16} />
          </Box>
          <CustomSkeleton height={16} />
        </Box>

        {[...Array(Number(20)).keys()].map((i) => {
          return (
            <Box sx={{ mb: 4 }} key={i}>
              <CustomSkeleton height={19} />
            </Box>
          );
        })}
      </>
    );

  if (!ipfs && ipfsError)
    return (
      <Box>
        <BoxWith3D
          className="ProposalDetails__error"
          wrapperCss={{ my: 12 }}
          borderSize={10}
          contentColor="$mainAgainst"
          css={{ p: '14px 18px' }}>
          <Box
            component="p"
            sx={{
              typography: 'descriptor',
              color: '$light',
              textAlign: 'center',
            }}>
            {ipfsError}
          </Box>
        </BoxWith3D>

        {!!onClick && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
              mt: 18,
            }}>
            <SmallButton onClick={onClick}>Re-request</SmallButton>
          </Box>
        )}
      </Box>
    );

  return (
    <>
      <Box sx={{ mb: '1.5em' }}>
        <Box component="p" sx={{ typography: 'h2', mb: '4px' }}>
          {texts.proposals.author}
        </Box>
        <Box component="p">{ipfs?.author}</Box>
      </Box>

      {proposalCreator && (
        <Box sx={{ mb: '1.5em' }}>
          <Box component="p" sx={{ typography: 'h2', mb: '4px' }}>
            {texts.proposals.creator}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box component="p" sx={{ wordBreak: 'break-word' }}>
              {(ensData[proposalCreator.toLocaleLowerCase() as Hex]
                ?.name as Hex) || proposalCreator}
            </Box>
            <NoSSR>
              <CopyAndExternalIconsSet
                iconSize={14}
                externalLink={getScanLink({
                  address: proposalCreator,
                })}
                copyText={proposalCreator}
                sx={{ '.CopyAndExternalIconsSet__copy': { mx: 4 } }}
              />
            </NoSSR>
          </Box>
        </Box>
      )}

      <MarkdownContainer
        markdown={ipfs?.description || ''}
        replaceImgSrc="https://raw.githubusercontent.com/aave/aip/main/content/"
      />
    </>
  );
}
