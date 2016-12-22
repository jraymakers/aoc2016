const fs = require('fs');

let data = fs.readFileSync(process.argv[2], 'utf8');
let lines = data.split('\n');

let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
nodeList = [];
nodeMap = {};
for (let line of lines) {
  let match = line.match(/\/dev\/grid\/node-x(\d+)-y(\d+)\s+(\d+)T\s+(\d+)T\s+(\d+)T\s+(\d+)%/);
  if (match) {
    let node = {
      x: parseInt(match[1], 10),
      y: parseInt(match[2], 10),
      size: parseInt(match[3], 10),
      used: parseInt(match[4], 10),
      avail: parseInt(match[5], 10),
      usePct: parseInt(match[6], 10)
    };
    if (node.x < minX) minX = node.x;
    if (node.x > maxX) maxX = node.x;
    if (node.y < minY) minY = node.y;
    if (node.y > maxY) maxY = node.y;
    nodeList.push(node);
    nodeMap[`${node.x}_${node.y}`] = node;
  }
}
let nodesByUsed = nodeList.filter((n) => n.used !== 0).sort((a, b) => a.used - b.used);
let nodesByAvail = [].concat(nodeList).sort((a, b) => b.avail - a.avail);

function countOfNodesWithAvail(avail) {
  let count = 0;
  while (nodesByAvail[count].avail >= avail) {
    count++;
  }
  return count;
}

let pairCount = 0;
for (let node of nodesByUsed) {
  if (node.used !== 0) {
    pairCount += countOfNodesWithAvail(node.used);
  }
  if (node.used <= node.avail) {
    pairCount--;
  }
}

console.log(pairCount);