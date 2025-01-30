# Aave Governance V3 interface

<img src="./public/metaLogo.jpg" alt="Aave Governance v3" width="100%" height="70.01%">

<br>

Welcome to the Aave Governance V3 interface! This is a sophisticated React application designed to interact seamlessly with the Aave Governance V3 smart contracts, allowing you to visualize important data and construct blockchain transactions effortlessly.

## Built On

- **Logic:** [React](https://react.dev/), [Next.js](https://nextjs.org/), [zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- **Web3:** [viem](https://viem.sh/), [wagmi](https://wagmi.sh/), [@bgd-labs/frontend-web3-utils](https://github.com/bgd-labs/fe-shared)
- **Styling:** [MUI system](https://mui.com/system/getting-started/), [headlessui](https://headlessui.com/)
- **Server:** [tRPC](https://trpc.io/), [Rest API](https://api.onaave.com/docs)

## Pre-requirements

Before you begin, ensure you have the following installed:

- **[Node.js](https://nodejs.org/ru):** Version 18 or higher.
- **[Git](https://git-scm.com/downloads):** Version 2.3.x or higher.
- **Package Manager:** We recommend [Pnpm](https://pnpm.io/), version 9.x or higher.

## Configurations

- **Blockchain RPC URLs:** Modify them in this [file](./src/helpers/chain/getInitialRpcUrls.ts).
- **IPFS Gateway URLs:** Update them in this [file](./src/configs/configs.ts).
- **Deployment Mode:** You can run the application in SSR (Server-Side-Rendering) or IPFS mode by adjusting `NEXT_PUBLIC_DEPLOY_FOR_IPFS`. The default is `false`, which is optimal for most use cases.

## How to Access the Aave Governance V3 UI?

### Run locally
Install dependencies

```
pnpm install
```

Start app
```
pnpm build // builds app
pnpm start // starts build
```
```
pnpm dev // starts dev server
```
Serves at `localhost:3000`

### Deploy Your Own Vercel Instance

Deploy your own version of the application on Vercel with ease. Click the button below and follow the instructions:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbgd-labs%2Faave-governance-v3-interface)

### Hosted Version

Access our hosted version directly from Vercel: [https://vote.onaave.com/](https://vote.onaave.com/)

## For Developers

### 1. How to Add New Chain Support to the Application?

1. **Update `RPCUrls` Type:**
    - Modify the type to include the new chain RPC name.
    - [File](./src/helpers/chain/getInitialRpcUrls.ts)
    ```typescript
    // TIP: The new chain rpc name should be here
    ```

2. **Add Public RPC URLs for New Chain:**
    - Include the public RPC URLs for the new chain.
    - [File](./src/helpers/chain/getInitialRpcUrls.ts)
    ```typescript
    // TIP: The new chain public RPC urls should be here
    ```

3. **Initialize the New Chain:**
    - Set up the new chain alongside other chains.
    - [File](./src/helpers/chain/getChains.ts)
    ```typescript
    // TIP: The new chain should initialize here
    ```

4. **Add New Chain to Server Chains:**
    - Specify the private RPC URLs for the server.
    - [File](./src/requests/utils/chains.ts)
    ```typescript
    // TIP: The new private RPC url's for the server is specified here.
    ```

5. **Add New Chain to Client Chains (Optional):**
    - In rare cases, specify the private RPC URLs for the client.
    - [File](./src/configs/chains.ts)
    ```typescript
    // TIP: The new private RPC url's for the client is specified here (getting from client env).
    ```

### 2. How to Add New Payloads Controller Support to the Application?

1. **Determine the Scope:**
    - Identify whether the new controller will be added to an existing chain or a new chain.

2. **Update `@bgd-labs/aave-address-book`:**
    - Ensure it includes the new controller addresses.

3. **If Adding to an Existing Chain:**

    1. **Find Required Chain Configuration:**
        - Locate the chain in the application payload controller configuration.
        - [File](./src/configs/appConfigInit.ts)

    2. **Update Payload Controller Addresses:**
        - Insert the new address from the address-book first, followed by the old address as the second element of the array. This ensures data from the old payload controller remains accessible in the UI.
        - [File](./src/configs/appConfigInit.ts)
        ```typescript
        // TIP: Old payloads controller addresses will be added here in the array
        ```

4. **If Adding to a New Chain:**

    1. **Add Support for the New Chain:**
        - Follow the steps outlined in the first section to add new chain support.

    2. **Update Payload Controller Configuration:**
        - Add the address of the payloads controller and the payloads controller data helper to the application payload controller configuration.
        - [File](./src/configs/appConfigInit.ts)
        ```typescript
        // TIP: Addresses for the new chain with a payload controller are added here
        ```

### 3. How to Add New Voting Machine Support to the Application?

1. **Determine the Scope:**
    - Identify whether the new voting machine will be added to an existing supported chain or a new chain.

2. **Update `@bgd-labs/aave-address-book`:**
    - Ensure it includes the new voting machine addresses.

3. **If Adding to a Supported Chain:**

    1. **Add Voting Portal Address:**
        - Add the voting portal address for the specific chain.
        - [File](./src/configs/appConfigInit.ts)
        ```typescript
        // TIP: The address for the new chain with the voting portal has been added here
        ```

    2. **Add Voting Machine Addresses:**
        - Insert the voting machine addresses for the specific chain.
        - [File](./src/configs/appConfigInit.ts)
        ```typescript
        // TIP: The addresses for the new chain with the voting machine has been added here
        ```

4. **If Adding to a New Chain:**

    1. **Add Support for the New Chain:**
        - Follow the steps outlined in the first section to add new chain support.

    2. **Follow Steps 3.3.1 and 3.3.2:**
        - After adding support for the new chain, add the voting portal and voting machine addresses as described above.

### 4. How to Add Support for a New Voting Asset?

Initially, a new asset for voting is added on the smart contract side. But additional actions are also required on the UI side:

1. **Add Voting Asset Address:**
    - Include the address of the new voting asset in the application config.
    - [File](./src/configs/appConfigInit.ts)
    ```typescript
    // TIP: New address of the voting asset will be added here
    ```

2. **Add Balance Slot for Voting Asset:**
    - Add the balance slot (or other slots) for the new voting asset to the balance slots config.
    - [File](./src/helpers/getVoteBalanceSlot.ts)
    ```typescript
    // TIP: Balance slot (or other slots) for new voting asset are added here
    ```

3. **Support for Symbol and Name of the Voting Asset:**

    1. **Add Symbol:**
        - Add the symbol of the new voting asset.
        - [File](./src/helpers/getAssetName.ts)
        ```typescript
        // TIP: Symbol for new voting asset is added here
        ```

    2. **Add Name:**
        - Include the name of the new voting asset.
        - [File](./src/helpers/getAssetName.ts)
        ```typescript
        // TIP: Name for new voting asset is added here
        ```

4. **Update Tutorial Modals:**
    - Modify the string with symbols for the tutorial modal windows to include the symbol of the new voting asset.
    - [File](./src/components/TutorialModals/assets.ts)
    ```typescript
    // TIP: Just the string that is used in the tutorial, add the symbol of the new voting asset here
    ```

### 5. How to Change Gov Core to Testnet?

1. **Change Core to Sepolia:**
    - Simply change the core name to `sepolia`.
    - [File](./src/configs/appConfig.ts)
    ```typescript
    // TIP: Сan be changed to sepolia testnet
    ```

## License

Copyright © 2023, Aave DAO, represented by its governance smart contracts.

Created by BGD Labs.

**IMPORTANT**. The BUSL1.1 license of this repository allows for any usage of the software, if respecting the *Additional Use Grant* limitations, forbidding any use case damaging anyhow the Aave DAO's interests.
