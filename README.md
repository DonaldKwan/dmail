# Dmail

__Decentralized email running on the Ethereum Blockchain__

<p align="center">
  <img src="https://raw.githubusercontent.com/UCSDTCT/Dmail/master/diagram.png"/>
</p>

Dmail is a full-stack decentralized application running on the Ethereum network that facilitates secure storage and retrieval of encrypted messages. RSA is used to encrypt messages: users generate public/private key pairs in their browser and then store their public keys and ciphertext on the blockchain while keeping their private key offline.

JavaScript on the front end handles encryption, decryption, and key generation, and then calls our Solidity smart contract to interact with the blockchain. You can access your mailbox through our UI, which maps your wallet’s address to memory on the blockchain containing your public key and any encrypted messages sent to you. You can then decrypt these messages by using your private key. You can verify that no malicious Javascript is run to expose your private key, as our website's source code is available on GitHub.

_Brought to you by Team CropTops_
