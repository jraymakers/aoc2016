const fs = require('fs');

function parseRoomEntry(entry) {
  let matches = entry.match(/(.+)-([0-9]+)\[([a-z]+)\]/);
  return {
    name: matches[1],
    number: Number(matches[2]),
    checksum: matches[3]
  }
}

function makeLetterFrequencyMap(encryptedName) {
  const map = {};
  for (let letter of encryptedName) {
    if (letter !== '-') {
      map[letter] = map[letter] ? map[letter] + 1 : 1;
    }
  }
  return map;
}

function letterFrequencyComparator(a, b) {
  return b.count - a.count || a.letter.localeCompare(b.letter);
}

function sortLetterFrequencies(letterFrequencyMap) {
  const arr = [];
  for (let letter in letterFrequencyMap) {
    arr.push({ letter, count: letterFrequencyMap[letter] });
  }

  return arr.sort(letterFrequencyComparator);
}

function checksum(roomName) {
  const letterFrequencyMap = makeLetterFrequencyMap(roomName);
  const sorted = sortLetterFrequencies(letterFrequencyMap);
  return sorted.slice(0, 5).map(entry => entry.letter).join('');
}

function isRealRoom(room) {
  return checksum(room.name) === room.checksum;
}

// Actual program here
const fileText = fs.readFileSync(process.argv[2], 'utf8');
const lines = fileText.split('\n');

let sum = 0;
for (let line of lines) {
  let room = parseRoomEntry(line);
  if (isRealRoom(room)) {
    sum += room.number;
  }
}

console.log(sum);
