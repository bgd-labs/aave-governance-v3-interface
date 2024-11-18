import { useTheme } from '@mui/system';
import ReactPaginate from 'react-paginate';

import { texts } from '../helpers/texts/texts';
import { BoxWith3D } from './BoxWith3D';

export interface PaginationProps {
  pageCount: number;
  onPageChange: (value: number) => void;
  forcePage?: number;
  withoutQuery?: boolean;
  borderSize?: number;
  isSmall?: boolean;
}

export function Pagination({
  pageCount,
  onPageChange,
  forcePage,
  borderSize = 10,
  isSmall,
}: PaginationProps) {
  const theme = useTheme();

  if (pageCount <= 1) return null;

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
        '.pagination': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        },
        '.arrow': {
          display: 'inline-flex',
          flex: 1,
          a: {
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
          '&.disabled': {
            a: {
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
          '&.arrow-next': {
            a: {
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
          '&.arrow-prev': {
            a: {
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
        },
        '.page-item': {
          a: {
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
          '&.active': {
            a: {
              cursor: 'default',
              color: '$text',
              '&:after': {
                backgroundColor: '$text',
                width: '100%',
              },
            },
          },
          hover: {
            a: {
              color: theme.palette.$text,
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
      <ReactPaginate
        onPageChange={(selectedItem) => {
          onPageChange(selectedItem.selected);
        }}
        pageCount={pageCount}
        pageRangeDisplayed={2}
        marginPagesDisplayed={1}
        nextLabel=""
        previousLabel=""
        pageClassName="page-item"
        previousClassName="arrow arrow-prev"
        nextClassName="arrow arrow-next"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        forcePage={forcePage}
        renderOnZeroPageCount={() => null}
        pageLabelBuilder={(page) => <span>{page}</span>}
      />
    </BoxWith3D>
  );
}
