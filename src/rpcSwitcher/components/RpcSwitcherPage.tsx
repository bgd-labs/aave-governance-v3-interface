'use client';

import { Box, useTheme } from '@mui/system';
import arrayMutators from 'final-form-arrays';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-final-form';

import { useStore } from '../../store';
import { BackButton3D, BigButton, Container } from '../../ui';
import { NoDataWrapper } from '../../ui/components/NoDataWrapper';
import { texts } from '../../ui/utils/texts';
import { RpcSwitcherFormData } from '../store/providerSlice';
import {
  checkValues,
  initialForm,
  setInitialForm,
} from '../utils/validationManagement';
import { RpcSwitcherTableWrapper } from './RpcSwitcherTableWrapper';

export function RpcSwitcherPage() {
  const theme = useTheme();
  const router = useRouter();

  const store = useStore();
  const {
    setConnectWalletModalOpen,
    activeWallet,
    appProviders,
    appProvidersStorage,
    updateProviders
  } = store;

  const [loadingData, setLoadingData] = useState(true);
  const [formData, setFormData] = useState<RpcSwitcherFormData>([]);
  const [changedValues, setChangedValues] = useState<RpcSwitcherFormData>([]);
  const initialData: RpcSwitcherFormData = Object.entries(appProviders).map(
    ([key, value]) => {
      return {
        chainId: +key,
        rpcUrl: value.rpcUrl,
      };
    },
  );

  useEffect(() => {
    setInitialForm(
      Object.entries(appProviders).map(([key, value]) => {
        return {
          chainId: +key,
          rpcUrl: value.rpcUrl,
        };
      }),
    );
  }, []);

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
    updateProviders(formData)
  };

  useEffect(() => {
    checkValues(initialForm, changedValues);
  }, [changedValues]);

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
            <Form<{ formData: RpcSwitcherFormData }>
              mutators={{
                ...arrayMutators,
              }}
              onSubmit={handleFormSubmit}
              initialValues={{
                formData: formData,
              }}>
              {({ handleSubmit, values, errors }) => {
                setChangedValues(values.formData);
                return (
                  <RpcSwitcherTableWrapper
                    loading={loadingData}
                    rpcSwitcherData={appProvidersStorage}
                    formData={formData}
                    handleFormSubmit={handleSubmit}>
                    <BigButton
                      type="submit"
                      disabled={!!Object.keys(errors || {}).length}>
                      {texts.other.confirm}
                    </BigButton>
                  </RpcSwitcherTableWrapper>
                );
              }}
            </Form>
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
    </>
  );
}
