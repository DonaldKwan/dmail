pragma solidity ^0.4.19;

contract Dmail {
    // exact size in bytes of pem file is 437
    mapping(address => bytes) public keyStore;
    mapping(address => bytes) public mailBoxes;
    
    //store_key(caller_address,caller_public_key) will store the caller’s public key as a value in a hashmap with the caller’s address as the key.
    function storeKey(bytes publicKey) returns (bool success) {
        keyStore[msg.sender] = publicKey;
        if (keyStore[msg.sender].length == publicKey.length){
            return keyStore[msg.sender];
        }
    }
    //send_mail(receiver_address,ciphertext,sender_address) will store ciphertext concatenated with sender_address as a value in a hashmap with the receiver_address as the key.
    function sendMail(address receiverAddress, bytes message) returns (bool success) {
        mailBoxes[receiverAddress] = message;
        if (mailBoxes[receiverAddress].length ==  message.length){
            return mailBoxes[receiverAddress];
        }
        //TODO: append msg.sender as bytes
        //+string(msg.sender);
        
    }
}
