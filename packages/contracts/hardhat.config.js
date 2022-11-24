require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
const LOCAL_PRIVATE_KEY = 'e887f7d17d07cc7b8004053fb8826f6657084e88904bb61590e498ca04704cf2'
const localGateway = 'http://localhost:8081/{sender}/{data}.json'
module.exports = {
  networks: {
    hardhat: {
      // throwOnCallFailures: false,
      chainId: 31337,
      gatewayurl:localGateway,
    },
    localhost: {
      // throwOnCallFailures: false,
      url: 'http://localhost:8545',
      chainId: 1337,
      accounts: [ LOCAL_PRIVATE_KEY ],
      gatewayurl:localGateway,
    },
    arbitrumLocalhost: {
      url: 'http://localhost:8547',
      chainId: 412346,
      accounts: [LOCAL_PRIVATE_KEY ]
    },
    // goerli: {
    //   url: process.env.L1_PROVIDER_URL || 'http://localhost:9545',
    //   accounts: [process.env.PRIVATE_KEY || '' ],
    //   chainId: 5,
    //   gatewayurl:'https://arbitrum-resolver-example.uc.r.appspot.com/{sender}/{data}.json',
    // },
    // optimismGoerli: {
    //   url: process.env.L2_PROVIDER_URL || 'http://localhost:8545',
    //   accounts: [process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80']
    // }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  namedAccounts: {
    deployer: {
      default: 0
    }
  },
  solidity: {
    version: "0.8.9",
  },
};
