//const ENCRYPT_METHOD = "base64";
const ENCRYPT_METHOD = "hex";

function encode(str) {
  return Buffer.from(str).toString(ENCRYPT_METHOD);
}

function decode(str) {
  return Buffer.from(str, ENCRYPT_METHOD).toString();
}

module.exports = {
  encode,
  decode,
};
