const crypto = require('crypto');

const example0 = 'hijkl';
const example1 = 'ihgpwlah';
const example2 = 'kglvqrro';
const example3 = 'ulqzkmiv';
const inputJeff = 'lpvhkcbi';

function getSingleHash(s) {
  let hash = crypto.createHash('md5');
  hash.update(s);
  return hash.digest('hex');
}

// dir: 0 = up, 1 = down, 2 = left, 3 = right
function openDoor(hash, dir) {
  return !!hash[dir].match(/b|c|d|e|f/);
}

function movesFrom(state, input) {
  let moves = [];
  let hash = getSingleHash(input + state.pathSoFar);
  // console.log(hash);
  if (state.y < 3 && openDoor(hash, 1)) {
    moves.push({ dx: 0, dy: +1, dir: 'D' });
  }
  if (state.x < 3 && openDoor(hash, 3)) {
    moves.push({ dx: +1, dy: 0, dir: 'R' });
  }
  if (state.y > 0 && openDoor(hash, 0)) {
    moves.push({ dx: 0, dy: -1, dir: 'U' });
  }
  if (state.x > 0 && openDoor(hash, 2)) {
    moves.push({ dx: -1, dy: 0, dir: 'L' });
  }
  return moves;
}

function applyMove(state, move) {
  // console.log(`applyMove ${JSON.stringify(state)} ${JSON.stringify(move)}`);
  return {
    x: state.x + move.dx,
    y: state.y + move.dy,
    pathSoFar: state.pathSoFar + move.dir
  };
}

function getShortestPath(state, input) {
  // console.log(`getShortestPath ${JSON.stringify(state)}`);
  let queue = [state];
  while (queue.length > 0) {
    let current = queue.shift();
    if (current.x === 3 && current.y === 3) {
      return current.pathSoFar;
    }
    for (let move of movesFrom(current, input)) {
      queue.push(applyMove(current, move));
    }
  }
  return null;
}

function getLongestPath(state, input) {
  let longestPath = '';
  let queue = [state];
  while (queue.length > 0) {
    let current = queue.shift();
    if (current.x === 3 && current.y === 3) {
      if (current.pathSoFar.length > longestPath.length) {
        longestPath = current.pathSoFar;
      }
    } else {
      for (let move of movesFrom(current, input)) {
        queue.push(applyMove(current, move));
      }
    }
  }
  return longestPath;
}

function solvePart1(input) {
  console.log(input);
  console.log(getShortestPath({ x: 0, y: 0, pathSoFar: '' }, input));
}

function solvePart2(input) {
  console.log(input);
  console.log(getLongestPath({ x: 0, y: 0, pathSoFar: '' }, input).length);
}

solvePart1(example0);
solvePart1(example1);
solvePart1(example2);
solvePart1(example3);
solvePart1(inputJeff);

solvePart2(example1);
solvePart2(example2);
solvePart2(example3);
solvePart2(inputJeff);