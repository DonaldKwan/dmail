// Import encryption functions.
import * as rsa from "./rsa.js";
import * as aes from "./aes.js";
import * as base64 from "./base64.js";

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
const ERROR_TOAST_DURATION = 5000;

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

    self.getPublicKey(account, function (err, public_key) {
      if (err) {
        Materialize.toast("An error occurred. Press F12 to see details.", ERROR_TOAST_DURATION);
        console.error(err);
      }
      // Account has no public key on the blockchain
      else if (public_key == undefined) {
        $('#setup-mailbox').removeClass('hide');

        Materialize.toast("Generating keys ...", TOAST_DURATION);

        rsa.keygen(function(err, keypair) {
          if (err) {
            Materialize.toast("An error occurred. Press F12 to see details.", ERROR_TOAST_DURATION);
            console.error(err);
          }
          else {
            Materialize.toast("Uploading public key ...", TOAST_DURATION);

            // Serialize keypair
            var pem_formats = rsa.serialize(keypair);

            // Upload public key to the blockchain
            App.uploadPublicKey(account, pem_formats.publicKey, function (err) {
              if (err) {
                Materialize.toast("An error occurred. Press F12 to see details.", ERROR_TOAST_DURATION);
                console.error(err);
              }
              else {
                // Save private key to cookies
                Cookies.set('address', account);
                Cookies.set('privatekey', pem_formats.privateKey);

                Materialize.toast("Done!", TOAST_DURATION);

                // Handle displays
                $('#display-private-key').html(pem_formats.privateKey.split('\n').join('<br>'));
                $('#display-public-key').html(pem_formats.publicKey.split('\n').join('<br>'));
                $('#doing-keygen').addClass('hide');
                $('#finished-keygen').removeClass('hide');
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

    // Get the user's private key
    App.getPrivateKey(account, function(err, private_key) {
      if (err) {
        Materialize.toast("An error occurred. Press F12 to see details.", ERROR_TOAST_DURATION);
        console.error(err);
      }
      else {
        if (private_key == undefined) {
          $('#private-key-modal').modal('open');
        }
        else {
          App.openMail(private_key);
        }
      }
    });
  },

  /**
   * Downloads any mail that the user has from the blockchain and then displays it on the user's mailbox page.
   *
   * @param  {Object} private_key The user's private key as a Forge object
   */
  openMail: function(private_key) {
    App.getMail(account, private_key, function(err, mail){
      // TODO: Display mail here
      var html = "<table><tr><th>Message</th><th>Sender</th>";
      for(var i=0; i<mail.length; i++){
        html += "<tr>";
        html+="<td>"+mail[i].message+"</td>";
        html+="<td>"+mail[i].sender+"</td>";
        html+="</tr>";
      }
      html+="</table>";
      document.getElementById("received-mail").innerHTML = html;
      console.log("User's mail: ")
      console.log(mail);
    });
  },

  /**
   * Returns the public key corresponding to the provided Ethereum address.
   * Queries the blockchain to retrieve the PEM of the key and then converts it to a usable key object.
   *
   * @param  {Object}   address  The ethereum address whose public key we want to retrieve
   * @param  {Function} callback A function taking an error and a public key (if successful, error will be null)
   */
  getPublicKey: function(address, callback) {
   var self = this;

    var inst;
    Dmail.deployed().then(function(instance) {
      inst = instance;
      return inst.getKey.call(address, {from: address});
    }).then(function(value) {
      if (value.valueOf().length == 0) {
        callback(null, undefined);
      }
      else {
        callback(null, rsa.deserialize_public_key(value.valueOf()));
      }
    }).catch(function(err) {
      callback(err, null);
    });
  },

  /**
   * Returns the decrypted mail that the provided Ethereum address owns.
   * Queries the blockchain to retrieve the number of mail a user owns and then incrementally fetches
   * the actual messages.
   *
   * @param  {Object}   address     The ethereum address whose mail we want to retrieve
   * @param  {Object}   private_key The private key used to decrypt each individual mail
   * @param  {Function} callback    A function taking an error and mail array (if successful, error will null)
   */
  getMail: function(address, private_key, callback) {
    var self = this;
    var inst;
    Dmail.deployed().then(function(instance) {
      inst = instance;
      return inst.getMailCount.call({from: address});
    }).then(function(value) {
      var mail = [];
      App.getMailByIndex(address, private_key, mail, 0, value, callback);
    }).catch(function(err) {
      callback(err, null);
    });
  },

  /**
   * Performs tail recursion in order to incrementally load a user's mail. This is done because
   * Solidity does not support array returns.
   *
   * @param  {Object}   address     The ethereum address whose mail we want to retrieve
   * @param  {Object}   private_key The private key used to decrypt each individual mail
   * @param  {Object[]} mail        An array of message/sender objects, each representing decrypted mail sent to the user
   * @param  {Number}   index       The index of the mail we want to download
   * @param  {Number}   count       The total amount of mail the user possesses
   * @return {Function} callback    A function taking an error and mail array (if successful, error will null)
   */
  getMailByIndex: function(address, private_key, mail, index, count, callback){
    if(index == count){
      callback(null, mail);
      return;
    }

    var self = this;
    var inst;
    Dmail.deployed().then(function(instance) {
      inst = instance;
      return inst.getMail.call(index, {from: address});
    }).then(function(value) {
      var ciphertext = base64.decode(value[0]);
      var encrypted_aes_key = base64.decode(value[1]);
      var aes_iv = base64.decode(value[2]);
      var sender = value[3];
      var aes_key = rsa.decrypt(encrypted_aes_key, private_key);

      var message = aes.decrypt(ciphertext, aes_key, aes_iv);

      mail.push({
        message: message,
        sender: sender
      });

      App.getMailByIndex(address, private_key, mail, index + 1, count, callback);
    }).catch(function(err) {
      callback(err, null);
    });
  },

  /**
   * Returns the private key corresponding to the provided Ethereum address.
   * Checks the browser's cookies to see if the user's private key is there and is associated with the given address.
   *
   * @param  {Object}   address  The ethereum address whose private key we want to retrieve
   * @param  {Function} callback A function taking an error and a private key (if successful, error will be null)
   */
  getPrivateKey: function(address, callback) {
    var self = this;

    // The user's account matches the saved address associated with the private key
    if (Cookies.get('address') == String(address)) {
      callback(null, rsa.deserialize_private_key(Cookies.get('privatekey')))
    }
    else {
      callback(null, undefined);
    }
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

    var inst;
    Dmail.deployed().then(function(instance) {
      inst = instance;
      return inst.setKey(public_key, {from: address});
    }).then(function() {
      callback(null);
    }).catch(function(err) {
      callback(err);
    });
  },

  /**
   * Sends a message in ciphertext to the receiver's address on the blockchain.
   *
   * @param  {Object}   sender_address      The sender's Ethereum address
   * @param  {String}   sender_message      The message the sender wants to send to the receiver
   * @param  {Object}   receiver_address    The receiver's Ethereum address
   * @param  {Object}   receiver_public_key The receiver's forge public key
   * @param  {Function} callback            A function taking an error (if upload was successful, error will be null)
   */
  uploadMessage: function(sender_address, sender_message, receiver_address, receiver_public_key, callback) {
    var self = this;

    var inst;
    Dmail.deployed().then(function(instance) {
      inst = instance;

      // Generate AES keys
      var aes_keygen = aes.keygen();
      var aes_key = aes_keygen.key;
      var aes_iv = aes_keygen.iv;

      // Encrypt message
      var ciphertext = aes.encrypt(sender_message, aes_key, aes_iv);

      // Encrypt AES key
      var aes_encrypted_key = rsa.encrypt(aes_key, receiver_public_key);

      // Upload both to the blockchain
      return inst.sendMail(receiver_address,
        base64.encode(ciphertext),
        base64.encode(aes_encrypted_key),
        base64.encode(aes_iv),
        {from: sender_address});
    }).then(function() {
      callback(null);
    }).catch(function(err) {
      callback(err);
    });
  }
};

$(document).ready(function() {
  // Register all modals
  $('.modal').modal({
    dismissible: false
  });

  // Transition from setup page to usage page
  $('#setup-done-button').click(function() {
    App.open();
  });

  // Handles send mail submits
  $('#message-form').submit(function(e) {
    // Prevent page from refreshing
    e.preventDefault();

    // Collect all of the form's values
    var values = {
      recipient: $('#recipient').val(),
      message: $('#message').val()
    };

    // Append 0x to front of Ethereum address if not there
    if (values.recipient.length == 40) {
      values.recipient = '0x' + values.recipient;
    }

    // Check recipient address
    if (values.recipient.length !== 42) {
      Materialize.toast("Please enter a valid recipient address!", TOAST_DURATION);
      return;
    }

    // Check message
    if (values.message.length == 0) {
      Materialize.toast("Please enter a message!", TOAST_DURATION);
      return;
    }

    // Get the public key of the user we want to send to
    App.getPublicKey(values.recipient, function(err, public_key) {
      if (err) {
          Materialize.toast("An error occurred. Press F12 to see details.", ERROR_TOAST_DURATION);
          console.error(err);
      }
      else {
        if (public_key == undefined) {
          Materialize.toast("That person has not uploaded his/her public key.", ERROR_TOAST_DURATION);
        }
        else {
          Materialize.toast("Encrypting & sending message ...", TOAST_DURATION);

          // Send a message to them using their own private key
          App.uploadMessage(account, values.message, values.recipient, public_key, function(err) {
            if (err) {
              Materialize.toast("An error occurred. Press F12 to see details.", ERROR_TOAST_DURATION);
              console.error(err);
            }
            else {
              Materialize.toast("Message sent!", TOAST_DURATION);
              $('#recipient').val("");
              $('#message').val("");
            }
          });
        }
      }
    });
  });

  // Handles private key submits
  $('#private-key-button').click(function() {
    var pem = $("#private-key").val();
    if (pem.length == 0) {
      Materialize.toast("You did not enter your private key!", ERROR_TOAST_DURATION);
      Materialize.toast("Your mailbox will not be loaded.", ERROR_TOAST_DURATION);
    }
    else {
      try {
        var private_key = rsa.deserialize_private_key(pem);
        App.openMail(private_key);
      }
      catch (err) {
        Materialize.toast("You entered an invalid private key!", ERROR_TOAST_DURATION);
        Materialize.toast("Your mailbox will not be loaded.", ERROR_TOAST_DURATION);
        console.error(err);
      }
    }
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
