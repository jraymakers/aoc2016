const fs = require('fs');

const dirMovements = {
  U: -3,
  D: 3,
  L: -1,
  R: 1
};

function move(pos, dir) {
  let newPos = pos + dirMovements[dir];
  return inRange(newPos) ? newPos : pos;
}

function inRange(pos) {
  return pos >= 1 && pos <= 9;
}

let data = fs.readFileSync(process.argv[2], 'utf8');

let lines = data.split('\n');

function lineToButton(buttons, line) {
  let pos = buttons[buttons.length - 1];
  for (let movement of line) {
    pos = move(pos, movement);
  }
  return buttons.concat(pos);
}

let buttons = lines.reduce(lineToButton, [5]);
buttons = buttons.slice(1);
console.log(buttons.join(''));