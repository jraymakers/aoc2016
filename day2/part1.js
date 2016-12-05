const fs = require('fs');

const buttons = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

const dirMovements = {
  U: [0, -1],
  D: [0, 1],
  L: [-1, 0],
  R: [1, 0]
};

function move(pos, dir) {
  let [x, y] = pos;
  let [moveX, moveY] = dirMovements[dir];
  let newPos = [x + moveX, y + moveY];
  return inRange(newPos) ? newPos : pos;
}

function inRange(pos) {
  let [x, y] = pos;
  return x >= 0 && x < buttons[0].length &&
    y >= 0 && y < buttons.length;
}

let data = fs.readFileSync(process.argv[2], 'utf8');

let lines = data.split('\n');

function lineToButton(buttonSequence, line) {
  let pos = buttonSequence[buttonSequence.length - 1];
  console.log(buttonSequence)
  for (let movement of line) {
    pos = move(pos, movement);
  }
  return buttonSequence.concat([pos]);
}

let buttonSequence = lines.reduce(lineToButton, [[1, 1]]);
buttonSequence = buttonSequence.slice(1);

let buttonNumbers = buttonSequence.map(pos => buttons[pos[1]][pos[0]]);
console.log(buttonNumbers.join(''));