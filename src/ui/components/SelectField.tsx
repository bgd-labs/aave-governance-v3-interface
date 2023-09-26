import { Listbox } from '@headlessui/react';
import { Box, useTheme } from '@mui/system';

import ArrowToBottom from '/public/images/icons/arrowToBottom.svg';
import ArrowToTop from '/public/images/icons/arrowToTop.svg';

import { IconBox } from '../primitives/IconBox';
import { getChainName } from '../utils/getChainName';

interface SelectFieldProps {
  value: any;
  onChange: (value: any) => void;
  options: any[];
  placeholder: string;
  withChainName?: boolean;
  withMyself?: boolean;
}

export function SelectField({
  value,
  onChange,
  options,
  placeholder,
  withChainName,
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              fontWeight: '400',
              fontSize: 11,
              lineHeight: '14px',
              p: '7px 5px',
              border: `1px solid ${theme.palette.$disabled}`,
              borderColor: open ? '$main' : '$disabled',
              color: !(value || value === 0) ? '$disabled' : '$text',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
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
                borderColor: '$main',
              },
              hover: {
                borderColor: theme.palette.$main,
              },
            }}>
            {!!(value || value === 0)
              ? withChainName
                ? getChainName(value)
                : value
              : withMyself && value === ''
              ? 'Myself'
              : placeholder}
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
              maxHeight: 250,
              overflowY: 'auto',
              zIndex: 2,
              backgroundColor: '$mainLight',
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
                  backgroundColor:
                    option === value ? '$disabled' : '$mainLight',
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
                    backgroundColor: theme.palette.$disabled,
                  },
                }}>
                {withChainName
                  ? getChainName(option)
                  : withMyself && option === ''
                  ? 'Myself'
                  : option}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </>
      )}
    </Listbox>
  );
}
