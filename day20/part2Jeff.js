const fs = require('fs');

let data = fs.readFileSync(process.argv[2], 'utf8');
let lines = data.split('\n');

let markers = [];
for (let line of lines) {
  let parts = line.split('-');
  let low = parseInt(parts[0], 10);
  let high = parseInt(parts[1], 10);
  markers.push({ type: 'low', value: low });
  markers.push({ type: 'high', value: high });
}
markers.sort((a, b) => a.value - b.value);
// console.log(markers);

let allowedCount = 4294967296;
let nestCount = 0;
let blockedLow;
for (let marker of markers) {
  if (marker.type === 'low') {
    if (nestCount === 0) {
      blockedLow = marker.value;
    }
    nestCount++;
  } else {
    nestCount--;
    if (nestCount === 0) {
      allowedCount -= marker.value - blockedLow + 1;
    }
  }
}
console.log(allowedCount);
