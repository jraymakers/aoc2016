const fs = require('fs');

let data = fs.readFileSync(process.argv[2], 'utf8');
let lines = data.split('\n');

let screen = {
  rows: [],
  width: 50,
  height: 6
};
for (let row = 0; row < screen.height; row++) {
  screen.rows[row] = [];
  for (let col = 0; col < screen.width; col++) {
    screen.rows[row][col] = '.';
  }
}

function printScreen(screen) {
  for (let row = 0; row < screen.height; row++) {
    console.log(screen.rows[row].join(' '));
  }
}

function countLit(screen) {
  let count = 0;
  for (let row = 0; row < screen.height; row++) {
    for (let col = 0; col < screen.width; col++) {
      if (screen.rows[row][col] === '#') {
        count++;
      }
    }
  }
  return count;
}

printScreen(screen);
for (let line of lines) {
  let command = parseLine(line);
  switch (command.type) {
    case 'rect':
      drawRect(screen, 0, 0, command.width, command.height);
      break;
    case 'row':
      rotateRow(screen, command.y, command.amount);
      break;
    case 'col':
      rotateCol(screen, command.x, command.amount);
      break;
  }
  printScreen(screen);
}
console.log(countLit(screen));

function parseLine(line) {
  let rectMatches = line.match(/rect ([0-9]+)x([0-9]+)/);
  if (rectMatches) {
    console.log(`rect ${rectMatches[1]} ${rectMatches[2]}`);
    return {
      type: 'rect',
      width: parseInt(rectMatches[1], 10),
      height: parseInt(rectMatches[2], 10)
    };
  }
  let rowMatches = line.match(/rotate row y=([0-9]+) by ([0-9]+)/);
  if (rowMatches) {
    console.log(`row ${rowMatches[1]} ${rowMatches[2]}`);
    return {
      type: 'row',
      y: parseInt(rowMatches[1], 10),
      amount: parseInt(rowMatches[2], 10)
    };
  }
  let colMatches = line.match(/rotate column x=([0-9]+) by ([0-9]+)/);
  if (colMatches) {
    console.log(`col ${colMatches[1]} ${colMatches[2]}`);
    return {
      type: 'col',
      x: parseInt(colMatches[1], 10),
      amount: parseInt(colMatches[2], 10)
    };
  }
}

function drawRect(screen, x, y, w, h) {
  for (let row = y; row < y+h; row++) {
    for (let col = x; col < x+w; col++) {
      screen.rows[row][col] = '#';
    }
  }
}

function rotateRow(screen, y, amount) {
  let values = [];
  for (let col = 0; col < screen.width; col++) {
    values.push(screen.rows[y][col]);
  }
  let index = amount;
  for (let value of values) {
    screen.rows[y][index] = value;
    index = (index + 1) % screen.width;
  }
}

function rotateCol(screen, x, amount) {
  let values = [];
  for (let row = 0; row < screen.height; row++) {
    values.push(screen.rows[row][x]);
  }
  let index = amount;
  for (let value of values) {
    screen.rows[index][x] = value;
    index = (index + 1) % screen.height;
  }
}
