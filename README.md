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
// Take notes of $ENS_REGISTRY_ADDRESS
// Take notes of $HELPER_ADDRESS
```

### Start gateway server

```
cd packages/gateway
yarn build
yarn start --l2_resolver_address $L2_RESOLVER_ADDRESS --helper_address $HELPER_ADDRESS
```

### Run test script

```
cd packages/clients
yarn start -r $ENS_REGISTRY_ADDRESS test.test
```

If sucessful, it should show the following output
```
options {
  l1_provider_url: 'http://localhost:8545',
  ensAddress: '0x3E9b8c645914626C2f304994d5992527c3ab528b',
  chainId: 1337,
  chainName: 'unknown',
  debug: false
}
getAddress            0x683642c22feDE752415D4793832Ab75EFdF6223c
(call time= 189 )
getAddress(60)        0x683642c22feDE752415D4793832Ab75EFdF6223c
_fetchBytes           0x683642c22fede752415d4793832ab75efdf6223c
addr(bytes32)         0x683642c22feDE752415D4793832Ab75EFdF6223c
addr(bytes32,uint256) 0x683642c22fede752415d4793832ab75efdf6223c
resolveName 0x683642c22feDE752415D4793832Ab75EFdF6223c
✨  Done in 3.84s.
```


## How to deploy to public net (goerli for example)

### Deploy l2 contract

```
TEST_NAME=$TEST_NAME \
L1_PROVIDER_URL=$L1_PROVIDER_URL \
L2_PROVIDER_URL=$L2_PROVIDER_URL 
PRIVATE_KEY=$PRIVATE_KEY \
npx hardhat --network arbitrumGoerli run scripts/deployL2.js
```

### Deploy l1 contract

```
L1_PROVIDER_URL=L1_PROVIDER_URL \
L2_PROVIDER_URL=L2_PROVIDER_URL \
PRIVATE_KEY=PRIVATE_KEY \
RESOLVER_ADDRESS=RESOLVER_ADDRESS \
npx hardhat --network goerli run scripts/deployL1.js
```

### Verify l1 contract

```
RESOLVER_ADDRESS= 
L1_PROVIDER_URL= 
ETHERSCAN_API_KEY= 
npx hardhat verify --network goerli --constructor-args scripts/arguments.js CONTRACT_ADDRESS
```

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

## How l2 state verification on l1 works.

### Overview

Every time l2 state is updated, the validator stores the l2 state information as `Node` into `Rolleup` L1 contract by sending the `Assertion` (the claim about the current state) via `Rollup.createNewNode` function. To verify the storage slot of l2, it requires the following 3 steps.

- 1. Prove a certain l2 block hash correspond to a node/rblock(raw block) state with the assertion
- 2. Prove the state root belong to the l2 block hash by supplying the blockheader
- 3. Prove the storage root is part of the state root

### The actual flow

The full reference code is at https://gist.github.com/gzeoneth/0a8bac381752e4b4f30650a0d3c76096

#### 1. Prove a certain l2 block hash correspond to a node/rblock(raw block) state with the assertion

- Find the latest node index by calling `rollup.latestNodeCreated()` for all posted rblock data by a validator (`rollup.latestNodeConfirmed()` for all confirmed data)
- Fetch an assertion from the node event
- Fetch blockhash via `GlobalStateLib.getBlockHash(assertion.afterState.globalState);`
- Fetch sendRoot via `GlobalStateLib.getSendRoot(assertion.afterState.globalState);`
- Manually derive confirmData by hashing blockhash and sendRoot
- Fetch rblock via `await rollup.getNode(nodeIndex)`
- Compare `confirmData == rblock.confirmData`

#### 2. Prove the state root belong to the l2 block hash by supplying the blockheader <= where do I find blockheader?
- Fetch l2 block (`l2blockRaw`) via `eth_getBlockByHash(blockhash)`
- Manually derive blockhash by hashing block header fields
- Compare the derived value against `proof.blockHash`

#### 3. Prove the storage root is part of the state root

This step is almost identical to how to verify it on Optimism and uses Optimism MerkleTrie contract library.

- Proof the account storage inside the state root
- Proof the storage slot is in the account root

### Arbitrum terms 

#### Assertion

The state of an Arbitrum chain is confirmed back on Ethereum via "assertions," aka "disputable assertions" or "DAs." These are claims made by Arbitrum validators about the chain's state. To make an assertion, a validator must post a bond in Ether. The more on ["The assertion tree"](https://developer.offchainlabs.com/assertion-tree) section.

The Assertion is [represented in the following fields within Arbitrum Nitro](https://github.com/OffchainLabs/nitro/blob/master/contracts/src/rollup/RollupLib.sol#L84).

```
    struct Assertion {
        ExecutionState beforeState;
        ExecutionState afterState;
        uint64 numBlocks;
    }

    struct ExecutionState {
        GlobalState globalState;
        MachineStatus machineStatus;
    }

    struct GlobalState {
        bytes32[2] bytes32Vals; // (blockhash, sendRoot)
        uint64[2] u64Vals;      // (inboxPosition, positionInMessage)
    }
```

#### blockHash

Hash of the l2 block header. The block header is composed of 15 distinct fields as per [the yellow paper](https://ethereum.github.io/yellowpaper/paper.pdf).

#### confirmData

confirmData is how Arbitrum stores the l2 state in rblock, contatination of blockHash and sendRoot (concatinated to save storage slot)

#### Inbox

Slow Inbox is a sequence of L1 initiated message that offer an alternative path for inclusion into the fast Inbox.
Fast Inbox is a Contract that holds a sequence of messages sent by clients to the contracts on an Arbitrum Chain; message can be put into the Inbox directly by the Sequencer or indirectly through the slow inbox.

#### Outbox

An L1 contract responsible for tracking outgoing (Arbitrum to Ethereum) messages, including withdrawals, which can be executed by users once they are confirmed. The outbox stores a Merkle Root of all outgoing messages.

#### Rblock (Rollup block), aka Node 

The rollup protocol tracks a chain of rollup blocks---we'll call these "RBlocks" for clarity. They're not the same as Layer 1 Ethereum blocks, and also not the same as Layer 2 Nitro blocks. You can think of the RBlocks as forming a separate chain, which the Arbitrum rollup protocol manages and oversees.

Validators can propose RBlocks. New RBlocks will be unresolved at first. Eventually every RBlock will be resolved, by being either confirmed or rejected. The confirmed RBlocks make up the confirmed history of the chain.

Each RBlock contains:
- the RBlock number
- the predecessor RBlock number: RBlock number of the last RBlock before this one that is (claimed to be) correct
- the number of L2 blocks that have been created in the chain's history
- the number of inbox messages have been consumed in the chain’s history
- a hash of the outputs produced over the chain’s history  (= sendRoot)

RBlocks typically get asserted every 30-60 minutes.
More detail [in the doc](https://developer.arbitrum.io/inside-arbitrum-nitro/#the-rollup-chain)

#### sendRoot

The root of the last confirmed transaction in Outbox. If the sendRoot information is in outbox, you can be assured that the stat is confirmed.

#### Sequencer

An entity (currently a single-party on Arbitrum One) given rights to reorder transactions in the Inbox over a small window of time, who can thus give clients sub-blocktime soft confirmations. (Not to be confused with a validator)


