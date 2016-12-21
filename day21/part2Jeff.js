const fs = require('fs');

let startState = process.argv[2];
let actionsData = fs.readFileSync(process.argv[3], 'utf8');
let actionsLines = actionsData.split('\n').reverse(); // reversed

function swapPosition(state, pos1, pos2) {
  console.log(`[${state.join('')}] swap position ${pos1} ${pos2}`);
  let temp = state[pos1];
  state[pos1] = state[pos2];
  state[pos2] = temp;
  return state;
}

function swapLetter(state, let1, let2) {
  console.log(`[${state.join('')}] swap letter ${let1} ${let2}`);
  for (let i = 0; i < state.length; i++) {
    if (state[i] === let1) {
      state[i] = let2;
    } else if (state[i] === let2) {
      state[i] = let1;
    }
  }
  return state;
}

function rotateLeft(state, steps) {
  let copy = [];
  for (let i = 0, l = state.length; i < l; i++) {
    copy[i] = state[(i+steps)%l];
  }
  return copy;
}

function rotateRight(state, steps) {
  let leftSteps = -steps;
  while (leftSteps < 0) {
    leftSteps += state.length;
  }
  return rotateLeft(state, leftSteps);
}

function rotateDirection(state, dir, steps) {
  console.log(`[${state.join('')}] rotate ${dir} ${steps}`);
  if (dir === 'left') {
    return rotateRight(state, steps); // reversed
  } else {
    return rotateLeft(state, steps); // reversed
  }
}

function rotateLetter(state, letter) {
  console.log(`[${state.join('')}] rotate letter ${letter}`);
  let steps;
  let rotatedState;
  for (let index = 0; index < state.length; index++) {
    steps = 1 + index + (index >= 4 ? 1 : 0);
    rotatedState = rotateLeft(state, steps);
    if (rotatedState.indexOf(letter) === (index % state.length)) {
      return rotatedState;
    }
  }
  console.log(`failed to find index`);
  return state;
}

function reversePositions(state, pos1, pos2) {
  console.log(`[${state.join('')}] reverse position ${pos1} ${pos2}`);
  let temp;
  while (pos1 < pos2) {
    temp = state[pos1];
    state[pos1] = state[pos2];
    state[pos2] = temp;
    pos1++;
    pos2--;
  }
  return state;
}

function movePosition(state, pos1, pos2) {
  console.log(`[${state.join('')}] move position ${pos1} ${pos2}`);
  let a = pos2; // reversed
  let b = pos1; // reversed
  let temp = state[a];
  let delta = a < b ? 1 : -1;
  while (a !== b) {
    state[a] = state[a+delta];
    a += delta;
  }
  state[b] = temp;
  return state;
}

function applyActionLine(state, line) {
  let match = line.match(/swap position (\d+) with position (\d+)/);
  if (match) return swapPosition(state, parseInt(match[1], 10), parseInt(match[2], 10));
  match = line.match(/swap letter ([a-z]) with letter ([a-z])/);
  if (match) return swapLetter(state, match[1], match[2]);
  match = line.match(/rotate (left|right) (\d+) steps?/);
  if (match) return rotateDirection(state, match[1], parseInt(match[2], 10));
  match = line.match(/rotate based on position of letter ([a-z])/);
  if (match) return rotateLetter(state, match[1]);
  match = line.match(/reverse positions (\d+) through (\d+)/);
  if (match) return reversePositions(state, parseInt(match[1], 10), parseInt(match[2], 10));
  match = line.match(/move position (\d+) to position (\d+)/);
  if (match) return movePosition(state, parseInt(match[1], 10), parseInt(match[2], 10));
  console.log(`unrecognized action line: ${line}`);
  return state;
}

function solve() {
  let state = startState.split('');
  for (let line of actionsLines) {
    state = applyActionLine(state, line);
  }
  return state.join('');
}

console.log(solve());
