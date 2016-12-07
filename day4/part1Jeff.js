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
  // console.log(`countsMap: ${JSON.stringify(countsMap)}`);
  let countsArray = Object.keys(countsMap).map((letter) => ({ letter: letter, count: countsMap[letter] }));
  // console.log(`countsArray: ${JSON.stringify(countsArray)}`);
  let sorted = countsArray.sort((a, b) => {
    if (a.count === b.count) {
      return a.letter.charCodeAt(0) - b.letter.charCodeAt(0);
    } else {
      return b.count - a.count;
    }
  });
  // console.log(`sorted: ${JSON.stringify(sorted)}`);
  let checksum = sorted[0].letter + sorted[1].letter + sorted[2].letter + sorted[3].letter + sorted[4].letter;
  // console.log(`checksum: ${checksum}`);
  return checksum;
}

let data = fs.readFileSync(process.argv[2], 'utf8');
let lines = data.split('\n');
let sum = 0;
for (let line of lines) {
  let room = parseLine(line);
  // console.log(room);
  sum += calculateChecksum(room.name) === room.checksum ? room.sectorId : 0;
}
console.log(`sum: ${sum}`);
