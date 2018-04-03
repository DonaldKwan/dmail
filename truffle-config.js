// Allows us to use ES6 in our migrations and tests.
require('babel-register');

var HDWalletProvider = require("truffle-hdwallet-provider");

// Ropsten network
var ropsten = {
  mnemonic: process.env.ROPSTEN_MNEMONIC,
  token: process.env.ROPSTEN_TOKEN
}

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*' // Match any network id
    },
    ropsten: {
      provider: new HDWalletProvider(ropsten.mnemonic, "https://ropsten.infura.io/" + ropsten.token),
      network_id: 3,
      gas: 4500000,
      // gasPrice: 3000000000, // 3 Gwei
      from: "0xff9e697ed54bb41df307e359c78fd1b514cfd123"
    }
  }
}
