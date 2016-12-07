const fs = require('fs');

function parseLine(line) {
  let matches = line.match(/([a-z-]+)([0-9]+)\[([a-z]+)\]/);
  return {
    name: matches[1],
    sectorId: parseInt(matches[2]),
    checksum: matches[3]
  };
}

function calculateChecksum(name) {
  let countsMap = {};
  for (let letter of name) {
    if (letter !== '-') {
      countsMap[letter] = (countsMap[letter] || 0) + 1;
    }
  }
  let countsArray = Object.keys(countsMap).map((letter) => ({ letter: letter, count: countsMap[letter] }));
  let sorted = countsArray.sort((a, b) => {
    if (a.count === b.count) {
      return a.letter.charCodeAt(0) - b.letter.charCodeAt(0);
    } else {
      return b.count - a.count;
    }
  });
  let checksum = sorted[0].letter + sorted[1].letter + sorted[2].letter + sorted[3].letter + sorted[4].letter;
  return checksum;
}

const ACharCode = 'a'.charCodeAt(0);
function decrypt(name, shift) {
  return name.split('').map((c) => {
    if (c === '-') return ' ';
    return String.fromCharCode(((c.charCodeAt(0) - ACharCode) + shift) % 26 + ACharCode);
  }).join('');
}

let data = fs.readFileSync(process.argv[2], 'utf8');
let lines = data.split('\n');
for (let line of lines) {
  let room = parseLine(line);
  if (calculateChecksum(room.name) === room.checksum) {
    console.log(`${room.sectorId}: ${decrypt(room.name, room.sectorId)}`);
  }
}
