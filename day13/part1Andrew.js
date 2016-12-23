const FavoriteNumber = 1362;

const Start = [1, 1];
const End = [31, 39];

function countOneBits(num) {
  let count = 0;
  do {
    if (num & 1) {
      count++;
    }
    num >>= 1;
  } while (num > 0);
  return count;
}

function isOpen(x, y, num) {
  let sum = x*x + 3*x + 2*x*y + y + y*y;
  sum += num;
  return countOneBits(sum) % 2 === 0;
}

const DirectionMovements = {
  U: [0, -1],
  D: [0, 1],
  L: [-1, 0],
  R: [1, 0]
}

const Visited = {};

function markVisited(x, y) {
  Visited[x + ',' + y] = true;
}

function isVisited(x, y) {
  return (x + ',' + y) in Visited;
}

function traverseGraph() {
  const q = [{ node: Start, steps: 0 }];

  while (q.length > 0) {
    let current = q.shift();
    let [x, y] = current.node;

    if (x === End[0] && y === End[1]) {
      console.log(`Reached end in ${current.steps} steps`);
      break;
    }

    for (dir in DirectionMovements) {
      let newX = x + DirectionMovements[dir][0];
      let newY = y + DirectionMovements[dir][1];
      if (newX >= 0 && newY >= 0 && !isVisited(newX, newY)
          && isOpen(newX, newY, FavoriteNumber)) {
        markVisited(newX, newY);
        q.push({ node: [newX, newY], steps: current.steps + 1 });
      }
    }
  }
}

function drawMaze(x, y) {
  for (row = 0; row <= y; row++) {
    let line = '';
    for (col = 0; col <= x; col++) {
      let open = isOpen(col, row, FavoriteNumber);
      line += open ? '.' : '#';
    }
    console.log(line);
  }
}

drawMaze.apply(null, End);
traverseGraph();