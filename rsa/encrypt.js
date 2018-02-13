/**
 * Encrypts a message using the receiver's modulus and receiver's public key.
 * This action is performed from the message sender's perspective.
 *
 * @param  {string} message             The message we want to encrypt as ciphertext
 * @param  {number} receiver_modulus    The modulus part of the receiver's public key
 * @param  {number} receiver_public_key The public exponent of the receiver's public key
 * @return {number}                     The ciphertext (essentially a very large number)
 */
function encrypt(message, receiver_modulus, receiver_public_exponent) {
  return encode(message, receiver_modulus) ** receiver_public_exponent % receiver_modulus;
}

/**
 * Encodes a message as a number greater than 1 and less than the receiver
 * modulus. This is done because RSA encryption requires an integer, not a
 * string.
 *
 * @param  {string} message          The message we want to encode as a unique number
 * @param  {number} receiver_modulus The modulus part of the receiver's public key
 * @return {number}                  A number greater than 1 and less than the receiver's modulus
 */
function encode(message, receiver_modulus) {
    var bytes = [];    
    for(var i = 0; i < message.length; i++){
        var code = message.charCodeAt(i);
        bytes.push(code);
    }
    //check if each element in the array is smaller than the receiver_modulus and bigger than 1
    var number = "";
    return bytes;
}