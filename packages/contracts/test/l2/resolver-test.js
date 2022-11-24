const { expect } = require("chai");
const hre = require("hardhat")
const ethers = hre.ethers
const { utils } = require("ethers")
const NODE = "0xeb4f647bea6caa36333c816d7b46fdcb05f9466ecacc140ea8c66faf15b3d9f1"; // namehash('test.eth')
const COIN_TYPE_ETH = 60;
const COIN_TYPE_BTC = 0;
const helpers = require("@nomicfoundation/hardhat-network-helpers");
const {
  formatsByName
} = require('@ensdomains/address-encoder')

let accounts, resolver;
describe.only("ArbitrumResolver", function() {
  beforeEach(async () => {
    accounts = await ethers.getSigners();
    const Resolver = await ethers.getContractFactory("ArbitrumResolver");
    resolver = await Resolver.deploy();
    await resolver.deployed();
  });

  it("Should set ETH", async function() {
    const address = await accounts[0].getAddress();

    await resolver.setAddr(NODE, COIN_TYPE_ETH, address);
    const result = await resolver['addr(bytes32)'](NODE)
    expect(await resolver.bytes32ToBytes(result)).to.equal(address.toLowerCase());

    // Call via getStorageAt
    const nodeLoc = await resolver.mapIntLocation(1, NODE);
    const coinLoc = await resolver.mapLocation(nodeLoc, COIN_TYPE_ETH);
    const storageValue = await helpers.getStorageAt(resolver.address, coinLoc);
    expect(await resolver.bytes32ToBytes(storageValue)).to.equal(address.toLowerCase());
  });

  it("Should set Other coin", async function() {
    const address = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
    const addrBytes = formatsByName['BTC'].decoder(address)
    await resolver.setAddr(NODE, COIN_TYPE_BTC, addrBytes);
    const result = await resolver['addr(bytes32,uint256)'](NODE, COIN_TYPE_BTC)
    const result2 = await resolver.bytes32ToBytes(result)
    const result3 = Buffer.from(ethers.utils.arrayify(result2))
    const result4 = formatsByName['BTC'].encoder(result3)
    expect(result4).to.equal(address);

    // Call via getStorageAt
    const nodeLoc = await resolver.mapIntLocation(1, NODE);
    const coinLoc = await resolver.mapLocation(nodeLoc, COIN_TYPE_BTC);
    const storageValue = await helpers.getStorageAt(resolver.address, coinLoc);
    const storageBytes = await resolver.bytes32ToBytes(storageValue);
    expect(
      Buffer.from(ethers.utils.arrayify(storageBytes)).toString('hex')
    ).to.equal(addrBytes.toString('hex'));
  });

  it("Should set ContentHash", async function() {
    const contenthash = '0x0000000000000000000000000000000000000000000000000000000000000001'
    await resolver.setContenthash(NODE, contenthash);
    const result = await resolver.contenthash(NODE)
    expect(await resolver.bytes32ToBytes(result)).to.equal(contenthash);

    // Call via getStorageAt
    const nodeLoc = await resolver.mapIntLocation(2, NODE);
    const storageValue = await helpers.getStorageAt(resolver.address, nodeLoc);
    expect(await resolver.bytes32ToBytes(storageValue)).to.equal(contenthash);
  });
  it.only("Should set Text", async function() {
    const key = 'hello'
    const value = 'world'
    const contenthash = '0x0000000000000000000000000000000000000000000000000000000000000001'
    console.log(1)
    await resolver.setText2(NODE, contenthash);
    console.log(2)
    const result = await resolver.text2(NODE)
    console.log(3, await resolver.bytes32ToString(result))
    expect(await resolver.bytes32ToString(result)).to.equal(value);
    console.log(4)
    // Call via getStorageAt
    // const keyBytes32 = utils.keccak256(utils.toUtf8Bytes(key))
    // // const nodeLoc = await resolver.mapIntLocation(3, NODE);
    // console.log(5, {keyBytes32})
    // // console.log(5, {nodeLoc, keyBytes32})
    // const keyLoc = await resolver.mapIntLocation(3, keyBytes32);
    // console.log(6, {keyLoc})
    // const storageValue = await helpers.getStorageAt(resolver.address, keyLoc);
    // console.log(7, {storageValue})
    // // expect(await resolver.bytes32ToString(storageValue)).to.equal(value);

    // const map1 = await resolver.map1(key)
    // const keyLoc2 = await resolver.mapIntStringLocation(4, key);
    const keyLoc2 = await resolver.mapIntLocation(4, contenthash);
    console.log(8, {keyLoc2})
    const storageValue2 = await helpers.getStorageAt(resolver.address, keyLoc2);
    console.log(9, {storageValue2})


    // const map2 = await resolver.map2(key)
    // const keyLoc3 = await resolver.mapIntLocation(3, map2);
    // console.log(10, {map2, keyLoc3})
    // const storageValue3 = await helpers.getStorageAt(resolver.address, keyLoc3);
    // console.log(11, {storageValue3})


  });

  // 0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B
  // 83786678008945491661677537538672678338309875438084546517200813798144034397943
  // 666f6f: 4 uint256
  it("Should set Text", async function() {
    const key = 'hello'
    const value = 'world'
    console.log(1)
    await resolver.setText(NODE, key, value);
    console.log(2)
    const result = await resolver.text(NODE, key)
    console.log(3)
    expect(await resolver.bytes32ToString(result)).to.equal(value);
    console.log(4)
    // Call via getStorageAt
    const keyBytes32 = utils.keccak256(utils.toUtf8Bytes(key))
    const nodeLoc = await resolver.mapIntLocation(3, NODE);
    console.log(5, {nodeLoc, keyBytes32})
    const keyLoc = await resolver.mapLocation(nodeLoc, keyBytes32);
    console.log(6, {keyLoc})
    const storageValue = await helpers.getStorageAt(resolver.address, keyLoc);
    console.log(7, {storageValue})
    // expect(await resolver.bytes32ToString(storageValue)).to.equal(value);

    const map1 = await resolver.map1(key)
    const keyLoc2 = await resolver.mapLocation(nodeLoc, map1);
    console.log(8, {map1, keyLoc2})
    const storageValue2 = await helpers.getStorageAt(resolver.address, keyLoc2);
    console.log(9, {storageValue2})


  });

});
