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
  /* TODO */
  var n = 1;
  var e = 1;
  var d = 1;

  return {
    modulus: n,
    public_exponent: e,
    private_exponent: d
  };
}