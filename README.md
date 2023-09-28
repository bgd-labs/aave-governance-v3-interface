# Aave Governance V3 frontend

<img src="./public/metaLogo.jpg" alt="Aave Governance v3" width="100%" height="75%">

<br>

React application to interact with the Aave Governance V3 smart contracts: visualize data and build blockchain transactions.

## Built on

- Logic: [React](https://react.dev/),  [Next.js](https://nextjs.org/), [zustand](https://docs.pmnd.rs/zustand/getting-started/introduction).
- Web3: [BGD web3 UI helpers](https://github.com/bgd-labs/fe-shared), [ether.js (v5.7.2)](https://docs.ethers.org/v5/), [web3-react](https://github.com/Uniswap/web3-react).
- Styling: [MUI system](https://mui.com/system/getting-started/), [headlessui](https://headlessui.com/).

## Pre-requirements

- [Node.js](https://nodejs.org/ru): version 18.x or higher.
- [Git](https://git-scm.com/downloads): version 2.3.x or higher.
- Package manager: we recommend [Yarn](https://yarnpkg.com/), version 1.x or higher.

## Configurations
- Blockchain RPC URLs and/or IPFS gateway URLs can be changed here [file](./src/utils/configs.ts).
- It is possible to run the application in SSR (Server-Side-Rendering) or IPFS mode, by changing `NEXT_PUBLIC_DEPLOY_FOR_IPFS`. The default is `false`, which is the most optimal option for all use cases.

<br>

## How to access the Aave Governance v3 UI?

### Run locally

First run:

```sh
git submodule init
git submodule update --remote --init
yarn

yarn dev
// or
yarn build && yarn start
```

After the first run:
```sh
yarn dev
// or
yarn build && yarn start
```

For submodules update:

```sh
git submodule update --remote --init
```

### Deploy your own Vercel instance

You can deploy your version of the application using Vercel just by clicking on the following button, and following the instructions:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/bgd-labs/governance-v3-zustand)

### Hosted version

We have our own hosted version from Vercel, you can access it on [https://vote.onaave.com/](https://vote.onaave.com/)

<br>

## License

Copyright © 2023, Aave DAO, represented by its governance smart contracts.

Created by BGD Labs.

**IMPORTANT**. The BUSL1.1 license of this repository allows for any usage of the software, if respecting the *Additional Use Grant* limitations, forbidding any use case damaging anyhow the Aave DAO's interests.
