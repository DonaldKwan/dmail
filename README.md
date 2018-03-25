# Dmail

_Now live at http://tsedmail.herokuapp.com/ (contract deployed on Ropsten testnet)_

<b>D</b>ecentralized E<b>mail</b> is an Ethereum DApp that combines messaging, modern cryptographic techniques, and the blockchain, all into one. It enables messages to be sent between users, each with their own Ethereum address, and each message remains encrypted in transit. Only the receiver is able to read messages meant for them.

<p align="center">
  <img src="https://raw.githubusercontent.com/UCSDTCT/Dmail/master/diagram.png"/>
</p>

## How It Works

It uses a combination of the RSA cryptosystem and the AES symmetric key algorithm to ensure that your messages remain secret. Key generation is done in the browser. Public keys are uploaded to the blockchain, and private keys remain offline.

When a user wishes to send a message to a receiver, a randomly generated AES key is created. This key is used to encrypt the sender's message and yields some resultant ciphertext. The AES key is then encrypted using the receiver's public key. The encrypted AES key is posted along with the ciphertext to the blockchain.

The receiver can access their mailbox using their Ethereum address, and this will give them a list of encrypted messages meant for their eyes only. The receiver can then decrypt these messages by decrypting the AES key stored along with the message ciphertext using their private key. The decrypted AES key can then be used to decrypt the message itself.

JavaScript on the front-end handles encryption, decryption, and key generation. A smart contract written in Solidity is used to interact with the blockchain.
