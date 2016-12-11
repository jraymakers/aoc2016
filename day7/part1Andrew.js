const fs = require('fs');

function supportsTLS(ipAddress) {
  let inHypernet = false;

  let foundAbbaOutsideHypernet = false;
  let foundAbbaInsideHypernet = false;

  for (let i = 0; i <= ipAddress.length - 4; i++) {

    if (ipAddress[i] === '[') {
      if (inHypernet) throw 'Already in hypernet!';
      inHypernet = true;
    } else if (ipAddress[i] === ']') {
      if (!inHypernet) throw 'Already out of hypernet!';
      inHypernet = false;
    } else {
      let window = ipAddress.slice(i, i+4+1);
      if (isAbba(window)) {
        if (inHypernet) {
          foundAbbaInsideHypernet = true;
        } else {
          foundAbbaOutsideHypernet = true;
        }
      }
    }
  }

  // Make sure the last 3 characters are well-formed
  for(let char of ipAddress.slice(-3)) {
    if (char === '[') {
      if (inHypernet) throw 'Already in hypernet!';
      inHypernet = true;
    } else if (char === ']') {
      if (!inHypernet) throw 'Already out of hypernet!';
      inHypernet = false;
    }
  }

  if (inHypernet) throw 'String never closes hypernet!';
  return foundAbbaOutsideHypernet && !foundAbbaInsideHypernet;
}

function isAbba(window) {
  return window[0] === window[3] && window[1] === window[2] && window[0] !== window[1];
}

const fileText = fs.readFileSync(process.argv[2], 'utf8');
const lines = fileText.split('\n');

let counter = 0;
for (line of lines) {
  let hasTLS = supportsTLS(line);
  if (hasTLS) counter++;
}

console.log(counter);
