# Aave Governance V3 frontend

<img src="./public/metaLogo.jpg" alt="Aave Governance v3" width="100%" height="70%">

<br>

React application to interact with the Aave Governance V3 smart contracts: visualize data and build blockchain transactions.

## Built on

- Logic: [React](https://react.dev/),  [Next.js](https://nextjs.org/), [zustand](https://docs.pmnd.rs/zustand/getting-started/introduction).
- Web3: [viem](https://viem.sh/), [wagmi](https://wagmi.sh/), [@bgd-labs/frontend-web3-utils](https://github.com/bgd-labs/fe-shared).
- Styling: [MUI system](https://mui.com/system/getting-started/), [headlessui](https://headlessui.com/).
- Server: [tRPC](https://trpc.io/), [Rest API](https://api.onaave.com/docs)

## Pre-requirements

- [Node.js](https://nodejs.org/ru): version 18 or higher.
- [Git](https://git-scm.com/downloads): version 2.3.x or higher.
- Package manager: we recommend [Pnpm](https://yarnpkg.com/), version 9.x or higher.

## Configurations
- Blockchain RPC URLs can be changed here [file](./src/helpers/chain/getInitialRpcUrls.ts) and IPFS gateway URLs can be changed here [file](./src/configs/configs.ts).
- It is possible to run the application in SSR (Server-Side-Rendering) or IPFS mode, by changing `NEXT_PUBLIC_DEPLOY_FOR_IPFS`. The default is `false`, which is the most optimal option for all use cases.

<br>

## How to access the Aave Governance v3 UI?

### Run locally
```sh
pnpm install && pnpm dev
// or
pnpm install && pnpm build && pnpm start
```

### Deploy your own Vercel instance

You can deploy your version of the application using Vercel just by clicking on the following button, and following the instructions:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbgd-labs%2Faave-governance-v3-interface)

### Hosted version

We have our own hosted version from Vercel, you can access it on [https://vote.onaave.com/](https://vote.onaave.com/)

<br>

## For developers
### 1. How to add new chain support to the application?
1.1. Need to update `RPCUrls` type. [file](./src/helpers/chain/getInitialRpcUrls.ts) `// TIP: The new chain rpc name should be here`

1.2. Need to add public RPC urls for new chain. [file](./src/helpers/chain/getInitialRpcUrls.ts) `// TIP: The new chain public RPC urls should be here`

1.3. Need to set new chain with other chains. [file](./src/helpers/chain/getChains.ts) `// TIP: The new chain should initialize here`

1.4. Need to add new chain to server chains. [file](./src/requests/utils/chains.ts) `// TIP: The new private RPC url's for the server is specified here.`

1.5. Need to add new chain to client chains. Not necessarily, in very rare cases. [file](./src/configs/chains.ts) `// TIP: The new private RPC url's for the client is specified here (getting from client env).`

### 2. How to add new payloads controller support to the application?

## License

Copyright © 2023, Aave DAO, represented by its governance smart contracts.

Created by BGD Labs.

**IMPORTANT**. The BUSL1.1 license of this repository allows for any usage of the software, if respecting the *Additional Use Grant* limitations, forbidding any use case damaging anyhow the Aave DAO's interests.
