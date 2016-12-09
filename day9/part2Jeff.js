const fs = require('fs');

let data = fs.readFileSync(process.argv[2], 'utf8');

function decompressedLength(s) {
  console.log('decompressedLength:'+s);
  let markerStart = s.indexOf('(');
  if (markerStart !== -1) {
    let markerEnd = s.indexOf(')', markerStart);
    let marker = s.slice(markerStart+1, markerEnd);
    console.log('marker: '+marker);
    let markerParts = marker.split('x');
    let chars = parseInt(markerParts[0], 10);
    let times = parseInt(markerParts[1], 10);
    let markedBlockDecompressedLength = decompressedLength(s.slice(markerEnd + 1, markerEnd + 1 + chars));
    console.log('markedBlockDecompressedLength: '+markedBlockDecompressedLength);
    let length = markerStart + markedBlockDecompressedLength * times + decompressedLength(s.slice(markerEnd + 1 + chars));
    console.log('length: '+length);
    return length;
  } else {
    let restLength = s.length;
    console.log('restLength: '+restLength);
    return restLength;
  }
}

console.log(decompressedLength(data));
