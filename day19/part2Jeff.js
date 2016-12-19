const input = 3014603;
// const input = 5;

let index = 0;
let numElves = input;
let removedPositions = [];
while (numElves > 1) {
  let oppositeIndex = (index + Math.floor(numElves/2)) % numElves;
  removedPositions.push(oppositeIndex);
  numElves--;
  if (index >= oppositeIndex) {
    index--;
  }
  index = (index + 1) % numElves;
}
let survivorPos = 0;
// console.log(removedPositions);
for (let i = removedPositions.length-1; i >= 0; i--) {
  if (removedPositions[i] <= survivorPos) {
    survivorPos++;
  }
}
console.log(survivorPos+1);