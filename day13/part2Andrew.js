const FavoriteNumber = 1362;

const Start = [1, 1];

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

    if (current.steps > 50) {
      break;
    }

    markVisited(x, y);

    for (dir in DirectionMovements) {
      let newX = x + DirectionMovements[dir][0];
      let newY = y + DirectionMovements[dir][1];
      if (newX >= 0 && newY >= 0 && !isVisited(newX, newY)
          && isOpen(newX, newY, FavoriteNumber)) {
        q.push({ node: [newX, newY], steps: current.steps + 1 });
      }
    }
  }

  let counter = 0;
  for (key in Visited) {
    console.log(key)
    counter++;
  }
  console.log(`Visited ${counter} nodes`);
}

traverseGraph();