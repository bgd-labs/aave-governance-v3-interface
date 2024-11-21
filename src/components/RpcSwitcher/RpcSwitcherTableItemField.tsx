import { Box } from '@mui/system';
import React, { useEffect } from 'react';
import { Field } from 'react-final-form';

import { chainInfoHelper } from '../../configs/configs';
import {
  composeValidators,
  rpcUrlValidator,
} from '../../helpers/inputValidation';
import { texts } from '../../helpers/texts/texts';
import { useStore } from '../../providers/ZustandStoreProvider';
import { InputWithAnimation } from '../InputWithAnimation';
import { InputWrapper } from '../InputWrapper';
import { TableText } from '../Table/TableText';

const Text = ({
  rpcUrl,
  isCrossed,
  alwaysGray,
  isError,
}: {
  rpcUrl?: string;
  isCrossed?: boolean;
  alwaysGray?: boolean;
  isError?: boolean;
  ensName?: string;
}) => {
  return (
    <TableText
      topText={''}
      isCrossed={isCrossed}
      alwaysGray={alwaysGray}
      isError={isError}
      value={rpcUrl}
      errorMessage={texts.other.rpcIsNotSupported}
      withoutHover
      isErrorOnRight>
      <>
        {!!rpcUrl && (
          <Box
            component="p"
            sx={{
              typography: 'h3',
              ml: 4,
              position: 'relative',
              textAlign: 'right',
            }}>
            {rpcUrl}
          </Box>
        )}
      </>
    </TableText>
  );
};

interface RpcSwitcherTableItemAddressProps {
  inputName: string;
  isEdit: boolean;
  isViewChanges: boolean;
  rpcUrl?: string;
  rpcUrlTo?: string;
  chainId?: number;
}

export function RpcSwitcherTableItemField({
  inputName,
  isEdit,
  isViewChanges,
  rpcUrl,
  rpcUrlTo,
  chainId,
}: RpcSwitcherTableItemAddressProps) {
  const isRpcUrlToVisible = rpcUrl !== rpcUrlTo;

  const checkRpcUrl = useStore((store) => store.checkRpcUrl);
  const rpcFormErrors = useStore((store) => store.rpcFormErrors);
  const rpcAppErrors = useStore((store) => store.rpcAppErrors);

  useEffect(() => {
    if (rpcUrlTo && rpcUrlTo !== rpcUrl && chainId) {
      checkRpcUrl(rpcUrlTo, chainId);
    }
  }, [rpcUrlTo]);

  return (
    <>
      {!isEdit && !isViewChanges && (
        <Text
          rpcUrl={rpcUrl}
          isError={
            Object.values(rpcAppErrors).filter(
              (error) => error.chainId === chainId,
            )[0].error
          }
        />
      )}
      {isEdit && !isViewChanges && (
        <Field name={inputName} validate={composeValidators(rpcUrlValidator)}>
          {(props) => {
            return (
              <InputWrapper
                onCrossClick={
                  chainId &&
                  props.input.value !==
                    chainInfoHelper.getChainParameters(chainId).rpcUrls.default
                      .http[0]
                    ? () => {
                        props.input.onChange(
                          chainInfoHelper.getChainParameters(chainId).rpcUrls
                            .default.http[0],
                        );
                      }
                    : undefined
                }
                isError={props.meta.error}
                error={props.meta.error}>
                <InputWithAnimation
                  type="text"
                  animatedPlaceholder={texts.rpcSwitcherPage.placeholder}
                  {...props.input}
                />
              </InputWrapper>
            );
          }}
        </Field>
      )}
      {!isEdit && isViewChanges && (
        <Box
          sx={(theme) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            [theme.breakpoints.up('sm')]: {
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              width: '100%',
            },
            [theme.breakpoints.up('md')]: {
              flexDirection: 'column',
              alignItems: 'flex-end',
              justifyContent: 'unset',
              width: 'auto',
            },
          })}>
          <Text rpcUrl={rpcUrl} isCrossed={isRpcUrlToVisible} alwaysGray />
          {isRpcUrlToVisible && (
            <Text
              rpcUrl={rpcUrlTo}
              isError={
                rpcUrlTo
                  ? rpcFormErrors.hasOwnProperty(rpcUrlTo)
                    ? rpcFormErrors[rpcUrlTo].error ||
                      rpcFormErrors[rpcUrlTo].chainId !== chainId
                    : false
                  : false
              }
            />
          )}
        </Box>
      )}
    </>
  );
}
