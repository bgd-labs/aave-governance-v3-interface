import { Box, useTheme } from '@mui/system';
import arrayMutators from 'final-form-arrays';
import isEqual from 'lodash/isEqual';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-final-form';

import ArrowToRight from '/public/images/icons/arrowToRightW.svg';

import { DelegateTableWrapper } from '../../delegate/components/DelegateTableWrapper';
import { DelegateData } from '../../delegate/types';
import { useStore } from '../../store';
import { BigButton } from '../';
import { BasicModal } from '../components/BasicModal';
import { IconBox } from '../primitives/IconBox';
import { setRelativePath } from '../utils/relativePath';
import { texts } from '../utils/texts';
import { media } from '../utils/themeMUI';
import { useMediaQuery } from '../utils/useMediaQuery';
import { HelpDelegateTx } from './HelpDelegateTx';
import { HelpModalCaption } from './HelpModalCaption';
import { HelpModalContainer, helpModalWidth } from './HelpModalContainer';
import { InfoType } from './HelpModalNavigation';
import { HelpModalTextButton } from './HelpModalTextButton';
import { HelpModalTooltip } from './HelpModalTooltip';
import { HelpTxWrapper } from './HelpTxWrapper';

interface HelpDelegateModalProps {
  infoType?: InfoType;
}

