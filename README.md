# Dmail

__Decentralized email running on the Ethereum Blockchain__

<p align="center">
  <img src="https://raw.githubusercontent.com/UCSDTCT/Dmail/master/diagram.png"/>
</p>

__Dmail__ is an Ethereum DApp that allows for secure storage and retrieval of encrypted messages. It uses the RSA cryptosystem to encrypt messages: users generate key pairs in their browser and then store their public key and ciphertext on the blockchain while keeping their private key offline.

 You can access your mailbox using your Ethereum address. This will give you a list of encrypted messages. You can decrypt any messages sent to you on the blockchain via your private key.

 JavaScript on the front-end handles encryption, decryption, and key generation. Smart contracts written in Solidity are used to interact with the blockchain.

_Brought to you by Team CropTops_
