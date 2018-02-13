/**
 * Decrypts a message using the receiver's modulus and receiver's private key.
 * This action is performed from the message receiver's perspective.
 *
 * @param  {number} ciphertext           The ciphertext (essentially a very large number)
 * @param  {number} receiver_modulus     The modulus part of the receiver's public key
 * @param  {number} receiver_private_key The public exponent of the receiver's public key
 * @return {string}                      The sender's original message
 */
function decrypt(ciphertext, receiver_modulus, receiver_private_key) {
  return decode(ciphertext ** receiver_private_key % receiver_modulus, receiver_modulus);
}

/**
 * Decodes the unique number that RSA decryption comes up. This is the reverse
 * of the encoding function in encrypt.js. The encoded message number is
 * guaranteed to be greater than 1 and less than the receiver's modulus.
 *
 * @param  {number} encoded_message  The encoded message (1 < encoded_message < receiver_modulus)
 * @param  {number} receiver_modulus The modulus part of the receiver's public key
 * @return {string}                  The original message
 */
function decode(encoded_message, receiver_modulus) {
	var words = "";
	for (var i = 0; i < message.length; i++){
	    words += String.fromCharCode(message[i]);
	}
	return words;
}