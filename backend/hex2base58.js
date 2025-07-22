const bs58 = require('bs58');
const encode = bs58.encode ? bs58.encode : bs58.default.encode;

// Your hex string (must be 64 bytes for a private key, 32 for a secret)
const hex = '10aac35d5d91987afc483974eda9d830cc4ebd11324b500d6bc91eedb91cb178408052cec5b360ca9d857630c9bd2c43c9d9248f615aedc4d3ee382abefacbbb';

// Convert hex to Uint8Array
const arr = new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

// Encode as base58
const base58 = encode(arr);

console.log(base58);
