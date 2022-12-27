const { expect } = require("chai");
const { ethers } = require('hardhat');
const { keccak256 } = require('ethers/lib/utils');
const { smock } = require('@defi-wonderland/smock');

const namehash = require('eth-ens-namehash');
const testNode = namehash.hash('test.eth');
const { defaultAbiCoder, hexConcat, Interface } = require("ethers/lib/utils");
const IResolverAbi = require('../../artifacts/contracts/l1/ArbitrumResolverStub.sol/IResolverService.json').abi
const {
  DUMMY_BATCH_HEADERS,
  DUMMY_BATCH_PROOFS,
} = require('./helpers/constants');
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

      proof = {
        nodeIndex:1,
        blockHash:'0x9d614b48ae08399467ab7ff7189410a4f78851b2300d0622b598d64d768c8f2f',
        sendRoot:'0x0000000000000000000000000000000000000000000000000000000000000000',
        encodedBlockArray:'0xf90220a060aa8f2df698cb2fd068f647db94ed21f07d97f1e2c401ac2f6b096c42505130a01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d4934794a4b000000000000000000073657175656e636572a05c50809328383f5a603c57ada9b61a95607cee6a7defe81f147a9d50b640b78ba00ea2433a5e968a249aeea102dfde8586b5d4363e4da9633dcb583bb4f414709da0331effa7f2ca1520510a268b07243aebbefd93a62eecde96dbbd4b218bbd8fd8b9010004000000000000000000000000000000040000000000000000000000000100000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000010000000000000000008000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000015a8704000000000000831475af8463a590d0a00000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000001f4b1000000000000000800000000000000008800000000000000198405f5e100',
        stateTrieWitness: (await generator.makeAccountProofTest(RESOLVER_ADDR))
          .accountTrieWitness,
        stateRoot: toHexString(generator._trie.root),
        storageTrieWitness: (
          await storageGenerator.makeInclusionProofTest(storageKey)
        ).proof,
      };
    })

    beforeEach(async () => {
      mock__Rollup.getNode.returns({
        stateHash: EMPTY_BYTES32,
        challengeHash: EMPTY_BYTES32,
        confirmData:'0xbe797a9a13133efbded100f2897c27599e34d464cbf6bb7a28a7a8a5872f7eb8',
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
