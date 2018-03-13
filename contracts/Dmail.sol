pragma solidity ^0.4.19;

contract Dmail {
    struct Mail {
        bytes message; // Encrypted using AES-128
        bytes aes_key; // Encrypted using RSAES PKCS#1 v1.5
        bytes aes_iv;
        address sender;
    }

    mapping(address => string) public keys;
    mapping(address => Mail[]) public mailboxes;

    function getKey(address receiver) public constant returns (string) {
        return keys[receiver];
    }

    function setKey(string publicKey) public {
        keys[msg.sender] = publicKey;
    }

    function getMailCount() public constant returns (uint) {
        return mailboxes[msg.sender].length;
    }

    function getMailMessage(uint index) public constant returns (bytes) {
        return mailboxes[msg.sender][index].message;
    }

    function getMailAESKey(uint index) public constant returns (bytes) {
        return mailboxes[msg.sender][index].aes_key;
    }

    function getMailAESIv(uint index) public constant returns (bytes) {
        return mailboxes[msg.sender][index].aes_iv;
    }

    function getMailSender(uint index) public constant returns (address) {
        return mailboxes[msg.sender][index].sender;
    }

    function sendMail(address receiver, bytes message, bytes aes_key, bytes aes_iv) public {
        mailboxes[receiver].push(Mail({
            message: message,
            aes_key: aes_key,
            aes_iv: aes_iv,
            sender: msg.sender
        }));
    }
}
