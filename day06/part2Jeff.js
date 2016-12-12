const fs = require('fs');

let data = fs.readFileSync(process.argv[2], 'utf8');
let lines = data.split('\n');

let letterCountsForIndex = [];
for (let line of lines) {
  for (let i = 0; i < line.length; i++) {
    let letter = line[i];
    let letterCounts = letterCountsForIndex[i];
    if (!letterCounts) {
      letterCounts = {};
      letterCountsForIndex[i] = letterCounts;
    }
    letterCounts[letter] = (letterCounts[letter] || 0) + 1;
  }
}
let minLetters = letterCountsForIndex.map((letterCounts) => {
  let min = Infinity;
  let minLetter = null;
  for (let letter in letterCounts) {
    if (letterCounts[letter] < min) {
      min = letterCounts[letter];
      minLetter = letter;
    }
  }
  return minLetter;
});
console.log(minLetters.join(''));
