const discs = [
  { positions: 17, startPosition: 1 },
  { positions: 7, startPosition: 0 },
  { positions: 19, startPosition: 2 },
  { positions: 5, startPosition: 0 },
  { positions: 3, startPosition: 0 },
  { positions: 13, startPosition: 5 },
  { positions: 11, startPosition: 0}
];

let buttonPressTime = 0;
while (true) {
  let discPositions = discs.map((disc, index) => {
    let discNum = index + 1;
    let time = buttonPressTime + discNum;
    return getDiscPositionAtTime(disc.startPosition, disc.positions, time);
  });
  if (sum(discPositions) === 0) {
    console.log(buttonPressTime);
    process.exit();
  }
  buttonPressTime++;
}

function getDiscPositionAtTime(startPosition, numPositions, time) {
  return (startPosition + time) % numPositions;
}

function sum(array) {
  let sum = 0;
  for (item of array) {
    sum += item;
  }
  return sum;
}