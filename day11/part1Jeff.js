const startStateJeff = {
  moves: 0,
  E: 0,
  floors: [
    ['G0', 'M0', 'G1', 'G2'],
    ['M1', 'M2'],
    ['G3', 'M3', 'G4', 'M4'],
    []
  ]
};

const startStateJeff2 = {
  moves: 0,
  E: 0,
  floors: [
    ['G0', 'M0', 'G1', 'G2', 'G5', 'M5', 'G6', 'M6'],
    ['M1', 'M2'],
    ['G3', 'M3', 'G4', 'M4'],
    []
  ]
};

const startStateExample = {
  moves: 0,
  E: 0,
  floors: [
    ['M0', 'M1'],
    ['G0'],
    ['G1'],
    []
  ]
};

function legalPair(item1, item2) {
  let type1 = item1.charAt(0);
  let name1 = item1.charAt(1);
  let type2 = item2.charAt(0);
  let name2 = item2.charAt(1);
  let fried1 = type1 === 'M' && type2 === 'G' && name1 !== name2;
  let fried2 = type1 === 'G' && type2 === 'M' && name1 !== name2;
  return !fried1 && !fried2;
}

function getMoves(state) {
  let moves = [];
  let e = state.E;
  let floor = state.floors[e];
  let combos = [];
  for (let i = 0, l = floor.length; i < l; i++) {
    let item1 = floor[i]
    combos.push([item1]);
    for (let j = i+1; j < l; j++) {
      let item2 = floor[j];
      if (legalPair(item1, item2)) {
        combos.push([item1, item2]);
      } else {
        // console.log(`illegal pair: ${item1} ${item2}`);
      }
    }
  }
  // console.log(combos);
  if (e < 3) {
    for (let combo of combos) {
      moves.push({ from: e, to: e+1, items: combo });
    }
  }
  if (e > 0) {
    for (let combo of combos) {
      moves.push({ from: e, to: e-1, items: combo });
    }
  }
  // console.log(moves);
  return moves;
}

function floorWithoutItems(floor, items) {
  return floor.filter((item) => !items.includes(item)).sort();
}

function floorWithItems(floor, items) {
  return floor.concat(items).sort();
}

function floorAfterMove(floor, index, move) {
  if (index === move.from) {
    return floorWithoutItems(floor, move.items);
  }
  if (index === move.to) {
    return floorWithItems(floor, move.items);
  }
  return floor;
}

function applyMove(state, move) {
  return {
    moves: state.moves + 1,
    E: move.to,
    floors: [
      floorAfterMove(state.floors[0], 0, move),
      floorAfterMove(state.floors[1], 1, move),
      floorAfterMove(state.floors[2], 2, move),
      floorAfterMove(state.floors[3], 3, move),
    ]
  };
}

function legalState(state) {
  for (let floor of state.floors) {
    let chips = [0, 0, 0, 0, 0, 0, 0];
    let gens = [0, 0, 0, 0, 0, 0, 0];
    let numChips = 0;
    let numGens = 0;
    for (let item of floor) {
      if (item.charAt(0) === 'M') {
        chips[parseInt(item.charAt(1), 0)] = 1;
        numChips++
      } else { // G
        gens[parseInt(item.charAt(1), 0)] = 1;
        numGens++
      }
    }
    if (numChips > 0 && numGens > 0) {
      for (let i = 0; i < 7; i++) {
        if (chips[i] && !gens[i]) {
          // console.log(`illegal ${i} ${numChips} ${chips} ${numGens} ${gens}`);
          return false;
        }
      }
    }
  }
  return true;
}

function isEndState(state) {
  return state.floors[0].length === 0 &&
         state.floors[1].length === 0 &&
         state.floors[2].length === 0;
}

function solve(startState) {
  let queue = [startState];
  let seen = {};
  while (queue.length > 0) {
    let state = queue.shift();
    let hash = '' + state.E + JSON.stringify(state.floors);
    if (!seen[hash]) {
      seen[hash] = true;
      console.log(state);
      let moves = getMoves(state);
      for (let move of moves) {
        // console.log(move);
        let newState = applyMove(state, move);
        // console.log(newState);
        if (legalState(newState)) {
          if (isEndState(newState)) {
            return newState.moves;
          }
          queue.push(newState);
        } else {
          // console.log('ILLEGAL');
          // console.log(state);
        }
      }
    }
  }
}

// console.log(solve(startStateExample));
console.log(solve(startStateJeff));
// console.log(solve(startStateJeff2));