'use client';

import { Box, useTheme } from '@mui/system';
import arrayMutators from 'final-form-arrays';
import { isEqual } from 'lodash';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-final-form';

import { useStore } from '../../store';
import { BackButton3D, BigButton, Container } from '../../ui';
import { CustomSkeleton } from '../../ui/components/CustomSkeleton';
import { texts } from '../../ui/utils/texts';
import { RpcSwitcherFormData } from '../store/providerSlice';
import { RpcSwitcherTableWrapper } from './RpcSwitcherTableWrapper';

export function RpcSwitcherPage() {
  const theme = useTheme();
  const router = useRouter();

  const store = useStore();
  const {
    activeWallet,
    appProviders,
    appProvidersForm,
    updateProviders,
    isRpcSwitcherChangedView,
    setIsRpcSwitcherChangedView,
  } = store;

  const [isEdit, setIsEdit] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [formData, setFormData] = useState<RpcSwitcherFormData>([]);

  const initialData: RpcSwitcherFormData = Object.entries(appProviders).map(
    ([key, value]) => {
      return {
        chainId: +key,
        rpcUrl: value.rpcUrl,
      };
    },
  );

  useEffect(() => {
    setIsEdit(false);
    setIsRpcSwitcherChangedView(false);
  }, [activeWallet?.accounts[0]]);

  useEffect(() => {
    setFormData(initialData);
  }, [activeWallet?.accounts[0], appProviders]);

  useEffect(() => {
    if (!!Object.keys(appProviders).length) {
      setLoadingData(false);
    } else {
      setLoadingData(true);
    }
  }, [Object.keys(appProviders).length]);

  useEffect(() => {
    setFormData(initialData);
  }, [activeWallet?.accounts[0], appProviders]);

  const handleFormSubmit = ({
    formData,
  }: {
    formData: RpcSwitcherFormData;
  }) => {
    setFormData(formData);
    setIsEdit(false);
    setIsRpcSwitcherChangedView(true);
  };

  const handleUpdateProviders = async () => {
    updateProviders(formData);
    setIsEdit(false);
    setIsRpcSwitcherChangedView(false);
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
        <>
          {!isEdit && isRpcSwitcherChangedView && (
            <RpcSwitcherTableWrapper
              loading={loadingData}
              rpcSwitcherData={appProvidersForm}
              isEdit={isEdit}
              isViewChanges={isRpcSwitcherChangedView}
              formData={formData}>
              <BigButton
                color="white"
                css={{ mr: 24 }}
                onClick={() => {
                  setIsEdit(true);
                  setIsRpcSwitcherChangedView(false);
                }}>
                {texts.other.backToEdit}
              </BigButton>
              <BigButton
                onClick={async () => {
                  if (isEqual(initialData, formData)) {
                    setIsEdit(false);
                    setIsRpcSwitcherChangedView(false);
                  } else {
                    await handleUpdateProviders();
                  }
                }}
                // loading={loading || txPending}
                disabled={
                  isEqual(initialData, formData)
                  // incorrectRepresentationFields.length > 0 ||
                  // formData.some((data) =>
                  //   checkIsGetAddressByENSNamePending(
                  //     store,
                  //     data.representative,
                  //   ),
                  // )
                }>
                {texts.other.confirm}
              </BigButton>
            </RpcSwitcherTableWrapper>
          )}
          {isEdit && !isRpcSwitcherChangedView && (
            <Form<{ formData: RpcSwitcherFormData }>
              mutators={{
                ...arrayMutators,
              }}
              onSubmit={handleFormSubmit}
              initialValues={{
                formData: formData,
              }}>
              {({ handleSubmit, values, errors, validating }) => {
                return (
                  <>
                    <RpcSwitcherTableWrapper
                      isEdit={isEdit}
                      isViewChanges={isRpcSwitcherChangedView}
                      loading={loadingData}
                      rpcSwitcherData={appProvidersForm}
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
                        loading={validating}
                        disabled={
                          !!Object.keys(errors || {}).length || validating
                        }>
                        {texts.other.confirm}
                      </BigButton>
                    </RpcSwitcherTableWrapper>
                  </>
                );
              }}
            </Form>
          )}
          {!isEdit && !isRpcSwitcherChangedView && (
            <RpcSwitcherTableWrapper
              loading={loadingData}
              rpcSwitcherData={appProvidersForm}
              isEdit={isEdit}
              isViewChanges={isRpcSwitcherChangedView}>
              {loadingData ? (
                <CustomSkeleton width={156} height={50} />
              ) : (
                <BigButton onClick={() => setIsEdit(true)}>
                  {texts.other.edit}
                </BigButton>
              )}
            </RpcSwitcherTableWrapper>
          )}
        </>
      </Container>
    </>
  );
}
