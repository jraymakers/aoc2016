const fs = require('fs');

const buttons = [
  [ null, null, 1  , null, null ],
  [ null, 2   , 3  , 4   , null ],
  [ 5   , 6   , 7  , 8   , 9    ],
  [ null, 'A' , 'B', 'C' , null ],
  [ null, null, 'D', null, null ]
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
    y >= 0 && y < buttons.length && buttons[y][x];
}

let data = fs.readFileSync(process.argv[2], 'utf8');

let lines = data.split('\n');

function lineToButton(buttonSequence, line) {
  let pos = buttonSequence[buttonSequence.length - 1];
  for (let movement of line) {
    pos = move(pos, movement);
  }
  return buttonSequence.concat([pos]);
}

let buttonSequence = lines.reduce(lineToButton, [[0, 2]]);
buttonSequence = buttonSequence.slice(1);

let buttonNumbers = buttonSequence.map(pos => buttons[pos[1]][pos[0]]);
console.log(buttonNumbers.join(''));