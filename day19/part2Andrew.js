const NumElves = 3014603;

function makeLinkedList(numElves) {
  let finalNode = { num: numElves, neighbor: null };
  let neighbor = finalNode;
  for (let i = numElves - 1; i >= 1; i--) {
    let newNode = { num: i, neighbor };
    neighbor = newNode;
  }
  finalNode.neighbor = neighbor;
  return neighbor // Elf #1
}

function deleteNode(preVictim) {
  let victim = preVictim.neighbor;
  preVictim.neighbor = victim.neighbor;
  victim.neighbor = null;
}

function solve(numElves) {
  let firstElf = makeLinkedList(numElves);

  // The elf immediately before the halfway elf
  let preHalfwayElf = firstElf;
  for (let i = Math.floor(numElves / 2); i > 1; i--) {
    preHalfwayElf = preHalfwayElf.neighbor;
  }

  while (firstElf.neighbor !== firstElf) {

    deleteNode(preHalfwayElf);
    firstElf = firstElf.neighbor;
    numElves--;

    // Advance the halfway point only half the time
    if (numElves % 2 === 0) {
      preHalfwayElf = preHalfwayElf.neighbor;      
    }
  }

  console.log(firstElf.num);
}

solve(NumElves);
