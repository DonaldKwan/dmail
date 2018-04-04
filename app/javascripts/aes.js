var forge = require('node-forge');

/**
 * Generates the keys needed for AES.
 * The key is 16 bytes, so it uses AES-128.
 *
 * @return {Object}            The user's key and IV
 */
function keygen() {
  return {
    key: forge.random.getBytesSync(16),
    iv: forge.random.getBytesSync(16)
  }
}

/**
 * Encrypts a message using a key and an IV.
 * AES-CBC 128-bit mode is used.
 *
 * @param  {Byte[]} message The message to encrypt
 * @param  {Byte[]} key     The AES key (16 bytes)
 * @param  {Byte[]} iv      The AES IV (16 bytes)
 * @return {Byte[]}         Ciphertext corresponding to the message
 */
function encrypt(message, key, iv) {
  var cipher = forge.cipher.createCipher('AES-CBC', key);
  cipher.start({
    iv: iv
  });
  cipher.update(forge.util.createBuffer(message, 'utf8'));
  cipher.finish();
  return cipher.output.getBytes();
}

/**
 * Encrypts a message using a key and an IV.
 * AES-CBC 128-bit mode is used.
 *
 * @param  {Byte[]} message A sequence of bytes representing some ciphertext
 * @param  {Byte[]} key     The AES key (16 bytes)
 * @param  {Byte[]} iv      The AES IV (16 bytes)
 * @return {Byte[]}         The decrypted message
 */
function decrypt(bytes, key, iv) {
  var decipher = forge.cipher.createDecipher('AES-CBC', key);
  decipher.start({
    iv: iv
  });
  decipher.update(forge.util.createBuffer(bytes));
  decipher.finish();
  return decipher.output.toString('utf8');
}

export { keygen, encrypt, decrypt }