pragma solidity ^0.4.19;

contract Dmail {
    struct Mail {
        string message; // Encrypted using AES-128
        string aes_key; // Encrypted using RSAES PKCS#1 v1.5
        string aes_iv;
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

    function getMail(uint index) public constant returns (string, string, string, address) {
        var mail = mailboxes[msg.sender][index];
        return (mail.message, mail.aes_key, mail.aes_iv, mail.sender);
    }


    function sendMail(address receiver, string message, string aes_key, string aes_iv) public {
        mailboxes[receiver].push(Mail({
            message: message,
            aes_key: aes_key,
            aes_iv: aes_iv,
            sender: msg.sender
        }));
    }
}
