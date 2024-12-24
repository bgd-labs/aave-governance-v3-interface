import { Box } from '@mui/system';
import arrayMutators from 'final-form-arrays';
import React, { useState } from 'react';
import { Field, Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { Address } from 'viem';

import { appConfig } from '../../configs/appConfig';
import {
  addressValidator,
  composeValidators,
  required,
} from '../../helpers/inputValidation';
import { texts } from '../../helpers/texts/texts';
import { useStore } from '../../providers/ZustandStoreProvider';
import { TxType } from '../../store/transactionsSlice';
import { useLastTxLocalStatus } from '../../transactions/useLastTxLocalStatus';
import { CreateProposalPageParams, PayloadAction } from '../../types';
import { BigButton } from '../BigButton';
import { BoxWith3D } from '../BoxWith3D';
import { InputWrapper } from '../InputWrapper';
import { Input } from '../primitives/Input';
import { SelectField } from '../SelectField';
import { CreateFieldArrayWrapper } from './CreateFieldArrayWrapper';
import { CreateFieldsArrayTitle } from './CreateFieldsArrayTitle';
import { CreateFormWrapper } from './CreateFormWrapper';
import { CreatePayloadModal } from './CreatePayloadModal';

type FormProperties = {
  chainId: number;
  payloadsController: string;
  payloadActions: PayloadAction[];
};

export function CreatePayloadForm({
  payloadsCount,
  accessLevels,
}: Pick<CreateProposalPageParams, 'payloadsCount' | 'accessLevels'>) {
  const createPayload = useStore((store) => store.createPayload);

  const defaultPayloadsController =
    appConfig.payloadsControllerConfig[appConfig.payloadsControllerChainIds[0]]
      .contractAddresses[0];

  const [isCreatePayloadModalOpen, setIsCreatePayloadModalOpen] =
    useState(false);
  const [chainId, setChainId] = useState(
    appConfig.payloadsControllerChainIds[0],
  );
  const [payloadsController, setPayloadsController] = useState(
    defaultPayloadsController,
  );

  const {
    error,
    setError,
    isTxStart,
    setIsTxStart,
    executeTxWithLocalStatuses,
    fullTxErrorMessage,
    setFullTxErrorMessage,
    tx,
  } = useLastTxLocalStatus({
    type: TxType.createPayload,
    payload: {
      payloadId: payloadsCount[payloadsController],
      chainId,
      payloadsController,
    },
  });

  const handleFormSubmit = async ({
    chainId,
    payloadsController,
    payloadActions,
  }: FormProperties) => {
    setIsCreatePayloadModalOpen(true);
    await executeTxWithLocalStatuses({
      callbackFunction: async () =>
        await createPayload({
          chainId,
          payloadActions,
          payloadId: payloadsCount[payloadsController],
          payloadsController: payloadsController as Address,
        }),
    });
  };

  return (
    <>
      <CreateFormWrapper title={texts.createPage.createPayloadTitle}>
        <Form<FormProperties>
          mutators={{
            ...arrayMutators,
          }}
          onSubmit={handleFormSubmit}>
          {({
            handleSubmit,
            values,
            form: {
              reset,
              mutators: { push, pop },
            },
          }) => {
            return (
              <Box
                component="form"
                onSubmit={async (event) => {
                  await handleSubmit(event);
                  reset();
                }}>
                <Field
                  name="chainId"
                  type="number"
                  validate={composeValidators(required)}
                  options={appConfig.payloadsControllerChainIds}>
                  {(props) => (
                    <InputWrapper
                      label={texts.createPage.payloadChainIdPlaceholder}
                      isError={props.meta.error && props.meta.touched}
                      error={props.meta.error}
                      css={{ mb: 25, zIndex: 6 }}>
                      <SelectField
                        withChainName
                        placeholder={texts.createPage.payloadChainIdPlaceholder}
                        value={props.input.value}
                        onChange={(event) => {
                          reset();
                          props.input.onChange(event);
                          if (
                            values.payloadActions &&
                            values.payloadActions.length > 0
                          ) {
                            values.payloadActions.forEach(() => {
                              pop('payloadActions');
                            });
                          }
                          setChainId(event);
                        }}
                        options={props.options}
                      />
                    </InputWrapper>
                  )}
                </Field>

                {!!values.chainId && (
                  <Field
                    name="payloadsController"
                    validate={composeValidators(required)}
                    options={
                      appConfig.payloadsControllerConfig[values.chainId]
                        .contractAddresses
                    }>
                    {(props) => (
                      <InputWrapper
                        label={texts.createPage.payloadsControllerPlaceholder}
                        isError={props.meta.error && props.meta.touched}
                        error={props.meta.error}
                        css={{ mb: 25, zIndex: 5 }}>
                        <SelectField
                          placeholder={
                            texts.createPage.payloadsControllerPlaceholder
                          }
                          value={props.input.value}
                          onChange={(event) => {
                            props.input.onChange(event);
                            if (
                              values.payloadActions &&
                              values.payloadActions.length > 0
                            ) {
                              values.payloadActions.forEach(() => {
                                pop('payloadActions');
                              });
                            }
                            setPayloadsController(event);
                          }}
                          options={props.options}
                        />
                      </InputWrapper>
                    )}
                  </Field>
                )}

                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', my: 30 }}>
                  <Box
                    component="button"
                    type="button"
                    disabled={!values.chainId && !values.payloadsController}
                    onClick={() =>
                      push('payloadActions', {
                        payloadAddress:
                          appConfig.payloadsControllerConfig[values.chainId]
                            .payloadAddress,
                        withDelegateCall: true,
                        accessLevel: 1,
                        value: 0,
                        signature: 'execute()',
                        callData: '',
                      })
                    }>
                    <BoxWith3D
                      disabled={!values.chainId}
                      contentColor="$mainLight"
                      activeContentColor="$light"
                      withActions
                      borderSize={4}
                      borderLinesColor={
                        !values.chainId ? '$disabled' : '$mainBorder'
                      }
                      css={{
                        minWidth: 97,
                        height: 30,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: !values.chainId ? '$textDisabled' : '$main',
                      }}>
                      <Box
                        component="p"
                        sx={{
                          fontWeight: '600',
                          letterSpacing: '0.03em',
                          fontSize: 12,
                          lineHeight: '15px',
                        }}>
                        {texts.createPage.addActionButtonTitle}
                      </Box>
                    </BoxWith3D>
                  </Box>
                </Box>

                <FieldArray name="payloadActions">
                  {({ fields }) => {
                    return (
                      <CreateFieldsArrayTitle
                        title={texts.createPage.payloadActions}
                        isTitleVisible={!!values.payloadActions}>
                        {fields.map((name, index) => (
                          <CreateFieldArrayWrapper
                            key={name}
                            fieldTitle={texts.createPage.actionTitle(index + 1)}
                            onRemoveClick={() => fields.remove(index)}>
                            <Field
                              name={`${name}.payloadAddress`}
                              validate={composeValidators(
                                required,
                                addressValidator,
                              )}>
                              {(props) => (
                                <InputWrapper
                                  label={texts.createPage.payloadActionAddress}
                                  isError={
                                    props.meta.error && props.meta.touched
                                  }
                                  error={props.meta.error}
                                  css={{ mb: 25 }}>
                                  <Input
                                    {...props}
                                    value={props.input.value}
                                    onChange={props.input.onChange}
                                    placeholder={
                                      texts.createPage.payloadActionAddress
                                    }
                                  />
                                </InputWrapper>
                              )}
                            </Field>

                            <Field
                              type="checkbox"
                              name={`${name}.withDelegateCall`}>
                              {(props) => (
                                <InputWrapper
                                  label={
                                    texts.createPage.payloadActionDelegateCall
                                  }
                                  isError={
                                    props.meta.error && props.meta.touched
                                  }
                                  error={props.meta.error}
                                  css={{ mb: 25 }}>
                                  <Box
                                    component="label"
                                    htmlFor={props.input.name}
                                    sx={{
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      width: '100%',
                                      input: {
                                        width: 0,
                                        height: 0,
                                        overflow: 'hidden',
                                        p: 0,
                                        border: 'none',
                                      },
                                    }}>
                                    <input
                                      id={props.input.name}
                                      {...props.input}
                                    />
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 14,
                                        height: 14,
                                        backgroundColor: '$disabled',
                                      }}>
                                      <Box
                                        sx={{
                                          transition: 'all 0.2s ease',
                                          width: 10,
                                          height: 10,
                                          backgroundColor: '$main',
                                          transform: props.input.checked
                                            ? 'scale(1)'
                                            : 'scale(0)',
                                        }}
                                      />
                                    </Box>
                                    <Box
                                      component="p"
                                      sx={{ typography: 'body', ml: 10 }}>
                                      {props.input.checked ? 'Yes' : 'No'}
                                    </Box>
                                  </Box>
                                </InputWrapper>
                              )}
                            </Field>

                            <Field
                              name={`${name}.accessLevel`}
                              type="number"
                              options={accessLevels}
                              validate={composeValidators(required)}>
                              {(props) => (
                                <InputWrapper
                                  label={
                                    texts.createPage.payloadActionAccessLevel
                                  }
                                  isError={
                                    props.meta.error && props.meta.touched
                                  }
                                  error={props.meta.error}
                                  css={{ mb: 25 }}>
                                  <SelectField
                                    placeholder={
                                      texts.createPage.payloadActionAccessLevel
                                    }
                                    value={props.input.value}
                                    onChange={props.input.onChange}
                                    options={props.options}
                                  />
                                </InputWrapper>
                              )}
                            </Field>

                            <Field
                              name={`${name}.value`}
                              type="number"
                              validate={composeValidators(required)}>
                              {(props) => (
                                <InputWrapper
                                  label={texts.createPage.payloadActionValue}
                                  isError={
                                    props.meta.error && props.meta.touched
                                  }
                                  error={props.meta.error}
                                  css={{ mb: 25 }}>
                                  <Input
                                    {...props}
                                    type="number"
                                    min="0"
                                    value={props.input.value}
                                    onChange={props.input.onChange}
                                    placeholder={
                                      texts.createPage.payloadActionValue
                                    }
                                  />
                                </InputWrapper>
                              )}
                            </Field>

                            <Field
                              name={`${name}.signature`}
                              validate={composeValidators(required)}>
                              {(props) => (
                                <InputWrapper
                                  label={
                                    texts.createPage.payloadActionSignature
                                  }
                                  isError={
                                    props.meta.error && props.meta.touched
                                  }
                                  error={props.meta.error}
                                  css={{ mb: 25 }}>
                                  <Input
                                    {...props}
                                    value={props.input.value}
                                    onChange={props.input.onChange}
                                    placeholder={
                                      texts.createPage.payloadActionSignature
                                    }
                                  />
                                </InputWrapper>
                              )}
                            </Field>

                            <Field name={`${name}.callData`}>
                              {(props) => (
                                <InputWrapper
                                  label={texts.createPage.payloadActionCallData}
                                  isError={
                                    props.meta.error && props.meta.touched
                                  }
                                  error={props.meta.error}
                                  css={{ mb: 25 }}>
                                  <Input
                                    {...props}
                                    value={props.input.value}
                                    onChange={props.input.onChange}
                                    placeholder={
                                      texts.createPage.payloadActionCallData
                                    }
                                  />
                                </InputWrapper>
                              )}
                            </Field>
                          </CreateFieldArrayWrapper>
                        ))}
                      </CreateFieldsArrayTitle>
                    );
                  }}
                </FieldArray>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <BigButton type="submit" disabled={!values.payloadActions}>
                    {texts.other.create}
                  </BigButton>
                </Box>
              </Box>
            );
          }}
        </Form>
      </CreateFormWrapper>

      <CreatePayloadModal
        error={error}
        setError={setError}
        isOpen={isCreatePayloadModalOpen}
        setIsOpen={setIsCreatePayloadModalOpen}
        isTxStart={isTxStart}
        setIsTxStart={setIsTxStart}
        payloadId={payloadsCount[payloadsController]}
        fullTxErrorMessage={fullTxErrorMessage}
        setFullTxErrorMessage={setFullTxErrorMessage}
        tx={tx}
      />
    </>
  );
}
