const crypto = require('crypto');

function getMD5(text) {
  const hash = crypto.createHash('md5');
  hash.update(text);
  return hash.digest('hex');
}

const openLetters = 'bcdef';
function isDoorOpen(doorChar) {
  return openLetters.includes(doorChar);
}

function getDoorStatuses(passcode, x, y) {
  let hash = getMD5(passcode).slice(0, 4);
  return {
    U: isDoorOpen(hash[0]),
    D: isDoorOpen(hash[1]),
    L: isDoorOpen(hash[2]),
    R: isDoorOpen(hash[3])
  }
}

const directionMovements = {
  U: [0, -1],
  D: [0, 1],
  L: [-1, 0],
  R: [1, 0]
}

function roomInBounds(x, y) {
  return x >= 0 && x <= 3 && y >= 0 && y <= 3;
}

function doSearch(q) {
  let longestPath = '';

  while (q.length > 0) {
    let { x, y, sequence } = q.shift();

    if (x === 3 && y === 3) {
      longestPath = sequence;
      continue;
    }

    let doorStatuses = getDoorStatuses(sequence, x, y);
    for (direction in doorStatuses) {
      if (!doorStatuses[direction]) {
        continue;
      }

      let movement = directionMovements[direction];
      let newX = x + movement[0];
      let newY = y + movement[1];
      let newSequence = sequence + direction;
      if (roomInBounds(newX, newY)) {
        q.push({ x: newX, y: newY, sequence: newSequence });
      }
    }
  }

  return longestPath;
}

function run(passcode) {
  let q = [ { x: 0, y: 0, sequence: passcode } ];
  let path = doSearch(q).slice(passcode.length);
  console.log(path);
  console.log(`${path.length} steps in path`);
}

run('awrkjxxr');