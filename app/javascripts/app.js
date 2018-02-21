// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import RSA functions.
import "./rsa.js";

// Require jQuery
var $ = require("jquery");

// Require Materialize CSS
require("materialize-loader");

// Import smart contract libraries.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';

// Import our contract artifacts and turn them into usable abstractions.
import dmail_artifacts from '../../build/contracts/Dmail.json';

// Usable abstraction, which we'll use through the code below.
var Dmail = contract(dmail_artifacts);

// The account of the current user (should equal the one MetaMask refers to)
var account;

window.App = {
  start: function() {
    var self = this;

    // Set the smart contract's provider.
    Dmail.setProvider(web3.currentProvider);

    // Get the user's account.
    account = web3.eth.accounts[0];
  }

  /*
  refreshBalance: function() {
    var self = this;

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account, {from: account});
    }).then(function(value) {
      var balance_element = document.getElementById("balance");
      balance_element.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },

  sendCoin: function() {
    var self = this;

    var amount = parseInt(document.getElementById("amount").value);
    var receiver = document.getElementById("receiver").value;

    this.setStatus("Initiating transaction... (please wait)");

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.sendCoin(receiver, amount, {from: account});
    }).then(function() {
      self.setStatus("Transaction complete!");
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending coin; see log.");
    });
  }

  */
};

window.addEventListener('load', function() {
  if (typeof web3 !== 'undefined') {
    // Provider (Metamask, etc.) found. Inject it into the window.
    window.web3 = new Web3(web3.currentProvider);
  } else {
    // No provider found!
    alert("Please install a Ethereum bridge such as MetaMask to use this DApp!")
  }

  App.start();
});
