// Allows us to use ES6 in our migrations and tests.
require('babel-register');

var HDWalletProvider = require("truffle-hdwallet-provider");

// Ropsten network
var mnemonic = process.env.INFURA_MNEMONIC;
var token = process.env.INFURA_TOKEN;

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*' // Match any network id
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/" + token),
      network_id: 3
    }
  }
}
