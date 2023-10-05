import React, { useCallback, useRef } from 'react';
import { Field } from 'react-final-form';

import { InputWithAnimation } from '../../ui/components/InputWithAnimation';
import { InputWrapper } from '../../ui/components/InputWrapper';
import {
  composeValidators,
  rpcUrlValidator,
} from '../../ui/utils/inputValidation';
import { texts } from '../../ui/utils/texts';
import { initialForm } from '../utils/validationManagement';

interface RpcSwitcherTableItemAddressProps {
  inputName: string;
}

export function RpcSwitcherTableItemField({
  inputName,
}: RpcSwitcherTableItemAddressProps) {
  // const debouncedRpcUrlValidator = useCallback(
  //   debounceAsync(rpcUrlValidator, 2000),
  //   [],
  // );

  return (
    <>
      <Field
        name={inputName}
        validate={composeValidators((value: string) =>
          rpcUrlValidator(value, initialForm, inputName),
        )}>
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
                animatedPlaceholder={texts.representationsPage.notRepresented}
                {...props.input}
              />
            </InputWrapper>
          );
        }}
      </Field>
    </>
  );
}
