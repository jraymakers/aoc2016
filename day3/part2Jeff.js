const fs = require('fs');

function getLineNumbers(line) {
  let matches = line.match(/([0-9]+)\s+([0-9]+)\s+([0-9]+)/);
  let a = parseInt(matches[1], 10);
  let b = parseInt(matches[2], 10);
  let c = parseInt(matches[3], 10);
  return [a, b, c];
}

function possibleTriangle(a, b, c) {
  return ((a + b) > c) && ((b + c) > a) && ((c + a) > b);
}

let data = fs.readFileSync(process.argv[2], 'utf8');
let lines = data.split('\n');
let count = 0;
let lineSet = [];
for (let line of lines) {
  lineSet.push(getLineNumbers(line));
  if (lineSet.length === 3) {
    if (possibleTriangle(lineSet[0][0], lineSet[1][0], lineSet[2][0])) {
      count++;
    }
    if (possibleTriangle(lineSet[0][1], lineSet[1][1], lineSet[2][1])) {
      count++;
    }
    if (possibleTriangle(lineSet[0][2], lineSet[1][2], lineSet[2][2])) {
      count++;
    }
    lineSet = [];
  }
}
console.log(`possible triangles: ${count}`);
