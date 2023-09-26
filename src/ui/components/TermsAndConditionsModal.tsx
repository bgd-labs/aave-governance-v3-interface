import { Box, useTheme } from '@mui/system';
import { ReactNode, useRef } from 'react';

import { useStore } from '../../store';
import { BasicModal } from './BasicModal';
import { Link } from './Link';

const Text = ({
  children,
  withMargin = true,
}: {
  children: ReactNode;
  withMargin?: boolean;
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        typography: 'body',
        mb: withMargin ? 12 : 0,
        lineHeight: '20px !important',
        fontWeight: 400,
        [theme.breakpoints.up('sm')]: {
          typography: 'body',
          lineHeight: '22px !important',
        },
        [theme.breakpoints.up('md')]: {
          typography: 'body',
          lineHeight: '24px !important',
        },
        [theme.breakpoints.up('lg')]: {
          typography: 'body',
          lineHeight: '24px !important',
        },
        [theme.breakpoints.up('xl')]: {
          typography: 'body',
          lineHeight: '28px !important',
        },
      }}>
      {children}
    </Box>
  );
};

export function TermsAndConditionsModal() {
  const { isTermModalOpen, setIsTermModalOpen } = useStore();
  const initialFocusRef = useRef(null);

  return (
    <BasicModal
      maxWidth={980}
      initialFocus={initialFocusRef}
      isOpen={isTermModalOpen}
      setIsOpen={setIsTermModalOpen}
      withCloseButton
      contentCss={{ ul: { listStyleType: 'disc' } }}>
      <Box
        ref={initialFocusRef}
        sx={{ typography: 'h1', textAlign: 'center', mb: 24 }}>
        Aave Governance V3 interface Terms and Conditions
      </Box>
      <Box sx={{ typography: 'h2', mb: 20 }}>1. Purpose of the Agreement</Box>
      <Text>Welcome to the Aave Governance V3 user interface.</Text>
      <Text>Effective Date: September 14, 2023</Text>
      <Text>
        The Aave Governance V3 user interface is brought to you by BGD Labs
        Technologies LLC (“BGD Labs Technologies”, “we,” “us,” or “our”). By
        accessing or using our interface, you agree to comply with and be bound
        by the following Terms and Conditions (the "Agreement"). Please read
        this Agreement carefully before using our interface.
      </Text>
      <Text>
        The Agreement regulates the use of the Aave Governance V3 interface{' '}
        <b>(“Aave Governance V3 interface”).</b>
      </Text>
      <Box sx={{ typography: 'h2', mb: 20 }}>
        2. Acceptance of the Agreement
      </Box>
      <Text>
        By accessing or using the Aave Governance V3 interface, you acknowledge
        that you have read and agree to this Agreement, and that you have the
        legal capacity to enter into a binding agreement with BGD Labs
        Technologies LLC. If you do not meet the eligibility requirements to
        enter into a binding agreement, you must not access or use our
        interface.
      </Text>
      <Box sx={{ typography: 'h2', mb: 20 }}>3. Who We Are</Box>
      <Text>
        BGD Labs Technologies is a software development venture in the
        blockchain field, specialised in DeFi and design of other types of
        decentralised protocols.
      </Text>
      <Box sx={{ typography: 'h2', mb: 20 }}>
        4. Our Professional Engagement with the Aave DAO
      </Box>
      <Text>
        Our engagement with the DAO consists of building software for smart
        contracts to be deployed on the Ethereum blockchain, which are subject
        to the decision-making process of the DAO. This means that the DAO has
        the final decision to activate or not activate the smart contract.
      </Text>
      <Box sx={{ typography: 'h2', mb: 20 }}>5. The Aave Ecosystem</Box>
      <Text>
        The Aave ecosystem is a software system of smart contracts fully
        controlled by AAVE token holders. AAVE is a governance token that
        enables holders to participate in the decision-making process for the
        Aave protocol. The Aave protocol is a decentralized liquidity protocol
        that enables users to supply and borrow on-chain digital tokens.
      </Text>
      <Box sx={{ typography: 'h2', mb: 20 }}>
        6. Ethereum as the Core of Aave Governance on v3
      </Box>
      <Text>
        Aave Governance v3 is a system of smart contracts that runs on Ethereum
        and other blockchains, enabling holders of the AAVE governance token to
        vote on decisions concerning the Aave ecosystem. These smart contracts
        operate independently of this interface and can be accessed through
        various other access points.
      </Text>
      <Box sx={{ typography: 'h2', mb: 20 }}>
        7. Description of our interface
      </Box>
      <Text>
        The interface is a standalone utility providing a convenient and
        user-friendly interaction flow for participants on the Aave governance
        to build vote transactions, which later on get submitted to the
        corresponding blockchain per proposal.
      </Text>
      <Box sx={{ typography: 'h2', mb: 20 }}>
        8. User Acknowledgement and Acceptance
      </Box>
      <Text>
        By accessing or using our interface, you acknowledge that you understand
        the following:
      </Text>
      <Box component="ul" sx={{ ml: 20 }}>
        <Box component="li" sx={{ mb: 12 }}>
          <Text withMargin={false}>
            You have a comprehensive understanding of blockchain technology and
            how it works, including the mechanics of transactions, gas fees,
            smart contracts, cryptographic tokens, and signatures. Additionally,
            you are representing that you possess the necessary financial and
            technical sophistication to appreciate the risks associated with
            using cryptographic and blockchain-based systems, and that you have
            a practical understanding of the complexities and usage of digital
            assets.
          </Text>
        </Box>
        <Box component="li" sx={{ mb: 12 }}>
          <Text withMargin={false}>
            You have a comprehensive understanding of the functionality and
            mechanics of the smart contracts, which are owned by the Aave DAO.
          </Text>
        </Box>
        <Box component="li" sx={{ mb: 12 }}>
          <Text withMargin={false}>
            You understand that the user interface interacting with smart
            contracts is software that is completely independent of the smart
            contracts themselves.
          </Text>
        </Box>
        <Box component="li" sx={{ mb: 12 }}>
          <Text withMargin={false}>
            While using the Aave Governance V3 interface, you recognize that the
            foundational blockchain technologies employed are both innovative
            and highly technical, carrying inherent risks. The responsibility to
            bear any risks of loss resulting from the use of the Aave Governance
            V3 interface lies squarely with you.
          </Text>
        </Box>
        <Box component="li" sx={{ mb: 12 }}>
          <Text withMargin={false}>
            It's paramount to grasp that digital asset markets can be volatile
            due to various reasons, such as market adoption, speculative
            tendencies, technological evolution, security protocols, and legal
            frameworks. The costs and speeds of operations on distributed ledger
            and blockchain systems can shift suddenly and dramatically.
          </Text>
        </Box>
        <Box component="li" sx={{ mb: 12 }}>
          <Text withMargin={false}>
            The Aave Governance V3 interface utilizes state-of-the-art
            technological solutions meant to enhance transactions on blockchain
            platforms. Given the numerous factors influencing outcomes, they are
            intrinsically unpredictable. Hence, you must accept that no specific
            outcomes are guaranteed when using this interface.
          </Text>
        </Box>
        <Box component="li" sx={{ mb: 12 }}>
          <Text withMargin={false}>
            We neither own nor exert control over any of the digital assets or
            the foundational blockchains involved in transactions via the
            Services. Thus, we cannot be held accountable for losses you might
            sustain while using the Service, particularly losses arising from
            software malfunctions, system downtimes, or equipment-related
            issues.
          </Text>
        </Box>
      </Box>
      <Box sx={{ typography: 'h2', mb: 20 }}>
        9. Modification of the Agreement
      </Box>
      <Text>
        We reserve the right to modify these Terms and Conditions at any time
        and for any reason at our sole discretion. Should any changes be made to
        these Terms, we will make reasonable efforts to notify you of such
        changes prior to the change becoming effective. Your continued use of
        the Aave Governance V3 interface after such notification signifies your
        acceptance of the modified terms.
      </Text>
      <Box sx={{ typography: 'h2', mb: 20 }}>10. Non-Profit Declaration</Box>
      <Text>
        BGD Labs Technologies hereby declares that it does not benefit in any
        way, financially or otherwise, from the Aave Governance V3 or this
        interface used to interact with them. Our engagement with the DAO is
        solely focused on providing software development services for the Aave
        Governance V3 on the Ethereum blockchain which are completely
        independent from this tool.
      </Text>
      <Box sx={{ typography: 'h2', mb: 20 }}>
        11. No Responsibility for User Assets and Tax Obligations
      </Box>
      <Text>
        The user assumes full responsibility for complying with any and all
        current and future tax obligations associated with their use of the Aave
        Governance V3 interface, including but not limited to taxes, duties, and
        assessments claimed or imposed by any governmental authority. This
        responsibility includes taxes payable as a result of interacting with
        smart contracts and recovering the assets.
      </Text>
      <Text>
        Please note that blockchain-based transactions are a relatively new
        development, and as such, their tax treatment is uncertain.
      </Text>
      <Box sx={{ typography: 'h2', mb: 20 }}>
        12. Disclaimer of Financial Services
      </Box>
      <Text>
        The Aave Governance V3 interface is provided solely for the purpose of
        interacting with the Aave Governance V3 smart contracts deployed on the
        Ethereum blockchain. The interface is not intended to provide, and
        should not be considered as, financial or investment advice or services.
        BGD Labs Technologies is not a financial institution and does not
        provide any financial or investment services through the interface. The
        interface with the Aave Governance V3 smart contracts is not intended to
        be used for any financial or investment purposes.
      </Text>
      <Box sx={{ typography: 'h2', mb: 20 }}>
        13. Non-Responsibility of Third-Party Services
      </Box>
      <Text>
        BGD Labs Technologies is not responsible for any third-party services
        used by users in connection with our interface, including but not
        limited to wallets, nodes, or other technologies used to interact with
        the Ethereum blockchain. We make no representations or warranties
        concerning the security, functionality, or availability of any
        third-party services, and users assume all risks associated with the use
        of such services. BGD Labs Technologies is not responsible for any
        losses, damages, or liabilities arising from the use of third-party
        services in connection with our interface.
      </Text>
      <Box sx={{ typography: 'h2', mb: 20 }}>14. User Responsibilities</Box>
      <Text>
        To access and use the Aave Governance V3 interface, you must comply with
        this Agreement, applicable third-party policies, and all applicable
        laws, rules, and regulations. The following conduct is strictly
        prohibited:
      </Text>
      <Box component="ul" sx={{ ml: 20 }}>
        <Box component="li" sx={{ mb: 12 }}>
          <Text withMargin={false}>
            Using the Aave Governance V3 interface to engage in or facilitate
            illegal activities, including but not limited to money laundering,
            terrorism financing, tax evasion, or the buying or selling illegal
            drugs, contraband, counterfeit goods, or illegal weapons;
          </Text>
        </Box>
        <Box component="li" sx={{ mb: 12 }}>
          <Text withMargin={false}>
            Using the Aave Governance V3 interface for unauthorized commercial
            purposes;
          </Text>
        </Box>
        <Box component="li" sx={{ mb: 12 }}>
          <Text withMargin={false}>
            Uploading or transmitting viruses, worms, Trojan horses, time bombs,
            cancel bots, spiders, malware or any other type of malicious code
            that will or may be used in any way that will affect the
            functionality or operation of the Aave Governance V3 interface;
          </Text>
        </Box>
        <Box component="li" sx={{ mb: 12 }}>
          <Text withMargin={false}>
            Attempting to or actually copying or making unauthorized use of all
            or any portion of the Aave Governance V3 interface, including by
            attempting to reverse compile, reformatting or framing, disassemble,
            reverse engineer any part of the Aave Governance V3 interface;
          </Text>
        </Box>
        <Box component="li" sx={{ mb: 12 }}>
          <Text withMargin={false}>
            Harvesting or collecting information from the Aave Governance V3
            interface for any unauthorized purpose;
          </Text>
        </Box>
        <Box component="li" sx={{ mb: 12 }}>
          <Text withMargin={false}>
            Using the Aave Governance V3 interface under false or fraudulent
            pretenses;
          </Text>
        </Box>
        <Box component="li" sx={{ mb: 12 }}>
          <Text withMargin={false}>
            Interfering with other users’ access to or use of the Aave
            Governance V3 interface;
          </Text>
        </Box>
        <Box component="li" sx={{ mb: 12 }}>
          <Text withMargin={false}>
            Interfering with or circumventing the security features of the Aave
            Governance V3 interface or any third party’s systems, networks, or
            resources used in the provision of Aave Governance V3 interface;
          </Text>
        </Box>
        <Box component="li" sx={{ mb: 12 }}>
          <Text withMargin={false}>
            Engaging in any attack, hack or denial-of-service attempt or
            interference in relation of the Aave Governance V3 interface; or
          </Text>
        </Box>
        <Box component="li" sx={{ mb: 12 }}>
          <Text withMargin={false}>
            Engaging in any anticompetitive behavior or other misconduct.
          </Text>
        </Box>
        <Box component="li" sx={{ mb: 12 }}>
          <Text withMargin={false}>
            Refrain from activities that could jeopardize the security or
            functionality of the Aave Governance V3 interface or that could
            deceive or defraud other users.
          </Text>
        </Box>
        <Box component="li" sx={{ mb: 12 }}>
          <Text withMargin={false}>
            Ensure not to engage in transactions associated with items that
            violate intellectual property rights, including copyrights and
            trademarks.
          </Text>
        </Box>
        <Box component="li" sx={{ mb: 12 }}>
          <Text withMargin={false}>
            Abstain from using connection methods like VPNs with the intention
            of bypassing regulations, accessing services from restricted areas,
            or breaching these terms of service.
          </Text>
        </Box>
        <Box component="li" sx={{ mb: 12 }}>
          <Text withMargin={false}>
            When creating hyperlinks to the Aave Governance V3 interface, ensure
            that such links do not depict the platform or its services in a
            misleading or negative light, and ensure associated sites are free
            from illegal or inappropriate content.
          </Text>
        </Box>
      </Box>
      <Box sx={{ typography: 'h2', mb: 20 }}>
        15. Intellectual Property Rights
      </Box>
      <Text>
        The Intellectual property rights clause can be accessed here:{' '}
        <Link
          inNewWindow
          href="https://github.com/bgd-labs/aave-governance-v3-frontend/blob/main/LICENSE"
          css={{ textDecoration: 'underline', hover: { opacity: 0.7 } }}>
          https://github.com/bgd-labs/aave-governance-v3-frontend/blob/main/LICENSE
        </Link>
        .
      </Text>
      <Text>
        The Aave Governance V3 interface and its related software are the
        intellectual property of and are owned by us. You agree that the
        software and the authorship, systems, ideas, methods of operation,
        documentation and other information contained in the software, are
        proprietary intellectual property and/or the valuable trade secrets of
        BGD Labs Technologies and that we are protected by the UAE Copyrights
        Law.
      </Text>
      <Text>
        You acknowledge that these Terms do not grant you any intellectual
        property rights whatsoever in the interface and its related software and
        all rights are reserved by BGD Labs Technologies.
      </Text>
      <Box sx={{ typography: 'h2', mb: 20 }}>16. No Investment Advice</Box>
      <Text>
        This application and any information provided through it are not
        intended to be and do not constitute investment advice, financial
        advice, trading advice, or any other advice. BGD Labs Technologies does
        not provide any investment advice or recommendations regarding any
        digital assets or cryptocurrencies. The information provided is solely
        for informational purposes and is not to be relied upon for any purpose.
        You should consult with an investment professional before making any
        investment decisions.
      </Text>
      <Box sx={{ typography: 'h2', mb: 20 }}>17. NO WARRANTIES</Box>
      <Text>
        THE AAVE GOVERNANCE V3 INTERFACE BY BGD LABS TECHNOLOGIES IS PROVIDED
        "AS IS" AND "AS AVAILABLE," WITHOUT ANY REPRESENTATIONS OR WARRANTIES OF
        ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY. WE SPECIFICALLY
        DISCLAIM ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
        PARTICULAR PURPOSE. YOU ACKNOWLEDGE AND AGREE THAT YOUR USE OF OUR
        PRODUCTS IS AT YOUR OWN RISK. WE DO NOT GUARANTEE THAT ACCESS TO ANY OF
        OUR PRODUCTS WILL BE CONTINUOUS, UNINTERRUPTED, TIMELY, OR SECURE; THAT
        THE INFORMATION CONTAINED IN ANY OF OUR PRODUCTS WILL BE ACCURATE,
        RELIABLE, COMPLETE, OR CURRENT; OR THAT ANY OF OUR PRODUCTS WILL BE FREE
        FROM ERRORS, DEFECTS, VIRUSES, OR OTHER HARMFUL ELEMENTS. ANY ADVICE,
        INFORMATION, OR STATEMENT THAT WE PROVIDE SHOULD NOT BE CONSIDERED AS
        CREATING ANY WARRANTY CONCERNING OUR PRODUCTS. WE DO NOT ENDORSE,
        GUARANTEE, OR ASSUME ANY RESPONSIBILITY FOR ANY ADVERTISEMENTS, OFFERS,
        OR STATEMENTS MADE BY THIRD PARTIES CONCERNING ANY OF OUR PRODUCTS.
      </Text>
      <Box sx={{ typography: 'h2', mb: 20 }}>18. Indemnification</Box>
      <Text>
        You agree to hold harmless, release, defend, and indemnify us and our
        officers, directors, employees, contractors, agents, and affiliates from
        and against all claims, damages, obligations, losses, liabilities,
        costs, and expenses arising from: (a) your access and use of of Aave
        Governance V3 interface; (b) your violation of any term or condition of
        this Agreement, the right of any third party, or any other applicable
        law, rule, or regulation; (c) any other party's access and use of Aave
        Governance V3 interface with your assistance or using any device or
        account that you own or control; (d) any dispute between you and any
        other user of Aave Governance V3 interface or any of your own customers
        or users; (e) your breach or alleged breach of the Agreement (including,
        without limitation, these Terms); (f) your violation of the rights of
        any third party, including any intellectual property right, publicity,
        confidentiality, property, or privacy right; (g) any misrepresentation
        made by you.
      </Text>
      <Text>
        We reserve the right to assume, at your expense, the exclusive defense
        and control of any matter subject to indemnification by you. You agree
        to cooperate with our defense of any claim. You will not in any event
        settle any claim without our prior written consent.
      </Text>
      <Box sx={{ typography: 'h2', mb: 20 }}>19. Contact</Box>
      <Text>
        If you have any questions or concerns about this Agreement or any of our
        Products, please contact us at{' '}
        <Link
          href="mailto:hi@bgdlabs.com"
          css={{ textDecoration: 'underline', hover: { opacity: 0.7 } }}>
          hi@bgdlabs.com
        </Link>
        .
      </Text>
      <Box sx={{ typography: 'h2', mb: 20 }}>
        20. Arbitration Agreement and Waiver of Rights, Including Class Actions
      </Box>
      <Box sx={{ typography: 'headline', mb: 12, textDecoration: 'underline' }}>
        Agreement to Attempt to Resolve Disputes Through Good Faith Negotiations
      </Box>
      <Text>
        Prior to commencing any legal proceeding against us of any kind,
        including an arbitration as set forth below, you and we agree that we
        will attempt to resolve any Dispute arising out of or relating to the
        agreement or the Services (each, a “Dispute” and, collectively,
        “Disputes”) by engaging in good faith negotiations In the event of any
        dispute arising between the parties, the parties shall first refer the
        dispute to the proceedings under Federal Law No. 6 of 2021 on Mediation
        in Civil and Commercial Disputes (the <b>“Mediation Law”</b>). If the
        dispute has not been settled pursuant to the said rules within 90 days
        following the request for mediation or within such other period as the
        parties may agree in writing, such dispute shall thereafter be finally
        settled by way of arbitration according to the Rules of Arbitration of
        the International Chamber of Commerce (ICC) as detailed in Article 21
      </Text>
      <Box sx={{ typography: 'headline', mb: 12, textDecoration: 'underline' }}>
        Agreement to Arbitrate
      </Box>
      <Text>
        You and we agree that any Dispute that cannot be resolved through the
        procedures set forth above will be resolved through binding arbitration
        in accordance with the International Arbitration Rules of the
        International Chamber of Commerce (ICC). The place of arbitration shall
        be Dubai, United Arab Emirates, and the language of the arbitration
        shall be English. The arbitrator(s) must have experience adjudicating
        matters involving Internet technology, software applications, financial
        transactions and, ideally, blockchain technology. The arbitrator’s award
        of damages must be consistent with the terms of the “Limitation of
        Liability” subsection of these Terms as to the types and amounts of
        damages for which a party may be held liable. The prevailing party will
        be entitled to an award of their reasonable attorney’s fees and costs.
        Except as may be required by law, neither a party nor its
        representatives may disclose the existence, content, or results of any
        arbitration hereunder without the prior written consent of both parties.
      </Text>
      <Text>
        UNLESS YOU TIMELY PROVIDE US WITH AN ARBITRATION OPT-OUT NOTICE (AS
        DEFINED BELOW IN THE SUBSECTION TITLED “YOUR CHOICES”), YOU ACKNOWLEDGE
        AND AGREE THAT YOU AND WE ARE EACH WAIVING THE RIGHT TO A TRIAL BY JURY
        OR TO PARTICIPATE AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS
        ACTION OR REPRESENTATIVE PROCEEDING. FURTHER, UNLESS BOTH YOU AND WE
        OTHERWISE AGREE IN WRITING, THE ARBITRATOR MAY NOT CONSOLIDATE MORE THAN
        ONE PERSON’S CLAIMS AND MAY NOT OTHERWISE PRESIDE OVER ANY FORM OF ANY
        CLASS OR REPRESENTATIVE PROCEEDING.
      </Text>
      <Text>
        By rejecting any changes to these Terms, you agree that you will
        arbitrate any Dispute between you and us in accordance with the
        provisions of this section as of the date you first accepted these Terms
        (or accepted any subsequent changes to these Terms).
      </Text>
      <Box sx={{ typography: 'h2', mb: 20 }}>21. Notice</Box>
      <Text>
        We may provide any notice to you under this Agreement using commercially
        reasonable means, including using public communication channels. Notices
        we provide by using public communication channels will be effective upon
        posting.
      </Text>
      <Box sx={{ typography: 'h2', mb: 20 }}>22. Severability</Box>
      <Text>
        If any provision of this Agreement shall be determined to be invalid or
        unenforceable under any rule, law, or regulation of any local, state, or
        federal government agency, such provision will be changed and
        interpreted to accomplish the objectives of the provision to the
        greatest extent possible under any applicable law and the validity or
        enforceability of any other provision of this Agreement shall not be
        affected.
      </Text>
      <Box sx={{ typography: 'h2', mb: 20 }}>23. Governing law</Box>
      <Text>
        These Terms and any separate agreements whereby we provide you Services
        shall be governed by and construed in accordance with the laws of the
        United Arab Emirates.
      </Text>
    </BasicModal>
  );
}
