import { Box } from '@mui/system';
import arrayMutators from 'final-form-arrays';
import { useEffect, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { Hex } from 'viem';

import { appConfig } from '../../configs/appConfig';
import { getAvailablePayloadsIdsByChainId } from '../../helpers/getAvailablePayloadsIdsByChainId';
import { composeValidators, required } from '../../helpers/inputValidation';
import { texts } from '../../helpers/texts/texts';
import { useLastTxLocalStatus } from '../../helpers/useLastTxLocalStatus';
import { useStore } from '../../providers/ZustandStoreProvider';
import { TxType } from '../../store/transactionsSlice';
import { CreateProposalPageParams, ProposalInitialStruct } from '../../types';
import { BigButton } from '../BigButton';
import { BoxWith3D } from '../BoxWith3D';
import { InputWrapper } from '../InputWrapper';
import { Input } from '../primitives/Input';
import { SelectField } from '../SelectField';
import { CreateFieldArrayWrapper } from './CreateFieldArrayWrapper';
import { CreateFieldsArrayTitle } from './CreateFieldsArrayTitle';
import { CreateFormWrapper } from './CreateFormWrapper';
import { CreateProposalModal } from './CreateProposalModal';

type FormProperties = {
  votingChainId: number;
  ipfsHash: string;
} & Pick<ProposalInitialStruct, 'payloads'>;

export function CreateProposalForm({
  proposalsCount,
  payloadsCount,
  payloadsAvailableIds,
  cancellationFee,
  proposalsData,
}: Pick<
  CreateProposalPageParams,
  | 'proposalsCount'
  | 'payloadsCount'
  | 'payloadsAvailableIds'
  | 'cancellationFee'
  | 'proposalsData'
>) {
  const createProposal = useStore((store) => store.createProposal);
  const [isCreateProposalModalOpen, setIsCreateProposalModalOpen] =
    useState(false);

  const [availableIds, setAvailableIds] =
    useState<Record<string, number[]>>(payloadsAvailableIds);
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
    if (selectedPayloads[fieldName]) {
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

    const availablePayloadsIds = getAvailablePayloadsIdsByChainId({
      chainId:
        Object.values(selectedPayloads).map((payload) => payload.chainId)[0] ??
        1,
      proposalsCount,
      proposalsData,
      payloadsCount,
    });

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

          const availablePayloadsIds = getAvailablePayloadsIdsByChainId({
            chainId:
              Object.values(selectedPayloads).map(
                (payload) => payload.chainId,
              )[0] ?? 1,
            proposalsCount,
            proposalsData,
            payloadsCount,
          });

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
  }, [selectedPayloads, proposalsCount, payloadsCount]);

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
    type: TxType.createProposal,
    payload: { proposalId: proposalsCount },
  });

  const handleFormSubmit = async ({
    votingChainId,
    payloads,
    ipfsHash,
  }: FormProperties) => {
    setIsCreateProposalModalOpen(true);

    await executeTxWithLocalStatuses({
      callbackFunction: async () =>
        await createProposal({
          votingPortalAddress:
            appConfig.govCoreConfig.votingPortals[votingChainId],
          ipfsHash: ipfsHash as Hex,
          cancellationFee,
          proposalsCount,
          payloads,
        }),
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
                              typeof values.payloads[index].chain !==
                                'undefined' && (
                                <Field
                                  name={`${name}.payloadsController`}
                                  validate={composeValidators(required)}
                                  options={
                                    appConfig.payloadsControllerConfig[
                                      Number(values.payloads[index].chain)
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
                              typeof values.payloads[index].chain !==
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
        setError={setError}
        isOpen={isCreateProposalModalOpen}
        setIsOpen={setIsCreateProposalModalOpen}
        isTxStart={isTxStart}
        setIsTxStart={setIsTxStart}
        proposalId={proposalsCount}
        fullTxErrorMessage={fullTxErrorMessage}
        setFullTxErrorMessage={setFullTxErrorMessage}
        tx={tx}
      />
    </>
  );
}
