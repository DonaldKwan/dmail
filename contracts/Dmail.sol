pragma solidity ^0.4.19;

contract Dmail {
    mapping(address => string) public keys;
    mapping(address => string[]) public mailboxes;

    function getKey(address receiver) public constant returns (string) {
        return keys[receiver];
    }

    function putKey(string publicKey) public {
        keys[msg.sender] = publicKey;
    }

    /*
    function getMail(string message) public constant returns (string[]) {
        return mailboxes[msg.sender];
    }
    */

    function putMail(address receiver, string message) public {
        mailboxes[receiver].push(message);
    }
}
