const fs = require('fs');

const width = 35;
const height = 29;

function putNodesIntoMatrix(nodes) {
  let matrix = [];
  for (let y = 0; y < height; y++) {
    matrix[y] = [];
    for (let x = 0; x < width; x++) {
      matrix[y][x] = nodes[x + ',' + y];
    }
  }
  return matrix;
}

function findThreshold(nodes) {
  let smallestNode = Infinity;
  for (key in nodes) {
    let node = nodes[key];
    if (node.size < smallestNode) {
      smallestNode = node.size;
    }
  }
  return smallestNode;
}

function printMatrix(matrix, nodes) {
  let threshold = findThreshold(nodes);
  console.log(`Threshold is ${threshold}`);

  function charForNode(node) {
    if (node.used === 0) {
      return '_';
    } else if (node.used <= threshold) {
      return '.';
    } else {
      return '#';
    }
  }

  console.log(`Width: ${width}\tHeight: ${height}\n`);

  let headerStr = '';
  for (let col = 0; col < width; col++) {
    headerStr += col % 10;
  }
  console.log(headerStr);

  for (let row = 0; row < height; row++) {
    let rowStr = '';
    for (let col = 0; col < width; col++) {
      let char = charForNode(matrix[row][col]);
      rowStr += char;
    }
    console.log(rowStr);
  }
}

function parse(lines) {
  const nodes = {};
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
      let key = x + ',' + y;
      nodes[key] = { x, y, size, used };
    }
  }
  return nodes;
}

(function run() {
  const lines = fs.readFileSync(process.argv[2], 'utf8').split('\n');

  let nodes = parse(lines);
  let matrix = putNodesIntoMatrix(nodes);
  printMatrix(matrix, nodes);
})();
