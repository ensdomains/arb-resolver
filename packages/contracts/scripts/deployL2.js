const hre = require("hardhat");
const {ethers} = hre;
const namehash = require('eth-ens-namehash');
let TEST_NAME
if(process.env.TEST_NAME){
  TEST_NAME = process.env.TEST_NAME
}else{
  if(hre.network.name === 'arbitrumLocalhost'){
    TEST_NAME = 'test.test'
  } else {
    throw('Set TEST_NAME=')
  }
}
const TEST_NODE = namehash.hash(TEST_NAME);

async function main() {
  /************************************
   * L2 deploy
   ************************************/
  // Deploy L2 resolver and set addr record for test.test
  const l2accounts = await ethers.getSigners();
  const ArbitrumResolver = await ethers.getContractFactory("ArbitrumResolver");

  const resolver = await ArbitrumResolver.deploy();
  await resolver.deployed();
  console.log(`Arbitrum l2 Resolver deployed to `, resolver.address);
  await (await resolver.functions.setAddr(TEST_NODE, l2accounts[0].address)).wait();
  console.log(`${TEST_NAME} ETH address is set to`, await resolver['addr(bytes32)'](TEST_NODE));
  console.log(`Set $L2_RESOLVER_ADDRESS to ${resolver.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
