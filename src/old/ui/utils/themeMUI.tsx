// eslint-disable-next-line import/default
import createCache from '@emotion/cache';
import { ThemeOptions } from '@mui/system';

import { isForIPFS } from '../../utils/appConfig';

declare module '@mui/system' {
  interface BreakpointOverrides {
    xsm: true;
  }
}

export function createEmotionCache() {
  return createCache({ key: 'css', prepend: true });
}

export const media = {
  xs: '(min-width: 465px)',
  sm: '(min-width: 768px)',
  md: '(min-width: 1024px)',
  lg: '(min-width: 1400px)',
  xl: '(min-width: 1800px)',
};

export const FONT = isForIPFS
  ? "'Inter', sans-serif"
  : // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('../../../../app/layout.page').interNextFont.style.fontFamily;

export const getDesignTokens = (mode: 'light' | 'dark') => {
  const getColor = (lightColor: string, darkColor: string) =>
    mode === 'dark' ? darkColor : lightColor;

  return {
    unstable_sxConfig: {
      hover: {
        style: (props) => {
          const { hover } = props;
          return {
            '@media (hover: hover) and (pointer: fine)': {
              '&:hover': {
                ...hover,
              },
            },
          };
        },
      },
    },
    breakpoints: {
      keys: ['xs', 'xsm', 'sm', 'md', 'lg', 'xl'],
      values: {
        xs: 0,
        xsm: 465,
        sm: 768,
        md: 1024,
        lg: 1400,
        xl: 1800,
      },
    },
    spacing: 1,
    palette: {
      mode,
      $main: getColor('#101423', '#ADAECF'),
      $secondary: getColor('#555069', '#090C16'),
      $middleLight: getColor('#C6C3D1', '#090C16'),
      $disabled: getColor('#CDC8E1', '#47557C'),
      $light: getColor('#F2F0F9', '#0C101E'),
      $mainFor: getColor('#1AD4B3', '#1AD4B3'),
      $mainAgainst: getColor('#FC4F83', '#FC4F83'),
      $secondaryAgainst: getColor('#FFCAD7', '#DD2A60'),
      $secondaryFor: getColor('#C7FFF1', '#0EA388'),
      $error: getColor('#FF607B', '#FF607B'),
      $mainLight: getColor('#FFFFFF', '#212948'),
      $mainStable: getColor('#101423', '#212948'),
      $mainElements: getColor('#101423', '#090C16'),
      $headerGray: getColor('#C6C3D1', '#0C101E'),

      $lightStable: getColor('#F2F0F9', '#F2F0F9'),

      $mainButton: getColor('#101423', '#3E456A'),
      $buttonBorderBottom: getColor('#F2F0F9', '#101423'),
      $buttonBorderLeft: getColor('#C6C3D1', '#0C101E'),
      $whiteButton: getColor('#FFFFFF', '#182038'),
      $buttonDisabled: getColor('#9A94B0', '#101423'),
      $whiteButtonBorderBottom: getColor('#F2F0F9', '#101423'),
      $whiteButtonBorderLeft: getColor('#C6C3D1', '#0C101E'),

      $paper: getColor('#FFFFFF', '#212948'),
      $backgroundOverlap: getColor('#292E4199', '#11141CA1'),
      $appBackground: getColor('#EDF0FC', '#1C2445'),

      $text: getColor('#1B2030', '#ADAECF'),
      $textLight: getColor('#F2F0F9', '#ADAECF'),
      $textSecondary: getColor('#555069', '#6A76A6'),
      $textDisabled: getColor('#CDC8E1', '#47557C'),
      $textWhite: getColor('#FFFFFF', '#FFFFFF'),

      $mainBorder: getColor('#1B2030', '#05070D'),
      $secondaryBorder: getColor('#555069', '#475072'),
      $disabledBorder: getColor('#C6C3D1', '#47557C'),
    },
    typography: {
      fontFamily: FONT,
      h5: undefined,
      h6: undefined,
      subtitle1: undefined,
      subtitle2: undefined,
      body1: undefined,
      body2: undefined,
      button: undefined,
      overline: undefined,
      h1: {
        fontFamily: FONT,
        fontWeight: '700',
        letterSpacing: '0.03em',
        fontSize: 16,
        lineHeight: '22px',
      },
      h2: {
        fontFamily: FONT,
        fontWeight: '600',
        letterSpacing: '0.03em',
        fontSize: 15,
        lineHeight: '18px',
      },
      h3: {
        fontFamily: FONT,
        fontWeight: '400',
        letterSpacing: '0.03em',
        fontSize: 14,
        lineHeight: '17px',
      },
      headline: {
        fontFamily: FONT,
        fontWeight: '600',
        fontSize: 14,
        lineHeight: '20px',
      },
      body: {
        fontFamily: FONT,
        fontWeight: '400',
        fontSize: 14,
        lineHeight: '20px',
      },
      descriptor: {
        fontFamily: FONT,
        fontWeight: '300',
        fontSize: 11,
        lineHeight: '13px',
      },
      descriptorAccent: {
        fontFamily: FONT,
        fontWeight: '700',
        fontSize: 11,
        lineHeight: '13px',
      },
      buttonLarge: {
        fontFamily: FONT,
        fontWeight: '700',
        letterSpacing: '0.03em',
        fontSize: 14,
        lineHeight: '17px',
      },
      buttonMedium: {
        fontFamily: FONT,
        fontWeight: '600',
        letterSpacing: '0.03em',
        fontSize: 14,
        lineHeight: '17px',
      },
      buttonSmall: {
        fontFamily: FONT,
        fontWeight: '400',
        letterSpacing: '0.03em',
        fontSize: 13,
        lineHeight: '16px',
      },
    },
  } as ThemeOptions;
};
