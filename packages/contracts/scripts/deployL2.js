const hre = require("hardhat");
const {ethers} = hre;
const namehash = require('eth-ens-namehash');
let TEST_NAME
if(process.env.TEST_NAME){
  TEST_NAME = process.env.TEST_NAME
}else{
  console.log(hre.network.name)
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
  const Storage = await ethers.getContractFactory("Storage");
  const storage = await Storage.deploy();
  const Foo = await ethers.getContractFactory("Foo");
  const foo = await Foo.deploy();

  const resolver = await ArbitrumResolver.deploy();
  await resolver.deployed();
  console.log(`ArbitrumResolver deployed to ${resolver.address}`);
  console.log(`Storage deployed to ${storage.address}`);
  console.log(`Foo deployed to ${foo.address}`);
  console.log({l2accounts})
  await (await resolver.functions.setAddr(TEST_NODE, l2accounts[0].address)).wait();
  await (await storage.functions.setInt(2, 4)).wait();
  console.log({
    TEST_NAME,
    TEST_NODE
  })
  console.log('Address set to', await resolver['addr(bytes32)'](TEST_NODE));
  console.log('Storage set to', await storage['getInt'](2));
  
  /************************************
   * L1 deploy
   ************************************/
  const accounts = await ethers.getSigners();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
