import { Listbox } from '@headlessui/react';
import { Box, useTheme } from '@mui/system';
import React from 'react';
import { Hex } from 'viem';

import ArrowToBottom from '/public/images/icons/arrowToBottom.svg';
import ArrowToTop from '/public/images/icons/arrowToTop.svg';

import { useRootStore } from '../../store/storeProvider';
import { NoSSR } from '../../ui';
import { CopyAndExternalIconsSet } from '../../ui/components/CopyAndExternalIconsSet';
import { CustomSkeleton } from '../../ui/components/CustomSkeleton';
import { InputWrapper } from '../../ui/components/InputWrapper';
import { SelectField } from '../../ui/components/SelectField';
import { IconBox } from '../../ui/primitives/IconBox';
import { textCenterEllipsis } from '../../ui/utils/text-center-ellipsis';
import { texts } from '../../ui/utils/texts';
import { appConfig } from '../../utils/appConfig';
import { getScanLink } from '../../utils/getScanLink';

interface PayloadsControllerSelectProps {
  chainId: number;
  controllerAddress: Hex;
  setControllerAddress: (value: Hex) => void;
}

export function PayloadsControllerSelect({
  chainId,
  controllerAddress,
  setControllerAddress,
}: PayloadsControllerSelectProps) {
  const theme = useTheme();
  const isRendered = useRootStore((store) => store.isRendered);

  const selectOptions =
    appConfig.payloadsControllerConfig[chainId].contractAddresses;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        [theme.breakpoints.up('sm')]: {
          flexDirection: 'row',
          alignItems: 'center',
        },
      }}>
      <Box component="h2" sx={{ typography: 'h1', mr: 6 }}>
        Payloads controller
      </Box>

      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          mt: 4,
          position: 'relative',
          zIndex: '5',
          [theme.breakpoints.up('sm')]: { display: 'none' },
        }}>
        {isRendered ? (
          <>
            <InputWrapper>
              <SelectField
                placeholder={texts.other.payloadsNetwork}
                value={controllerAddress}
                onChange={(event) => {
                  setControllerAddress(event);
                }}
                options={selectOptions}
              />
            </InputWrapper>

            <CopyAndExternalIconsSet
              sx={{ ml: 8 }}
              iconSize={14}
              externalLink={getScanLink({
                chainId,
                address: controllerAddress,
              })}
            />
          </>
        ) : (
          <Box
            sx={{
              lineHeight: '1 !important',
              width: '100%',
              '.react-loading-skeleton': { width: '100%' },
            }}>
            <CustomSkeleton height={31} />
          </Box>
        )}
      </Box>

      <NoSSR>
        <Box
          sx={{
            display: 'none',
            position: 'relative',
            zIndex: '5',
            [theme.breakpoints.up('sm')]: {
              display: 'flex',
              alignItems: 'center',
            },
          }}>
          <Box sx={{ position: 'relative' }}>
            <Listbox value={controllerAddress} onChange={setControllerAddress}>
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
                      typography: 'headline',
                      color: '$text',
                      p: 2,
                      '.PayloadsControllerSelect__ellipsisAddress': {
                        display: open ? 'none' : 'block',
                      },
                      '.PayloadsControllerSelect__normalAddress': {
                        display: open ? 'block' : 'none',
                      },
                      '&:active, &:focus': {
                        backgroundColor: theme.palette.$light,
                      },
                      hover: {
                        backgroundColor: theme.palette.$light,
                        '.PayloadsControllerSelect__ellipsisAddress': {
                          display: 'none',
                        },
                        '.PayloadsControllerSelect__normalAddress': {
                          display: 'block',
                        },
                      },
                    }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        mr: 4,
                      }}>
                      <Box className="PayloadsControllerSelect__ellipsisAddress">
                        {textCenterEllipsis(controllerAddress, 10, 10)}
                      </Box>
                      <Box className="PayloadsControllerSelect__normalAddress">
                        {controllerAddress}
                      </Box>
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
                      width: '100%',
                      maxHeight: 160,
                      overflowY: 'auto',
                      zIndex: 2,
                      backgroundColor: '$mainLight',
                      [theme.breakpoints.up('md')]: {
                        maxHeight: 250,
                      },
                    }}>
                    {selectOptions.map((option) => (
                      <Listbox.Option
                        as={Box}
                        key={option}
                        value={option}
                        disabled={option === controllerAddress}
                        sx={{
                          typography: 'headline',
                          transition: 'all 0.2s ease',
                          width: '100%',
                          color: '$text',
                          p: 2,
                          cursor:
                            option === controllerAddress
                              ? 'default'
                              : 'pointer',
                          backgroundColor:
                            option === controllerAddress
                              ? '$light'
                              : '$mainLight',
                          hover: {
                            backgroundColor: theme.palette.$light,
                          },
                        }}>
                        {option}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </>
              )}
            </Listbox>
          </Box>

          <CopyAndExternalIconsSet
            sx={{ ml: 8 }}
            iconSize={14}
            externalLink={getScanLink({ chainId, address: controllerAddress })}
          />
        </Box>
      </NoSSR>
    </Box>
  );
}
