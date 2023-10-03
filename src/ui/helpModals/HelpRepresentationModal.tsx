import { Box, useTheme } from '@mui/system';
import arrayMutators from 'final-form-arrays';
import isEqual from 'lodash/isEqual';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-final-form';

import ArrowToRight from '/public/images/icons/arrowToRightW.svg';

import { RepresentationsTableWrapper } from '../../representations/components/RepresentationsTableWrapper';
import { RepresentationFormData } from '../../representations/store/representationsSlice';
import { useStore } from '../../store';
import { BasicModal } from '../components/BasicModal';
import { BigButton } from '../components/BigButton';
import { IconBox } from '../primitives/IconBox';
import { setRelativePath } from '../utils/relativePath';
import { texts } from '../utils/texts';
import { media } from '../utils/themeMUI';
import { useMediaQuery } from '../utils/useMediaQuery';
import { HelpModalCaption } from './HelpModalCaption';
import { HelpModalContainer, helpModalWidth } from './HelpModalContainer';
import { InfoType } from './HelpModalNavigation';
import { HelpRepresentationsTx } from './HelpRepresentationsTx';
import { HelpTxWrapper } from './HelpTxWrapper';

interface HelpRepresentationModalProps {
  infoType?: InfoType;
}

export function HelpRepresentationModal({
  infoType,
}: HelpRepresentationModalProps) {
  const theme = useTheme();
  const sm = useMediaQuery(media.sm);

  const [txPending, setTxPending] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);
  const [isFirstStepOnMobile, setIsFirstStepOnMobile] = useState(true);

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

  useEffect(() => {
    if (!sm) {
      setFormData([]);
      setIsEdit(false);
      setIsRepresentationsChangedView(false);
      setTxPending(false);
      setTxSuccess(false);
      setIsFirstStepOnMobile(true);
    }
  }, [sm]);

  if (!helpRepresentationsData) return null;

  const initialData = Object.entries(helpRepresentationsData).map((data) => {
    return {
      chainId: +data[0],
      representative: data[1].representative,
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

  const DelegateModalTexts = () => {
    return (
      <>
        {!isEdit && !isRepresentationsChangedView && !txSuccess && (
          <>
            <Box
              component="p"
              sx={{
                typography: 'body',
                lineHeight: '20px !important',
                mb: 12,
                [theme.breakpoints.up('lg')]: {
                  typography: 'body',
                  lineHeight: '26px !important',
                },
              }}>
              {texts.faq.delegate.startFirstDescription}
            </Box>
            <Box
              component="p"
              sx={{
                typography: 'body',
                lineHeight: '20px !important',
                [theme.breakpoints.up('lg')]: {
                  typography: 'body',
                  lineHeight: '26px !important',
                },
              }}>
              {texts.faq.delegate.startSecondDescription}
            </Box>
            <Box
              sx={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                display: isFirstStepOnMobile ? 'flex' : 'none',
                mt: 24,
                [theme.breakpoints.up('sm')]: {
                  display: 'none',
                },
              }}>
              <BigButton
                alwaysWithBorders
                onClick={() => setIsFirstStepOnMobile(false)}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    svg: { path: { fill: theme.palette.$textWhite } },
                  }}>
                  <Box component="p" sx={{ typography: 'body' }}>
                    {texts.faq.other.next}
                  </Box>
                  <IconBox
                    sx={{
                      width: 20,
                      height: 20,
                      ml: 10,
                      '> svg': { width: 20, height: 20 },
                    }}>
                    <ArrowToRight />
                  </IconBox>
                </Box>
              </BigButton>
            </Box>
          </>
        )}
        {isEdit && !isRepresentationsChangedView && !txSuccess && (
          <>
            <Box
              component="p"
              sx={{
                typography: 'body',
                mb: 12,
                lineHeight: '20px !important',
                [theme.breakpoints.up('lg')]: {
                  typography: 'body',
                  lineHeight: '26px !important',
                },
              }}>
              {texts.faq.delegate.editFirstDescription}
            </Box>
            <Box
              component="p"
              sx={{
                typography: 'body',
                mb: 12,
                lineHeight: '20px !important',
                [theme.breakpoints.up('lg')]: {
                  typography: 'body',
                  lineHeight: '26px !important',
                },
              }}>
              {texts.faq.delegate.editSecondDescription}
            </Box>
            <Box
              component="p"
              sx={{
                typography: 'body',
                lineHeight: '20px !important',
                [theme.breakpoints.up('lg')]: {
                  typography: 'body',
                  lineHeight: '26px !important',
                },
              }}>
              {texts.faq.delegate.editThirdDescription}
            </Box>
          </>
        )}
        {!isEdit && isRepresentationsChangedView && !txSuccess && (
          <>
            <Box
              component="p"
              sx={{
                typography: 'body',
                mb: 12,
                lineHeight: '20px !important',
                [theme.breakpoints.up('lg')]: {
                  typography: 'body',
                  lineHeight: '26px !important',
                },
              }}>
              {texts.faq.delegate.confirmFirstDescription}
            </Box>
            <Box
              component="p"
              sx={{
                typography: 'body',
                lineHeight: '20px !important',
                [theme.breakpoints.up('lg')]: {
                  typography: 'body',
                  lineHeight: '26px !important',
                },
              }}>
              {texts.faq.delegate.confirmSecondDescription}
            </Box>
          </>
        )}
        {!isEdit && !isRepresentationsChangedView && txSuccess && (
          <>
            <Box
              component="p"
              sx={{
                typography: 'body',
                lineHeight: '20px !important',
                [theme.breakpoints.up('lg')]: {
                  typography: 'body',
                  lineHeight: '26px !important',
                },
              }}>
              {texts.faq.delegate.delegatedFirstDescription}
            </Box>
            <Box
              component="p"
              sx={{
                typography: 'body',
                lineHeight: '20px !important',
                [theme.breakpoints.up('lg')]: {
                  typography: 'body',
                  lineHeight: '26px !important',
                },
              }}>
              {texts.faq.delegate.delegatedSecondDescription}
            </Box>
          </>
        )}
      </>
    );
  };

  return (
    <BasicModal
      withoutAnimationWhenOpen
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
          : !isFirstStepOnMobile
          ? () => {
              setFormData([]);
              setIsEdit(false);
              setIsRepresentationsChangedView(false);
              setTxPending(false);
              setTxSuccess(false);
              setIsFirstStepOnMobile(true);
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
                setIsFirstStepOnMobile(true);
              }
            : undefined
        }>
        {!txPending && (
          <>
            <HelpModalCaption
              caption={
                txSuccess
                  ? texts.faq.delegate.delegated
                  : isEdit && !isRepresentationsChangedView && !txSuccess
                  ? texts.faq.delegate.editMode
                  : !isEdit && isRepresentationsChangedView && !txSuccess
                  ? texts.faq.delegate.confirmation
                  : !isEdit &&
                    !isRepresentationsChangedView &&
                    !txSuccess &&
                    !isFirstStepOnMobile
                  ? texts.faq.delegate.delegationBar
                  : texts.faq.delegate.delegation
              }
              image={
                <Box
                  sx={{
                    width: 220,
                    height: 200,
                    background:
                      theme.palette.mode === 'dark'
                        ? `url(${setRelativePath(
                            `/images/helpModals/${
                              isRepresentationsChangedView
                                ? 'delegationChange'
                                : isEdit
                                ? 'delegationEdit'
                                : 'delegationMain'
                            }Dark.svg`,
                          )})`
                        : `url(${setRelativePath(
                            `/images/helpModals/${
                              isRepresentationsChangedView
                                ? 'delegationChange'
                                : isEdit
                                ? 'delegationEdit'
                                : 'delegationMain'
                            }.svg`,
                          )})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    display:
                      !isEdit &&
                      !isRepresentationsChangedView &&
                      !txSuccess &&
                      isFirstStepOnMobile
                        ? 'block'
                        : 'none',
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
                <DelegateModalTexts />
              </Box>
            </HelpModalCaption>

            <Box
              sx={{
                position: 'relative',
                display: isFirstStepOnMobile ? 'none' : 'block',
                [theme.breakpoints.up('sm')]: {
                  display: 'block',
                },
                [theme.breakpoints.up('md')]: {
                  maxWidth: 940,
                  margin: '0 auto',
                },
                [theme.breakpoints.up('lg')]: { maxWidth: 'unset' },
              }}>
              <Box
                sx={{
                  width: '100%',
                  position: 'relative',
                }}>
                <Box
                  sx={{
                    pl:
                      !isEdit && !isRepresentationsChangedView && !txSuccess
                        ? 15
                        : 0,
                    transition: 'all 0.2s ease',
                    [theme.breakpoints.up('sm')]: { pl: 0 },
                  }}>
                  {!isEdit && isRepresentationsChangedView && (
                    <RepresentationsTableWrapper
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
                          setFormData(initialData);
                          setIsRepresentationsChangedView(false);
                        }}>
                        {texts.other.cancel}
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
                            disabled={isEqual(
                              formData,
                              values.formData.map((data) => {
                                return {
                                  chainId: data.chainId,
                                  representative:
                                    data.representative === undefined
                                      ? ''
                                      : data.representative,
                                };
                              }),
                            )}>
                            {texts.delegatePage.viewChanges}
                          </BigButton>
                        </RepresentationsTableWrapper>
                      )}
                    </Form>
                  )}
                  {!isEdit && !isRepresentationsChangedView && (
                    <RepresentationsTableWrapper
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
              <DelegateModalTexts />
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
                {texts.faq.delegate.txPendingTitle}
              </Box>
              <Box
                component="p"
                sx={{ typography: 'body', lineHeight: '26px !important' }}>
                {texts.faq.delegate.txPendingDescription}
              </Box>
            </>
          </HelpTxWrapper>
        )}
      </HelpModalContainer>
    </BasicModal>
  );
}
