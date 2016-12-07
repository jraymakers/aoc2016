const fs = require('fs');

function possibleTriangle(line) {
  let matches = line.match(/([0-9]+)\s+([0-9]+)\s+([0-9]+)/);
  let a = parseInt(matches[1], 10);
  let b = parseInt(matches[2], 10);
  let c = parseInt(matches[3], 10);
  return ((a + b) > c) && ((b + c) > a) && ((c + a) > b);
}

let data = fs.readFileSync(process.argv[2], 'utf8');
let lines = data.split('\n');
let count = 0;
for (let line of lines) {
  if (possibleTriangle(line)) {
    count++;
  }
}
console.log(`possible triangles: ${count}`);
