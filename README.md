# Arbitrum Resolver

This repository contains smart contracts and a node.js gateway server that together allow storing ENS names on Arbitrum using EIP 3668 and ENSIP 10.

## Usage

### Setup local node

```
git clone https://github.com/offchainlabs/nitro
cd nitro
git submodule update --init --recursive
./test-node.bash --no-blockscout --init
```

### Deploy contracts

```
cd packages/contracts
npx hardhat --network arbitrumLocalhost run scripts/deployL2.js
// Take notes of L2_RESOLVER_ADDRESS
RESOLVER_ADDRESS=$L2_RESOLVER_ADDRESS npx hardhat --network localhost run scripts/deployL1.js
```

### Start gateway server

```
cd packages/gateway
yarn start --l2_resolver_address $L2_RESOLVER_ADDRESS
```

### Run test script

```
cd packages/clients
yarn start
```


## How to deploy to public net (goerli for example)

### Deploy l2 contract

TEST_NAME=$TEST_NAME L1_PROVIDER_URL=$L1_PROVIDER_URL L2_PROVIDER_URL=$L2_PROVIDER_URL PRIVATE_KEY=$PRIVATE_KEY
npx hardhat --network arbitrumGoerli run scripts/deployL2.js

### Deploy l1 contract

L1_PROVIDER_URL=L1_PROVIDER_URL L2_PROVIDER_URL=L2_PROVIDER_URL PRIVATE_KEY=PRIVATE_KEY
RESOLVER_ADDRESS=RESOLVER_ADDRESS npx hardhat --network goerli run scripts/deployL1.js

### Verify l1 contract

RESOLVER_ADDRESS= L1_PROVIDER_URL= ETHERSCAN_API_KEY= npx hardhat verify --network goerli --constructor-args scripts/arguments.js CONTRACT_ADDRESS

 RESOLVER_ADDRESS=0xE2ea775DfEb454F7E667e71029b401b6C08fF000 npx hardhat verify --network goerli --constructor-args scripts/arguments.js 0xb5AcD139192ddA9C96A1EC1D298dE1663805Fa68
Error in plugin @nomiclabs/hardhat-etherscan: Importing the module for the constructor arguments list failed.

## Deployed contracts

- Arbitrum goerli resolver = 0xE2ea775DfEb454F7E667e71029b401b6C08fF000
- goerli (gateway points to 'https://arb-resolver-example.uc.r.appspot.com/{sender}/{data}.json' ) = [0x142884839B7A5F952aD00bF65c5baf225257FFa2](https://goerli.etherscan.io/address/0x142884839B7A5F952aD00bF65c5baf225257FFa2)
- goerli test domain = [arb-resolver.eth](https://app.ens.domains/name/arb-resolver.eth/details)

## Deploy gateway

Create secret.yaml and update credentials

```
cd gateway
cp secret.yaml.org secret.yaml
```

Deploy to app engine

```
gcloud app deploy goeril.app.yml
```
