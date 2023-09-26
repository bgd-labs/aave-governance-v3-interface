import { Box, useTheme } from '@mui/system';
import Image from 'next/image';
import React from 'react';

// @ts-ignore
import gelatoIcon from '/public/images/icons/gelato.svg?url';

import { BackButton3D, BigButton, Divider } from '../../ui';
import { GelatoSwitcher } from '../../ui/components/GelatoSwitcher';
import { IconBox } from '../../ui/primitives/IconBox';
import { texts } from '../../ui/utils/texts';

interface VotingModesContentProps {
  onBackClick: (value: boolean) => void;
}

export function VotingModesContent({ onBackClick }: VotingModesContentProps) {
  const theme = useTheme();

  const Subtitle = ({ text }: { text: string }) => {
    return (
      <Box
        sx={{
          typography: 'h3',
          fontWeight: 600,
          mb: 14,
          [theme.breakpoints.up('sm')]: {
            typography: 'h3',
            mb: 16,
            fontWeight: 600,
          },
        }}>
        {text}
      </Box>
    );
  };

  const Text = ({ text }: { text: string }) => {
    return (
      <Box
        sx={{
          typography: 'body',
          mt: 12,
          mb: 20,
          [theme.breakpoints.up('sm')]: { typography: 'body', mb: 12, mt: 16 },
        }}>
        {text}
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ typography: 'h1' }}>{texts.proposals.votingModes}</Box>
      <Divider
        sx={{
          mb: 20,
          mt: 13,
          [theme.breakpoints.up('sm')]: { mb: 12, mt: 18 },
        }}
      />
      <Subtitle text={texts.proposals.gasLessVoteTitle} />
      <BigButton
        alwaysWithBorders
        withoutActions
        css={{ mb: 12, '.BigButton__children': { height: '100%' } }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}>
          <IconBox
            sx={{
              width: 8,
              height: 12,
              mr: 5,
              [theme.breakpoints.up('sm')]: {
                width: 11,
                height: 19,
              },
              '> img': {
                width: 8,
                height: 12,
                [theme.breakpoints.up('sm')]: {
                  width: 11,
                  height: 19,
                },
              },
            }}>
            <Image src={gelatoIcon} alt="gelatoIcon" />
          </IconBox>
          <Box
            sx={{
              height: '100%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {texts.proposals.vote}
          </Box>
        </Box>
      </BigButton>
      <GelatoSwitcher value disabled />
      <Text text={texts.proposals.gasLessVoteDescription} />
      <Subtitle text={texts.proposals.fallbackVoteTitle} />
      <BigButton alwaysWithBorders withoutActions css={{ mb: 12 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}>
          {texts.proposals.vote}
        </Box>
      </BigButton>
      <GelatoSwitcher value={false} disabled />
      <Text text={texts.proposals.fallbackVoteDescription} />

      <Box
        sx={{
          position: 'relative',
          mt: 35,
          [theme.breakpoints.up('sm')]: { mt: 30 },
        }}>
        <BackButton3D
          isSmall
          isVisibleOnMobile
          alwaysWithBorders
          alwaysVisible
          onClick={() => onBackClick(false)}
        />
      </Box>
    </Box>
  );
}
