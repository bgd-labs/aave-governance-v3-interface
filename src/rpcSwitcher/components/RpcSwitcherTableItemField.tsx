import { Box } from '@mui/system';
import React, { useEffect } from 'react';
import { Field } from 'react-final-form';

import { useStore } from '../../store';
import { InputWithAnimation } from '../../ui/components/InputWithAnimation';
import { InputWrapper } from '../../ui/components/InputWrapper';
import { TableText } from '../../ui/components/TableText';
import {
  composeValidators,
  rpcUrlValidator,
} from '../../ui/utils/inputValidation';
import { texts } from '../../ui/utils/texts';

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
      address={rpcUrl}
      errorMessage={texts.rpcSwitcherPage.rpcIsNotSupported}
      removeHover
      isErrorOnRight>
      <>
        {!!rpcUrl && (
          <Box
            component="p"
            sx={{
              typography: 'h3',
              ml: 4,
              position: 'relative',
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

  const { checkRpcUrl, rpcHasError } = useStore();

  useEffect(() => {
    if (rpcUrlTo && rpcUrlTo !== rpcUrl && chainId) {
      checkRpcUrl(rpcUrlTo, chainId);
    }
  }, [rpcUrlTo]);

  return (
    <>
      {!isEdit && !isViewChanges && <Text rpcUrl={rpcUrl} />}
      {isEdit && !isViewChanges && (
        <Field name={inputName} validate={composeValidators(rpcUrlValidator)}>
          {(props) => {
            return (
              <InputWrapper
                onCrossClick={
                  props.input.value !== ''
                    ? () => {
                        props.input.onChange('');
                      }
                    : undefined
                }
                isError={props.meta.error && props.meta.touched}
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
                  ? rpcHasError.hasOwnProperty(rpcUrlTo)
                    ? rpcHasError[rpcUrlTo].error === true ||
                      rpcHasError[rpcUrlTo].chainId !== chainId
                    : true
                  : false
              }
            />
          )}
        </Box>
      )}
    </>
  );
}
