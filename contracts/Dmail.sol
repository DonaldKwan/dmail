pragma solidity ^0.4.19;

contract Dmail {
    struct Mail {
        string message;
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

    function getMail() public constant returns (Mail[]) {
        return mailboxes[msg.sender];
    }

    function sendMail(address receiver, string message) public {
        mailboxes[receiver].push(Mail({
            message: message,
            sender: msg.sender
        }));
    }
}
