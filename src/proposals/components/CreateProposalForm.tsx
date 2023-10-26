import { InitialPayload } from '@bgd-labs/aave-governance-ui-helpers';
import { Box } from '@mui/system';
import arrayMutators from 'final-form-arrays';
import { useEffect, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import { useStore } from '../../store';
import { useLastTxLocalStatus } from '../../transactions/hooks/useLastTxLocalStatus';
import { BigButton, BoxWith3D, Input } from '../../ui';
import { InputWrapper } from '../../ui/components/InputWrapper';
import { SelectField } from '../../ui/components/SelectField';
import { composeValidators, required } from '../../ui/utils/inputValidation';
import { texts } from '../../ui/utils/texts';
import { appConfig } from '../../utils/appConfig';
import { selectAvailablePayloadsIdsByChainId } from '../store/proposalsSelectors';
import { CreateProposalModal } from './actionModals/CreateProposalModal';
import { CreateFieldArrayWrapper } from './CreateFieldArrayWrapper';
import { CreateFieldsArrayTitle } from './CreateFieldsArrayTitle';
import { CreateFormWrapper } from './CreateFormWrapper';

type FormProperties = {
  votingChainId: number;
  payloads: InitialPayload[];
  ipfsHash: string;
};

export function CreateProposalForm() {
  const store = useStore();
  const {
    createProposal,
    totalPayloadsCount,
    totalProposalCount,
    isCreateProposalModalOpen,
    setIsCreateProposalModalOpen,
  } = store;

  const availableIdsInit = appConfig.payloadsControllerChainIds
    .map((chainId) => {
      return appConfig.payloadsControllerConfig[chainId].contractAddresses.map(
        (controller) => {
          const availablePayloadsIds = selectAvailablePayloadsIdsByChainId(
            store,
            controller,
          );
          return {
            [controller]: availablePayloadsIds,
          };
        },
      );
    })
    .flat()
    .flat()
    .reduce((a, v) => ({ ...a, [Object.keys(v)[0]]: Object.values(v)[0] }), {});

  const [availableIds, setAvailableIds] =
    useState<Record<string, number[]>>(availableIdsInit);
  const [selectedPayloads, setSelectedPayloads] = useState<
    Record<
      string,
      { id?: number; chainId?: number; payloadsController?: string }
    >
  >({});

  const handleSelectPayload = (
    fieldName: string,
    id?: number,
    chainId?: number,
    payloadsController?: string,
  ) => {
    if (!!selectedPayloads[fieldName]) {
      if (typeof chainId !== 'undefined') {
        const selectedPayload = {
          [fieldName]: {
            id: selectedPayloads[fieldName].id,
            chainId,
            payloadsController: selectedPayloads[fieldName].payloadsController,
          },
        };
        setSelectedPayloads({ ...selectedPayloads, ...selectedPayload });
      } else if (typeof id !== 'undefined') {
        const selectedPayload = {
          [fieldName]: {
            id,
            chainId: selectedPayloads[fieldName].chainId,
            payloadsController: selectedPayloads[fieldName].payloadsController,
          },
        };
        setSelectedPayloads({ ...selectedPayloads, ...selectedPayload });
      } else if (typeof payloadsController !== 'undefined') {
        const selectedPayload = {
          [fieldName]: {
            id: selectedPayloads[fieldName].id,
            chainId: selectedPayloads[fieldName].chainId,
            payloadsController: payloadsController,
          },
        };
        setSelectedPayloads({ ...selectedPayloads, ...selectedPayload });
      } else {
        const selectedPayload = {
          [fieldName]: { id, chainId, payloadsController },
        };
        setSelectedPayloads({ ...selectedPayloads, ...selectedPayload });
      }
    } else {
      const selectedPayload = {
        [fieldName]: { id, chainId, payloadsController },
      };
      setSelectedPayloads({ ...selectedPayloads, ...selectedPayload });
    }
  };

  const handleDeletePayload = (fieldName: string) => {
    const updatedSelectedPayloads = selectedPayloads;
    const payloadsController =
      (updatedSelectedPayloads[fieldName]
        ? updatedSelectedPayloads[fieldName].payloadsController
        : appConfig.payloadsControllerConfig[
            appConfig.payloadsControllerChainIds[0]
          ].contractAddresses[0]) ||
      appConfig.payloadsControllerConfig[
        appConfig.payloadsControllerChainIds[0]
      ].contractAddresses[0];

    delete updatedSelectedPayloads[fieldName];
    setSelectedPayloads(updatedSelectedPayloads);
    const selectedIds = Object.values(selectedPayloads)
      .filter((payload) => payload.payloadsController === payloadsController)
      .map((payload) => payload.id);
    const availablePayloadsIds = selectAvailablePayloadsIdsByChainId(
      store,
      payloadsController,
    );
    setAvailableIds({
      [payloadsController]: availablePayloadsIds.filter(
        (id) => selectedIds.indexOf(id) === -1,
      ),
    });
  };

  useEffect(() => {
    const availableIdsLocal = appConfig.payloadsControllerChainIds
      .map((chainId) => {
        return appConfig.payloadsControllerConfig[
          chainId
        ].contractAddresses.map((controller) => {
          const selectedIds = Object.values(selectedPayloads)
            .filter((payload) => payload.payloadsController === controller)
            .map((payload) => payload.id);

          const availablePayloadsIds = selectAvailablePayloadsIdsByChainId(
            store,
            controller,
          );
          return {
            [controller]: availablePayloadsIds.filter(
              (id) => selectedIds.indexOf(id) === -1,
            ),
          };
        });
      })
      .flat()
      .flat()
      .reduce(
        (a, v) => ({ ...a, [Object.keys(v)[0]]: Object.values(v)[0] }),
        {},
      );

    setAvailableIds(availableIdsLocal);
  }, [selectedPayloads, totalProposalCount, totalPayloadsCount]);

  const {
    error,
    setError,
    isTxStart,
    txHash,
    txPending,
    txSuccess,
    setIsTxStart,
    txWalletType,
    isError,
    executeTxWithLocalStatuses,
    fullTxErrorMessage,
    setFullTxErrorMessage,
  } = useLastTxLocalStatus({
    type: 'createProposal',
    payload: { proposalId: totalProposalCount },
  });

  const handleFormSubmit = async ({
    votingChainId,
    payloads,
    ipfsHash,
  }: FormProperties) => {
    setIsCreateProposalModalOpen(true);

    await executeTxWithLocalStatuses({
      errorMessage: 'Tx error',
      callbackFunction: async () =>
        await createProposal(
          appConfig.govCoreConfig.votingPortals[votingChainId],
          payloads,
          ipfsHash,
        ),
    });
  };

  return (
    <>
      <CreateFormWrapper title={texts.createPage.createProposalTitle}>
        <Form<FormProperties>
          mutators={{
            ...arrayMutators,
          }}
          onSubmit={handleFormSubmit}
          initialValues={{
            votingChainId: appConfig.votingMachineChainIds[0],
            ipfsHash:
              '0x366f499db7fed9b542e614e587312e417b6d8add2fc83840745781f5a70567b1',
          }}>
          {({
            handleSubmit,
            form: {
              reset,
              mutators: { push, pop },
            },
            values,
          }) => {
            return (
              <Box
                component="form"
                onSubmit={async (event) => {
                  await handleSubmit(event);
                  reset();
                }}>
                <Field
                  name="votingChainId"
                  type="number"
                  options={appConfig.votingMachineChainIds}
                  validate={composeValidators(required)}>
                  {(props) => (
                    <InputWrapper
                      label={texts.createPage.votingChainIdPlaceholder}
                      isError={props.meta.error && props.meta.touched}
                      error={props.meta.error}
                      css={{ mb: 25, zIndex: 5 }}>
                      <SelectField
                        withChainName
                        placeholder={texts.createPage.votingChainIdPlaceholder}
                        value={props.input.value}
                        onChange={(event) => {
                          props.input.onChange(event);
                          if (values.payloads && values.payloads.length > 0) {
                            values.payloads.forEach(() => {
                              pop('payloads');
                            });
                          }
                        }}
                        options={props.options}
                      />
                    </InputWrapper>
                  )}
                </Field>

                <Field name="ipfsHash" validate={composeValidators(required)}>
                  {(props) => (
                    <InputWrapper
                      label={texts.createPage.ipfsHashPlaceholder}
                      isError={props.meta.error && props.meta.touched}
                      error={props.meta.error}
                      css={{ mb: 25 }}>
                      <Input
                        {...props}
                        value={props.input.value}
                        onChange={props.input.onChange}
                        placeholder={texts.createPage.ipfsHashPlaceholder}
                      />
                    </InputWrapper>
                  )}
                </Field>

                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', my: 30 }}>
                  <Box
                    component="button"
                    type="button"
                    onClick={() => push('payloads', undefined)}>
                    <BoxWith3D
                      contentColor="$mainLight"
                      activeContentColor="$light"
                      withActions
                      borderSize={4}
                      css={{
                        minWidth: 97,
                        height: 30,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '$main',
                      }}>
                      <Box
                        component="p"
                        sx={{
                          fontWeight: '600',
                          letterSpacing: '0.03em',
                          fontSize: 12,
                          lineHeight: '15px',
                        }}>
                        {texts.createPage.addPayloadButtonTitle}
                      </Box>
                    </BoxWith3D>
                  </Box>
                </Box>

                <FieldArray name="payloads">
                  {({ fields }) => {
                    return (
                      <CreateFieldsArrayTitle
                        title={texts.createPage.payloadsTitle}
                        isTitleVisible={!!values.payloads}>
                        {fields.map((name, index) => (
                          <CreateFieldArrayWrapper
                            key={name}
                            fieldTitle={texts.createPage.payloadTitle(
                              index + 1,
                            )}
                            onRemoveClick={() => {
                              fields.remove(index);
                              handleDeletePayload(name);
                            }}>
                            <Field
                              name={`${name}.chainId`}
                              type="number"
                              validate={composeValidators(required)}
                              options={appConfig.payloadsControllerChainIds}>
                              {(props) => (
                                <InputWrapper
                                  label={
                                    texts.createPage.payloadChainIdPlaceholder
                                  }
                                  isError={
                                    props.meta.error && props.meta.touched
                                  }
                                  error={props.meta.error}
                                  css={{ mb: 25 }}>
                                  <SelectField
                                    withChainName
                                    placeholder={
                                      texts.createPage.payloadChainIdPlaceholder
                                    }
                                    value={props.input.value}
                                    onChange={(event) => {
                                      fields.update(index, {
                                        id: undefined,
                                        chainId: event,
                                        payloadsController: undefined,
                                      });
                                      props.input.onChange(event);
                                      const selectedPayload = {
                                        [name]: {
                                          id: undefined,
                                          event,
                                          payloadsController: undefined,
                                        },
                                      };
                                      setSelectedPayloads({
                                        ...selectedPayloads,
                                        ...selectedPayload,
                                      });
                                    }}
                                    options={props.options}
                                  />
                                </InputWrapper>
                              )}
                            </Field>

                            {!!values.payloads[index] &&
                              typeof values.payloads[index].chainId !==
                                'undefined' && (
                                <Field
                                  name={`${name}.payloadsController`}
                                  validate={composeValidators(required)}
                                  options={
                                    appConfig.payloadsControllerConfig[
                                      values.payloads[index].chainId
                                    ].contractAddresses
                                  }>
                                  {(props) => (
                                    <InputWrapper
                                      label={
                                        texts.createPage
                                          .payloadsControllerPlaceholder
                                      }
                                      isError={
                                        props.meta.error && props.meta.touched
                                      }
                                      error={props.meta.error}
                                      css={{ mb: 25 }}>
                                      <SelectField
                                        placeholder={
                                          texts.createPage
                                            .payloadsControllerPlaceholder
                                        }
                                        value={props.input.value}
                                        onChange={(event) => {
                                          props.input.onChange(event);
                                          handleSelectPayload(
                                            name,
                                            undefined,
                                            undefined,
                                            event,
                                          );
                                        }}
                                        options={props.options}
                                      />
                                    </InputWrapper>
                                  )}
                                </Field>
                              )}

                            {!!values.payloads[index] &&
                              typeof values.payloads[index].chainId !==
                                'undefined' &&
                              typeof values.payloads[index]
                                .payloadsController !== 'undefined' && (
                                <Field
                                  name={`${name}.id`}
                                  type="number"
                                  validate={composeValidators(required)}
                                  options={
                                    (!!availableIds &&
                                      availableIds[
                                        values.payloads[index]
                                          .payloadsController
                                      ]) ||
                                    []
                                  }>
                                  {(props) => (
                                    <InputWrapper
                                      label={
                                        texts.createPage.payloadIdPlaceholder
                                      }
                                      isError={
                                        props.meta.error && props.meta.touched
                                      }
                                      error={props.meta.error}
                                      css={{ mb: 25 }}>
                                      <SelectField
                                        placeholder={
                                          texts.createPage.payloadIdPlaceholder
                                        }
                                        value={props.input.value}
                                        onChange={(event) => {
                                          props.input.onChange(event);
                                          handleSelectPayload(
                                            name,
                                            event,
                                            undefined,
                                            undefined,
                                          );
                                        }}
                                        options={props.options}
                                      />
                                    </InputWrapper>
                                  )}
                                </Field>
                              )}
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
                  <BigButton type="submit" disabled={!values.payloads}>
                    {texts.other.create}
                  </BigButton>
                </Box>
              </Box>
            );
          }}
        </Form>
      </CreateFormWrapper>

      <CreateProposalModal
        error={error}
        isError={isError}
        setError={setError}
        isOpen={isCreateProposalModalOpen}
        setIsOpen={setIsCreateProposalModalOpen}
        isTxStart={isTxStart}
        setIsTxStart={setIsTxStart}
        txWalletType={txWalletType}
        txSuccess={txSuccess}
        txHash={txHash}
        txPending={txPending}
        proposalId={totalProposalCount}
        fullTxErrorMessage={fullTxErrorMessage}
        setFullTxErrorMessage={setFullTxErrorMessage}
      />
    </>
  );
}
