const { expect } = require("chai");
const hre = require("hardhat")
const ethers = hre.ethers
const NODE = "0xeb4f647bea6caa36333c816d7b46fdcb05f9466ecacc140ea8c66faf15b3d9f1"; // namehash('test.eth')
const helpers = require("@nomicfoundation/hardhat-network-helpers");

let accounts, resolver;
describe("ArbitrumResolver", function() {
  beforeEach(async () => {
    accounts = await ethers.getSigners();
    const Resolver = await ethers.getContractFactory("ArbitrumResolver");
    resolver = await Resolver.deploy();
    await resolver.deployed();
  });

  it("Should set ETH", async function() {
    const address = await accounts[0].getAddress();

    await resolver.setAddr(NODE, address);
    const result = await resolver['addr(bytes32)'](NODE)
    expect(result).to.equal(address);

    // Call via getStorageAt
    const slot = '0x0000000000000000000000000000000000000000000000000000000000000000'
    const storageValue = await helpers.getStorageAt(resolver.address, slot);
    expect('0x' + storageValue.slice(26)).to.equal(address.toLowerCase());
  });
});
