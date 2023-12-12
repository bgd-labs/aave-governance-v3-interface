import { GlobalStyles as GS } from '@mui/system';
import React from 'react';

import { FONT, media } from './themeMUI';

export function GlobalStyles() {
  const defaultStyles = {
    '*': {
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      outline: 'none',
      '&:after, &:before': {
        boxSizing: 'border-box',
      },
    },

    html: {
      scrollBehavior: 'smooth',
    },

    body: {
      fontFamily: FONT,
      minWidth: 365,
      fontWeight: '400',
      fontSize: 14,
      lineHeight: '20px',
      [`@media only screen and (${media.lg})`]: {
        fontSize: 15,
        lineHeight: '24px',
      },
    },

    '#root': {
      background: 'inherit',
    },

    'h1, h2, h3, h4, h5, h6': {
      margin: 0,
      marginBlock: 0,
      fontSize: 'unset',
    },

    a: {
      transition: 'all 0.2s ease',
      textDecoration: 'none',
    },

    ul: {
      listStyleType: 'none',
    },

    'input, button': {
      fontFamily: FONT,
    },
    input: {
      width: '100%',
      borderRadius: 0,
      WebkitAppearance: 'none',
    },
    button: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      '&:disabled': {
        cursor: 'not-allowed',
      },
    },
    'wcm-modal': {
      position: 'relative',
      zIndex: 1001,
    },

    '#nprogress .bar': {
      height: '3px !important',
    },
    '#nprogress .peg': {
      boxShadow: 'none !important',
    },
    '#nprogress .spinner-icon': {
      width: '20px !important',
      height: '20px !important',
      display: 'none',
      [`@media only screen and (${media.md})`]: {
        display: 'block',
      },
    },
  };

  const stylesForSSR = {
    ':root': {
      body: {
        backgroundColor: '#FFFFFF',
        color: '#101423',
      },
      '.BoxWith3D': {
        '.BoxWith3D__left-shadow': {
          borderColor: '#101423',
        },
        '.BoxWith3D__bottom-shadow': {
          borderColor: '#101423',
        },
        '.BoxWith3D__content > div': {
          border: `1px solid #101423`,
        },
      },
      '.BigButton': {
        '.BoxWith3D': {
          '.BoxWith3D__content': {
            backgroundColor: '#101423',
          },
          '.BoxWith3D__left-shadow': {
            backgroundColor: '#C6C3D1',
          },
          '.BoxWith3D__bottom-shadow': {
            backgroundColor: '#F2F0F9',
          },
        },
      },
      header: {
        backgroundColor: '#FFFFFF',
        [`@media only screen and (${media.lg})`]: {
          backgroundColor: 'transparent',
        },
        '.Header_content': {
          backgroundColor: '#FFFFFF',
          '.BoxWith3D__content': {
            backgroundColor: '#101423',
          },
          '.BoxWith3D__left-shadow': {
            backgroundColor: '#555069',
          },
          '.BoxWith3D__bottom-shadow': {
            backgroundColor: '#C6C3D1',
          },
        },
        '.Header__navItem': {
          color: '#FFFFFF',
        },
      },
      '.ProposalListItem': {
        '.BoxWith3D': {
          '.BoxWith3D__content': {
            backgroundColor: '#FFFFFF',
          },
          '.BoxWith3D__left-shadow': {
            backgroundColor: '#C6C3D1',
          },
          '.BoxWith3D__bottom-shadow': {
            backgroundColor: '#F2F0F9',
          },
        },
        '.ProposalListItem__title': {
          color: '#101423',
        },
      },
      '.react-loading-skeleton': {
        backgroundColor: '#F2F0F9 !important',
        '&:after': {
          backgroundImage: `linear-gradient(90deg, #F2F0F9, #C6C3D1, #F2F0F9) !important`,
        },
      },
      '.BackButton3D': {
        '.BoxWith3D__left-shadow': {
          backgroundColor: '#555069',
        },
        '.BoxWith3D__bottom-shadow': {
          backgroundColor: '#C6C3D1',
        },
        '.BoxWith3D__content': {
          backgroundColor: '#101423',
        },
        '.BackButton3D__icon': {
          path: {
            fill: '#FFFFFF',
          },
        },
        '.BackButton3D__title': {
          color: '#FFFFFF',
        },
      },
      '.NoDataWrapper': {
        '.BoxWith3D__content': {
          backgroundColor: '#FFFFFF',
        },
        '.BoxWith3D__left-shadow': {
          backgroundColor: '#C6C3D1',
        },
        '.BoxWith3D__bottom-shadow': {
          backgroundColor: '#F2F0F9',
        },
      },
      '.ProposalLoading__SSR': {
        '.BoxWith3D__content': {
          backgroundColor: '#FFFFFF',
        },
        '.BoxWith3D__left-shadow': {
          backgroundColor: '#C6C3D1',
        },
        '.BoxWith3D__bottom-shadow': {
          backgroundColor: '#F2F0F9',
        },
      },

      '#nprogress .bar': {
        background: '#101423',
      },
      '#nprogress .spinner-icon': {
        borderTopColor: '#101423',
        borderLeftColor: '#101423',
      },

      '.Divider': {
        borderBottomColor: '#555069',
      },

      '.ProposalListItemFinalStatus__text': {
        color: '#555069',
      },

      '.ProposalListItemFinalStatus__box': {
        color: '#C6C3D1',
        [`@media only screen and (${media.sm})`]: {
          borderColor: '#C6C3D1',
        },
        svg: {
          path: {
            stroke: '#C6C3D1',
          },
        },
      },

      '.Branding': {
        '.Branding__text': {
          color: '#C6C3D1',
        },
        a: {
          '&:hover': {
            '.Branding__icon': {
              svg: {
                path: {
                  fill: '#101423',
                },
              },
            },
          },
        },
        '.Branding__icon': {
          '> svg': {
            path: {
              fill: '#C6C3D1',
            },
          },
        },
      },

      '.ProposalList__noData__image': {
        backgroundImage: 'url(/images/noDataList.svg)',
      },

      '.ComingSoonPage': {
        backgroundImage: 'url(/images/ComingF_Mob_light.svg)',
        [`@media only screen and (${media.sm})`]: {
          backgroundImage: 'url(/images/ComingF_Light.svg)',
        },
      },
    },
    "[data-theme='dark']": {
      body: {
        backgroundColor: '#212948',
        color: '#ADAECF',
      },
      '.BoxWith3D': {
        '.BoxWith3D__left-shadow': {
          borderColor: '#05070D',
        },
        '.BoxWith3D__bottom-shadow': {
          borderColor: '#05070D',
        },
        '.BoxWith3D__content > div': {
          border: `1px solid #05070D`,
        },
      },
      '.BigButton': {
        '.BoxWith3D': {
          '.BoxWith3D__content': {
            backgroundColor: '#3E456A',
          },
          '.BoxWith3D__left-shadow': {
            backgroundColor: '#090C16',
          },
          '.BoxWith3D__bottom-shadow': {
            backgroundColor: '#0C101E',
          },
        },
      },
      header: {
        backgroundColor: '#212948',
        '.Header_content': {
          backgroundColor: '#212948',
          '.BoxWith3D__content': {
            backgroundColor: '#212948',
          },
          '.BoxWith3D__left-shadow': {
            backgroundColor: '#090C16',
          },
          '.BoxWith3D__bottom-shadow': {
            backgroundColor: '#0C101E',
          },
        },
        '.Header__navItem': {
          color: '#ADAECF',
        },
        [`@media only screen and (${media.lg})`]: {
          backgroundColor: 'transparent',
        },
      },
      '.ProposalListItem': {
        '.BoxWith3D': {
          '.BoxWith3D__content': {
            backgroundColor: '#212948',
          },
          '.BoxWith3D__left-shadow': {
            backgroundColor: '#090C16',
          },
          '.BoxWith3D__bottom-shadow': {
            backgroundColor: '#0C101E',
          },
        },
        '.ProposalListItem__title': {
          color: '#ADAECF',
        },
      },
      '.react-loading-skeleton': {
        backgroundColor: '#0C101E !important',
        '&:after': {
          backgroundImage: `linear-gradient(90deg, #0C101E, #090C16, #0C101E) !important`,
        },
      },
      '.BackButton3D': {
        '.BoxWith3D__content': {
          backgroundColor: '#212948',
        },
        '.BoxWith3D__left-shadow': {
          backgroundColor: '#090C16',
        },
        '.BoxWith3D__bottom-shadow': {
          backgroundColor: '#0C101E',
        },
        '.BackButton3D__icon': {
          path: {
            fill: '#ADAECF',
          },
        },
        '.BackButton3D__title': {
          color: '#ADAECF',
        },
      },
      '.NoDataWrapper': {
        '.BoxWith3D__content': {
          backgroundColor: '#212948',
        },
        '.BoxWith3D__left-shadow': {
          backgroundColor: '#090C16',
        },
        '.BoxWith3D__bottom-shadow': {
          backgroundColor: '#0C101E',
        },
      },
      '.ProposalLoading__SSR': {
        '.BoxWith3D__content': {
          backgroundColor: '#212948',
        },
        '.BoxWith3D__left-shadow': {
          backgroundColor: '#090C16',
        },
        '.BoxWith3D__bottom-shadow': {
          backgroundColor: '#0C101E',
        },
      },

      '#nprogress .bar': {
        background: '#ADAECF',
      },
      '#nprogress .spinner-icon': {
        borderTopColor: '#ADAECF',
        borderLeftColor: '#ADAECF',
      },

      '.Divider': {
        borderBottomColor: '#475072',
      },

      '.ProposalListItemFinalStatus__text': {
        color: '#6A76A6',
      },

      '.ProposalListItemFinalStatus__box': {
        color: '#47557C',
        [`@media only screen and (${media.sm})`]: {
          borderColor: '#47557C',
        },
        svg: {
          path: {
            stroke: '#47557C',
          },
        },
      },

      '.Branding': {
        '.Branding__text': {
          color: '#47557C',
        },
        a: {
          '&:hover': {
            '.Branding__icon': {
              svg: {
                path: {
                  fill: '#ADAECF',
                },
              },
            },
          },
        },
        '.Branding__icon': {
          '> svg': {
            path: {
              fill: '#47557C',
            },
          },
        },
      },

      '.ProposalList__noData__image': {
        backgroundImage: 'url(/images/noDataListDark.svg)',
      },

      '.ComingSoonPage': {
        backgroundImage: 'url(/images/ComingF_Mob_dark.svg)',
        [`@media only screen and (${media.sm})`]: {
          backgroundImage: 'url(/images/ComingF_Dark.svg)',
        },
      },
    },
  };

  return (
    <GS
      styles={{
        ...defaultStyles,
        // styles for SSR
        ...stylesForSSR,
      }}
    />
  );
}
