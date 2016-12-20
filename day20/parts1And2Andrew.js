const fs = require('fs');

let data = fs.readFileSync(process.argv[2], 'utf8').split('\n');

function parseLine(line) {
  let matches = line.match(/([0-9]+)-([0-9]+)/);
  return [ Number(matches[1]), Number(matches[2]) ];
}

blacklist = [];

for (line of data) {
  let row = parseLine(line);
  blacklist.push(row);
}

blacklist.sort((a, b) => a[0] - b[0]);

let window = [ blacklist[0][0], blacklist[0][1] ];

let ips = [];

for (pair of blacklist) {
  let [min, max] = pair;
  let [foundMin, foundMax] = window;
  if (min <= foundMax + 1) {
    if (max > foundMax) {
      window[1] = max;
    }
  } else {
    for (i = foundMax + 1; i < min; i++) {
      ips.push(i);
    }
    window[0] = min;
    window[1] = max;
  }
}

console.log(`First IP address is ${ips[0]}`);
console.log(`${ips.length} total IP addresses`);