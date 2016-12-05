const fs = require('fs');

function moveOne(pos, dir) {
  switch (dir) {
      case 0:
        return [pos[0], pos[1]+1];
      case 1:
        return [pos[0]+1, pos[1]];
      case 2:
        return [pos[0], pos[1]-1];
      case 3:
        return [pos[0]-1, pos[1]];
    }
}

function move(pos, dir, dist, crumbs) {
  while (dist > 0) {
    pos = moveOne(pos, dir);
    let key = `${pos[0]}_${pos[1]}`;
    if (crumbs[key]) {
      console.log(`${key}: ${Math.abs(pos[0])+Math.abs(pos[1])}`);
      process.exit();
    }
    crumbs[key] = true;
    dist--;
  }
  return pos;
}

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) throw err;
  let crumbs = { '0_0': true }; // x_y: true
  let pos = [0, 0];
  let dir = 0; // N = 0, E = 1, S = 2, W = 3
  const parts = data.split(',');
  for (let part of parts) {
    const matches = part.match(/(L|R)([0-9]+)/);
    const partDir = matches[1] === 'R' ? 1 : 3;
    const partDist = parseInt(matches[2], 10);
    dir = (dir + partDir) % 4;
    pos = move(pos, dir, partDist, crumbs);
  }
  console.log(Math.abs(pos[0])+Math.abs(pos[1]));
});
