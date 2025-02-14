'use client';

import { WalletType } from '@bgd-labs/frontend-web3-utils';
import { Box, useTheme } from '@mui/system';
import dayjs from 'dayjs';
// eslint-disable-next-line import/default
import arrayMutators from 'final-form-arrays';
import isEqual from 'lodash/isEqual';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import { zeroAddress } from 'viem';

import WarningIcon from '/public/images/icons/warningIcon.svg';

import { useStore } from '../../store/ZustandStoreProvider';
import { useLastTxLocalStatus } from '../../transactions/hooks/useLastTxLocalStatus';
import { TxType } from '../../transactions/store/transactionsSlice';
import { BackButton3D, BigButton, BoxWith3D, Container, NoSSR } from '../../ui';
import { CustomSkeleton } from '../../ui/components/CustomSkeleton';
import { NoDataWrapper } from '../../ui/components/NoDataWrapper';
import { TopPanelContainer } from '../../ui/components/TopPanelContainer';
import { IconBox } from '../../ui/primitives/IconBox';
import { texts } from '../../ui/utils/texts';
import {
  checkIfAddressENS,
  checkIsGetAddressByENSNamePending,
} from '../../web3/store/ensSelectors';
import { DelegateData, DelegateItem } from '../types';
import { DelegateModal } from './DelegateModal';
import { DelegateTableWrapper } from './DelegateTableWrapper';

