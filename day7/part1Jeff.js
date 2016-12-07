const fs = require('fs');

function parseLine(line) {
  return {
    outs: line.match(/^([a-z]+)|]([a-z]+)\[|([a-z]+)$/g),
    ins: line.match(/\[([a-z]+)]/g)
  };
}

function hasAbba(s) {
  for (let i = 0, maxi = s.length - 4; i <= maxi; i++) {
    if (s[i] === s[i+3] && s[i] !== s[i+1] && s[i+1] === s[i+2]) return true;
  }
  return false;
}

let data = fs.readFileSync(process.argv[2], 'utf8');
let lines = data.split('\n');

let count = 0;
for (let line of lines) {
  // console.log(line);
  let parts = parseLine(line);
  // console.log(parts);
  // console.log(parts.outs.some(hasAbba));
  // console.log(!parts.ins.some(hasAbba));
  if (parts.outs.some(hasAbba) && !parts.ins.some(hasAbba)) {
    count++;
  }
}
console.log(count);
