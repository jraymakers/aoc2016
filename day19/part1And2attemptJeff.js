const input = 3014603;
let l = input - Math.pow(2,21);
console.log('part1: '+2*l+1);

// Note: The approach below takes way too long.
console.log();

let elves = [];
for (let i = 1; i <= input; i++) {
  elves.push(i);
}

// elves = [1,2,3,4,5];

let index = 0;
while (elves.length > 1) {
  let oppositeIndex = (index + Math.floor(elves.length/2)) % elves.length;
  // console.log(`${index} removes ${oppositeIndex}`);
  // console.log(elves);
  elves.splice(oppositeIndex, 1);
  if (elves.length % 1000 === 0) console.log(elves.length);
  if (index >= oppositeIndex) {
    index--;
  }
  index = (index + 1) % elves.length;
}
console.log(elves);