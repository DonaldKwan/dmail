// Import RSA functions.
import * as rsa from "./rsa.js";

// Import cookies (for auto-saving private key)
import Cookies from 'js-cookie';

// Require jQuery
var $ = require("jquery");

// Require Materialize CSS
require("materialize-loader");
import * as Materialize from 'materialize-css/dist/js/materialize.min.js';
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

// Global constants
const TOAST_DURATION = 3000;

window.App = {

  /**
   * Starts the application. Responsible for mailbox setup too.
   */
  start: function() {
    var self = this; // NECESSARY: `this` changes when entering callback functions

    // Return early if we are not on the right page
    if (!document.getElementById('use-mailbox')) {
      return;
    }

    // Set the smart contract's provider.
    Dmail.setProvider(web3.currentProvider);

    // Get the user's account.
    account = web3.eth.accounts[0];

    // Disable mailbox if we don't have a valid account
    if (account === undefined) {
      $('#loading-mailbox').addClass('hide');
      $('#disable-mailbox').removeClass('hide');
      return;
    }

    // Update the address display
    $('#display-address').text("Your address is "+account+".");

    // Change screens (loading -> setup/use)
    $('#loading-mailbox').addClass('hide');

    self.getPublicKeyPEM(account, function (err, pem_public_key) {
      if (err) {
        console.log(err);

        Materialize.toast("An error occurred: " + err, TOAST_DURATION);
        Materialize.toast("Try refreshing the page.", TOAST_DURATION);
      }
      // Account has no public key on the blockchain
      else if (pem_public_key == undefined) {
        $('#setup-mailbox').removeClass('hide');

        Materialize.toast("Generating keys ...", TOAST_DURATION);

        rsa.keygen(function(err, keypair) {
          if (err) {
            console.log(err);

            Materialize.toast("An error occurred: " + err, TOAST_DURATION);
            Materialize.toast("Try refreshing the page.", TOAST_DURATION);
          }
          else {
            Materialize.toast("Uploading public key ...", TOAST_DURATION);

            // Serialize keypair
            var pem_formats = rsa.serialize(keypair);

            // Save private key to cookies
            Cookies.set('address', account);
            Cookies.set('privatekey', pem_formats.privateKey);

            // Upload public key to the blockchain
            App.uploadPublicKey(account, pem_formats.publicKey, function (err) {
              if (err) {
                console.log(err);

                Materialize.toast("An error occurred: " + err, TOAST_DURATION);
                Materialize.toast("Try refreshing the page.", TOAST_DURATION);
              }
              else {
                Materialize.toast("Done!", TOAST_DURATION);

                // Handle displays
                $('#doing-keygen').addClass('hide');
                $('#finished-keygen').removeClass('hide');
                $('#display-private-key').text(pem_formats.privateKey);
                $('#display-public-key').text(pem_formats.publicKey);
              }
            });
          }
        });
      }
      // Account has a public key on the blockchain
      else {
        self.open();
      }
    });
  },

  /**
   * Opens the mailbox usage screen and handles all actions there.
   */
  open: function() {
    var self = this;

    $('#setup-mailbox').addClass('hide');
    $('#use-mailbox').removeClass('hide');
  },

  /**
   * Returns the PEM of the public key corresponding to the provided Ethereum address.
   * Queries the blockchain to retrieve the PEM.
   *
   * @param  {Object}   address  The ethereum address whose public key we want to retrieve
   * @param  {Function} callback A function taking an error and a public key PEM (if successful, error will be null)
   */
  getPublicKeyPEM: function(address, callback) {
    var self = this;

    var pem = undefined;

    // TODO: Query the smart contract and retrieve the key in PEM format
    // See https://github.com/trufflesuite/truffle-init-webpack/blob/master/app/javascripts/app.js

    callback(null, pem);
  },

  /**
   * Returns the PEM of the private key.
   * The function first checks the browser cache to see if a private key exists there. If a private key
   * does it exist, it then checks to see if the private key's address corresponds to MetaMask's address.
   * If no private key is found in the browser cache or a different private key is found, it asks the user
   * to input the key in directly.
   *
   * @param  {Object}   address  The ethereum address whose private key we want to retrieve
   * @param  {Function} callback A function taking an error and a private key PEM (if successful, error will be null)
   */
  getPrivateKeyPEM: function(address, callback) {
    var self = this;

    var pem = undefined;

    // The user's account matches the saved address associated with the private key
    if (Cookies.get('address') == String(address)) {
      pem = Cookies.get('privatekey');
    }

    // Private key does not exist
    if (pem == undefined) {
      // TODO: Ask user to input their private key
    }

    callback(null, pem);
  },

   /**
    * Uploads the given public key to the blockchain under the given Ethereum address.
    *
    * @param  {Object}   address    The ethereum address whose public key we are uploading
    * @param  {Object}   public_key A Forge public key
    * @param  {Function} callback   A function taking an error (if upload was successful, error will be null)
    */
  uploadPublicKey: function(address, public_key, callback) {
    var self = this;

    // TODO: Call smart contract
    // See https://github.com/trufflesuite/truffle-init-webpack/blob/master/app/javascripts/app.js
    
    var inst;
    Dmail.deployed().then(function(instance) {
      inst = instance;
      return inst.storeKey(public_key, {from:account});
    }).then(function() {
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error: see log.");
    });
    
    callback(null);
  }
};

$(document).ready(function() {
  // Associate buttons with JS
  $('#saved-private-key').click(function() {
    App.open();
  });

  // Make page visible
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
