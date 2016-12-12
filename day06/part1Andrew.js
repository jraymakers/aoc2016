const fs = require('fs');

const fileText = fs.readFileSync(process.argv[2], 'utf8');
const lines = fileText.split('\n');

function addLetterToMap(letter, letterFrequencyMap) {
  if (letterFrequencyMap[letter]) {
    letterFrequencyMap[letter]++;
  } else {
    letterFrequencyMap[letter] = 1;
  }
  return letterFrequencyMap;
}

function mostCommonLetter(letterFrequencyMap) {
  let max = { letter: null, count: 0 };
  for (letter in letterFrequencyMap) {
    let count = letterFrequencyMap[letter];
    if (count > max.count) {
      max = { letter, count };
    }
  }

  return max.letter;
}

// Initialize an empty array of letter frequency maps
let numColumns = lines[0].length;
let frequencies = Array.apply(null, Array(numColumns)).map(() => ({}));

frequencies = lines.reduce((frequencies, line) =>
  frequencies.map((frequencyMap, i) => addLetterToMap(line[i], frequencyMap))
, frequencies);

let mostCommonLetters = frequencies.map(mostCommonLetter);

console.log(mostCommonLetters.join(''));
