'use client';

import { WalletType } from '@bgd-labs/frontend-web3-utils';
import { Box, useTheme } from '@mui/system';
import dayjs from 'dayjs';
import arrayMutators from 'final-form-arrays';
import isEqual from 'lodash/isEqual';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import { Hex } from 'viem';

import WarningIcon from '/public/images/icons/warningIcon.svg';

import { useStore } from '../../store';
import { useLastTxLocalStatus } from '../../transactions/hooks/useLastTxLocalStatus';
import { TxType } from '../../transactions/store/transactionsSlice';
import {
  BackButton3D,
  BigButton,
  BoxWith3D,
  Container,
  Link,
  NoSSR,
} from '../../ui';
import { CustomSkeleton } from '../../ui/components/CustomSkeleton';
import { NoDataWrapper } from '../../ui/components/NoDataWrapper';
import { TopPanelContainer } from '../../ui/components/TopPanelContainer';
import { IconBox } from '../../ui/primitives/IconBox';
import { texts } from '../../ui/utils/texts';
import {
  checkIsGetAddressByENSNamePending,
  getAddressByENSNameIfExists,
} from '../../web3/store/ensSelectors';
import { isEnsName } from '../../web3/utils/ensHelpers';
import { DelegateData, DelegateItem } from '../types';
import { DelegateModal } from './DelegateModal';
import { DelegateTableWrapper } from './DelegateTableWrapper';

export function DelegatePage() {
  const theme = useTheme();
  const router = useRouter();

  const store = useStore();
  const {
    activeWallet,
    delegateData,
    getDelegateData,
    isDelegateModalOpen,
    setDelegateModalOpen,
    setConnectWalletModalOpen,
    isDelegateChangedView,
    setIsDelegateChangedView,
    delegate,
    incorrectDelegationToFields,
    ensData,
  } = store;

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
    if (!!delegateData.length) {
      setLoadingData(false);
    } else {
      setLoadingData(true);
    }
  }, [delegateData.length]);

  // TODO: need fix `ensName` should be string
  useEffect(() => {
    setFormDelegateData(
      delegateData.map((data) => {
        return {
          underlyingAsset: data.underlyingAsset,
          votingToAddress:
            (ensData[data.votingToAddress.toLocaleLowerCase() as Hex]
              ?.name as Hex) || data.votingToAddress,
          propositionToAddress:
            (ensData[data.propositionToAddress.toLocaleLowerCase() as Hex]
              ?.name as Hex) || data.propositionToAddress,
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
        votingToAddress:
          data.votingToAddress === undefined ||
          data.votingToAddress.toLocaleLowerCase() ===
            activeWallet?.address.toLocaleLowerCase()
            ? ''
            : data.votingToAddress,
        propositionToAddress:
          data.propositionToAddress === undefined ||
          data.propositionToAddress.toLocaleLowerCase() ===
            activeWallet?.address.toLocaleLowerCase()
            ? ''
            : data.propositionToAddress,
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
                      <Box>
                        {texts.delegatePage.walletConnectSafeWarning}{' '}
                        <Link
                          css={{
                            color: '$textSecondary',
                            fontWeight: 600,
                            hover: { color: theme.palette.$text },
                          }}
                          href="https://github.com/bgd-labs/aave-governance-v3-interface/issues/24"
                          inNewWindow>
                          {texts.other.readMore}
                        </Link>
                        .
                      </Box>
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
                          store,
                          data.votingToAddress,
                        ) ||
                        checkIsGetAddressByENSNamePending(
                          store,
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
                              votingToAddress:
                                data.votingToAddress?.toLocaleLowerCase(),
                              propositionToAddress:
                                data.propositionToAddress?.toLocaleLowerCase(),
                            };
                          }),
                          values.formDelegateData.map((data) => {
                            return {
                              underlyingAsset: data.underlyingAsset,
                              votingToAddress:
                                data.votingToAddress === undefined ||
                                data.votingToAddress.toLocaleLowerCase() ===
                                  activeWallet.address.toLocaleLowerCase()
                                  ? ''
                                  : isEnsName(data.votingToAddress)
                                    ? getAddressByENSNameIfExists(
                                        store,
                                        data.votingToAddress,
                                      ) ||
                                      data.votingToAddress.toLocaleLowerCase()
                                    : data.votingToAddress.toLocaleLowerCase(),
                              propositionToAddress:
                                data.propositionToAddress === undefined ||
                                data.propositionToAddress.toLocaleLowerCase() ===
                                  activeWallet.address.toLocaleLowerCase()
                                  ? ''
                                  : isEnsName(data.propositionToAddress)
                                    ? getAddressByENSNameIfExists(
                                        store,
                                        data.propositionToAddress,
                                      ) ||
                                      data.propositionToAddress.toLocaleLowerCase()
                                    : data.propositionToAddress.toLocaleLowerCase(),
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
