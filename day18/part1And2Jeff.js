const fs = require('fs');

function getInput() {
  return fs.readFileSync(process.argv[2], 'utf8');
}

let rules = {
  '...': '.',
  '..^': '^',
  '.^.': '.',
  '.^^': '^',
  '^..': '^',
  '^.^': '.',
  '^^.': '^',
  '^^^': '.',
}

function getNextRow(row) {
  let nextRowArray = [];
  nextRowArray.push(rules['.'+row.substr(0, 2)]);
  for (let i = 0, last = row.length-3; i <= last; i++) {
    nextRowArray.push(rules[row.substr(i, 3)]);
  }
  nextRowArray.push(rules[row.substr(row.length-2, 2)+'.']);
  return nextRowArray.join('');
}

function countSafe(row) {
  let numSafe = 0;
  for (let c of row) {
    numSafe += c === '.' ? 1 : 0;
  }
  return numSafe;
}

function solve(firstRow, numRows) {
  let rows = [firstRow];
  while (rows.length < numRows) {
    rows.push(getNextRow(rows[rows.length-1]));
  }
  // console.log(rows.join('\n'));
  let numSafe = 0;
  for (let row of rows) {
    numSafe += countSafe(row);
  }
  return numSafe;
}

console.log(solve(getInput(), parseInt(process.argv[3], 10)));
