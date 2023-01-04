const hre = require("hardhat");
const {ethers } = hre;
const namehash = require('eth-ens-namehash');
const abi = require('../artifacts/@ensdomains/ens-contracts/contracts/registry/ENSRegistry.sol/ENSRegistry.json').abi
const ROLLUP_ADDRESSES = require('./constants').ROLLUP_ADDRESSES
require('isomorphic-fetch');

let RESOLVER_ADDRESS
async function main() {
  console.log(hre.network.name)
  const rollupAddress = ROLLUP_ADDRESSES[hre.network.name]
  const AssertionHelper = await ethers.getContractFactory("AssertionHelper");
  const assertionHelper = await AssertionHelper.deploy();
  await assertionHelper.deployed();
  console.log(`assertionHelper deployed at ${assertionHelper.address}`);

  if(process.env.RESOLVER_ADDRESS){
    RESOLVER_ADDRESS = process.env.RESOLVER_ADDRESS
  }else{
    throw('Set RESOLVER_ADDRESS=')
  }
  /************************************
   * L1 deploy
   ************************************/
  const accounts = await ethers.getSigners();

  // Deploy the resolver stub
  const ArbitrumResolverStub = await ethers.getContractFactory("ArbitrumResolverStub");
  const stub = await ArbitrumResolverStub.deploy([hre.network.config.gatewayurl], rollupAddress, RESOLVER_ADDRESS);
  await stub.deployed();
  console.log(`ArbitrumResolverStub deployed at ${stub.address}`);

  // Create test.test owned by us
  if(hre.network.name === 'localhost'){
    // Deploy the ENS registry
    const ENS = await ethers.getContractFactory("ENSRegistry");
    const ens = await ENS.deploy();
    await ens.deployed();
    console.log(`ENS registry deployed at ${ens.address}`);

    let tx = await ens.setSubnodeOwner('0x' + '00'.repeat(32), ethers.utils.keccak256(ethers.utils.toUtf8Bytes('test')), accounts[0].address);
    let rcpt = await tx.wait()
    tx = await ens.setSubnodeOwner(namehash.hash('test'), ethers.utils.keccak256(ethers.utils.toUtf8Bytes('test')), accounts[0].address);
    rcpt = await tx.wait()
    // Set the stub as the resolver for test.test
    tx = await ens.setResolver(namehash.hash('test.test'), stub.address);
    rcpt = await tx.wait()
    console.log(`Set $ENS_REGISTRY_ADDRESS to ${ens.address}`)
    console.log(`Set $HELPER_ADDRESS to ${assertionHelper.address}`)
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
