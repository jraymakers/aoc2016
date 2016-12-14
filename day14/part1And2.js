const crypto = require('crypto');

const input = 'jlmsuwbz';
// const input = 'abc';

function getSingleHash(s) {
  let hash = crypto.createHash('md5');
  hash.update(s);
  return hash.digest('hex');
}

function multihash(s) {
  let hash = getSingleHash(s);
  for (let i = 0; i < 2016; i++) {
    hash = getSingleHash(hash);
  }
  return hash;
}

let hashes = [];
function getHash(index) {
  if (!hashes[index]) {
    // Single hash for part 1, multi hash for part 2
    // hashes[index] = getSingleHash(input+index);
    hashes[index] = multihash(input+index);
  }
  return hashes[index];
}

function getTripletChar(s) {
  let matches = s.match(/(.)\1\1/);
  if (matches) {
    return matches[1];
  } else {
    return null;
  }
}

function hasFive(s, c) {
  let five = c+c+c+c+c;
  return s.includes(five);
}

let index = 0;
let keysFound = 0;
while (keysFound < 64) {
  let c = getTripletChar(getHash(index));
  if (c) {
    for (let i = 1; i <= 1000; i++) {
      if (hasFive(getHash(index+i), c)) {
        keysFound++;
        console.log(`${keysFound}: ${index}`);
        break;
      }
    }
  }
  index++;
}
console.log(index-1);