'use client';

import { Box, useTheme } from '@mui/system';
import React from 'react';

import NoDataListImage from '../../assets/noDataList.svg';
import NoDataListDarkImage from '../../assets/noDataListDark.svg';
import NotFoundGhostImage from '../../assets/notFoundGhost.svg';
import { BoxWith3D } from '../BoxWith3D';
import { IconBox } from '../primitives/IconBox';

export function NoData() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      <BoxWith3D
        className="NoDataWrapper"
        borderSize={10}
        contentColor="$mainLight"
        wrapperCss={{
          width: '100%',
          mb: 24,
          position: 'relative',
          pb: 40,
        }}
        css={{
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          p: 30,
        }}>
        <IconBox
          className="ProposalList__noData__image"
          sx={{
            width: '100%',
            height: '100vh',
            maxHeight: 100,
            '> svg': {
              width: '100%',
              height: '100vh',
              maxHeight: 100,
            },
          }}>
          {theme.palette.mode === 'dark' ? (
            <NoDataListDarkImage />
          ) : (
            <NoDataListImage />
          )}
        </IconBox>
        <IconBox
          sx={(theme) => ({
            width: 50,
            maxHeight: 90,
            '> svg': {
              width: 50,
              maxHeight: 90,
              [theme.breakpoints.up('sm')]: {
                width: 65,
                maxHeight: 120,
              },
              [theme.breakpoints.up('lg')]: {
                width: 73,
                maxHeight: 137,
              },
            },
            position: 'absolute',
            bottom: -35,
            right: '25%',
            [theme.breakpoints.up('sm')]: {
              width: 65,
              maxHeight: 120,
              bottom: -60,
            },
            [theme.breakpoints.up('lg')]: {
              width: 73,
              maxHeight: 137,
              bottom: -80,
              right: '30%',
            },
          })}>
          <NotFoundGhostImage />
        </IconBox>
      </BoxWith3D>
    </Box>
  );
}
