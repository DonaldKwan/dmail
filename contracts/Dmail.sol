pragma solidity ^0.4.19;

contract Dmail {
    mapping(address => string) public keys;
    mapping(address => string[]) public mailboxes;

    function getKey(address receiver) public constant returns (string) {
        return keys[receiver];
    }

    function setKey(string publicKey) public {
        keys[msg.sender] = publicKey;
    }

    /*
    // String arrays cannot be returned via Solidity (2D arrays via general)
    function getMail() public constant returns (string[]) {
        return mailboxes[msg.sender];
    }
    */

   function getMailByIndex(uint index) public constant returns (string) {
        return mailboxes[msg.sender][index];
   }

   function getMailAmount() public constant returns (uint) {
        return mailboxes[msg.sender].length;
   }

    function sendMail(address receiver, string message) public {
        mailboxes[receiver].push(message);
    }
}
