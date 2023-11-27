import { appConfig } from '../../utils/appConfig';
import { getChainName } from './getChainName';

export const texts = {
  proposals: {
    proposalListTitle: 'Proposals',
    voted: 'You voted',
    voting: 'You voting',
    votingPower: 'Voting power',
    totalVotingPower: 'Total voting power',
    detailsModalTitle: (id: number) => `Proposal #${id} life cycle details`,
    vote: 'Vote',
    notEnoughPower: "You don't have voting power",
    notEnough: 'Not enough',
    toVote: 'to vote',
    viewAll: 'View all',
    searchPlaceholder: 'Search proposals',
    yourVotingPower: 'Your voting power:',
    votingNotStartedStart: 'Voting on',
    votingNotStartedEnd: 'has not started yet',
    walletNotConnected: 'Wallet is not connected',
    notVoted: "You didn't vote on this proposal",
    author: 'Author',
    canBeClosedByPropositionPower:
      'Proposal can be closed because the proposition power of the creator is not enough',
    detailsLinkForumDiscussion: 'Forum discussion',
    detailsLinkSnapshotVoting: 'Snapshot voting',
    detailsLinkBGDReport: 'BGD Report',
    detailsLinkSeatbeltReport: 'Seatbelt report',
    detailsShareTwitter: 'Share on X',
    detailsRawIpfs: 'Raw-Ipfs',
    timelinePointCreated: 'Created',
    timelinePointOpenVote: 'Open for voting',
    timelinePointVotingClosed: 'Voting closed',
    timelinePointPayloadsExecuted: 'Payloads executed',
    timelinePointFinished: 'Finished',
    timelinePointCanceled: 'Canceled',
    voters: 'Voters',
    action: 'Action',
    votersListFinishedNoDataTitle: 'No one has voted for this proposal',
    votersListNoDataTitle: 'So far, no one has voted for this proposal',
    votersListShowAll: 'Show all',
    votersListVoters: 'Voters',
    votersListVotingPower: 'Voting power',
    votersListSupport: 'Support',
    gelatoNotAvailableGnosis:
      'Gas-less voting not available for gnosis safe wallet',
    gelatoNotAvailableChain:
      'Gas-less voting not available for this voting chain',
    gasLess: 'Gas-less',
    // voting modes
    votingModes: 'Voting modes',
    gasLessVoteTitle: 'Gas-less vote',
    gasLessVoteDescription:
      'On Governance v3, you can vote for free via gas-less transactions, thanks to the Aave Gelato gas tank. Enable gas-less mode as in the picture, and you will only need to do a signature on your wallet to emit a vote',
    fallbackVoteTitle: 'Fallback vote',
    fallbackVoteDescription:
      "If you don't want to relay your vote via Gelato, it is always possible to submit and pay for your own vote transaction by disabling the gas-less mode. Beware that you will need to pay on the gas token of the voting network (e.g. MATIC for Polygon)",
    noVotersData: (type: 'for' | 'against') => `No votes '${type}'`,
    payloadsDetails: {
      payload: 'Payload',
      payloads: 'Payloads',
      created: 'Created at',
      executedIn: 'Execution will be available in',
      execute: 'Execute',
      executedAt: 'Executed at',
      execution: 'Ready for execution',
      timeLocked: 'Time-locked',
      cancelledAt: 'Cancelled at',
      expired: 'Expired at',
      expiredIn: 'Expire in',
      accessLevel: 'Access level',
      creator: 'Creator',
      seatbelt: 'Seatbelt',
      actions: (length: number) => (length > 1 ? 'Actions' : 'Action'),
      details: 'Status',
      more: (active: boolean) => (active ? 'Hide' : 'Show more'),
    },
  },
  proposalActions: {
    proposalCreated: 'Proposal created',
    activateVoting: 'Activate voting',
    activateVotingTimer: 'for voting opening',
    proposalActivated: 'Proposal activated',
    proofsSent: 'Proofs sent',
    waitForBridging: 'Waiting for bridging',
    votingPassed: 'Voting passed',
    closeVoting: 'Close voting',
    votingClosedResultsSent: 'Voting closed and results sent',
    proposalTimeLocked: 'Proposal is time-locked',
    proposalCanBeExecuted: 'Proposal can be executed',
    executeProposal: 'Execute proposal',
    executeProposalTimer: 'for proposal execution',
    proposalExecuted: 'Proposal executed',
    payloadsTimeLocked: 'Payloads are time-locked',
    executePayload: 'Execute payload',
    expiredPayload: 'Payload expired',
    executePayloadsTimer: 'for payloads execution',
    noWalletTitle: 'Connect wallet to do actions',
    noWalletButtonTitle: 'Connect wallet',
    activateVotingDescription: 'Voting will be activate',
    cancelProposal: 'Cancel proposal',
    closeVotingDescription: 'Voting will be closed and result sent',
    createPayload: 'Create payload',
    createPayloadDescription: (id: number) => `Payload #${id} will be created`,
    createPayloadSuccess: (id: number) => `Payload #${id} created`,
    createProposal: 'Create proposal',
    createProposalDescription: (id: number) =>
      `Proposal #${id} will be created`,
    createProposalSuccess: (id: number) => `Proposal #${id} created`,
    executePayloadDescription: 'Payload will be executed',
    executeProposalDescription: 'Proposal will be executed',
    voteSmallButtonTitle: 'Normal vote',
  },
  proposalHistory: {
    payloadCreated: (count: number, length: number, chainId: number) =>
      `Payload ${length > 1 ? count : ''}${
        length > 1 ? `/${length}` : ''
      } was created (${getChainName(chainId)})`,
    proposalCreated: (id: number) =>
      `Proposal #${id} was created (${getChainName(appConfig.govCoreChainId)})`,
    proposalActivated: (id: number) =>
      `Proposal #${id} was activated for voting (${getChainName(
        appConfig.govCoreChainId,
      )})`,
    proposalOpenForVoting: (id: number, chainId: number) =>
      `Voting started for proposal #${id} (${getChainName(chainId)})`,
    votingOver: `Voting is over. <b>Proposal Passed</b>`,
    votingFailed: `<b>Proposal failed</b>, because there were not enough votes <b>for</b>.`,
    proposalVotingClosed: (id: number, chainId: number) =>
      `Proposal #${id} voting was closed (${getChainName(chainId)})`,
    votingResultsSent: `Voting results were sent to Core (${getChainName(
      appConfig.govCoreChainId,
    )})`,
    proposalTimeLocked: (id: number) =>
      `Proposal #${id} was time-locked (${getChainName(
        appConfig.govCoreChainId,
      )})`,
    proposalExecuted: (id: number) =>
      `Proposal #${id} was executed (${getChainName(
        appConfig.govCoreChainId,
      )})`,
    payloadTimeLocked: (count: number, length: number, chainId: number) =>
      `Payload ${length > 1 ? count : ''}${
        length > 1 ? `/${length}` : ''
      } was time-locked (${getChainName(chainId)})`,
    payloadExecuted: (count: number, length: number, chainId: number) =>
      `Payload ${length > 1 ? count : ''}${
        length > 1 ? `/${length}` : ''
      } was executed (${getChainName(chainId)})`,
    payloadExpired: (count: number, length: number, chainId: number) =>
      `Payload ${length > 1 ? count : ''}${
        length > 1 ? `/${length}` : ''
      } expired (${getChainName(chainId)})`,
    proposalCanceled: (id: number) => `Proposal #${id} was canceled`,
    proposalExpired: (id: number) =>
      `Proposal #${id} expired, because no one performed the action to execute the proposal or payloads`,
  },
  createPage: {
    walletNotConnectedTitle:
      'Create payload and proposal not available if wallet not connected',
    walletNotConnectedDescription:
      'We suggest you to connect wallet if you want create payload or proposal.',
    walletNotConnectedButtonTitle: 'Connect',
    appModeTitle: 'Create payload and proposal not available in this app mode',
    appModeDescriptionFirst: `You can't create payload or proposal in this app mode.`,
    appModeDescriptionSecond: `We suggest you to change app mode or back to the proposal list.`,
    appModeButtonTitle: `Back to list`,
    createProposalTitle: 'Create proposal',
    createPayloadTitle: 'Create payload',
    payloadChainIdPlaceholder: 'Payload network',
    payloadsControllerPlaceholder: 'Payloads controller',
    ipfsHashPlaceholder: 'Ipfs hash',
    addActionButtonTitle: 'Add action',
    payloadActions: 'Payload actions',
    actionTitle: (index: number) => `Action ${index}`,
    payloadActionAddress: 'Address',
    payloadActionDelegateCall: 'With delegate call?',
    payloadActionAccessLevel: 'Access level',
    payloadActionValue: 'Value',
    payloadActionSignature: 'Signature',
    payloadActionCallData: 'Call data',
    votingChainIdPlaceholder: 'Voting network',
    addPayloadButtonTitle: 'Add payload',
    payloadsTitle: 'Payloads',
    payloadTitle: (index: number) => `Payload ${index}`,
    payloadIdPlaceholder: 'Payload id',
  },
  delegatePage: {
    viewChanges: 'View changes',
    notConnectedWallet: 'Wallet is not connected',
    notConnectedWalletDescription:
      'Please connect wallet first, to see delegation info',
    notConnectedWalletButtonTitle: 'Connect wallet',
    willDelegate: 'You will delegate',
    delegated: 'You delegated',
    receiveBack: 'You will receive back',
    receivedBack: 'You received back',
    votingAndPropositionPowers: 'voting and proposition powers',
    votingPower: 'voting power',
    propositionPower: 'proposition power',
    delegateTxSuccess: 'Delegated',
    delegateTxTitle: 'Delegation',
    tableHeaderVoting: 'Voting',
    tableHeaderProposition: 'Proposition',
    tableItemDelegated: 'Delegated',
    tableItemNotDelegated: 'Not Delegated',
    walletConnectSafeWarning:
      'Note that when connecting a Safe wallet via WalletConnect, the delegation transaction tracking is broken on our side.',
  },
  representationsPage: {
    notConnectedWallet: 'Wallet is not connected',
    notConnectedWalletDescription:
      'Please connect wallet first, to see representations info',
    notConnectedWalletButtonTitle: 'Connect wallet',
    tableHeaderFirstTitle: 'Network',
    tableHeaderRepresented: 'Represented by',
    myself: 'Myself',
    represented: 'Represented',
    txSuccess: 'Represented',
    txTitle: 'Representations',
    yourWillRepresent: 'You will be represented',
    yourRepresented: 'You represented',
    yourCancelRepresented: 'You cancel represented',
    yourCanceledRepresented: 'You canceled represented',
    notRepresented: 'Not represented',
    representationInfo:
      'This is the voting power of the address you are representing. Remember that the representative role is by network, so if not able to vote on other proposals, try to change who you are representing',
  },
  rpcSwitcherPage: {
    tableHeaderSwitcher: 'RPC URL',
    tableHeaderNetwork: 'Network',
    placeholder: 'Enter RPC URL',
  },
  notFoundPage: {
    title: 'Page not found',
    descriptionFirst: `Sorry, we couldn't find the page you were looking for.`,
    descriptionSecond: `We suggest you go back to the proposals list.`,
    buttonTitle: 'Back to list',
  },
  transactions: {
    allTransactions: 'All Transactions',
    pending: 'Pending...',
    pendingDescription: 'Waiting while the transaction is getting executed',
    success: 'Success',
    error: 'Error',
    replaced: 'Replaced',
    executed: 'Transaction executed',
    notExecuted: `The transaction failed`,
    txReplaced: `The transaction replaced`,
    tryAgain: 'Try again',
    testTransaction: 'You made test transaction',
    createPayloadTx: 'You create payload',
    createProposalTx: 'You create proposal',
    activateVotingTx: 'You activated voting for the proposal',
    sendProofsTx: 'You settled the voting balances of',
    activateVotingOnVotingMachineTx:
      'You activate voting on voting machine for the proposal',
    voteTx: 'You voted',
    voteTxAsRepresentative: 'as a representative of',
    closeVoteTx: 'You closed voting for the proposal',
    sendVoteResultsTx: 'and sent voting results to',
    executeProposalTx: 'You executed the proposal',
    executePayloadTx: 'You executed the payload',
    cancelProposalTx: 'You cancel the proposal',
    cancelPayloadTx: 'You cancel the payload',
  },
  walletConnect: {
    delegations: 'Manage delegations',
    representations: 'Manage representations',
    disconnect: 'Disconnect',
    allTransactions: 'View all',
    transactions: 'Transactions',
    lastTransaction: (count: number) =>
      count > 1 ? 'Last transactions' : 'Last transaction',
    transactionsEmpty: "You don't have any governance transaction",
    transactionsNoWallet: 'Connect your wallet to see governance transactions',
    connectButtonConnecting: 'Connecting',
    connectButtonConnect: 'Connect wallet',
    connectWallet: 'Connect a wallet',
    connecting: 'Connecting...',
    walletConfirmation: 'Waiting confirmation from your wallet',
    needHelpTitle: 'Need help connecting a wallet?',
    needHelpFAQ: 'Read FAQ',
    needHelpDescription:
      'By selecting a wallet from an External Provider, you agree to their Terms and Conditions. Your ability to access the wallet may depend on the External Provider being operational.',
    impersonatedInputPlaceholder: 'Account address',
    impersonatedButtonTitle: 'Connect',
    representing: 'Representing',
    representative: 'You are representing',
  },
  header: {
    navSnapshots: 'Snapshots',
    navForum: 'Visit forum',
    navTutorial: 'Tutorial',
    navCreate: 'Create',
    termsAndConditions: 'Terms and conditions',
    changeRPC: 'Change RPC',
    appMode: 'App mode',
    theme: 'Theme',
    appModeDefault: 'Default',
    appModeDev: 'Dev',
    appModeExpert: 'Expert',
  },
  other: {
    backButtonTitle: 'Back',
    paginationNext: 'Next',
    paginationPrevious: 'Previous',
    day: 'd',
    hours: 'h',
    minutes: 'm',
    seconds: 's',
    toggleFor: 'For',
    toggleAgainst: 'Against',
    copied: 'Copied',
    copy: 'Copy',
    viewOnExplorer: 'View on explorer',
    transactionHash: 'Transaction hash',
    replacedTransactionHash: 'Replaced transaction hash',
    cancel: 'Cancel',
    close: 'Close',
    required: 'Required',
    edit: 'Edit',
    votingInfo: 'Voting info',
    all: 'All',
    create: 'Create',
    confirm: 'Confirm',
    requiredValidation: 'Required field',
    addressValidation: 'Wrong Ethereum address format',
    ensNameValidation: 'Wrong Ethereum address format or ENS name',
    rpcUrlValidation: 'RPC is either incorrect or unavailable',
    appLoading:
      'The application is loading the required data, please wait a moment',
    fetchFromIpfsError:
      'An error occurred while fetching proposal metadata from IPFS, try again later.',
    fetchFromIpfsIncorrectHash: `An error occurred while fetching proposal metadata from IPFS. It seems that the ipfs hash is incorrect or the content by this hash does not match the desired one.`,
    explorer: 'Explorer',
    votingNotAvailableForGnosis:
      'Voting on this chain is not available for Gnosis safe wallet',
    yourself: 'Yourself',
    backToEdit: 'Back to edit',
    notAvailable: 'Not available',
    wallet: 'Wallet',
    off: 'Off',
    on: 'On',
    copyError: 'Copy error text',
    userNotFound: 'User not found',
    readMore: 'Read more',
    rpcIsNotSupported: "This RPC doesn't support our contracts logic",
    rpcError: (rpcErrorsLength: number, rpcUrl?: string) =>
      `At the moment we cannot get data from ${
        rpcErrorsLength > 1
          ? "multiple RPC's"
          : `this RPC (${!!rpcUrl && rpcUrl})`
      }. Try to use the application later or go to the RPC change screen.`,
    payloadsNetwork: 'Payloads network',
  },
  terms: {
    description:
      'By proceeding, you agree to our Terms & Conditions. We encourage you to read them carefully to ensure that you understand your rights and obligations.',
    checkBoxLabel: 'I have read and accept the',
    terms: 'Terms & Conditions',
    buttonTitle: 'Proceed',
  },
  faq: {
    welcome: {
      title: 'Hey!',
      description:
        'Let me show you how to use the new Aave governance interface.',
      closeButtonTitle: 'Later',
      nextButtonTitle: 'Start',
    },
    navigation: {
      title: 'How can I help you?',
      wallet: 'How to connect and manage my wallet?',
      vote: 'How to vote?',
      delegate: 'How to delegate?',
      representation: 'How do representations work?',
      lifeCycle: 'Proposal life cycle description',
    },
    wallet: {
      title: 'Wallet',
      description:
        'This window allows you to connect your wallet. Browse the list and pick the one you want to use.',
      realWalletInfo:
        "Don't worry, this is just a practice run! The real wallet won't be connected.",
      transactionsViewDescription:
        'Welcome to your wallet window! Here you can view all transactions made within the interface. The status of transactions can be pending, successful, or failed. Give it a try and make a test transaction now!',
      makeTransaction: 'Make a transaction',
    },
    voting: {
      title: 'Let’s try to vote',
      firstDescriptionFirstPart:
        'On the homepage you can browse all the available proposals. To vote on or read more about a proposal, simply',
      connectWallet: 'connect your wallet',
      firstDescriptionSecondPart: 'and select from the Active proposals.',
      secondDescription:
        'You can vote directly from the list or click on a proposal to learn more before making your choice.',
      firstTooltip:
        'Here you can see the current stage of the proposal and its expected outcome',
      secondTooltipFirstPart: 'Here you can see your',
      votingPower: 'voting power',
      secondTooltipSecondPart: 'and vote directly on the proposal',
      thirdTooltipFirstPart: 'Here you can see the',
      votingProgress: 'voting progress',
      thirdTooltipSecondPart:
        'and the required number of votes for the proposal stage change',
      proposalBar: 'Proposal bar',
      pressVoteButton: 'Press vote button to continue',
      txSuccess: 'All done!',
      txPending: 'Almost there!',
      txStart: 'Voting',
      txStartFirstDescription:
        'After clicking the ‘Vote’ button you will see a confirmation screen, where you can choose if you support or oppose the proposal.',
      txStartSecondDescription:
        "You can see the proposal's progress in real-time as it is influenced by your vote.",
      txStartThirdDescription:
        'Check how the interface works and then click ‘Vote’ button.',
      txPendingDescription: 'Your vote is being processed',
      txSuccessFirstDescription:
        'You can view your transaction details in the wallet information modal.',
      txSuccessSecondDescription:
        'Voting is only a step in the proposal process. Learn more about',
      proposalLifeCycle: 'proposal life cycle',
    },
    votingPower: {
      title: 'Voting power',
      description: (assets: string) =>
        `Voting power is determined by the balance in ${assets} a user has, plus received voting power, and minus sent voting power, at the time the voting starts.`,
    },
    votingBars: {
      title: 'Voting bars',
      description:
        'The voting bars show the number of votes a proposal currently has, as well as the minimum number of votes required for a proposal to pass or fail.',
      secondDescription: (quorum: number, differential: number) =>
        `For a proposal to pass, it must receive a minimum of <b>${quorum} ‘For’</b> votes, with a majority of 'For' votes over 'Against' votes plus a minimum of <b>${differential}</b>. Otherwise, the proposal will fail.`,
    },
    delegate: {
      delegated: 'Delegated',
      delegation: 'Delegation',
      editMode: 'Edit mode',
      confirmation: 'Confirmation',
      delegationBar: 'Delegation bar',
      startFirstDescription:
        'This is the delegation screen. Here you can delegate voting and proposition powers.',
      startSecondDescription:
        'Delegating voting power means giving someone else the power to vote on proposals on your behalf. Delegating proposition power means giving someone else the power to create proposals on your behalf.',
      editFirstDescription:
        "Proposition and voting powers are tied to individual assets, meaning each asset carries its own proposition and voting power. The extent of an user's powers is determined by the number of that specific asset they hold, plus delegation they receive.",
      editSecondDescription:
        "Here you can delegate your power to someone else or receive it back. You can delegate proposition, voting, or both. To do so, just input the recipient's wallet address/ENS.",
      editThirdDescription:
        'To remove delegation from somebody, leave the input empty.',
      confirmFirstDescription:
        'You can now view information about what you are going to delegate and to whom.',
      confirmSecondDescription:
        'If you are sure of your choice, click the confirmation button.',
      delegatedFirstDescription:
        "You can now view information about the delegations you've made. Don’t forget to change it later.",
      delegatedSecondDescription:
        "If you want to try again, just click the 'Edit' button.",
      tooltipFirstPart: 'Delegation of',
      votingPower: 'Voting power',
      propositionPower: 'Proposition power',
      txPendingTitle: 'Almost there!',
      txPendingDescription: 'Your delegation is being processed',
      warning: 'WARNING!',
      entireBalance: (assets: string) =>
        `This is the entire balance of ${assets} at the moment.`,
      votingPowerWarning:
        'Please note that after delegation, you will lose all your voting power until you receive it back. If a proposal opens for voting during this time, you will not be able to vote on it, even if you receive your voting power back later.',
      propositionPowerFirstWarning:
        'Please keep in mind that after delegation, you will lose all your proposition power until you receive it back.',
      propositionPowerSecondWarning:
        'Please note that you need to keep the proposition power, when you create a proposal. If you delegate your proposition power before your proposal is executed, it may be subject to cancellation.',
    },
    lifeCycles: {
      initial: {
        title: 'Proposal life cycle',
        description:
          'A proposal can have different life cycle stages, not just determined by voting. You can check the current stage and the timeline of the proposal by going to the proposal details.',
        nextButtonTitle: 'Create proposal',
        prevButtonTitle: 'Back',
      },
      created: {
        title: 'Proposal life cycle',
        description:
          "Let’s start from scratch. The first stage is when the proposal is created. You can't vote on it yet, but you can already look at the details and decide if you want to vote for or against it.",
        nextButtonTitle: 'Activate voting',
        prevButtonTitle: 'Back',
      },
      openToVote: {
        title: 'Open for voting',
        description:
          'After a period of time, the voting will be activated. This will make the proposal open for voting, allowing everyone to cast their votes.',
        additionDescription:
          "It's important to note that this is when the evaluation of the voting power will take place. Your voting power will be determined at this time.",
        nextButtonTitle: 'Close voting',
        prevButtonTitle: 'Created',
      },
      votingClosed: {
        title: 'Voting closed',
        description:
          'At the end of the voting period, the proposal is either passed or rejected. The result is then forwarded to Ethereum.',
        nextButtonTitle: 'Execute proposal',
        prevButtonTitle: 'Open for vote',
      },
      proposalExecuted: {
        title: 'Proposal executed',
        description:
          'Once the cool-down period has passed, the proposal can be executed.',
        additionDescription:
          'After receiving the proposal results, the proposal gets executed on Ethereum, which means that all payloads in the different networks enter in time-lock. Once they pass their respective time-locks, they can be executed.',
        nextButtonTitle: 'Execute payloads',
        prevButtonTitle: 'Voting closed',
      },
      finishedExecuted: {
        title: 'Proposal finished',
        description:
          'After all the payloads of the proposal have been executed, the proposal is considered to be fully executed or finished.',
        nextButtonTitle: 'Voting failed',
        prevButtonTitle: 'Execute payloads',
      },
      finishedFailed: {
        title: 'Proposal failed',
        description:
          'If the proposal does not receive enough votes or the majority of votes are for rejection, the proposal will immediately fail.',
        nextButtonTitle: 'Proposal canceled',
        prevButtonTitle: 'Finished',
      },
      finishedCanceled: {
        title: 'Proposal canceled',
        description:
          'If at any stage the proposal or all of the associated payloads were canceled by the proposer, then the proposal will have the status "Canceled".',
        prevButtonTitle: 'Defeated',
      },
    },
    representative: {
      title: 'Representatives',
      descriptionFirst:
        'Being representative of an Ethereum address on another network means that, for any proposal with voting running on that network, you can vote on behalf of said Ethereum address.',
      descriptionSecond:
        'If you have connected a wallet that was chosen as representative, on your account screen you can choose if you want to represent yourself, or any other address who selected you.This is just an interface feature, so no worries, will not do any blockchain transaction!',
      firstTooltip:
        'By clicking on the "Manage representations" button, you can go to the representations interface, where you can change your representatives for each voting network',
      secondTooltip:
        'In this drop-down list you can select who you will represent, or unset the representation.',
    },
    representations: {
      manage: 'Manage',
      edit: 'Edit',
      confirmation: 'Confirmation',
      selected: 'Representative selected',
      startFirstDescription:
        'In this screen, with your Ethereum address with voting power connected, you can choose representatives for all available voting networks.',
      startSecondDescription: 'Click Edit to choose a representative',
      startThirdDescription:
        '(This is just a mock, you will not choose a real representative)',
      editFirstDescription:
        'Now you can input a representative address for any of the available networks. Remember to always validate that the address you select exists in that network and is the one intended!',
      editSecondDescription:
        'P.S. if you want to remove a representative, you can just click the "x" icon on the input',
      confirmFirstDescription:
        'You can now view the summary about the representative/s you are choosing, and the network/s. If you are sure of your choice, click the confirmation button.',
      confirmSecondDescription:
        '(Again, this is just a mock, you will not choose a real representative)',
      txPendingTitle: 'Almost there!',
      txPendingDescription: 'Your representations are being processed',
      doneDescription:
        'Now the table shows the representatives you have chosen, and you can change them at any time',
    },
    other: {
      gotIt: 'Got it!',
      next: 'Next',
      mainMenu: 'Main menu',
    },
    tx: {
      tryAgain: 'Try again',
    },
  },
};
