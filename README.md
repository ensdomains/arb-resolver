# Arbitrum Resolver

This repository contains smart contracts and a node.js gateway server that together allow storing ENS names on Optimism using EIP 3668 and ENSIP 10.

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
yarn hardhat --network arbitrumLocalhost run scripts/deployL2.js
yarn hardhat --network localhost run scripts/deployL1.js
```

### Run test script

```
cd packages/clients
yarn start
```