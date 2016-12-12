const fs = require('fs');

let data = fs.readFileSync(process.argv[2], 'utf8');

let index = 0;
let decompressed = ''
while (index < data.length) {
  if (data[index] === '(') {
    let end = data.indexOf(')', index);
    let marker = data.slice(index+1, end);
    let markerParts = marker.split('x');
    let chars = parseInt(markerParts[0], 10);
    let times = parseInt(markerParts[1], 10);
    index = end + 1;
    let block = data.slice(index, index+chars);
    for (var i = 0; i < times; i++) {
      decompressed = decompressed + block;
    }
    index += chars;
  } else {
    decompressed = decompressed + data[index];
    index++;
  }
}
console.log(decompressed);
console.log(decompressed.length);