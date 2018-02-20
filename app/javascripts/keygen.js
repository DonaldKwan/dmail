/**
 * Generates the keys needed for RSA. How it works:
 *   - Generates two large random numbers p, q
 *   - Calculates modulus n by multiplying p and q
 *   - Calculates the totient of p and q
 *   - Computes e such that e is less than the totient and is coprime to the totient
 *   - Computes d such that d * e is congruent to 1 with the totient as the modulus
 *
 * @return {object} The receiver's public exponent, private exponent, and modulus (public)
 */

function generate_keys() {

  // bits: 1024 exponent: 0x10001
  var pair = forge.pki.rsa.generateKeyPair(1024, 0x10001);

  var public_key = forge.pki.publicKeyToPem(pair.publicKey);
  var private_key = forge.pki.privateKeyToPem(pair.privateKey);

  return {
    public_key: public_key,
    private_key: private_key,
  };
}