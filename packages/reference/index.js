// import { ethers } from 'ethers';
const ethers = require('ethers')
// const namehash = require('eth-ens-namehash');
const storageAbi = require('../contracts/artifacts/contracts/l2/Storage.sol/Storage.json').abi
const rollupAbi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "previousAdmin",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "newAdmin",
        "type": "address"
      }
    ],
    "name": "AdminChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "beacon",
        "type": "address"
      }
    ],
    "name": "BeaconUpgraded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint64",
        "name": "nodeNum",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "blockHash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "sendRoot",
        "type": "bytes32"
      }
    ],
    "name": "NodeConfirmed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint64",
        "name": "nodeNum",
        "type": "uint64"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "parentNodeHash",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "nodeHash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "executionHash",
        "type": "bytes32"
      },
      {
        "components": [
          {
            "components": [
              {
                "components": [
                  {
                    "internalType": "bytes32[2]",
                    "name": "bytes32Vals",
                    "type": "bytes32[2]"
                  },
                  {
                    "internalType": "uint64[2]",
                    "name": "u64Vals",
                    "type": "uint64[2]"
                  }
                ],
                "internalType": "struct GlobalState",
                "name": "globalState",
                "type": "tuple"
              },
              {
                "internalType": "enum MachineStatus",
                "name": "machineStatus",
                "type": "uint8"
              }
            ],
            "internalType": "struct RollupLib.ExecutionState",
            "name": "beforeState",
            "type": "tuple"
          },
          {
            "components": [
              {
                "components": [
                  {
                    "internalType": "bytes32[2]",
                    "name": "bytes32Vals",
                    "type": "bytes32[2]"
                  },
                  {
                    "internalType": "uint64[2]",
                    "name": "u64Vals",
                    "type": "uint64[2]"
                  }
                ],
                "internalType": "struct GlobalState",
                "name": "globalState",
                "type": "tuple"
              },
              {
                "internalType": "enum MachineStatus",
                "name": "machineStatus",
                "type": "uint8"
              }
            ],
            "internalType": "struct RollupLib.ExecutionState",
            "name": "afterState",
            "type": "tuple"
          },
          {
            "internalType": "uint64",
            "name": "numBlocks",
            "type": "uint64"
          }
        ],
        "indexed": false,
        "internalType": "struct RollupLib.Assertion",
        "name": "assertion",
        "type": "tuple"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "afterInboxBatchAcc",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "wasmModuleRoot",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "inboxMaxCount",
        "type": "uint256"
      }
    ],
    "name": "NodeCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint64",
        "name": "nodeNum",
        "type": "uint64"
      }
    ],
    "name": "NodeRejected",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Paused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint64",
        "name": "challengeIndex",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "asserter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "challenger",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "challengedNode",
        "type": "uint64"
      }
    ],
    "name": "RollupChallengeStarted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "machineHash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "chainId",
        "type": "uint256"
      }
    ],
    "name": "RollupInitialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Unpaused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "implementation",
        "type": "address"
      }
    ],
    "name": "Upgraded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "implementation",
        "type": "address"
      }
    ],
    "name": "UpgradedSecondary",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "initialBalance",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "finalBalance",
        "type": "uint256"
      }
    ],
    "name": "UserStakeUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "initialBalance",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "finalBalance",
        "type": "uint256"
      }
    ],
    "name": "UserWithdrawableFundsUpdated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "VALIDATOR_AFK_BLOCKS",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "_stakerMap",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountStaked",
        "type": "uint256"
      },
      {
        "internalType": "uint64",
        "name": "index",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "latestStakedNode",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "currentChallenge",
        "type": "uint64"
      },
      {
        "internalType": "bool",
        "name": "isStaked",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "stakerAddress",
        "type": "address"
      }
    ],
    "name": "addToDeposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "staker",
        "type": "address"
      }
    ],
    "name": "amountStaked",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "baseStake",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "bridge",
    "outputs": [
      {
        "internalType": "contract IBridge",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "chainId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "challengeManager",
    "outputs": [
      {
        "internalType": "contract IChallengeManager",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "challengeIndex",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "winningStaker",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "losingStaker",
        "type": "address"
      }
    ],
    "name": "completeChallenge",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "blockHash",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "sendRoot",
        "type": "bytes32"
      }
    ],
    "name": "confirmNextNode",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "confirmPeriodBlocks",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "nodeNum",
        "type": "uint64"
      }
    ],
    "name": "countStakedZombies",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "nodeNum",
        "type": "uint64"
      }
    ],
    "name": "countZombiesStakedOnChildren",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[2]",
        "name": "stakers",
        "type": "address[2]"
      },
      {
        "internalType": "uint64[2]",
        "name": "nodeNums",
        "type": "uint64[2]"
      },
      {
        "internalType": "enum MachineStatus[2]",
        "name": "machineStatuses",
        "type": "uint8[2]"
      },
      {
        "components": [
          {
            "internalType": "bytes32[2]",
            "name": "bytes32Vals",
            "type": "bytes32[2]"
          },
          {
            "internalType": "uint64[2]",
            "name": "u64Vals",
            "type": "uint64[2]"
          }
        ],
        "internalType": "struct GlobalState[2]",
        "name": "globalStates",
        "type": "tuple[2]"
      },
      {
        "internalType": "uint64",
        "name": "numBlocks",
        "type": "uint64"
      },
      {
        "internalType": "bytes32",
        "name": "secondExecutionHash",
        "type": "bytes32"
      },
      {
        "internalType": "uint256[2]",
        "name": "proposedTimes",
        "type": "uint256[2]"
      },
      {
        "internalType": "bytes32[2]",
        "name": "wasmModuleRoots",
        "type": "bytes32[2]"
      }
    ],
    "name": "createChallenge",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "staker",
        "type": "address"
      }
    ],
    "name": "currentChallenge",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currentRequiredStake",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "extraChallengeTimeBlocks",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "firstUnresolvedNode",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "components": [
              {
                "components": [
                  {
                    "internalType": "bytes32[2]",
                    "name": "bytes32Vals",
                    "type": "bytes32[2]"
                  },
                  {
                    "internalType": "uint64[2]",
                    "name": "u64Vals",
                    "type": "uint64[2]"
                  }
                ],
                "internalType": "struct GlobalState",
                "name": "globalState",
                "type": "tuple"
              },
              {
                "internalType": "enum MachineStatus",
                "name": "machineStatus",
                "type": "uint8"
              }
            ],
            "internalType": "struct RollupLib.ExecutionState",
            "name": "beforeState",
            "type": "tuple"
          },
          {
            "components": [
              {
                "components": [
                  {
                    "internalType": "bytes32[2]",
                    "name": "bytes32Vals",
                    "type": "bytes32[2]"
                  },
                  {
                    "internalType": "uint64[2]",
                    "name": "u64Vals",
                    "type": "uint64[2]"
                  }
                ],
                "internalType": "struct GlobalState",
                "name": "globalState",
                "type": "tuple"
              },
              {
                "internalType": "enum MachineStatus",
                "name": "machineStatus",
                "type": "uint8"
              }
            ],
            "internalType": "struct RollupLib.ExecutionState",
            "name": "afterState",
            "type": "tuple"
          },
          {
            "internalType": "uint64",
            "name": "numBlocks",
            "type": "uint64"
          }
        ],
        "internalType": "struct RollupLib.Assertion",
        "name": "assertion",
        "type": "tuple"
      }
    ],
    "name": "getL2BlockHash",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "nodeNum",
        "type": "uint64"
      }
    ],
    "name": "getNode",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "stateHash",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "challengeHash",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "confirmData",
            "type": "bytes32"
          },
          {
            "internalType": "uint64",
            "name": "prevNum",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "deadlineBlock",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "noChildConfirmedBeforeBlock",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "stakerCount",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "childStakerCount",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "firstChildBlock",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "latestChildNumber",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "createdAtBlock",
            "type": "uint64"
          },
          {
            "internalType": "bytes32",
            "name": "nodeHash",
            "type": "bytes32"
          }
        ],
        "internalType": "struct Node",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "staker",
        "type": "address"
      }
    ],
    "name": "getStaker",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "amountStaked",
            "type": "uint256"
          },
          {
            "internalType": "uint64",
            "name": "index",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "latestStakedNode",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "currentChallenge",
            "type": "uint64"
          },
          {
            "internalType": "bool",
            "name": "isStaked",
            "type": "bool"
          }
        ],
        "internalType": "struct IRollupCore.Staker",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "stakerNum",
        "type": "uint64"
      }
    ],
    "name": "getStakerAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "inbox",
    "outputs": [
      {
        "internalType": "contract IInbox",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_stakeToken",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isERC20Enabled",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "staker",
        "type": "address"
      }
    ],
    "name": "isStaked",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "staker",
        "type": "address"
      }
    ],
    "name": "isStakedOnLatestConfirmed",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "isValidator",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "staker",
        "type": "address"
      }
    ],
    "name": "isZombie",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "lastStakeBlock",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "latestConfirmed",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "latestNodeCreated",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "staker",
        "type": "address"
      }
    ],
    "name": "latestStakedNode",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "loserStakeEscrow",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "minimumAssertionPeriod",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "nodeNum",
        "type": "uint64"
      },
      {
        "internalType": "bytes32",
        "name": "nodeHash",
        "type": "bytes32"
      }
    ],
    "name": "newStakeOnExistingNode",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "components": [
              {
                "components": [
                  {
                    "internalType": "bytes32[2]",
                    "name": "bytes32Vals",
                    "type": "bytes32[2]"
                  },
                  {
                    "internalType": "uint64[2]",
                    "name": "u64Vals",
                    "type": "uint64[2]"
                  }
                ],
                "internalType": "struct GlobalState",
                "name": "globalState",
                "type": "tuple"
              },
              {
                "internalType": "enum MachineStatus",
                "name": "machineStatus",
                "type": "uint8"
              }
            ],
            "internalType": "struct RollupLib.ExecutionState",
            "name": "beforeState",
            "type": "tuple"
          },
          {
            "components": [
              {
                "components": [
                  {
                    "internalType": "bytes32[2]",
                    "name": "bytes32Vals",
                    "type": "bytes32[2]"
                  },
                  {
                    "internalType": "uint64[2]",
                    "name": "u64Vals",
                    "type": "uint64[2]"
                  }
                ],
                "internalType": "struct GlobalState",
                "name": "globalState",
                "type": "tuple"
              },
              {
                "internalType": "enum MachineStatus",
                "name": "machineStatus",
                "type": "uint8"
              }
            ],
            "internalType": "struct RollupLib.ExecutionState",
            "name": "afterState",
            "type": "tuple"
          },
          {
            "internalType": "uint64",
            "name": "numBlocks",
            "type": "uint64"
          }
        ],
        "internalType": "struct RollupLib.Assertion",
        "name": "assertion",
        "type": "tuple"
      },
      {
        "internalType": "bytes32",
        "name": "expectedNodeHash",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "prevNodeInboxMaxCount",
        "type": "uint256"
      }
    ],
    "name": "newStakeOnNewNode",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "nodeNum",
        "type": "uint64"
      },
      {
        "internalType": "address",
        "name": "staker",
        "type": "address"
      }
    ],
    "name": "nodeHasStaker",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "outbox",
    "outputs": [
      {
        "internalType": "contract IOutbox",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "proxiableUUID",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "target",
        "type": "uint256"
      }
    ],
    "name": "reduceDeposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "stakerAddress",
        "type": "address"
      }
    ],
    "name": "rejectNextNode",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "startIndex",
        "type": "uint256"
      }
    ],
    "name": "removeOldZombies",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "removeWhitelistAfterFork",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "removeWhitelistAfterValidatorAfk",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "zombieNum",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxNodes",
        "type": "uint256"
      }
    ],
    "name": "removeZombie",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "nodeNum",
        "type": "uint256"
      }
    ],
    "name": "requireUnresolved",
    "outputs": [],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "requireUnresolvedExists",
    "outputs": [],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "blockNumber",
        "type": "uint256"
      },
      {
        "internalType": "uint64",
        "name": "firstUnresolvedNodeNum",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "latestCreatedNode",
        "type": "uint64"
      }
    ],
    "name": "requiredStake",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "stakerAddress",
        "type": "address"
      }
    ],
    "name": "returnOldDeposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rollupDeploymentBlock",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rollupEventInbox",
    "outputs": [
      {
        "internalType": "contract IRollupEventInbox",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "sequencerInbox",
    "outputs": [
      {
        "internalType": "contract ISequencerInbox",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "nodeNum",
        "type": "uint64"
      },
      {
        "internalType": "bytes32",
        "name": "nodeHash",
        "type": "bytes32"
      }
    ],
    "name": "stakeOnExistingNode",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "components": [
              {
                "components": [
                  {
                    "internalType": "bytes32[2]",
                    "name": "bytes32Vals",
                    "type": "bytes32[2]"
                  },
                  {
                    "internalType": "uint64[2]",
                    "name": "u64Vals",
                    "type": "uint64[2]"
                  }
                ],
                "internalType": "struct GlobalState",
                "name": "globalState",
                "type": "tuple"
              },
              {
                "internalType": "enum MachineStatus",
                "name": "machineStatus",
                "type": "uint8"
              }
            ],
            "internalType": "struct RollupLib.ExecutionState",
            "name": "beforeState",
            "type": "tuple"
          },
          {
            "components": [
              {
                "components": [
                  {
                    "internalType": "bytes32[2]",
                    "name": "bytes32Vals",
                    "type": "bytes32[2]"
                  },
                  {
                    "internalType": "uint64[2]",
                    "name": "u64Vals",
                    "type": "uint64[2]"
                  }
                ],
                "internalType": "struct GlobalState",
                "name": "globalState",
                "type": "tuple"
              },
              {
                "internalType": "enum MachineStatus",
                "name": "machineStatus",
                "type": "uint8"
              }
            ],
            "internalType": "struct RollupLib.ExecutionState",
            "name": "afterState",
            "type": "tuple"
          },
          {
            "internalType": "uint64",
            "name": "numBlocks",
            "type": "uint64"
          }
        ],
        "internalType": "struct RollupLib.Assertion",
        "name": "assertion",
        "type": "tuple"
      },
      {
        "internalType": "bytes32",
        "name": "expectedNodeHash",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "prevNodeInboxMaxCount",
        "type": "uint256"
      }
    ],
    "name": "stakeOnNewNode",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "stakeToken",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "stakerCount",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalWithdrawableFunds",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "validatorUtils",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "validatorWalletCreator",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "validatorWhitelistDisabled",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "wasmModuleRoot",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawStakerFunds",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "withdrawableFunds",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "zombieNum",
        "type": "uint256"
      }
    ],
    "name": "zombieAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "zombieCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "zombieNum",
        "type": "uint256"
      }
    ],
    "name": "zombieLatestStakedNode",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

