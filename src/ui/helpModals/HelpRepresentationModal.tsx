import { Box, useTheme } from '@mui/system';
import arrayMutators from 'final-form-arrays';
import isEqual from 'lodash/isEqual';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-final-form';

import { RepresentationsTableWrapper } from '../../representations/components/RepresentationsTableWrapper';
import { RepresentationFormData } from '../../representations/store/representationsSlice';
import { useStore } from '../../store';
import { BasicModal } from '../components/BasicModal';
import { BigButton } from '../components/BigButton';
import { setRelativePath } from '../utils/relativePath';
import { texts } from '../utils/texts';
import { HelpModalCaption } from './HelpModalCaption';
import { HelpModalContainer, helpModalWidth } from './HelpModalContainer';
import { InfoType } from './HelpModalNavigation';
import { HelpModalText } from './HelpModalText';
import { HelpRepresentationsTx } from './HelpRepresentationsTx';
import { HelpTxWrapper } from './HelpTxWrapper';

interface HelpRepresentationModalProps {
  infoType?: InfoType;
}

export function HelpRepresentationModal({
  infoType,
}: HelpRepresentationModalProps) {
  const theme = useTheme();

  const [txPending, setTxPending] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);

  const [formData, setFormData] = useState<RepresentationFormData[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isRepresentationsChangedView, setIsRepresentationsChangedView] =
    useState(false);

  const {
    helpRepresentationsData,
    getHelpRepresentationsData,
    setHelpRepresentationsData,
    isHelpModalClosed,
    setIsHelpNavigationModalOpen,
    setIsHelpWalletModalOpen,
    setIsHelpRepresentativeModalOpen,
    setIsHelpRepresentationModalOpen,
    isHelpRepresentationModalOpen,
  } = useStore();

  useEffect(() => {
    getHelpRepresentationsData();
    setFormData([]);
    setIsEdit(false);
    setIsRepresentationsChangedView(false);
    setTxPending(false);
    setTxSuccess(false);
  }, [isHelpModalClosed]);

  if (!helpRepresentationsData) return null;

  const initialData = Object.entries(helpRepresentationsData).map((data) => {
    return {
      chainId: +data[0],
      representative:
        typeof data[1].representative === 'undefined'
          ? ''
          : data[1].representative,
    };
  });

  const handleFormSubmit = ({
    formData,
  }: {
    formData: RepresentationFormData[];
  }) => {
    setFormData(formData);
    setIsEdit(false);
    setIsRepresentationsChangedView(true);
  };

  const handleDelegate = async () => {
    setTxPending(true);
    setTimeout(() => {
      setTxPending(false);
      setTxSuccess(true);
      setIsRepresentationsChangedView(false);
      setHelpRepresentationsData(formData);
    }, 3000);
  };

  const Texts = () => {
    return (
      <>
        {!isEdit && !isRepresentationsChangedView && !txSuccess && (
          <>
            <HelpModalText mb={12}>
              {texts.faq.representations.startFirstDescription}
            </HelpModalText>
            <HelpModalText mb={12}>
              <b>{texts.faq.representations.startSecondDescription}</b>
            </HelpModalText>
            <HelpModalText>
              {texts.faq.representations.startThirdDescription}
            </HelpModalText>
          </>
        )}
        {isEdit && !isRepresentationsChangedView && !txSuccess && (
          <>
            <HelpModalText mb={12}>
              {texts.faq.representations.editFirstDescription}
            </HelpModalText>
            <HelpModalText>
              {texts.faq.representations.editSecondDescription}
            </HelpModalText>
          </>
        )}
        {!isEdit && isRepresentationsChangedView && !txSuccess && (
          <>
            <HelpModalText mb={12}>
              {texts.faq.representations.confirmFirstDescription}
            </HelpModalText>
            <HelpModalText>
              {texts.faq.representations.confirmSecondDescription}
            </HelpModalText>
          </>
        )}
        {!isEdit && !isRepresentationsChangedView && txSuccess && (
          <>
            <HelpModalText>
              {texts.faq.representations.doneDescription}
            </HelpModalText>
          </>
        )}
      </>
    );
  };

  return (
    <BasicModal
      maxWidth={helpModalWidth}
      isOpen={isHelpRepresentationModalOpen}
      setIsOpen={setIsHelpRepresentationModalOpen}
      withCloseButton
      onBackButtonClick={
        txSuccess
          ? () => {
              setFormData([]);
              setTxPending(false);
              setTxSuccess(false);
            }
          : () => {
              setIsHelpRepresentationModalOpen(false);
              infoType === InfoType.WalletOptions
                ? setIsHelpWalletModalOpen(true)
                : infoType === InfoType.Representation
                  ? setIsHelpRepresentativeModalOpen(true)
                  : setIsHelpNavigationModalOpen(true);
            }
      }>
      <HelpModalContainer
        onMainButtonClick={
          txSuccess && !txPending
            ? () => {
                getHelpRepresentationsData();
                setFormData([]);
                setIsEdit(false);
                setIsRepresentationsChangedView(false);
                setTxPending(false);
                setTxSuccess(false);
                setIsHelpRepresentationModalOpen(false);
                setIsHelpNavigationModalOpen(true);
              }
            : undefined
        }>
        {!txPending && (
          <>
            <HelpModalCaption
              caption={
                txSuccess
                  ? texts.faq.representations.selected
                  : isEdit && !isRepresentationsChangedView && !txSuccess
                    ? texts.faq.representations.edit
                    : !isEdit && isRepresentationsChangedView && !txSuccess
                      ? texts.faq.representations.confirmation
                      : texts.faq.representations.manage
              }
              image={
                <Box
                  sx={{
                    width: 220,
                    height: 200,
                    background:
                      theme.palette.mode === 'dark'
                        ? `url(${setRelativePath(
                            `/images/helpModals/representatives${
                              txSuccess
                                ? 'Done'
                                : isRepresentationsChangedView
                                  ? 'Confirmation'
                                  : isEdit
                                    ? 'Edit'
                                    : 'Manage'
                            }Dark.svg`,
                          )})`
                        : `url(${setRelativePath(
                            `/images/helpModals/representatives${
                              txSuccess
                                ? 'Done'
                                : isRepresentationsChangedView
                                  ? 'Confirmation'
                                  : isEdit
                                    ? 'Edit'
                                    : 'Manage'
                            }.svg`,
                          )})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    display: 'none',
                    [theme.breakpoints.up('sm')]: {
                      width: 235,
                      height: 265,
                      display: 'block',
                    },
                  }}
                />
              }>
              <Box
                sx={{
                  maxWidth: 500,
                  display: 'none',
                  [theme.breakpoints.up('sm')]: {
                    minHeight: 210,
                    display: 'block',
                  },
                }}>
                <Texts />
              </Box>
            </HelpModalCaption>

            <Box
              sx={{
                position: 'relative',
                [theme.breakpoints.up('md')]: {
                  maxWidth: 870,
                  margin: '0 auto',
                },
              }}>
              <Box
                sx={{
                  width: '100%',
                  position: 'relative',
                }}>
                <Box
                  sx={{
                    transition: 'all 0.2s ease',
                    [theme.breakpoints.up('sm')]: { pl: 0 },
                  }}>
                  {!isEdit && isRepresentationsChangedView && (
                    <RepresentationsTableWrapper
                      forHelp
                      loading={false}
                      representationData={helpRepresentationsData}
                      isEdit={isEdit}
                      isViewChanges={isRepresentationsChangedView}
                      formData={formData}>
                      <BigButton
                        alwaysWithBorders
                        color="white"
                        css={{ mr: 24 }}
                        onClick={() => {
                          setIsEdit(true);
                          setIsRepresentationsChangedView(false);
                        }}>
                        {texts.other.backToEdit}
                      </BigButton>
                      <BigButton
                        alwaysWithBorders
                        onClick={handleDelegate}
                        disabled={isEqual(initialData, formData)}>
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
                          forHelp
                          loading={false}
                          representationData={helpRepresentationsData}
                          isEdit={isEdit}
                          isViewChanges={isRepresentationsChangedView}
                          formData={formData}
                          handleFormSubmit={handleSubmit}>
                          <BigButton
                            alwaysWithBorders
                            color="white"
                            css={{ mr: 24 }}
                            onClick={() => {
                              setFormData(initialData);
                              setIsEdit(false);
                            }}>
                            {texts.other.close}
                          </BigButton>
                          <BigButton
                            alwaysWithBorders
                            type="submit"
                            disabled={
                              isEqual(
                                initialData,
                                values.formData.map((data) => {
                                  return {
                                    chainId: data.chainId,
                                    representative:
                                      data.representative === undefined
                                        ? ''
                                        : data.representative,
                                  };
                                }),
                              ) || !!Object.keys(errors || {}).length
                            }>
                            {texts.delegatePage.viewChanges}
                          </BigButton>
                        </RepresentationsTableWrapper>
                      )}
                    </Form>
                  )}
                  {!isEdit && !isRepresentationsChangedView && (
                    <RepresentationsTableWrapper
                      forHelp
                      loading={false}
                      representationData={helpRepresentationsData}
                      isEdit={isEdit}
                      isViewChanges={isRepresentationsChangedView}>
                      <BigButton
                        onClick={() => {
                          setFormData(initialData);
                          setIsEdit(true);
                          setTxSuccess(false);
                        }}
                        alwaysWithBorders>
                        {texts.other.edit}
                      </BigButton>
                    </RepresentationsTableWrapper>
                  )}
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                m: '30px auto 0',
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                [theme.breakpoints.up('sm')]: { display: 'none' },
              }}>
              <Texts />
            </Box>
          </>
        )}

        {txPending && (
          <HelpTxWrapper
            mobileTitle={texts.faq.delegate.txPendingTitle}
            txPending={txPending}
            txSuccess={txSuccess}
            txStartImageMobile="images/helpModals/txLoadingMobile.svg"
            txEndImageMobile="images/helpModals/txLoadingMobile.svg"
            withTxOnMobile
            txBlock={
              <HelpRepresentationsTx
                txPending={txPending}
                txSuccess={txSuccess}
                initialData={initialData}
                formData={formData}
                handleCancelClick={() => {
                  setTxPending(false);
                  setTxSuccess(false);
                  setIsRepresentationsChangedView(false);
                  setHelpRepresentationsData([]);
                }}
              />
            }>
            <>
              <Box
                component="h2"
                sx={{
                  mb: 20,
                  display: 'none',
                  [theme.breakpoints.up('sm')]: {
                    typography: 'h1',
                    display: 'block',
                  },
                }}>
                {texts.faq.representations.txPendingTitle}
              </Box>
              <Box
                component="p"
                sx={{ typography: 'body', lineHeight: '24px !important' }}>
                {texts.faq.representations.txPendingDescription}
              </Box>
            </>
          </HelpTxWrapper>
        )}
      </HelpModalContainer>
    </BasicModal>
  );
}
