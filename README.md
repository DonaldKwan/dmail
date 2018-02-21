# Dmail

__Decentralized email running on the Ethereum blockchain__

<p align="center">
  <img src="https://raw.githubusercontent.com/UCSDTCT/Dmail/master/diagram.png"/>
</p>

__Dmail__ is an Ethereum DApp that faciliates secure storage and retrieval of encrypted messages.

It uses the RSA cryptosystem to ensure that your messages remain secret. Key generation is done in the browser. Public keys are uploaded to the blockchain, and private keys remain offline.

When a user wishes to send a message to a receiver, the message is encrypted via the receiver's public key and the resulting ciphertext is posted to the blockchain. The receiver can access their mailbox using their Ethereum address, and this will give them a list of encrypted messages meant for their eyes only. The receiver can then decrypt these messages via their private key.

 JavaScript on the front-end handles encryption, decryption, and key generation. Smart contracts written in Solidity are used to interact with the blockchain.
