// decrypts message given the receivers private key.
function decrypt(message,privateKey) {
  
  // defaults to RSAES PKCS#1 v1.5
  var decrypted = privateKey.decrypt(message);

  return decrypted;
}