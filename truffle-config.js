// Allows us to use ES6 in our migrations and tests.
require('babel-register');

var HDWalletProvider = require("truffle-hdwallet-provider");

// Ropsten network
var mnemonic = "glow cheese defy begin hair notable adapt expire job weekend absent slow"; //  process.env.INFURA_MNEMONIC;
var token = "nq7lKSWouqpyH5wddc1W"; // process.env.INFURA_TOKEN;

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*' // Match any network id
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/" + token),
      network_id: 3,
      gas: 4500000,
      gasPrice: 1500000000, // 1.5 Gwei
      from: "0xff9e697ed54bb41df307e359c78fd1b514cfd123"
    }
  }
}