export function DelegatePage() {
  const theme = useTheme();
  const router = useRouter();

  const activeWallet = useStore((store) => store.activeWallet);
  const ensData = useStore((store) => store.ensData);
  const addressesNameInProgress = useStore(
    (store) => store.addressesNameInProgress,
  );
  const delegateData = useStore((store) => store.delegateData);
  const getDelegateData = useStore((store) => store.getDelegateData);
  const isDelegateModalOpen = useStore((store) => store.isDelegateModalOpen);
  const setDelegateModalOpen = useStore((store) => store.setDelegateModalOpen);
  const setConnectWalletModalOpen = useStore(
    (store) => store.setConnectWalletModalOpen,
  );
  const isDelegateChangedView = useStore(
    (store) => store.isDelegateChangedView,
  );
  const setIsDelegateChangedView = useStore(
    (store) => store.setIsDelegateChangedView,
  );
  const delegate = useStore((store) => store.delegate);
  const incorrectDelegationToFields = useStore(
    (store) => store.incorrectDelegationToFields,
  );

  const [isEdit, setIsEdit] = useState(false);
  const [formDelegateData, setFormDelegateData] = useState<DelegateData[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [stateDelegateData, setStateDelegateData] = useState<DelegateItem[]>(
    [],
  );
  const [submittedFormData, setSubmittedFormData] = useState<DelegateData[]>(
    [],
  );
  const [timestampTx] = useState(dayjs().unix());

  const {
    error,
    setError,
    loading,
    isTxStart,
    setIsTxStart,
    fullTxErrorMessage,
    setFullTxErrorMessage,
    executeTxWithLocalStatuses,
    tx,
  } = useLastTxLocalStatus({
    type: TxType.delegate,
    payload: {
      delegateData: stateDelegateData,
      formDelegateData: submittedFormData,
      timestamp: timestampTx,
    },
  });

  useEffect(() => {
    getDelegateData();
    setIsEdit(false);
    setIsDelegateChangedView(false);
  }, [activeWallet?.address]);

  useEffect(() => {
    if (delegateData.length) {
      setLoadingData(false);
    } else {
      setLoadingData(true);
    }
  }, [delegateData.length]);

  useEffect(() => {
    setFormDelegateData(
      delegateData.map((data) => {
        return {
          underlyingAsset: data.underlyingAsset,
          votingToAddress: data.votingToAddress,
          propositionToAddress: data.propositionToAddress,
        };
      }),
    );
  }, [activeWallet?.address, delegateData]);

  const handleFormSubmit = ({
    formDelegateData,
  }: {
    formDelegateData: DelegateData[];
  }) => {
    const formattedFormData = formDelegateData.map((data) => {
      return {
        underlyingAsset: data.underlyingAsset,
        votingToAddress: checkIfAddressENS(
          ensData,
          activeWallet?.address || zeroAddress,
          data.votingToAddress,
        ),
        propositionToAddress: checkIfAddressENS(
          ensData,
          activeWallet?.address || zeroAddress,
          data.propositionToAddress,
        ),
      };
    });

    setFormDelegateData(formattedFormData);
    setSubmittedFormData(formattedFormData);
    setStateDelegateData(delegateData);
    setIsEdit(false);
    setIsDelegateChangedView(true);
  };

  const handleDelegate = async () => {
    setDelegateModalOpen(true);
    if (!!stateDelegateData.length && !!submittedFormData.length) {
      await executeTxWithLocalStatuses({
        callbackFunction: async () =>
          await delegate(stateDelegateData, formDelegateData, timestampTx),
      });
    }
  };

  return (
    <>
      <TopPanelContainer>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            [theme.breakpoints.up('sm')]: {
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexDirection: 'row',
            },
          }}>
          <BackButton3D onClick={router.back} isVisibleOnMobile />
          {activeWallet &&
            activeWallet.isContractAddress &&
            activeWallet.walletType === WalletType.WalletConnect && (
              <NoSSR>
                <Box
                  sx={{
                    mt: 16,
                    [theme.breakpoints.up('sm')]: {
                      mt: 0,
                      ml: 16,
                    },
                  }}>
                  <BoxWith3D
                    borderSize={10}
                    contentColor="$mainLight"
                    css={{ p: 8, color: '$text' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <IconBox
                        sx={{
                          position: 'relative',
                          top: 4,
                          mr: 8,
                          width: 16,
                          height: 12,
                          '> svg': {
                            width: 16,
                            height: 12,
                          },
                        }}>
                        <WarningIcon />
                      </IconBox>
                      <Box>{texts.delegatePage.walletConnectSafeWarning}</Box>
                    </Box>
                  </BoxWith3D>
                </Box>
              </NoSSR>
            )}
        </Box>
      </TopPanelContainer>

      <Container>
        {activeWallet?.isActive ? (
          <>
            {!isEdit && isDelegateChangedView && (
              <DelegateTableWrapper
                loading={loadingData}
                delegateData={delegateData}
                isEdit={isEdit}
                isViewChanges={isDelegateChangedView}
                formDelegateData={formDelegateData}>
                <BigButton
                  color="white"
                  css={{ mr: 24 }}
                  onClick={() => {
                    setIsEdit(true);
                    setIsDelegateChangedView(false);
                  }}>
                  {texts.other.backToEdit}
                </BigButton>
                <BigButton
                  onClick={handleDelegate}
                  loading={loading || tx.pending}
                  disabled={
                    isEqual(
                      delegateData.map((data) => {
                        return {
                          underlyingAsset: data.underlyingAsset,
                          votingToAddress: data.votingToAddress,
                          propositionToAddress: data.propositionToAddress,
                        };
                      }),
                      formDelegateData,
                    ) ||
                    incorrectDelegationToFields.length !== 0 ||
                    formDelegateData.some(
                      (data) =>
                        checkIsGetAddressByENSNamePending(
                          addressesNameInProgress,
                          data.votingToAddress,
                        ) ||
                        checkIsGetAddressByENSNamePending(
                          addressesNameInProgress,
                          data.propositionToAddress,
                        ),
                    )
                  }>
                  {texts.other.confirm}
                </BigButton>
              </DelegateTableWrapper>
            )}
            {isEdit && !isDelegateChangedView && (
              <Form<{ formDelegateData: DelegateData[] }>
                mutators={{
                  ...arrayMutators,
                }}
                onSubmit={handleFormSubmit}
                initialValues={{
                  formDelegateData: formDelegateData,
                }}>
                {({ handleSubmit, values, errors }) => (
                  <DelegateTableWrapper
                    loading={loadingData}
                    delegateData={delegateData}
                    isEdit={isEdit}
                    isViewChanges={isDelegateChangedView}
                    formDelegateData={formDelegateData}
                    handleFormSubmit={handleSubmit}>
                    <BigButton
                      color="white"
                      css={{ mr: 24 }}
                      onClick={() => {
                        setFormDelegateData(
                          delegateData.map((data) => {
                            return {
                              underlyingAsset: data.underlyingAsset,
                              votingToAddress: data.votingToAddress,
                              propositionToAddress: data.propositionToAddress,
                            };
                          }),
                        );
                        setIsEdit(false);
                      }}>
                      {texts.other.close}
                    </BigButton>
                    <BigButton
                      type="submit"
                      disabled={
                        isEqual(
                          delegateData.map((data) => {
                            return {
                              underlyingAsset: data.underlyingAsset,
                              votingToAddress: data.votingToAddress,
                              propositionToAddress: data.propositionToAddress,
                            };
                          }),
                          values.formDelegateData.map((data) => {
                            return {
                              underlyingAsset: data.underlyingAsset,
                              votingToAddress: checkIfAddressENS(
                                ensData,
                                activeWallet.address,
                                data.votingToAddress,
                              ),
                              propositionToAddress: checkIfAddressENS(
                                ensData,
                                activeWallet.address,
                                data.propositionToAddress,
                              ),
                            };
                          }),
                        ) || !!Object.keys(errors || {}).length
                      }>
                      {texts.delegatePage.viewChanges}
                    </BigButton>
                  </DelegateTableWrapper>
                )}
              </Form>
            )}
            {!isEdit && !isDelegateChangedView && (
              <DelegateTableWrapper
                loading={loadingData}
                delegateData={delegateData}
                isEdit={isEdit}
                isViewChanges={isDelegateChangedView}>
                {loadingData ? (
                  <CustomSkeleton width={156} height={50} />
                ) : (
                  <BigButton onClick={() => setIsEdit(true)}>
                    {texts.other.edit}
                  </BigButton>
                )}
              </DelegateTableWrapper>
            )}
          </>
        ) : (
          <NoDataWrapper>
            <Box component="h2" sx={{ typography: 'h1', mt: 8 }}>
              {texts.delegatePage.notConnectedWallet}
            </Box>
            <Box
              component="p"
              sx={{ typography: 'body', mt: 12, mb: 20, maxWidth: 480 }}>
              {texts.delegatePage.notConnectedWalletDescription}
            </Box>

            <BigButton onClick={() => setConnectWalletModalOpen(true)}>
              {texts.delegatePage.notConnectedWalletButtonTitle}
            </BigButton>
          </NoDataWrapper>
        )}
      </Container>

      {!!submittedFormData.length && !!stateDelegateData.length && (
        <DelegateModal
          isOpen={isDelegateModalOpen}
          setIsOpen={setDelegateModalOpen}
          delegateData={stateDelegateData}
          formDelegateData={submittedFormData}
          error={error}
          setError={setError}
          isTxStart={isTxStart}
          setIsTxStart={setIsTxStart}
          fullTxErrorMessage={fullTxErrorMessage}
          setFullTxErrorMessage={setFullTxErrorMessage}
          tx={tx}
        />
      )}
    </>
  );
}
