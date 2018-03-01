// Import RSA functions.
import * as rsa from "./rsa.js";

// Import cookies (for auto-saving private key)
import Cookies from 'js-cookie';

// Require jQuery
var $ = require("jquery");

// Require Materialize CSS
require("materialize-loader");
import 'materialize-css/dist/js/materialize.min.js';
import 'materialize-css/dist/css/materialize.min.css';

// Import the page's CSS.
import "../stylesheets/app.css";

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

    // Update the address display
    $('#display-address').text("Your address is "+account+".");

    // Change screens (loading -> setup/use)
    $('#loading-mailbox').addClass('hide');

    if (self.getPublicKeyPEM(account) !== undefined) {
      $('#use-mailbox').removeClass('hide');
    }
    else {
      $('#setup-mailbox').removeClass('hide');

      console.log('Running keygen ...');
      rsa.keygen(function(err, keypair) {
        console.log('Keygen finished. Serializing, caching and displaying ...');

        // Serialize keypair
        var pem_formats = rsa.serialize(keypair);

        // Save private key to cookies
        Cookies.set('privatekey', pem_formats.privateKey);

        // Handle displays
        $('#doing-keygen').addClass('hide');
        $('#finished-keygen').removeClass('hide');
        $('#display-private-key').text(pem_formats.privateKey);
        $('#display-public-key').text(pem_formats.publicKey);

        console.log('Keygen tasks done.');
      });
    }
  },

  getPublicKeyPEM: function(address) {
    // TODO: Query the blockchain and retrieve the key in PEM format
    return undefined;
  },

  getPrivateKeyPEM: function() {
    var pem = Cookies.get('privatekey');
    if (pem == undefined) {
      // TODO: Ask user to input their private key
    }
    return pem;
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

$(document).ready(function() {
  $('body').addClass('loaded');

  if (typeof web3 !== 'undefined') {
    // Provider (Metamask, etc.) found. Inject it into the window.
    window.web3 = new Web3(web3.currentProvider);
    $('#loading-mailbox').removeClass('hide');
  } else {
    // No provider found!
    $('#disable-mailbox').removeClass('hide');
  }

  App.start();
});
