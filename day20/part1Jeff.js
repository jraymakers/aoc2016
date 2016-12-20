const fs = require('fs');

let data = fs.readFileSync(process.argv[2], 'utf8');
let lines = data.split('\n');

let ranges = [];
for (let line of lines) {
  let parts = line.split('-');
  let low = parseInt(parts[0], 10);
  let high = parseInt(parts[1], 10);
  ranges.push([low, high]);
}
ranges.sort((a, b) => a[0] - b[0]);
let min = 0;
for (let range of ranges) {
  if (range[0] <= min && min <= range[1]) {
    min = range[1]+1;
  }
}
console.log(min);
