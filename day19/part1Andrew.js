const NumElves = 3014603;

function makeLinkedList(numElves) {
  let finalNode = { num: numElves, presents: 1, neighbor: null };
  let neighbor = finalNode;
  for (let i = numElves - 1; i >= 1; i--) {
    let newNode = { num: i, presents: 1, neighbor };
    neighbor = newNode;
  }
  finalNode.neighbor = neighbor;
  return neighbor // Elf #1
}

function solve(numElves) {
  let firstElf = makeLinkedList(numElves);

  while (firstElf.neighbor !== firstElf) {
    firstElf.presents += firstElf.neighbor.presents;
    firstElf.neighbor = firstElf.neighbor.neighbor;
    firstElf = firstElf.neighbor;
  }

  console.log(firstElf);
}

solve(NumElves);
