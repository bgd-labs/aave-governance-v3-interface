import { getChainName } from '@bgd-labs/react-web3-icons/dist/utils';
import { Listbox } from '@headlessui/react';
import { Box, useTheme } from '@mui/system';

import ArrowToBottom from '../assets/icons/arrowToBottom.svg';
import ArrowToTop from '../assets/icons/arrowToTop.svg';
import { NetworkIcon } from './NetworkIcon';
import { IconBox } from './primitives/IconBox';

interface SelectFieldProps {
  value: any;
  onChange: (value: any) => void;
  options: any[];
  placeholder: string;
  withChainName?: boolean;
  withChainIcon?: boolean;
  withMyself?: boolean;
}

export function SelectField({
  value,
  onChange,
  options,
  placeholder,
  withChainName,
  withChainIcon,
  withMyself,
}: SelectFieldProps) {
  const theme = useTheme();

  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <>
          <Listbox.Button
            as={Box}
            sx={{
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              fontWeight: '400',
              border: `1px solid ${theme.palette.$main}`,
              fontSize: 11,
              lineHeight: '14px',
              p: '7px 5px',
              color: !(value || value === 0) ? '$textDisabled' : '$text',
              [theme.breakpoints.up('xsm')]: {
                fontSize: 12,
                lineHeight: '15px',
              },
              [theme.breakpoints.up('lg')]: {
                p: '8px 10px',
                fontSize: 13,
                lineHeight: '16px',
              },
              '&:active, &:focus': {
                backgroundColor: theme.palette.$light,
              },
              hover: {
                backgroundColor: theme.palette.$light,
              },
            }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
              {withChainIcon && (
                <NetworkIcon chainId={value} size={14} css={{ mr: 8 }} />
              )}
              {value || value === 0
                ? withChainName
                  ? getChainName({ chainId: value })
                  : value
                : withMyself && value === ''
                  ? 'Myself'
                  : placeholder}
            </Box>

            <IconBox sx={{ path: { stroke: theme.palette.$main } }}>
              {open ? <ArrowToTop /> : <ArrowToBottom />}
            </IconBox>
          </Listbox.Button>
          <Listbox.Options
            as={Box}
            sx={{
              position: 'absolute',
              top: 'calc(100% - 1px)',
              border: `1px solid ${theme.palette.$main}`,
              width: '100%',
              maxHeight: 160,
              overflowY: 'auto',
              zIndex: 2,
              backgroundColor: '$mainLight',
              [theme.breakpoints.up('md')]: {
                maxHeight: 250,
              },
            }}>
            {options.map((option: any) => (
              <Listbox.Option
                as={Box}
                key={option}
                value={option}
                disabled={option === value}
                sx={{
                  width: '100%',
                  fontWeight: '400',
                  fontSize: 11,
                  lineHeight: '14px',
                  p: '7px 5px',
                  color: '$text',
                  transition: 'all 0.2s ease',
                  cursor: option === value ? 'default' : 'pointer',
                  backgroundColor: option === value ? '$light' : '$mainLight',
                  [theme.breakpoints.up('xsm')]: {
                    fontSize: 12,
                    lineHeight: '15px',
                  },
                  [theme.breakpoints.up('lg')]: {
                    p: '8px 10px',
                    fontSize: 13,
                    lineHeight: '16px',
                  },
                  hover: {
                    backgroundColor: theme.palette.$light,
                  },
                }}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                  {withChainIcon && (
                    <NetworkIcon chainId={option} size={14} css={{ mr: 8 }} />
                  )}
                  {withChainName
                    ? getChainName({ chainId: option })
                    : withMyself && option === ''
                      ? 'Myself'
                      : option}
                </Box>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </>
      )}
    </Listbox>
  );
}
