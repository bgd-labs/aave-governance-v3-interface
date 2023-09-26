'use client';

import { Box, useTheme } from '@mui/system';
import dayjs from 'dayjs';
import arrayMutators from 'final-form-arrays';
import isEqual from 'lodash/isEqual';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-final-form';

import { useStore } from '../../store';
import { useLastTxLocalStatus } from '../../transactions/hooks/useLastTxLocalStatus';
import { BackButton3D, BigButton, Container } from '../../ui';
import { CustomSkeleton } from '../../ui/components/CustomSkeleton';
import { NoDataWrapper } from '../../ui/components/NoDataWrapper';
import { texts } from '../../ui/utils/texts';
import {
  checkIsGetAddressByENSNamePending,
  getAddressByENSNameIfExists,
} from '../../web3/store/ensSelectors';
import { isEnsName } from '../../web3/utils/ensHelpers';
import { RepresentationFormData } from '../store/representationsSlice';
import { RepresentationsModal } from './RepresentationsModal';
import { RepresentationsTableWrapper } from './RepresentationsTableWrapper';

export function RepresentationsPage() {
  const theme = useTheme();
  const router = useRouter();

  const store = useStore();
  const {
    setConnectWalletModalOpen,
    activeWallet,
    setIsRepresentationsChangedView,
    isRepresentationsChangedView,
    representationData,
    updateRepresentatives,
    isRepresentationsModalOpen,
    setRepresentationsModalOpen,
    resetL1Balances,
    incorrectRepresentationFields,
    ensData,
  } = store;

  const [loadingData, setLoadingData] = useState(true);
  const [formData, setFormData] = useState<RepresentationFormData[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [stateInitialData, setStateInitialData] = useState<
    RepresentationFormData[]
  >([]);
  const [submittedFormData, setSubmittedFormData] = useState<
    RepresentationFormData[]
  >([]);
  const [timestampTx] = useState(dayjs().unix());

  const initialData = Object.entries(representationData).map((data) => {
    return {
      chainId: +data[0],
      representative:
        ensData[data[1].representative.toLocaleLowerCase()]?.name ||
        data[1].representative,
    };
  });

  useEffect(() => {
    setIsEdit(false);
    setIsRepresentationsChangedView(false);
  }, [activeWallet?.accounts[0]]);

  useEffect(() => {
    if (!!Object.keys(representationData).length) {
      setLoadingData(false);
    } else {
      setLoadingData(true);
    }
  }, [Object.keys(representationData).length]);

  useEffect(() => {
    setFormData(initialData);
  }, [activeWallet?.accounts[0], representationData]);

  const {
    error,
    setError,
    loading,
    isTxStart,
    txHash,
    txPending,
    txSuccess,
    setIsTxStart,
    isError,
    txWalletType,
    setFullTxErrorMessage,
    fullTxErrorMessage,
    executeTxWithLocalStatuses,
  } = useLastTxLocalStatus({
    type: 'representations',
    payload: {
      initialData: stateInitialData,
      data: submittedFormData,
      timestamp: timestampTx,
    },
  });

  const handleFormSubmit = ({
    formData,
  }: {
    formData: RepresentationFormData[];
  }) => {
    setFormData(formData);
    setStateInitialData(initialData);
    setSubmittedFormData(formData);
    setIsEdit(false);
    setIsRepresentationsChangedView(true);
  };

  const handleRepresent = async () => {
    setRepresentationsModalOpen(true);
    if (!!submittedFormData.length && !!stateInitialData.length) {
      await executeTxWithLocalStatuses({
        errorMessage: texts.representationsPage.txError,
        callbackFunction: async () =>
          await updateRepresentatives(
            stateInitialData,
            submittedFormData,
            timestampTx,
          ),
      });
    }
  };

  return (
    <>
      <Container>
        <Box sx={{ mb: 12 }}>
          <BackButton3D onClick={router.back} isVisibleOnMobile />
        </Box>
      </Container>

      <Container
        sx={{
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
          paddingLeft: 12,
          paddingRight: 12,
          maxWidth: 860,
          [theme.breakpoints.up('sm')]: { paddingLeft: 20, paddingRight: 20 },
          [theme.breakpoints.up('lg')]: {
            maxWidth: 900,
          },
        }}>
        {activeWallet?.isActive ? (
          <>
            {!isEdit && isRepresentationsChangedView && (
              <RepresentationsTableWrapper
                loading={loadingData}
                representationData={representationData}
                isEdit={isEdit}
                isViewChanges={isRepresentationsChangedView}
                formData={formData}>
                <BigButton
                  color="white"
                  css={{ mr: 24 }}
                  onClick={() => {
                    setIsEdit(true);
                    setIsRepresentationsChangedView(false);
                  }}>
                  {texts.other.backToEdit}
                </BigButton>
                <BigButton
                  onClick={async () => {
                    if (isEqual(initialData, formData)) {
                      setIsEdit(false);
                      setIsRepresentationsChangedView(false);
                      resetL1Balances();
                    } else {
                      await handleRepresent();
                    }
                  }}
                  loading={loading || txPending}
                  disabled={
                    isEqual(initialData, formData) ||
                    incorrectRepresentationFields.length > 0 ||
                    formData.some((data) =>
                      checkIsGetAddressByENSNamePending(
                        store,
                        data.representative,
                      ),
                    )
                  }>
                  {texts.other.confirm}
                </BigButton>
              </RepresentationsTableWrapper>
            )}
            {isEdit && !isRepresentationsChangedView && (
              <Form<{ formData: RepresentationFormData[] }>
                mutators={{
                  ...arrayMutators,
                }}
                onSubmit={handleFormSubmit}
                initialValues={{
                  formData: formData,
                }}>
                {({ handleSubmit, values, errors }) => (
                  <RepresentationsTableWrapper
                    loading={loadingData}
                    representationData={representationData}
                    isEdit={isEdit}
                    isViewChanges={isRepresentationsChangedView}
                    formData={formData}
                    handleFormSubmit={handleSubmit}>
                    <BigButton
                      color="white"
                      css={{ mr: 24 }}
                      onClick={() => {
                        setFormData(initialData);
                        setIsEdit(false);
                      }}>
                      {texts.other.close}
                    </BigButton>
                    <BigButton
                      type="submit"
                      disabled={
                        isEqual(
                          initialData.map((data) => {
                            return {
                              chainId: data.chainId,
                              representative:
                                data.representative?.toLocaleLowerCase(),
                            };
                          }),
                          values.formData.map((data) => {
                            return {
                              chainId: data.chainId,
                              representative:
                                data.representative === undefined
                                  ? ''
                                  : isEnsName(data.representative)
                                  ? getAddressByENSNameIfExists(
                                      store,
                                      data.representative,
                                    ) || data.representative.toLocaleLowerCase()
                                  : data.representative.toLocaleLowerCase(),
                            };
                          }),
                        ) || !!Object.keys(errors || {}).length
                      }>
                      {texts.other.paginationNext}
                    </BigButton>
                  </RepresentationsTableWrapper>
                )}
              </Form>
            )}
            {!isEdit && !isRepresentationsChangedView && (
              <RepresentationsTableWrapper
                loading={loadingData}
                representationData={representationData}
                isEdit={isEdit}
                isViewChanges={isRepresentationsChangedView}>
                {loadingData ? (
                  <CustomSkeleton width={156} height={50} />
                ) : (
                  <BigButton onClick={() => setIsEdit(true)}>
                    {texts.other.edit}
                  </BigButton>
                )}
              </RepresentationsTableWrapper>
            )}
          </>
        ) : (
          <NoDataWrapper>
            <Box component="h2" sx={{ typography: 'h1', mt: 8 }}>
              {texts.representationsPage.notConnectedWallet}
            </Box>
            <Box
              component="p"
              sx={{ typography: 'body', mt: 12, mb: 20, maxWidth: 480 }}>
              {texts.representationsPage.notConnectedWalletDescription}
            </Box>

            <BigButton onClick={() => setConnectWalletModalOpen(true)}>
              {texts.representationsPage.notConnectedWalletButtonTitle}
            </BigButton>
          </NoDataWrapper>
        )}
      </Container>

      {!!submittedFormData.length && !!stateInitialData.length && (
        <RepresentationsModal
          isOpen={isRepresentationsModalOpen}
          setIsOpen={setRepresentationsModalOpen}
          initialData={stateInitialData}
          formData={submittedFormData}
          error={error}
          setError={setError}
          isTxStart={isTxStart}
          setIsTxStart={setIsTxStart}
          txWalletType={txWalletType}
          txSuccess={txSuccess}
          txHash={txHash}
          txPending={txPending}
          isError={isError}
          setFullTxErrorMessage={setFullTxErrorMessage}
          fullTxErrorMessage={fullTxErrorMessage}
        />
      )}
    </>
  );
}
