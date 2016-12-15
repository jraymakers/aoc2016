let example = [
  { size: 5, pos: 4 },
  { size: 2, pos: 1 }
]

let inputPart1 = [
  { size: 17, pos: 15 },
  { size: 3, pos: 2 },
  { size: 19, pos: 4 },
  { size: 13, pos: 2 },
  { size: 7, pos: 2 },
  { size: 5, pos: 0 },
];

let inputPart2 = [
  { size: 17, pos: 15 },
  { size: 3, pos: 2 },
  { size: 19, pos: 4 },
  { size: 13, pos: 2 },
  { size: 7, pos: 2 },
  { size: 5, pos: 0 },
  { size: 11, pos: 0 },
];

let discs = inputPart2;

function correctTime() {
  for (let i = 0; i < discs.length; i++) {
    let disc = discs[i];
    if (((disc.pos + i + 1) % disc.size) !== 0) return false;
  }
  return true;
}

function advanceDiscs() {
  for (let i = 0; i < discs.length; i++) {
    let disc = discs[i];
    disc.pos = (disc.pos + 1) % disc.size;
  }
}

let t = 0;
while (!correctTime()) {
  advanceDiscs();
  t++;
}
console.log('answer: '+t);
