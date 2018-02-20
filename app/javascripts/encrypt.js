// returns UTF-16 encoding of char.
function s(x) {return x.charCodeAt(0);}

// encrypts message given the receivers public key.
function encrypt(message, publicKey) {

  var bytes = message.split('').map(s);
  
  // defaults to RSAES PKCS#1 v1.5
  var encrypted = publicKey.encrypt(bytes);

  return encrypted;
}