const assertion = {
  "numBlocks": 341823,
  "afterState": {
    "globalState": {
      "u64Vals": [30700, 24],
      "bytes32Vals": [[169, 129, 17, 206, 132, 86, 173, 140, 149, 243, 244, 21, 223, 117, 118, 242, 225, 179, 224, 232, 53, 68, 219, 116, 75, 63, 57, 117, 155, 255, 235, 51], [192, 153, 60, 224, 225, 112, 115, 46, 47, 203, 181, 33, 25, 230, 149, 129, 133, 205, 31, 225, 225, 80, 145, 78, 241, 104, 136, 227, 10, 149, 36, 83]]}, "machineStatus": 1}, "beforeState": {"globalState": {"u64Vals": [29934, 350], "bytes32Vals": [[144, 192, 22, 202, 35, 230, 61, 77, 186, 167, 7, 57, 254, 248, 101, 189, 79, 143, 11, 180, 243, 144, 110, 96, 96, 91, 195, 223, 46, 169, 219, 187], [108, 187, 143, 93, 208, 7, 89, 114, 92, 230, 201, 24, 23, 33, 33, 189, 167, 68, 206, 231, 20, 151, 253, 167, 134, 245, 47, 69, 180, 41, 48, 64]]}, 
    "machineStatus": 1
  }
}

