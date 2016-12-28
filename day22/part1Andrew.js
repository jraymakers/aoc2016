const fs = require('fs');

function isViable(a, b) {
  if (a === b) {
    return false;
  }

  if (a.used === 0) {
    return false;
  }

  let bAvail = b.size - b.used;
  return bAvail > a.used;
}

function search(nodes) {
  let viableCount = 0;

  for (a of nodes) {
    for (b of nodes) {
      if (isViable(a, b)) {
        viableCount++;
      }
    }
  }

  console.log(viableCount);
}

(function run() {
  const lines = fs.readFileSync(process.argv[2], 'utf8').split('\n');
  const nodes = [];

  for (line of lines) {
    let matches = line.match(/node-x([0-9]+)-y([0-9]+) +([0-9]+)T +([0-9]+)T +([0-9]+)T/);
    if (matches) {
      let x = Number(matches[1]);
      let y = Number(matches[2]);
      let size = Number(matches[3]);
      let used = Number(matches[4]);
      let avail = Number(matches[5]);
      if (size - used !== avail) {
        console.log(line);
        throw 'Numbers don\'t add up';
      }
      nodes.push({ x, y, size, used });
    }
  }

  search(nodes);
})();
