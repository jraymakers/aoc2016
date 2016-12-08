const fs = require('fs');

function parseLine(line) {
  return {
    supernets: line.match(/^([a-z]+)|]([a-z]+)\[|([a-z]+)$/g),
    hypernets: line.match(/\[([a-z]+)]/g)
  };
}

function getAbas(s, abas) {
  for (let i = 0, maxi = s.length - 3; i <= maxi; i++) {
    if (s[i] === s[i+2] && s[i] !== s[i+1]) {
      abas.push(s[i]+s[i+1]+s[i+2]);
    }
  }
}

function makeBab(aba) {
  return aba[1] + aba[0] + aba[1];
}

function supportsSSL(ip) {
  let abas = [];
  for (let supernet of ip.supernets) {
    getAbas(supernet, abas);
  }
  console.log(abas);
  for (let aba of abas) {
    let bab = makeBab(aba);
    for (let hypernet of ip.hypernets) {
      if (hypernet.includes(bab)) {
        return true;
      }
    }
  }
  return false;
}

let data = fs.readFileSync(process.argv[2], 'utf8');
let lines = data.split('\n');

let count = 0;
for (let line of lines) {
  console.log(line);
  let ip = parseLine(line);
  console.log(ip);
  if (supportsSSL(ip)) {
    count++;
  }
}
console.log(count);
