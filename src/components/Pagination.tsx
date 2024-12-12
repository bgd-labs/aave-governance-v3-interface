import { Box, useTheme } from '@mui/system';
import InitialPagination from 'rc-pagination';
import React, { useState } from 'react';

import { PAGE_SIZE } from '../configs/configs';
import { texts } from '../helpers/texts/texts';
import { BoxWith3D } from './BoxWith3D';
import { Link } from './Link';

export interface PaginationProps {
  totalItems: number;
  forcePage?: number;
  withoutQuery?: boolean;
  borderSize?: number;
  isSmall?: boolean;
  setCurrentPageState?: (page: number) => void;
  filtering?: boolean;
}

export function Pagination({
  totalItems,
  forcePage,
  borderSize = 10,
  isSmall,
  setCurrentPageState,
  filtering,
}: PaginationProps) {
  const theme = useTheme();

  const [currentPage, setCurrentPage] = useState<number>(1 + (forcePage ?? 0));

  if (totalItems <= PAGE_SIZE) return null;

  return (
    <BoxWith3D
      className="Pagination"
      borderSize={borderSize}
      contentColor="$mainLight"
      wrapperCss={{
        margin: '32px auto 0',
        [theme.breakpoints.up('md')]: {
          maxWidth: '80%',
        },
      }}
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pb: 5,
        pt: 10,
        [theme.breakpoints.up('sm')]: {
          pb: isSmall ? 8 : 10,
          pt: isSmall ? 15 : 20,
        },
        '.rc-pagination': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        },
        '.rc-pagination-prev, .rc-pagination-next': {
          display: 'inline-flex',
          flex: 1,
          'a, .Pagination_item': {
            width: '100%',
            cursor: 'pointer',
            position: 'relative',
            height: 29,
            display: 'inline-flex',
            alignItems: 'center',
            bottom: 3,
            [theme.breakpoints.up('sm')]: {
              bottom: 5,
            },
            '&:before': {
              transition: 'all 0.2s ease',
              typography: 'buttonMedium',
              color: '$text',
              display: 'none',
              [theme.breakpoints.up('sm')]: {
                display: 'inline',
                typography: 'buttonMedium',
              },
              [theme.breakpoints.up('lg')]: {
                typography: 'buttonMedium',
              },
            },
            '&:after': {
              content: `''`,
              border: `1px solid ${theme.palette.$text}`,
              borderWidth: '0 2px 2px 0',
              display: 'inline-block',
              padding: '4px',
              transition: 'all 0.2s ease',
            },
            hover: {
              '&:before': {
                color:
                  theme.palette.mode === 'dark'
                    ? theme.palette.$textSecondary
                    : theme.palette.$buttonDisabled,
              },
              '&:after': {
                border: `1px solid ${
                  theme.palette.mode === 'dark'
                    ? theme.palette.$textSecondary
                    : theme.palette.$buttonDisabled
                }`,
                borderWidth: '0 2px 2px 0',
              },
            },
            '&:active': {
              '&:before': {
                color: '$textDisabled',
              },
              '&:after': {
                border: `1px solid ${theme.palette.$textDisabled}`,
                borderWidth: '0 2px 2px 0',
              },
            },
          },
        },
        '.rc-pagination-disabled': {
          'a, .Pagination_item': {
            cursor: 'not-allowed',
            '&:before': {
              color: '$textDisabled',
            },
            '&:after': {
              border: `1px solid ${theme.palette.$textDisabled}`,
              borderWidth: '0 2px 2px 0',
            },
          },
        },
        '.rc-pagination-next': {
          'a, .Pagination_item': {
            justifyContent: 'flex-end',
            ml: 8,
            mr: 15,
            [theme.breakpoints.up('lg')]: {
              mr: 25,
            },
            '&:before': {
              content: `'${texts.other.paginationNext}'`,
              mr: 5,
            },
            '&:after': {
              transform: 'rotate(-45deg)',
            },
          },
        },
        '.rc-pagination-prev': {
          'a, .Pagination_item': {
            flexDirection: 'row-reverse',
            justifyContent: 'flex-end',
            mr: 8,
            ml: 15,
            [theme.breakpoints.up('lg')]: {
              ml: 25,
            },
            '&:before': {
              content: `'${texts.other.paginationPrevious}'`,
              ml: 5,
            },
            '&:after': {
              transform: 'rotate(135deg)',
            },
          },
        },
        '.rc-pagination-item, .rc-pagination-jump-prev, .rc-pagination-jump-next':
          {
            'a, .Pagination_item': {
              color: '$textDisabled',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              width: 37,
              height: 29,
              pt: 5,
              fontSize: 11,
              lineHeight: 1,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              [theme.breakpoints.up('sm')]: {
                width: isSmall ? 48 : 75,
              },
              [theme.breakpoints.up('lg')]: {
                width: isSmall ? 54 : 92,
              },
              span: {
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 20,
                p: '4.5px 6px',
                borderRadius: '50%',
                fontSize: 11,
                lineHeight: 1,
                color: '$textDisabled',
              },
              '&:after, &:before': {
                content: `''`,
                width: '100%',
                height: 2,
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: '$textDisabled',
                transition: 'all 0.2s ease',
              },
              '&:after': {
                width: 0,
              },
            },
            '&-active': {
              'a, .Pagination_item': {
                cursor: 'default',
                color: '$text',
                '&:after': {
                  backgroundColor: '$text',
                  width: '100%',
                },
              },
            },
            hover: {
              'a, .Pagination_item': {
                color: theme.palette.$text,
                span: {
                  color: theme.palette.$text,
                },
                '&:after': {
                  backgroundColor: theme.palette.$text,
                  width: '100%',
                },
              },
            },
            '&:active': {
              a: {
                span: {
                  backgroundColor: '$light',
                },
              },
            },
          },
      }}>
      <InitialPagination
        current={currentPage}
        hideOnSinglePage
        total={totalItems}
        pageSize={PAGE_SIZE}
        onChange={(page) => setCurrentPage(page)}
        showLessItems
        locale={{
          items_per_page: '/ page',
          jump_to: 'Go to',
          jump_to_confirm: 'confirm',
          page: 'Page',
          prev_page: 'Previous Page',
          next_page: 'Next Page',
          prev_5: 'Previous 5 Pages',
          next_5: 'Next 5 Pages',
          prev_3: 'Previous 3 Pages',
          next_3: 'Next 3 Pages',
          page_size: 'Page Size',
        }}
        itemRender={(current, type) => {
          if (type === 'page') {
            return setCurrentPageState && filtering ? (
              <Box
                className="Pagination_item"
                onClick={() => setCurrentPageState(current)}>
                <span>{current}</span>
              </Box>
            ) : (
              <Link href={`/${current}/`} scroll>
                <span>{current}</span>
              </Link>
            );
          }
          if (type === 'prev') {
            return setCurrentPageState && filtering ? (
              <Box
                className="Pagination_item"
                onClick={() => setCurrentPageState(current)}
              />
            ) : (
              <Link href={`/${current}/`} scroll />
            );
          }
          if (type === 'next') {
            return setCurrentPageState && filtering ? (
              <Box
                className="Pagination_item"
                onClick={() => setCurrentPageState(current)}
              />
            ) : (
              <Link href={`/${current}/`} scroll />
            );
          }
          if (type === 'jump-prev') {
            return setCurrentPageState && filtering ? (
              <Box
                className="Pagination_item"
                onClick={() => setCurrentPageState(current)}>
                <span>...</span>
              </Box>
            ) : (
              <Link href={`/${current}/`} scroll>
                <span>...</span>
              </Link>
            );
          }
          if (type === 'jump-next') {
            return setCurrentPageState && filtering ? (
              <Box
                className="Pagination_item"
                onClick={() => setCurrentPageState(current)}>
                <span>...</span>
              </Box>
            ) : (
              <Link href={`/${current}/`} scroll>
                <span>...</span>
              </Link>
            );
          }
        }}
      />
    </BoxWith3D>
  );
}
