const fs = require('fs');

function decompressSequence(input, i) {
  let parenIndex = input.indexOf(')', i);
  let repeatStr = input.substring(i, parenIndex + 1);
  let matches = repeatStr.match(/\(([0-9]+)x([0-9]+)\)/);
  let charCount = Number(matches[1]);
  let times = Number(matches[2]);

  let textToRepeat = input.substr(parenIndex + 1, charCount);
  let decompressedLength = decompressString(textToRepeat);
  let repeatedDecompressedLength = decompressedLength * times;

  return {
    newIndex: parenIndex + charCount,
    decompressedCount: repeatedDecompressedLength
  };
}

function decompressString(input) {
  let decompressed = 0;
  for (let i = 0; i < input.length; i++) {
    let char = input[i];
    if (char == '(') {
      let { newIndex, decompressedCount } = decompressSequence(input, i);
      i = newIndex;
      decompressed += decompressedCount;
    } else {
      decompressed += 1;
    }
  }
  return decompressed;
}

let compressed = fs.readFileSync(process.argv[2], 'utf8');
let decompressed = decompressString(compressed);
console.log(decompressed);
