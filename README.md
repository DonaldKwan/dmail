# Dmail

__Decentralized email running on the Ethereum Blockchain__

Dmail is a full stack decentralized application running on the Ethereum network that facilitates secure storage and retrieval of encrypted messages. Our initial implementation will use RSA to encrypt messages, enable users to generate public/private key pairs, and store public keys and encrypted ciphertext on the blockchain. Javascript on our front end will handle encryption, decryption, and key generation, then call our Solidity smart contracts to interact with the blockchain. Users will access their mailboxes through our UI, which maps their wallet’s address to memory on the blockchain containing their encrypted messages and public key. They can then decrypt messages by providing their private key on our site.

You can verify that no malicious Javascript is run to expose their private key, as our website's source code is available on GitHub.

_Brought to you by Team CropTops_