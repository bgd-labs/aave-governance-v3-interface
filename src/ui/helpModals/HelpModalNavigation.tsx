import { Box, useTheme } from '@mui/system';
import { useEffect } from 'react';

import RightArrow from '/public/images/icons/arrowToRightThin.svg';

import { useRootStore } from '../../store/storeProvider';
import { BasicModal, BoxWith3D } from '..';
import { IconBox } from '../primitives/IconBox';
import { setRelativePath } from '../utils/relativePath';
import { texts } from '../utils/texts';
import { getProposalData } from './getProposalData';
import { HelpModalContainer, helpModalWidth } from './HelpModalContainer';

export enum InfoType {
  WalletOptions = 'WalletOptions',
  Vote = 'Vote',
  Delegate = 'Delegate',
  Representation = 'Representation',
  Statuses = 'Statuses',
}

export const infoTypes = [
  {
    type: InfoType.WalletOptions,
    title: texts.faq.navigation.wallet,
  },
  {
    type: InfoType.Vote,
    title: texts.faq.navigation.vote,
  },
  {
    type: InfoType.Delegate,
    title: texts.faq.navigation.delegate,
  },
  {
    type: InfoType.Representation,
    title: texts.faq.navigation.representation,
  },
  {
    type: InfoType.Statuses,
    title: texts.faq.navigation.lifeCycle,
  },
];

interface HelpModalNavigationProps {
  setInfoType: (value: InfoType | undefined) => void;
}

export function HelpModalNavigation({ setInfoType }: HelpModalNavigationProps) {
  const theme = useTheme();

  const isHelpNavigationModalOpen = useRootStore(
    (store) => store.isHelpNavigationModalOpen,
  );
  const setIsHelpNavigationModalOpen = useRootStore(
    (store) => store.setIsHelpNavigationModalOpen,
  );
  const setIsHelpWalletModalOpen = useRootStore(
    (store) => store.setIsHelpWalletModalOpen,
  );
  const setIsHelpVotingModalOpen = useRootStore(
    (store) => store.setIsHelpVotingModalOpen,
  );
  const setIsHelpDelegateModalOpen = useRootStore(
    (store) => store.setIsHelpDelegateModalOpen,
  );
  const setIsHelpStatusesModalOpen = useRootStore(
    (store) => store.setIsHelpStatusesModalOpen,
  );
  const setIsHelpRepresentativeModalOpen = useRootStore(
    (store) => store.setIsHelpRepresentativeModalOpen,
  );
  const setHelpProposalData = useRootStore(
    (store) => store.setHelpProposalData,
  );

  useEffect(() => {
    const proposalData = getProposalData();
    setHelpProposalData(proposalData);
  }, [isHelpNavigationModalOpen]);

  const handleInfoTypeItemClick = (type: InfoType) => {
    if (type === InfoType.WalletOptions) {
      setInfoType(InfoType.WalletOptions);
      setIsHelpWalletModalOpen(true); // wallet options help modal
    } else if (type === InfoType.Vote) {
      setInfoType(InfoType.Vote);
      setIsHelpVotingModalOpen(true); // vote info help modal
    } else if (type === InfoType.Delegate) {
      setInfoType(InfoType.Delegate);
      setIsHelpDelegateModalOpen(true); // delegate info help modal
    } else if (type === InfoType.Representation) {
      setInfoType(InfoType.Representation);
      setIsHelpRepresentativeModalOpen(true); // representation info help modal
    } else if (type === InfoType.Statuses) {
      setInfoType(InfoType.Statuses);
      setIsHelpStatusesModalOpen(true); // life cycle info help modal
    } else {
      setInfoType(type);
    }
  };

  return (
    <BasicModal
      isOpen={isHelpNavigationModalOpen}
      setIsOpen={setIsHelpNavigationModalOpen}
      maxWidth={helpModalWidth}
      withCloseButton>
      <HelpModalContainer>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            [theme.breakpoints.up('sm')]: { flexDirection: 'row' },
          }}>
          <Box
            component="h2"
            sx={{
              typography: 'h1',
              display: 'block',
              mb: 22,
              textAlign: 'center',
              [theme.breakpoints.up('sm')]: {
                display: 'none',
              },
            }}>
            {texts.faq.navigation.title}
          </Box>
          <Box
            sx={{
              display: 'flex',
              width: 320,
              height: 280,
              alignItems: 'center',
              justifyContent: 'center',
              mb: 22,
              [theme.breakpoints.up('sm')]: {
                width: 376,
                height: 350,
                mb: 0,
                mr: 60,
              },
            }}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                background:
                  theme.palette.mode === 'dark'
                    ? `url(${setRelativePath(
                        '/images/helpModals/navigationDark.svg',
                      )})`
                    : `url(${setRelativePath(
                        '/images/helpModals/navigation.svg',
                      )})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
          </Box>
          <Box sx={{ maxWidth: 410 }}>
            <Box
              component="h2"
              sx={{
                display: 'none',
                [theme.breakpoints.up('sm')]: {
                  typography: 'h1',
                  mb: 36,
                  display: 'block',
                },
              }}>
              {texts.faq.navigation.title}
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              {infoTypes.map((item) => (
                <Box
                  sx={{ width: '100%' }}
                  key={item.type}
                  onClick={() => handleInfoTypeItemClick(item.type)}>
                  <BoxWith3D
                    alwaysWithBorders
                    contentColor="$mainLight"
                    borderSize={4}
                    withActions
                    wrapperCss={{
                      mb: 24,
                    }}
                    css={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      p: '12px 14px',
                      cursor: 'pointer',
                      color: '$textSecondary',
                      [theme.breakpoints.up('sm')]: {
                        alignItems: 'flex-start',
                      },
                    }}>
                    <Box component="h3" sx={{ typography: 'h3' }}>
                      {item.title}
                    </Box>
                    <IconBox
                      sx={{
                        width: 20,
                        height: 20,
                        ml: 20,
                        '> svg': {
                          width: 20,
                          height: 20,
                          path: { fill: theme.palette.$textSecondary },
                        },
                      }}>
                      <RightArrow />
                    </IconBox>
                  </BoxWith3D>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </HelpModalContainer>
    </BasicModal>
  );
}
