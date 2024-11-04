import { Popover } from '@headlessui/react';
import { Box, useTheme } from '@mui/system';
import React from 'react';

import InfoIcon from '/public/images/icons/info.svg';

import { IconBox } from '../../ui/primitives/IconBox';

interface BlockTitleWithTooltipProps {
  title: string;
  description: string;
  isPopoverVisible?: boolean;
  onClick?: () => void;
  isClicked?: boolean;
  isRed?: boolean;
}

export function BlockTitleWithTooltip({
  title,
  description,
  isPopoverVisible = true,
  onClick,
  isClicked,
  isRed,
}: BlockTitleWithTooltipProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}>
      <Box
        component="h2"
        sx={{
          typography: 'h2',
          textAlign: 'center',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        {title}
      </Box>

      {isPopoverVisible && (
        <Popover as={Box} sx={{ position: 'relative' }}>
          <Popover.Button
            onClick={onClick}
            as={Box}
            sx={{
              ml: 4,
              transition: 'all 0.2s ease',
              lineHeight: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 23,
              cursor: 'pointer',
              '> *': {
                lineHeight: 0,
              },
              hover: { opacity: 0.6 },
            }}>
            <IconBox
              sx={{
                position: 'relative',
                width: 14,
                height: 14,
                [theme.breakpoints.up('lg')]: {
                  top: 2,
                },
                '> svg': {
                  width: 14,
                  height: 14,
                  path: {
                    fill: isClicked
                      ? theme.palette.$text
                      : isRed
                        ? theme.palette.$error
                        : theme.palette.$text,
                  },
                },
              }}>
              <InfoIcon />
            </IconBox>
          </Popover.Button>

          <Popover.Panel
            as={Box}
            sx={{
              position: 'absolute',
              zIndex: 3,
              top: '100%',
              left: -100,
              width: 250,
              backgroundColor: '$light',
              p: 8,
            }}>
            <Box sx={{ typography: 'descriptor' }}>{description}</Box>
          </Popover.Panel>
        </Popover>
      )}
    </Box>
  );
}
