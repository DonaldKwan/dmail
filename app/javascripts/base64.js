var forge = require('node-forge');

function encode(bytes) {
  return forge.util.encode64(bytes);
}

function decode(bytes) {
  return forge.util.decode64(bytes);
}

export { encode, decode }