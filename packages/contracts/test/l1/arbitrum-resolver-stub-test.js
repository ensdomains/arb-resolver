const { expect } = require("chai");
const { ethers } = require('hardhat');
const { keccak256 } = require('ethers/lib/utils');
const { smock } = require('@defi-wonderland/smock');

const namehash = require('eth-ens-namehash');
const testNode = namehash.hash('test.eth');
const { Interface } = require("ethers/lib/utils");
const IResolverAbi = require('../../artifacts/contracts/l1/ArbitrumResolverStub.sol/IResolverService.json').abi
const { TrieTestGenerator } = require('./helpers/trie-test-generator');
const { toHexString } = require('./helpers/utils');

const RESOLVER_ADDR = "0x0123456789012345678901234567890123456789";
const GATEWAYS = ["http://localhost:8080/query/" + RESOLVER_ADDR];
const EMPTY_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000';


const proofInterface = new Interface(IResolverAbi)
describe("ArbitrumResolverStub", function() {
  let signer;
  let account2;
  before(async () => {
    [signer, account2] = await ethers.getSigners()
  });

  let mock__Rollup
  before(async () => {
    mock__Rollup = await smock.fake('IRollup');
  });

  let Factory__ArbitrumResolverStub;
  before(async () => {
    Factory__ArbitrumResolverStub = await ethers.getContractFactory(
      'ArbitrumResolverStub'
    );
  });

  let stub, callbackFunction;
  beforeEach(async () => {
    stub = await Factory__ArbitrumResolverStub.deploy(GATEWAYS, mock__Rollup.address ,RESOLVER_ADDR);
    callbackFunction = stub.interface.getSighash('addrWithProof(bytes, bytes)')
    callData = stub.interface.encodeFunctionData("addr(bytes32)", [testNode])
    await stub.deployed();
  });

  it("Should return the gateways and contract address from the constructor", async function() {
    expect(await stub.l2resolver()).to.equal(RESOLVER_ADDR);
    expect(await stub.gateways(0)).to.equal(GATEWAYS[0]);
  });

  describe('addr', async () => {
    it('returns a CCIP-read error', async () => {
      try{
        await stub["addr(bytes32)"](testNode)
      }catch(e){
        expect(e.errorName).to.equal('OffchainLookup')
        expect(e.errorArgs.urls[0]).to.equal(GATEWAYS[0])
        expect(e.errorArgs.callbackFunction).to.equal(callbackFunction)
        expect(e.errorArgs.callData).to.equal(callData)
        expect(e.errorArgs.extraData).to.equal(testNode)
      }
    });
  });

  describe("addrWithProof", () => {
    let testAddress;
    let proof;
    before(async () => {
      testAddress = await account2.getAddress();
      const storageKey = keccak256(
        testNode + '00'.repeat(31) + '01'
      )
      const storageGenerator = await TrieTestGenerator.fromNodes({
        nodes: [
          {
            key: storageKey,
            // 0x94 is the RLP prefix for a 20-byte string
            val: '0x94' + testAddress.substring(2),
          },
        ],
        secure: true,
      });

      const generator = await TrieTestGenerator.fromAccounts({
        accounts: [
          {
            address: RESOLVER_ADDR,
            nonce: 0,
            balance: 0,
            codeHash: keccak256('0x1234'),
            storageRoot: toHexString(storageGenerator._trie.root),
          },
        ],
        secure: true,
      });

      // 
      // const l2blockRaw = await l2provider.send('eth_getBlockByHash', [
      //   blockHash,
      //   false
      // ]);
      // const blockArray = [
      // l2blockRaw.parentHash, 
      // l2blockRaw.sha3Uncles, 
      // l2blockRaw.miner, 
      // l2blockRaw.stateRoot, 
      // l2blockRaw.transactionsRoot,
      // l2blockRaw.receiptsRoot,
      // l2blockRaw.logsBloom,
      // BigNumber.from(l2blockRaw.difficulty).toHexString(),
      // BigNumber.from(l2blockRaw.number).toHexString(),
      // BigNumber.from(l2blockRaw.gasLimit).toHexString(),
      // BigNumber.from(l2blockRaw.gasUsed).toHexString(),
      // BigNumber.from(l2blockRaw.timestamp).toHexString(),
      // l2blockRaw.extraData,
      // l2blockRaw.mixHash,
      // l2blockRaw.nonce,
      // BigNumber.from(l2blockRaw.baseFeePerGas).toHexString()  
      // ]
      const blockArray = [
        EMPTY_BYTES32
      ]
      const encodedBlockArray = ethers.utils.RLP.encode(blockArray)
      const blockHash = ethers.utils.keccak256(encodedBlockArray)
      const stateTrieWitness = (
        await generator.makeAccountProofTest(RESOLVER_ADDR))
      .accountTrieWitness
      const storageTrieWitness = (
        await storageGenerator.makeInclusionProofTest(storageKey)
      ).proof
      proof = {
        nodeIndex:1,
        blockHash,
        sendRoot:EMPTY_BYTES32,
        encodedBlockArray,
        stateTrieWitness,
        stateRoot: toHexString(generator._trie.root),
        storageTrieWitness,
      };
    })

    beforeEach(async () => {
      const confirmData = ethers.utils.keccak256(
        ethers.utils.solidityPack(
          ['bytes32','bytes32'],
          [proof.blockHash, proof.sendRoot]
        )
      )
      mock__Rollup.getNode.returns({
        stateHash: EMPTY_BYTES32,
        challengeHash: EMPTY_BYTES32,
        confirmData,
        prevNum: 0,
        deadlineBlock: 0,
        noChildConfirmedBeforeBlock: 0,
        stakerCount: 0,
        childStakerCount: 0,
        firstChildBlock: 0,
        latestChildNumber: 0,
        createdAtBlock: 0,
        nodeHash: EMPTY_BYTES32
      })
    })

    it("should verify proofs of resolution results", async function() {
      const responseData = proofInterface.encodeFunctionResult("addr(bytes32)", [proof])
      expect(await stub.addrWithProof(responseData, testNode)).to.equal(testAddress);
    });
  });
});
