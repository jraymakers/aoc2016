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

const alphabetCharCode = 'a'.charCodeAt();
function rotateLetter(letter, n) {
  let letterCharCode = letter.charCodeAt();
  let letterIndex = letterCharCode - alphabetCharCode;
  let newLetterIndex = (letterIndex + n) % 26;
  return String.fromCharCode(newLetterIndex + alphabetCharCode);
}

function decryptRoomName(room) {
  return Array.prototype.map.call(room.name, char => {
    if (char === '-') {
      return char;
    } else {
      return rotateLetter(char, room.number);
    }
  }).join('');
}

function compareByRoomName(a, b) {
  return a.name.localeCompare(b.name);
}

// Actual program here
const fileText = fs.readFileSync(process.argv[2], 'utf8');
const lines = fileText.split('\n');

let roomNames = [];
for (let line of lines) {
  let room = parseRoomEntry(line);
  if (isRealRoom(room)) {
    let roomName = decryptRoomName(room);
    roomNames.push({ number: room.number, name: roomName });
  }
}

roomNames.sort(compareByRoomName);
for (let item of roomNames) {
  console.log(item.number + '\t' + item.name);
}
