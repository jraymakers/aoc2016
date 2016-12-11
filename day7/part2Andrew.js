const fs = require('fs');

function supportsSSL(ipAddress) {
  let inHypernet = false;

  let abaSet = {};
  let babSet = {};

  for (let i = 0; i <= ipAddress.length - 3; i++) {

    if (ipAddress[i] === '[') {
      if (inHypernet) throw 'Already in hypernet!';
      inHypernet = true;
    } else if (ipAddress[i] === ']') {
      if (!inHypernet) throw 'Already out of hypernet!';
      inHypernet = false;
    } else {
      let window = ipAddress.slice(i, i+3);
      if (isAba(window)) {
        if (inHypernet) {
          babSet[babToAba(window)] = true;
        } else {
          abaSet[window] = true;
        }
      }
    }
  }

  // Make sure the last 2 characters are well-formed
  for(let char of ipAddress.slice(-2)) {
    if (char === '[') {
      if (inHypernet) throw 'Already in hypernet!';
      inHypernet = true;
    } else if (char === ']') {
      if (!inHypernet) throw 'Already out of hypernet!';
      inHypernet = false;
    }
  }

  if (inHypernet) throw 'String never closes hypernet!';

  for (aba in abaSet) {
    if (babSet[aba]) return true;
  }
  return false;
}

const brackets = '[]';
function isAba(window) {
  return window[0] === window[2] && window[0] !== window[1] &&
      !brackets.includes(window[0]) && !brackets.includes(window[1]);
}

function babToAba(window) {
  return [window[1], window[0], window[1]].join('');
}

const fileText = fs.readFileSync(process.argv[2], 'utf8');
const lines = fileText.split('\n');

let counter = 0;
for (line of lines) {
  let hasSSL = supportsSSL(line);
  if (hasSSL) counter++;
}

console.log(counter);
