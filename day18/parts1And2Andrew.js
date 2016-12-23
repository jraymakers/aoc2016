const fs = require('fs');

const fileText = fs.readFileSync(process.argv[2], 'utf8');

// trap is true, safe is false

function readRowFromFile(line) {
  const row = [];
  for (char of line) {
    row.push(char === '^' ? true : false);
  }
  return row;
}

function makeNextRow(row) {
  let rowWithBuffers = [false].concat(row).concat(false);

  let nextRow = row.map((item, i) => {
    let [left, center, right] = rowWithBuffers.slice(i, i + 3);

    let isTrap = false;
    if (left && center && !right) {
      isTrap = true;
    } else if (!left && center && right) {
      isTrap = true;
    } else if (left && !center && !right) {
      isTrap = true;
    } else if (!left && !center && right) {
      isTrap = true;
    }

    return isTrap;
  });

  return nextRow;
}

function countRow(row) {
  let counter = 0;
  for (item of row) {
    if (!item) {
      counter++;
    }
  }
  return counter;
}

const numRows = 400000;

let prevRow = readRowFromFile(fileText);
let counter = countRow(prevRow);

for (let i = 1; i < numRows; i++) {
  let nextRow = makeNextRow(prevRow);
  counter += countRow(nextRow);
  prevRow = nextRow;
}

console.log(counter);