// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Storage {
    mapping(uint256 => uint256) i2i; //position is 0
    event IntSetEvent(uint256 indexed key, uint256 val);

    function setInt(uint256 key, uint256 val) public {
        i2i[key] = val;
        emit IntSetEvent(key, val);
    }

    function getInt(uint256 key) public view returns (uint256) {
        return i2i[key];
    }

    function mapLocationInt(uint256 slot, uint256 k)
        public
        pure
        returns (uint256)
    {
        return uint256(keccak256(abi.encode(k, slot)));
    }
}
