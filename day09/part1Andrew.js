const fs = require('fs');

let compressed = fs.readFileSync(process.argv[2], 'utf8');
let decompressed = [];

function decompressSequence(input, decompressed, i) {
  let parenIndex = input.indexOf(')', i);
  let repeatStr = input.substring(i, parenIndex + 1);
  let matches = repeatStr.match(/\(([0-9]+)x([0-9]+)\)/);
  let repeatSpec = { charCount: Number(matches[1]), times: Number(matches[2]) };

  let textToRepeat = input.substr(parenIndex + 1, repeatSpec.charCount);
  let repeatedText = textToRepeat.repeat(repeatSpec.times);
  decompressed.push(repeatedText);
  return parenIndex + repeatSpec.charCount;
}

for (let i = 0; i < compressed.length; i++) {
  let char = compressed[i];
  if (char == '(') {
    i = decompressSequence(compressed, decompressed, i);
  } else {
    decompressed.push(char);
  }
}

let finalString = decompressed.join('');
console.log(finalString.length);
