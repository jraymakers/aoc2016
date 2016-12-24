const fs = require('fs');

let data = fs.readFileSync(process.argv[2], 'utf8');
let rows = data.split('\n');

let height = rows.length;
let width = rows[0].length;
console.log(`${width} ${height} ${width*height}`);

function getTargets() {
  let tgts = []
  for (let y = 0; y < height; y++) {
    let row = rows[y];
    for (let x = 0; x < width; x++) {
      let c = row.charAt(x);
      if (c !== '.' && c !== '#') {
        let num = parseInt(c, 10);
        tgts[num] = { num: num, x: x, y: y };
      }
    }
  }
  return tgts;
}

let targets = getTargets();
console.log(targets);

function getAdj(node) {
  let adjs = [];
  if (rows[node.y].charAt(node.x - 1) !== '#') {
    adjs.push({ x: node.x - 1, y: node.y });
  }
  if (rows[node.y].charAt(node.x + 1) !== '#') {
    adjs.push({ x: node.x + 1, y: node.y });
  }
  if (rows[node.y - 1].charAt(node.x) !== '#') {
    adjs.push({ x: node.x, y: node.y - 1 });
  }
  if (rows[node.y + 1].charAt(node.x) !== '#') {
    adjs.push({ x: node.x, y: node.y + 1 });
  }
  return adjs;
}

function findShortestPath(start, end) {
  if (start.x === end.x && start.y === end.y) {
    return 0;
  }
  let queue = [{ x: start.x, y: start.y, dist: 0 }];
  let added = {};
  added[`${start.x}_${start.y}`] = true;
  while (queue.length > 0) {
    let current = queue.shift();
    let adjs = getAdj(current);
    for (let adj of adjs) {
      if (!added[`${adj.x}_${adj.y}`]) {
        if (adj.x === end.x && adj.y === end.y) {
          return current.dist + 1;
        }
        queue.push({ x: adj.x, y: adj.y, dist: current.dist + 1 });
        added[`${adj.x}_${adj.y}`] = true;
      }
    }
  }
  return -1;
}

let distanceFrom = [];
for (let a = 0; a <= 7; a++) {
  let distanceTo = [];
  for (let b = 0; b <= 7; b++) {
    distanceTo[b] = findShortestPath(targets[a], targets[b]);
  }
  distanceFrom[a] = distanceTo;
}
console.log(distanceFrom);

function findShortestTargetPath() {
  let minPath = Infinity;
  let queue = [{ path: [0], dist: 0, visited: [true] }];
  while (queue.length > 0) {
    let current = queue.shift();
    if (current.path.length === 8) {
      if (current.dist < minPath) {
        minPath = current.dist;
        console.log(current);
        console.log(minPath);
      }
    } else {
      for (let i = 0; i < 8; i++) {
        if (!current.visited[i]) {
          let newVisited = [].concat(current.visited);
          newVisited[i] = true;
          queue.push({
            path: current.path.concat([i]),
            dist: current.dist + distanceFrom[current.path[current.path.length-1]][i],
            visited: newVisited
          });
        }
      }
    }
  }
  console.log(`minPath: ${minPath}`);
}
findShortestTargetPath();

function findShortestTargetPathAndReturn() {
  let minPath = Infinity;
  let queue = [{ path: [0], dist: 0, visited: [true] }];
  while (queue.length > 0) {
    let current = queue.shift();
    if (current.path.length === 8) {
      let dist = current.dist + distanceFrom[current.path[current.path.length-1]][0];
      if (dist < minPath) {
        minPath = dist;
        console.log(current);
        console.log(minPath);
      }
    } else {
      for (let i = 0; i < 8; i++) {
        if (!current.visited[i]) {
          let newVisited = [].concat(current.visited);
          newVisited[i] = true;
          queue.push({
            path: current.path.concat([i]),
            dist: current.dist + distanceFrom[current.path[current.path.length-1]][i],
            visited: newVisited
          });
        }
      }
    }
  }
  console.log(`minPath: ${minPath}`);
}
findShortestTargetPathAndReturn();