const ROLLUP_ADDRESSES = require('./constants').ROLLUP_ADDRESSES
const hre = require("hardhat");
let RESOLVER_ADDRESS
if(process.env.RESOLVER_ADDRESS){
  RESOLVER_ADDRESS = process.env.RESOLVER_ADDRESS
}else{
  throw('Set RESOLVER_ADDRESS=')
}
module.exports = [
  [ hre.network.config.gatewayurl ],
  ROLLUP_ADDRESSES[hre.network.name],
  RESOLVER_ADDRESS
]