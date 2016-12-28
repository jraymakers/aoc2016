const fs = require('fs');

let material = 'abcdefgh'.split('');

function swapPosition(x, y) {
  let temp = material[x];
  material[x] = material[y];
  material[y] = temp;
}

function swapLetter(x, y) {
  let xIndex = material.indexOf(x);
  let yIndex = material.indexOf(y);
  swapPosition(xIndex, yIndex);
}

function rotate(x, dir) {
  if (x >= material.length) {
    x %= material.length;
  }

  if (dir === 'left') {
    let right = material.slice(x);
    let left = material.slice(0, x);
    var rotated = right.concat(left);
  } else {
    let right = material.slice(-x);
    let left = material.slice(0, -x);
    var rotated = right.concat(left);
  }
  material = rotated;
}

function rotatePosition(x) {
  let index = material.indexOf(x);
  rotate(1, 'right');
  rotate(index, 'right');
  if (index >= 4) {
    rotate(1, 'right');
  }
}

function reversePositions(x, y) {
  let left = material.slice(0, x);
  let middle = material.slice(x, y + 1);
  let right = material.slice(y + 1);
  material = left.concat(middle.reverse()).concat(right);
}

function moveTo(x, y) {
  let letter = material.splice(x, 1);
  material.splice(y, 0, letter[0]);
}

function parseAndRunCommand(command) {
  let tokens = command.split(' ');
  if (command.startsWith('swap position')) {
    swapPosition(Number(tokens[2]), Number(tokens[5]));
  } else if (command.startsWith('swap letter')) {
    swapLetter(tokens[2], tokens[5]);
  } else if (command.startsWith('rotate based on position')) {
    rotatePosition(tokens[6]);
  } else if (command.startsWith('rotate')) {
    rotate(Number(tokens[2]), tokens[1]);
  } else if (command.startsWith('reverse positions')) {
    reversePositions(Number(tokens[2]), Number(tokens[4]));
  } else if (command.startsWith('move position')) {
    moveTo(Number(tokens[2]), Number(tokens[5]));
  } else {
    throw 'Invalid command';
  }
}

(function run() {
  const commands = fs.readFileSync(process.argv[2], 'utf8').split('\n');

  console.log(material.join(''));
  for (line of commands) {
    parseAndRunCommand(line);
    console.log(material.join('') + '\t' + line);
  }
})();
