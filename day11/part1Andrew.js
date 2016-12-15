const _ = require('underscore');
const fs = require('fs');

const input = fs.readFileSync(process.argv[2], 'utf8').split('\n');

function parseInitialState(lines) {
  const items = {};
  for (line of lines) {
    let itemsOnFloor = line.split(' ');
    let floorNum = Number(itemsOnFloor.shift());
    for (itemName of itemsOnFloor) {
      itemName && (items[itemName] = floorNum);
    }
  }

  return {
    parentKey: null,
    elevatorFloor: 1,
    items
  }
}

function newStateFromTransition(prevState, itemsToMove, dir) {
  let newFloor = prevState.elevatorFloor + dir;
  let newItems = _.clone(prevState.items);
  for (item of itemsToMove) {
    newItems[item] = newFloor;
  }

  return {
    elevatorFloor: newFloor,
    parentKey: keyForState(prevState),
    items: newItems
  };
}

function keyForState(state) {
  let itemFloors = _(state.items).map((floorNum, itemName) => floorNum + itemName);
  itemFloors.sort();
  return state.elevatorFloor + ': ' + itemFloors.join(' ');
}

function isValidState(state) {
  let itemsByFloor = _(_.keys(state.items)).groupBy(item => state.items[item]);
  return _.all(itemsByFloor, itemsOnFloor => {
    let hasAnyGenerators = _.any(itemsOnFloor, i => i.endsWith('G'));
    if (!hasAnyGenerators) return true;

    return _.all(itemsOnFloor, item => {
      if (!item.endsWith('M')) {
        return true;
      } else {
        let matchingGenerator = item[0] + 'G';
        return _(itemsOnFloor).contains(matchingGenerator);
      }
    });
  });
}

function enqueueTransitionsForDirection(queue, state, itemCombos, dir) {
  let transitionStates = _(itemCombos).map(combo => newStateFromTransition(state, combo, dir));
  for (transitionState of transitionStates) {
    if (isValidState(transitionState)) {
      queue.push(transitionState);
    }
  }
}

function enqueueTransitions(queue, state, floorMax) {
  let itemsByFloor = _(_.keys(state.items)).groupBy(item => state.items[item]);
  let itemsOnFloor = itemsByFloor[state.elevatorFloor];
  let itemCombos = [];
  for (let i = 0; i < itemsOnFloor.length; i++) {
    // Get both single and double item combos
    itemCombos.push([ itemsOnFloor[i] ]);
    for (let j = i+1; j < itemsOnFloor.length; j++) {
      itemCombos.push([ itemsOnFloor[i], itemsOnFloor[j] ]);
    }
  }
  if (state.elevatorFloor < floorMax) {
    enqueueTransitionsForDirection(queue, state, itemCombos, 1);
  }

  if (state.elevatorFloor > _.min(state.items)) {
    enqueueTransitionsForDirection(queue, state, itemCombos, -1);
  }
}

function isConsolidatedOnFloor(state, floor) {
  return _.all(state.items, floorNum => floorNum === floor);
}

function traceThroughStates(seenStates, finalStateKey) {
  let stateKey = finalStateKey;
  let states = [];
  while (stateKey) {
    states.push(stateKey);
    stateKey = seenStates[stateKey];
  }

  return states.reverse();
}

function findPathToFloor(initialState, destFloor) {
  let seenStates = {};
  const queue = [ initialState ];
  let state, stateKey;

  let floorMax = Math.max(_.max(initialState.items), destFloor);

  while (queue.length > 0) {
    state = queue.shift();

    stateKey = keyForState(state);
    if (stateKey in seenStates) continue;
    seenStates[stateKey] = state.parentKey;

    if (isConsolidatedOnFloor(state, destFloor)) {
      break;
    }

    if (isConsolidatedOnFloor(state, 3)) {
      console.log('Got everything to 3rd floor');
    }

    enqueueTransitions(queue, state, floorMax);
  }

  return {
    finalState: state,
    trace: traceThroughStates(seenStates, stateKey)
  };
}

let initialState = parseInitialState(input);
console.log('Initial state:');
console.log(initialState);

let floor3Result = findPathToFloor(initialState, 4);
console.log(floor3Result.trace);
console.log(`${floor3Result.trace.length - 1} steps`);

let floor4Result = findPathToFloor(floor3Result.finalState, 4);
console.log(floor4Result.trace);
console.log(`${floor4Result.trace.length - 1} steps`);
