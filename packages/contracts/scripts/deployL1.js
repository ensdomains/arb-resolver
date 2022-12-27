const hre = require("hardhat");
const {ethers } = hre;
const namehash = require('eth-ens-namehash');
const abi = require('../artifacts/@ensdomains/ens-contracts/contracts/registry/ENSRegistry.sol/ENSRegistry.json').abi
const CONSTANTS = require('./constants')
require('isomorphic-fetch');

let RESOLVER_ADDRESS
async function main() {
  const rollupAddress = '0x7456c45bfd495b7bcf424c0a7993a324035f682f';
  const contractAddress = '0x6c25aA969CaDCCA2cA6ad022bD67cCe5Fc27024B';
  const AssertionHelper = await ethers.getContractFactory("AssertionHelper");
  const assertionHelper = await AssertionHelper.deploy();
  await assertionHelper.deployed();
  console.log(`assertionHelper deployed at ${assertionHelper.address}`);

  const Verifier = await ethers.getContractFactory("Verifier");
  const verifier = await Verifier.deploy();
  await verifier.deployed();
  await verifier.setRollup(rollupAddress);
  await verifier.setTarget(contractAddress);
  console.log(`Verifier deployed at ${verifier.address}`);

  if(process.env.RESOLVER_ADDRESS){
    RESOLVER_ADDRESS = process.env.RESOLVER_ADDRESS
  }else{
    throw('Set RESOLVER_ADDRESS=')
  }
  console.log({RESOLVER_ADDRESS})
  /************************************
   * L1 deploy
   ************************************/
  const accounts = await ethers.getSigners();

  // Deploy the resolver stub
  console.log(2)
  const ArbitrumResolverStub = await ethers.getContractFactory("ArbitrumResolverStub");
  console.log(3, [hre.network.config.gatewayurl], rollupAddress, RESOLVER_ADDRESS)
  const stub = await ArbitrumResolverStub.deploy([hre.network.config.gatewayurl], rollupAddress, RESOLVER_ADDRESS);
  console.log(4)
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
    console.log(18)
    // Set the stub as the resolver for test.test
    tx = await ens.setResolver(namehash.hash('test.test'), stub.address);
    rcpt = await tx.wait()
    console.log(19, ens.address)
    console.log(await ens.owner(namehash.hash('test.test')))
    console.log(await ens.resolver(namehash.hash('test.test')))  
    console.log(hre.network.config, ens.address)
    provider = new ethers.providers.JsonRpcProvider(hre.network.config.url, {
      chainId: hre.network.config.chainId,
      name: 'unknown',
      ensAddress:ens.address
    });  
    const ens2 = new ethers.Contract(ens.address, abi, provider);
    console.log(await ens2.resolver(namehash.hash('test.test')))  
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