const l1url = 'http://localhost:8545'
const l1provider = new ethers.providers.JsonRpcProvider(l1url);
// const l2url = 'https://goerli-rollup.arbitrum.io/rpc'
const l2url = 'http://localhost:8547'
const l2provider = new ethers.providers.JsonRpcProvider(l2url);

(async () => {
    // const l1ChainId = 1337
    // const l2ChainId = 412346 
    // Goerli
    // const storageAddress = '0x2A0d1702421E1B18FCb83176E6Cf4F96853cc208'
    // Local
    const rollupAddress = '0xcd5ab8c20f90ccc4ef31d32c885d5c159eada6c0'
    const storageAddress = '0xd5be5dFCA1f468f27f9ae6e54c738877125daf54'    

    const storage = new ethers.Contract(storageAddress, storageAbi, l2provider);
    const rollup = new ethers.Contract(rollupAddress, rollupAbi, l1provider);
    console.log(1, await storage.getInt(2))
    const slot = await storage.mapLocationInt(0, 2)
    const value = await l2provider.getStorageAt(storageAddress, slot)
    console.log(2, {storageAddress, slot, value, slot2: slot.toHexString()})
    const nodeIndex = await rollup.latestNodeCreated()
    console.log(3, nodeIndex)
    const nodeEventFilter = await rollup.filters.NodeCreated(nodeIndex);
    const nodeEvents = await rollup.queryFilter(nodeEventFilter);
    const assertion = nodeEvents[0].args.assertion
    const blockHash = await rollup.getL2BlockHash(assertion)
    console.log(4, {blockHash})
    const proof = await l2provider.send('eth_getProof', [
      storageAddress,
      [slot.toHexString()],
      blockHash
    ]);
    console.log(5, {proof})
    console.log(6, {storageProof:proof.storageProof})
    console.log(7, {storageProofProof:proof.storageProof[0].proof})
  }
)();