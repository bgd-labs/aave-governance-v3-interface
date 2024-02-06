import { ProposalMetadata } from '@bgd-labs/aave-governance-ui-helpers';
import { Box } from '@mui/system';
import React, { useEffect } from 'react';
import { Hex } from 'viem';

import { useStore } from '../../../store';
import { BoxWith3D, NoSSR, SmallButton } from '../../../ui';
import { CopyAndExternalIconsSet } from '../../../ui/components/CopyAndExternalIconsSet';
import { CustomSkeleton } from '../../../ui/components/CustomSkeleton';
import { MarkdownContainer } from '../../../ui/components/MarkdownContainer';
import { texts } from '../../../ui/utils/texts';
import { getScanLink } from '../../../utils/getScanLink';
import { ENSDataExists } from '../../../web3/store/ensSelectors';
import { ENSProperty } from '../../../web3/store/ensSlice';

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
  const store = useStore();
  const { ensData, fetchEnsNameByAddress } = store;

  useEffect(() => {
    if (
      proposalCreator &&
      !ENSDataExists(store, proposalCreator as Hex, ENSProperty.NAME)
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

        <CustomSkeleton count={20} height={19} />
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
      <Box
        sx={(theme) => ({
          mb: 18,
          [theme.breakpoints.up('lg')]: {
            mb: 24,
          },
        })}>
        <Box component="p" sx={{ typography: 'h2', mb: 12 }}>
          {texts.proposals.author}
        </Box>
        <Box component="p">{ipfs?.author}</Box>
      </Box>

      {proposalCreator && (
        <Box
          sx={(theme) => ({
            mb: 18,
            [theme.breakpoints.up('lg')]: {
              mb: 24,
            },
          })}>
          <Box component="p" sx={{ typography: 'headline', mb: 12 }}>
            {texts.proposals.creator}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box component="p">
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
