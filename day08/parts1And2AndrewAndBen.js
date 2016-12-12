const fs = require('fs');

function initScreen() {
  let numColumns = 50;
  let numRows = 6;

  return Array.apply(null, Array(numRows)).map(() => Array.apply(null, Array(numColumns)).map(() => "."));
}

function printScreen(screen) {
  for (let row of screen) {
    console.log(row.join(''));
  }
  console.log();
}

function rect(screen, x, y) {
  for (var row = 0; row < y; row++) {
    for (var col = 0; col < x; col++) {
      screen[row][col] = '#';
    }
  }
}

function rotateRow(screen, rowNum, amount) {
  let row = screen[rowNum];
  screen[rowNum] = rotateString(row, amount);
}

function rotateString(string, amount) {

  if (amount < 0) {
    amount = string.length + amount;
  }
  
  let newLeft = string.slice(-amount);
  let newRight = string.slice(0, string.length - amount);
  
  return newLeft.concat(newRight);
}

function rotateColumn(screen, colNum, amount) {
  let colSlice = screen.map((row) => row[colNum]);
  let rotatedCol = rotateString(colSlice, amount);

  for (let row = 0; row < screen.length; row++) {
    screen[row][colNum] = rotatedCol[row];
  }
}

const fileText = fs.readFileSync(process.argv[2], 'utf8');
const lines = fileText.split('\n');

let screen = initScreen();

for (let line of lines) {
  let rectMatches = line.match(/rect ([0-9]+)x([0-9]+)/);
  let colMatches = line.match(/rotate column x=([0-9]+) by ([0-9]+)/);
  let rowMatches = line.match(/rotate row y=([0-9]+) by ([0-9]+)/);

  if (rectMatches) rect(screen, rectMatches[1], rectMatches[2]);
  else if (colMatches) rotateColumn(screen, colMatches[1], colMatches[2]);
  else if (rowMatches) rotateRow(screen, rowMatches[1], rowMatches[2]);
  else throw "line is crazy !" + line + "!!!!!!!!"
}

let count = 0;
for (let row of screen) {
  for (let col of row) {
    count += "#" === col ? 1 : 0;
  }
}

printScreen(screen);

console.log(count);
