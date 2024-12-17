import { Box, styled, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';

import SearchIcon from '../../assets/icons/searchIcon.svg';
import { texts } from '../../helpers/texts/texts';
import { useStore } from '../../providers/ZustandStoreProvider';
import { BoxWith3D } from '../BoxWith3D';
import { InputWrapper } from '../InputWrapper';
import { IconBox } from '../primitives/IconBox';

export const Input = styled('input')(({ theme }) => ({
  width: '100%',
  fontWeight: '400',
  fontSize: 11,
  lineHeight: '14px',
  color: theme.palette.$text,
  transition: 'all 0.3s ease',
  border: 'none',
  height: 36,
  background: 'transparent',
  paddingRight: 35,
  [theme.breakpoints.up('xsm')]: {
    fontSize: 12,
    lineHeight: '15px',
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: 13,
    lineHeight: '16px',
    height: 42,
  },
  '&::placeholder': {
    color: theme.palette.$textDisabled,
  },
}));

interface SearchButtonProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  searchValue: string | null;
  setSearchValue: (value: string) => void;
  disabled?: boolean;
}

export function SearchButton({
  isOpen,
  setIsOpen,
  searchValue,
  setSearchValue,
  disabled,
}: SearchButtonProps) {
  const router = useRouter();
  const theme = useTheme();
  const setTitleFilter = useStore((store) => store.setTitleFilter);

  const [isHovered, setIsHovered] = useState(false);

  const ref = useRef<HTMLInputElement>(null);
  const refMobile = useRef<HTMLInputElement>(null);

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 12,
        [theme.breakpoints.up('md')]: { width: 'unset', mb: 0 },
      }}>
      <Box
        component="h2"
        sx={{
          typography: 'h1',
          display: 'block',
          pl: 6,
          [theme.breakpoints.up('sm')]: { typography: 'h1', pl: 8 },
          [theme.breakpoints.up('md')]: { typography: 'h1', display: 'none' },
        }}>
        {texts.proposals.proposalListTitle}
      </Box>

      <Box
        onMouseOver={() => !isOpen && !disabled && setIsHovered(true)}
        onMouseOut={() => !disabled && setIsHovered(false)}
        onClick={() => {
          if (!isOpen && !disabled) {
            ref.current?.focus();
            refMobile.current?.focus();
          }
          if (!disabled) {
            setIsOpen(!isOpen);
            setIsHovered(false);
          }
        }}>
        <BoxWith3D
          withActions={isHovered}
          borderSize={isOpen ? 4 : 10}
          disableActiveState
          disabled={disabled}
          contentColor="$mainLight"
          bottomBorderColor="$light"
          wrapperCss={{
            cursor: disabled ? 'not-allowed' : 'pointer',
            display: 'none',
            hover: {
              '.BoxWith3D__content': {
                backgroundColor: isOpen
                  ? theme.palette.$mainLight
                  : theme.palette.$light,
              },
            },
            [theme.breakpoints.up('sm')]: { display: 'block' },
          }}
          css={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'width 0.3s ease',
            height: isOpen ? 36 : 32,
            width: isOpen ? 240 : 32,
            [theme.breakpoints.up('lg')]: {
              height: isOpen ? 42 : 36,
              width: isOpen ? 280 : 36,
            },
          }}>
          <IconBox
            sx={{
              width: 17,
              height: 17,
              '> svg': {
                width: 17,
                height: 17,
                [theme.breakpoints.up('lg')]: {
                  width: 19,
                  height: 19,
                },
              },
              mx: 7.5,
              path: { stroke: theme.palette.$text },
              [theme.breakpoints.up('lg')]: {
                width: 19,
                height: 19,
              },
            }}>
            <SearchIcon />
          </IconBox>
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              width: isOpen ? 'calc(100% - 34px)' : '0',
              overflow: 'hidden',
              [theme.breakpoints.up('md')]: {
                width: isOpen ? 'calc(100% - 36px)' : '0',
              },
            }}>
            <InputWrapper
              onCrossClick={() => {
                setSearchValue('');
                setIsOpen(false);
                setTitleFilter(null, router, true, true);
              }}>
              <Input
                ref={ref}
                type="text"
                value={searchValue ?? ''}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={texts.proposals.searchPlaceholder}
              />
            </InputWrapper>
          </Box>
        </BoxWith3D>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'width 0.3s ease',
            height: 34,
            width: isOpen ? 240 : 34,
            border: `1px solid ${theme.palette.$mainBorder}`,
            [theme.breakpoints.up('sm')]: { display: 'none' },
          }}>
          <IconBox
            sx={{
              width: 17,
              height: 17,
              '> svg': {
                width: 17,
                height: 17,
                [theme.breakpoints.up('lg')]: {
                  width: 19,
                  height: 19,
                },
              },
              mx: 7.5,
              path: { stroke: theme.palette.$text },
              [theme.breakpoints.up('lg')]: {
                width: 19,
                height: 19,
              },
            }}>
            <SearchIcon />
          </IconBox>
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              width: isOpen ? 'calc(100% - 34px)' : '0',
              overflow: 'hidden',
            }}>
            <InputWrapper
              onCrossClick={() => {
                setSearchValue('');
                setIsOpen(false);
                setTitleFilter(null, router, true, true);
              }}>
              <Input
                ref={refMobile}
                type="text"
                value={searchValue ?? ''}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={texts.proposals.searchPlaceholder}
              />
            </InputWrapper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