export function HelpDelegateModal({ infoType }: HelpDelegateModalProps) {
  const theme = useTheme();
  const sm = useMediaQuery(media.sm);

  const [txPending, setTxPending] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);
  const [isFirstStepOnMobile, setIsFirstStepOnMobile] = useState(true);

  const [isEdit, setIsEdit] = useState(false);
  const [isDelegateChangedView, setIsDelegateChangedView] = useState(false);
  const [formDelegateData, setFormDelegateData] = useState<DelegateData[]>([]);

  const {
    isHelpModalClosed,
    isHelpDelegateModalOpen,
    setIsHelpDelegateModalOpen,
    setIsHelpNavigationModalOpen,
    setIsHelpWalletModalOpen,
    helpDelegateData,
    getHelpDelegateData,
    setIsHelpDelegationVotingPowerModalOpen,
    setIsHelpDelegationPropositionPowerModalOpen,
    setHelpDelegateData,
  } = useStore();

  useEffect(() => {
    getHelpDelegateData();
    setFormDelegateData([]);
    setIsEdit(false);
    setIsDelegateChangedView(false);
    setTxPending(false);
    setTxSuccess(false);
  }, [isHelpModalClosed]);

  useEffect(() => {
    if (!sm) {
      setFormDelegateData([]);
      setIsEdit(false);
      setIsDelegateChangedView(false);
      setTxPending(false);
      setTxSuccess(false);
      setIsFirstStepOnMobile(true);
    }
  }, [sm]);

  if (!helpDelegateData) return null;

  const handleFormSubmit = ({
    formDelegateData,
  }: {
    formDelegateData: DelegateData[];
  }) => {
    const formattedFormData = formDelegateData.map((data) => {
      return {
        underlyingAsset: data.underlyingAsset,
        votingToAddress:
          data.votingToAddress === undefined ? '' : data.votingToAddress,
        propositionToAddress:
          data.propositionToAddress === undefined
            ? ''
            : data.propositionToAddress,
      };
    });

    setFormDelegateData(formattedFormData);
    setIsEdit(false);
    setIsDelegateChangedView(true);
  };

  const handleDelegate = async () => {
    setTxPending(true);
    setTimeout(() => {
      setTxPending(false);
      setTxSuccess(true);
      setIsDelegateChangedView(false);
      setHelpDelegateData(
        helpDelegateData.map((item) => {
          return {
            symbol: item.symbol,
            amount: item.amount,
            underlyingAsset: formDelegateData[0].underlyingAsset,
            votingToAddress: formDelegateData[0].votingToAddress,
            propositionToAddress: formDelegateData[0].propositionToAddress,
          };
        }),
      );
    }, 3000);
  };

  const DelegateModalTexts = () => {
    return (
      <>
        {!isEdit && !isDelegateChangedView && !txSuccess && (
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
        {isEdit && !isDelegateChangedView && !txSuccess && (
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
        {!isEdit && isDelegateChangedView && !txSuccess && (
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
        {!isEdit && !isDelegateChangedView && txSuccess && (
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
      isOpen={isHelpDelegateModalOpen}
      setIsOpen={setIsHelpDelegateModalOpen}
      withCloseButton
      onBackButtonClick={
        txSuccess
          ? () => {
              setFormDelegateData([]);
              setTxPending(false);
              setTxSuccess(false);
            }
          : !isFirstStepOnMobile
          ? () => {
              setFormDelegateData([]);
              setIsEdit(false);
              setIsDelegateChangedView(false);
              setTxPending(false);
              setTxSuccess(false);
              setIsFirstStepOnMobile(true);
            }
          : () => {
              setIsHelpDelegateModalOpen(false);
              infoType === InfoType.WalletOptions
                ? setIsHelpWalletModalOpen(true)
                : setIsHelpNavigationModalOpen(true);
            }
      }>
      <HelpModalContainer
        onMainButtonClick={
          txSuccess && !txPending
            ? () => {
                getHelpDelegateData();
                setFormDelegateData([]);
                setIsEdit(false);
                setIsDelegateChangedView(false);
                setTxPending(false);
                setTxSuccess(false);
                setIsHelpDelegateModalOpen(false);
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
                  : isEdit && !isDelegateChangedView && !txSuccess
                  ? texts.faq.delegate.editMode
                  : !isEdit && isDelegateChangedView && !txSuccess
                  ? texts.faq.delegate.confirmation
                  : !isEdit &&
                    !isDelegateChangedView &&
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
                              isDelegateChangedView
                                ? 'delegationChange'
                                : isEdit
                                ? 'delegationEdit'
                                : 'delegationMain'
                            }Dark.svg`,
                          )})`
                        : `url(${setRelativePath(
                            `/images/helpModals/${
                              isDelegateChangedView
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
                      !isDelegateChangedView &&
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
                  display: 'none',
                  [theme.breakpoints.up('md')]: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: -10,
                  },
                }}>
                <Box sx={{ flex: 1 }} />
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 2,
                    ml: 20,
                    [theme.breakpoints.up('lg')]: {
                      ml: 45,
                    },
                  }}>
                  <HelpModalTooltip maxWidth={270}>
                    <Box component="p" sx={{ typography: 'body' }}>
                      {texts.faq.delegate.tooltipFirstPart}{' '}
                      <HelpModalTextButton
                        white
                        onClick={() => {
                          setIsHelpDelegateModalOpen(false);
                          setIsHelpDelegationVotingPowerModalOpen(true);
                        }}>
                        <>{texts.faq.delegate.votingPower}</>
                      </HelpModalTextButton>
                    </Box>
                  </HelpModalTooltip>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 2,
                    mr: 30,
                    [theme.breakpoints.up('lg')]: {
                      mr: 50,
                    },
                  }}>
                  <HelpModalTooltip maxWidth={270} countNumber={2}>
                    <Box component="p" sx={{ typography: 'body' }}>
                      {texts.faq.delegate.tooltipFirstPart}{' '}
                      <HelpModalTextButton
                        white
                        onClick={() => {
                          setIsHelpDelegateModalOpen(false);
                          setIsHelpDelegationPropositionPowerModalOpen(true);
                        }}>
                        <>{texts.faq.delegate.propositionPower}</>
                      </HelpModalTextButton>
                    </Box>
                  </HelpModalTooltip>
                </Box>
              </Box>

              <Box
                sx={{
                  width: '100%',
                  position: 'relative',
                }}>
                <Box
                  sx={{
                    position: 'absolute',
                    left: -5,
                    top: 90,
                    display:
                      !isEdit && !isDelegateChangedView && !txSuccess
                        ? 'block'
                        : 'none',
                    [theme.breakpoints.up('sm')]: {
                      display: 'block',
                      left: -5,
                      top: 105,
                    },
                    [theme.breakpoints.up('md')]: {
                      display: 'none',
                    },
                  }}>
                  <HelpModalTooltip maxWidth={270} mobileBottomPadding={30}>
                    <Box component="p" sx={{ typography: 'body' }}>
                      {texts.faq.delegate.tooltipFirstPart}{' '}
                      <HelpModalTextButton
                        white
                        onClick={() => {
                          setIsHelpDelegateModalOpen(false);
                          setIsHelpDelegationVotingPowerModalOpen(true);
                        }}>
                        <>{texts.faq.delegate.votingPower}</>
                      </HelpModalTextButton>
                    </Box>
                  </HelpModalTooltip>
                </Box>

                <Box
                  sx={{
                    position: 'absolute',
                    left: -5,
                    bottom: 95,
                    display:
                      !isEdit && !isDelegateChangedView && !txSuccess
                        ? 'block'
                        : 'none',
                    [theme.breakpoints.up('sm')]: {
                      display: 'block',
                      left: -5,
                      bottom: 110,
                    },
                    [theme.breakpoints.up('md')]: {
                      display: 'none',
                    },
                  }}>
                  <HelpModalTooltip
                    maxWidth={270}
                    countNumber={2}
                    mobileBottomPadding={30}>
                    <Box component="p" sx={{ typography: 'body' }}>
                      {texts.faq.delegate.tooltipFirstPart}{' '}
                      <HelpModalTextButton
                        white
                        onClick={() => {
                          setIsHelpDelegateModalOpen(false);
                          setIsHelpDelegationPropositionPowerModalOpen(true);
                        }}>
                        <>{texts.faq.delegate.propositionPower}</>
                      </HelpModalTextButton>
                    </Box>
                  </HelpModalTooltip>
                </Box>

                <Box
                  sx={{
                    pl:
                      !isEdit && !isDelegateChangedView && !txSuccess ? 15 : 0,
                    transition: 'all 0.2s ease',
                    [theme.breakpoints.up('sm')]: { pl: 0 },
                  }}>
                  {!isEdit && isDelegateChangedView && (
                    <DelegateTableWrapper
                      forHelp
                      loading={false}
                      delegateData={helpDelegateData}
                      isEdit={isEdit}
                      isViewChanges={isDelegateChangedView}
                      formDelegateData={formDelegateData}>
                      <BigButton
                        alwaysWithBorders
                        color="white"
                        css={{ mr: 24 }}
                        onClick={() => {
                          setFormDelegateData(
                            helpDelegateData.map((data) => {
                              return {
                                underlyingAsset: data.underlyingAsset,
                                votingToAddress: data.votingToAddress,
                                propositionToAddress: data.propositionToAddress,
                              };
                            }),
                          );
                          setIsDelegateChangedView(false);
                        }}>
                        {texts.other.cancel}
                      </BigButton>
                      <BigButton
                        alwaysWithBorders
                        onClick={handleDelegate}
                        disabled={isEqual(
                          helpDelegateData.map((data) => {
                            return {
                              underlyingAsset: data.underlyingAsset,
                              votingToAddress: data.votingToAddress,
                              propositionToAddress: data.propositionToAddress,
                            };
                          }),
                          formDelegateData,
                        )}>
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
                      {({ handleSubmit, values }) => (
                        <DelegateTableWrapper
                          forHelp
                          loading={false}
                          delegateData={helpDelegateData}
                          isEdit={isEdit}
                          isViewChanges={isDelegateChangedView}
                          formDelegateData={formDelegateData}
                          handleFormSubmit={handleSubmit}>
                          <BigButton
                            alwaysWithBorders
                            color="white"
                            css={{ mr: 24 }}
                            onClick={() => {
                              setFormDelegateData(
                                helpDelegateData.map((data) => {
                                  return {
                                    underlyingAsset: data.underlyingAsset,
                                    votingToAddress: data.votingToAddress,
                                    propositionToAddress:
                                      data.propositionToAddress,
                                  };
                                }),
                              );
                              setIsEdit(false);
                            }}>
                            {texts.other.close}
                          </BigButton>
                          <BigButton
                            alwaysWithBorders
                            type="submit"
                            disabled={isEqual(
                              formDelegateData,
                              values.formDelegateData.map((data) => {
                                return {
                                  underlyingAsset: data.underlyingAsset,
                                  votingToAddress:
                                    data.votingToAddress === undefined
                                      ? ''
                                      : data.votingToAddress,
                                  propositionToAddress:
                                    data.propositionToAddress === undefined
                                      ? ''
                                      : data.propositionToAddress,
                                };
                              }),
                            )}>
                            {texts.delegatePage.viewChanges}
                          </BigButton>
                        </DelegateTableWrapper>
                      )}
                    </Form>
                  )}
                  {!isEdit && !isDelegateChangedView && (
                    <DelegateTableWrapper
                      forHelp
                      loading={false}
                      delegateData={helpDelegateData}
                      isEdit={isEdit}
                      isViewChanges={isDelegateChangedView}>
                      <BigButton
                        onClick={() => {
                          setFormDelegateData(
                            helpDelegateData.map((data) => {
                              return {
                                underlyingAsset: data.underlyingAsset,
                                votingToAddress: data.votingToAddress,
                                propositionToAddress: data.propositionToAddress,
                              };
                            }),
                          );
                          setIsEdit(true);
                          setTxSuccess(false);
                        }}
                        alwaysWithBorders>
                        {texts.other.edit}
                      </BigButton>
                    </DelegateTableWrapper>
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
              <HelpDelegateTx
                txPending={txPending}
                txSuccess={txSuccess}
                formDelegateData={formDelegateData}
                delegateData={helpDelegateData}
                handleCancelClick={() => {
                  setTxPending(false);
                  setTxSuccess(false);
                  setIsDelegateChangedView(false);
                  setHelpDelegateData([]);
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
