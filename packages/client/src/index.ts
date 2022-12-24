import { BigNumber, ethers } from 'ethers'
import dotenv from 'dotenv'
dotenv.config()
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
const helperAbi = require('../../contracts/artifacts/contracts/l1/AssertionHelper.sol/AssertionHelper.json').abi
const verifierAbi = require('../../contracts/artifacts/contracts/l1/Verifier.sol/Verifier.json').abi
// const L1_ALCHEMY_KEY = process.env.L1_ALCHEMY_KEY
// const L2_ALCHEMY_KEY = process.env.L2_ALCHEMY_KEY
// if(!(L1_ALCHEMY_KEY && L2_ALCHEMY_KEY)) throw("set L1_ALCHEMY_KEY and L2_ALCHEMY_KEY")

// const l1url = `https://eth-goerli.g.alchemy.com/v2/${L1_ALCHEMY_KEY}`
const l1url = `http://localhost:8545`
const l1provider = new ethers.providers.JsonRpcProvider(l1url);
// const l2url = `https://arb-goerli.g.alchemy.com/v2/${L2_ALCHEMY_KEY}`
const l2url = `http://localhost:8547`
const l2provider = new ethers.providers.JsonRpcProvider(l2url);
console.log({l1url, l2url})
console.log({l1provider, l2provider})

// l2 addresses
const fooAddress = '0x6c25aA969CaDCCA2cA6ad022bD67cCe5Fc27024B'

// l1 addresses
const rollupAddress = '0x7456c45bfd495b7bcf424c0a7993a324035f682f'
const helperAddress = '0x3f442e7bA284c6Ac57eb95ca6977208443F71795'
// Uses @eth-optimism/contracts/libraries/trie/Lib_SecureMerkleTrie.sol
// https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/libraries/trie/Lib_SecureMerkleTrie.sol
const verifierAddress = '0xa662897d53ff3cFA9cb44Ed635dB6e152C68C677'
const rollup = new ethers.Contract(rollupAddress, rollupAbi, l1provider);
const helper = new ethers.Contract(helperAddress, helperAbi, l1provider);
const verifier = new ethers.Contract(verifierAddress, verifierAbi, l1provider);
async function main(){
  const slot = '0x0000000000000000000000000000000000000000000000000000000000000000'
  console.log(await l1provider.getBlock('latest'))
  console.log(await l2provider.getBlock('latest'))
  const nodeIndex = await rollup.latestNodeCreated()
  console.log(3, nodeIndex)
  const nodeEventFilter = await rollup.filters.NodeCreated(nodeIndex);
  const nodeEvents = await rollup.queryFilter(nodeEventFilter);
  const assertion = nodeEvents[0].args!.assertion
  console.log(4, {assertion})
  const sendRoot = await helper.getSendRoot(assertion)
  console.log(41, {sendRoot})
  const blockHash = await helper.getBlockHash(assertion)
  console.log(5, {nodeIndex:parseInt(nodeIndex), blockHash, sendRoot})
  
//   const sendRoot = await helper.getSendRoot(assertion)
  const confirmdata = ethers.utils.keccak256(ethers.utils.solidityPack(['bytes32','bytes32'], [blockHash, sendRoot]))
  console.log(5, {blockHash, sendRoot})
  const l2block = (await l2provider.getBlock(blockHash))
  const l2blockNumber = l2block.number
  console.log(6, l2blockNumber)
  const rblock = await rollup.getNode(nodeIndex)
  // compare these two
  console.log(7, rblock.confirmData) // node or rollup block or rblock
  console.log(8, confirmdata, rblock.confirmData === confirmdata)
  // ^ This complete Proof a certain l2 block hash correspond to a node/rblock
  // ^ Your L1 contract now know the L2 block hash

  // Next step, you need to show the L1 contract the L1 state root
  // You get all the field in the blockheader with the L2 RPC
  const l2blockRaw = await l2provider.send('eth_getBlockByHash', [
    blockHash,
    false
  ]);
  console.log(l2blockRaw)
  const stateroot = l2blockRaw.stateRoot
  const blockarray = [ 
    l2blockRaw.parentHash, 
    l2blockRaw.sha3Uncles, 
    l2blockRaw.miner, 
    stateroot, 
    l2blockRaw.transactionsRoot,
    l2blockRaw.receiptsRoot,
    l2blockRaw.logsBloom,
    BigNumber.from(l2blockRaw.difficulty).toHexString(),
    BigNumber.from(l2blockRaw.number).toHexString(),
    BigNumber.from(l2blockRaw.gasLimit).toHexString(),
    BigNumber.from(l2blockRaw.gasUsed).toHexString(),
    BigNumber.from(l2blockRaw.timestamp).toHexString(),
    l2blockRaw.extraData,
    l2blockRaw.mixHash,
    l2blockRaw.nonce,
    BigNumber.from(l2blockRaw.baseFeePerGas).toHexString(),
    ]
  console.log({blockarray})
  const encoded_blockarray = ethers.utils.RLP.encode(blockarray)
  console.log({encoded_blockarray})
  const calculated_blockhash = ethers.utils.keccak256(encoded_blockarray)
  console.log({calculated_blockhash})
  console.log(calculated_blockhash === blockHash)
  
  // ^ with these, the L1 contract now know the state root (from the blockhash)

  // For the last steps, you need to 
  // 1. prove the account is in the state root
  // 2. prove the storage is in the account root
  const proof = await l2provider.send('eth_getProof', [
    fooAddress,
    [slot],
    {blockHash}
  ]);
  console.log(proof)
  const proofKey = proof.address
  const accountProof = ethers.utils.RLP.encode(proof.accountProof)
  console.log(7, {
    address:proof.address,
    proofKey, accountProof, stateroot
  })


  const [acctExists, acctEncoded] = await verifier.get(
    proofKey, accountProof, stateroot
  )
  console.log({acctExists, acctEncoded})
  // decodeEVMAccount
  const storageRoot = ethers.utils.RLP.decode(acctEncoded)[2]
  console.log({acctExists, storageRoot})

  const slotKey = slot
  const storageProof = ethers.utils.RLP.encode((proof.storageProof as any[]).filter((x)=>x.key===slot)[0].proof)
  
  const [storageExists, storageEncoded] = await verifier.get(
    slotKey, storageProof, storageRoot
  )

  console.log({storageEncoded: storageEncoded})

  // Doing all the check on-chain
  console.log(await verifier.verify(
    nodeIndex,
    blockHash,
    sendRoot,
    encoded_blockarray,
    proofKey,
    accountProof,
    stateroot,
    slotKey,
    storageProof
   ))

  const storageValue = ethers.utils.RLP.decode(storageEncoded)
  const actualValue = await l2provider.getStorageAt(fooAddress, slot, l2block.number) // should use blockhash here but some bug with the alchemy rpc
  const actualValueRemoveLeading0 = BigNumber.from(actualValue).toHexString()
  console.log({storageValue: storageValue, actualValue: actualValueRemoveLeading0, equal: storageValue===actualValueRemoveLeading0})
}
main()