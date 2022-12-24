// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import { Lib_SecureMerkleTrie } from "@eth-optimism/contracts/libraries/trie/Lib_SecureMerkleTrie.sol";
import { Lib_OVMCodec } from "@eth-optimism/contracts/libraries/codec/Lib_OVMCodec.sol";
import {Lib_RLPReader} from "@eth-optimism/contracts/libraries/rlp/Lib_RLPReader.sol";

struct Node {
    // Hash of the state of the chain as of this node
    bytes32 stateHash;
    // Hash of the data that can be challenged
    bytes32 challengeHash;
    // Hash of the data that will be committed if this node is confirmed
    bytes32 confirmData;
    // Index of the node previous to this one
    uint64 prevNum;
    // Deadline at which this node can be confirmed
    uint64 deadlineBlock;
    // Deadline at which a child of this node can be confirmed
    uint64 noChildConfirmedBeforeBlock;
    // Number of stakers staked on this node. This includes real stakers and zombies
    uint64 stakerCount;
    // Number of stakers staked on a child node. This includes real stakers and zombies
    uint64 childStakerCount;
    // This value starts at zero and is set to a value when the first child is created. After that it is constant until the node is destroyed or the owner destroys pending nodes
    uint64 firstChildBlock;
    // The number of the latest child of this node to be created
    uint64 latestChildNumber;
    // The block number when this node was created
    uint64 createdAtBlock;
    // A hash of all the data needed to determine this node's validity, to protect against reorgs
    bytes32 nodeHash;
}

interface IRollup {
    function getNode(uint64 _nodeIndex)
        external
        view
        returns (Node memory);
}

contract Verifier {
    IRollup rollup;
    address public target;

    function setRollup (address rollupAddress) public{
        rollup = IRollup(rollupAddress);
    }
    function setTarget (address targetAddress) public{
        target = targetAddress;
    }

    function verify(
        uint64 nodeIndex,
        bytes32 blockHash,
        bytes memory sendRoot,
        bytes memory encodedBlockArray,
        bytes memory stateTrieWitness,
        bytes32 stateRoot,
        bytes32 slot,
        bytes memory storageTrieWitness
    ) public view returns (bytes32) {
        // step 1: check confirmData
        bytes32 confirmdata = keccak256(abi.encodePacked(blockHash, sendRoot));
        Node memory rblock = rollup.getNode(nodeIndex);
        require(rblock.confirmData == confirmdata, "confirmData mismatch");
        // step 2: check blockHash against encoded block array
        require(blockHash == keccak256(encodedBlockArray), "blockHash encodedBlockArray mismatch");
        // step 3: check storage value from derived value
        return getStorageValue(target, slot, stateRoot, stateTrieWitness, storageTrieWitness);
    }

    function getStorageValue(
        address target,
        bytes32 slot,
        bytes32 stateRoot,
        bytes memory stateTrieWitness,
        bytes memory storageTrieWitness
    ) internal view returns (bytes32) {
        (
            bool exists,
            bytes memory encodedResolverAccount
        ) = Lib_SecureMerkleTrie.get(
                abi.encodePacked(target),
                stateTrieWitness,
                stateRoot
            );
        require(exists, "Account does not exist");
        Lib_OVMCodec.EVMAccount memory account = Lib_OVMCodec.decodeEVMAccount(
            encodedResolverAccount
        );
        (bool storageExists, bytes memory retrievedValue) = Lib_SecureMerkleTrie
            .get(
                abi.encodePacked(slot),
                storageTrieWitness,
                account.storageRoot
            );
        require(storageExists, "Storage value does not exist");
        return toBytes32PadLeft(Lib_RLPReader.readBytes(retrievedValue));
    }

    // Ported old function from Lib_BytesUtils.sol
    function toBytes32PadLeft(bytes memory _bytes)
        internal
        pure
        returns (bytes32)
    {
        bytes32 ret;
        uint256 len = _bytes.length <= 32 ? _bytes.length : 32;
        assembly {
            ret := shr(mul(sub(32, len), 8), mload(add(_bytes, 32)))
        }
        return ret;
    }


    function verifyInclusionProof(
        bytes memory _key,
        bytes memory _value,
        bytes memory _proof,
        bytes32 _root
    ) public pure returns (bool) {
        return Lib_SecureMerkleTrie.verifyInclusionProof(_key, _value, _proof, _root);
    }

    function get(
        bytes memory _key,
        bytes memory _proof,
        bytes32 _root
    ) public pure returns (bool, bytes memory) {
        return Lib_SecureMerkleTrie.get(_key, _proof, _root);
    }
}