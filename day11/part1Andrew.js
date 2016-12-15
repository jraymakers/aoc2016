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
    transition: null,
    elevatorFloor: 1,
    items
  };
}

function newStateFromTransition(prevState, itemsToMove, dir) {
  if (!itemsToMove || itemsToMove.length === 0) {
    throw 'No items to move in state transition!';
  }

  let newFloor = prevState.elevatorFloor + dir;
  let newItems = _.clone(prevState.items);
  for (item of itemsToMove) {
    newItems[item] = newFloor;
  }

  return {
    elevatorFloor: newFloor,
    parentKey: keyForState(prevState),
    transition: itemsToMove.join(' ') + (dir === 1 ? ' up' : ' down'),
    items: newItems
  };
}

function keyForState(state) {
  let itemFloors = _(state.items).map((floorNum, itemName) => itemName + floorNum);
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

function isSameElement(items) {
  let firstChar = items[0][0];
  return _.all(items, item => item[0] === firstChar);
}

function markTransitionStatesAsSeenForDirection(seenStates, state, itemCombos, dir) {
  let transitionStates = _(itemCombos).map(combo => newStateFromTransition(state, combo, dir));
  for (transitionState of transitionStates) {
    let stateKey = keyForState(transitionState);
    seenStates[stateKey] = transitionState.parentKey;
  }
}

function enqueueTransitionsForDirection(queue, seenStates, state, itemCombos, dir) {
  let transitionStates = _(itemCombos).map(combo => newStateFromTransition(state, combo, dir));
  for (transitionState of transitionStates) {
    if (isValidState(transitionState)) {
      queue.push(transitionState);
    }
  }
}

function enqueueTransitions(queue, seenStates, state, destFloor) {
  let itemsByFloor = _(_.keys(state.items)).groupBy(item => state.items[item]);
  let itemsOnFloor = itemsByFloor[state.elevatorFloor];
  
  let singleItemCombos = [];  
  for (let i = 0; i < itemsOnFloor.length; i++) {
    singleItemCombos.push([ itemsOnFloor[i] ]);
  }

  let doubleItemCombos = [];
  let noopCombos = [];
  let foundPair = false;
  for (let i = 0; i < itemsOnFloor.length; i++) {
    for (let j = i+1; j < itemsOnFloor.length; j++) {
      let twoItems = [ itemsOnFloor[i], itemsOnFloor[j] ];
      let isPair = isSameElement(twoItems);
      if (!foundPair && isPair) {
        // Enqueue only the first pair found
        foundPair = true;
        doubleItemCombos.push(twoItems);
      } else if (isPair) {
        noopCombos.push(twoItems);
      } else if (!isPair) {
        doubleItemCombos.push(twoItems);
      }
    }
  }

  let floorMin = Math.min(_.min(state.items), destFloor);
  let floorMax = Math.max(_.max(state.items), destFloor);

  let canMoveUp = state.elevatorFloor < floorMax;
  let canMoveDown = state.elevatorFloor > floorMin;

  // Enqueue in a specific order to favor the more likely solutions first
  canMoveUp && enqueueTransitionsForDirection(queue, seenStates, state, doubleItemCombos, 1);
  canMoveDown && enqueueTransitionsForDirection(queue, seenStates, state, singleItemCombos, -1);
  canMoveUp && enqueueTransitionsForDirection(queue, seenStates, state, singleItemCombos, 1);
  // canMoveDown && enqueueTransitionsForDirection(queue, seenStates, state, doubleItemCombos, -1);

  canMoveUp && markTransitionStatesAsSeenForDirection(seenStates, state, noopCombos, 1);
}

function isConsolidatedOnFloor(state, floor) {
  return _.all(state.items, floorNum => floorNum === floor);
}

function traceThroughStates(seenStates, seenStatesTransitions, finalStateKey) {
  let stateKey = finalStateKey;
  let states = [];
  while (stateKey) {
    transition = seenStatesTransitions[stateKey];
    states.push({ key: stateKey, transition });
    stateKey = seenStates[stateKey];
  }

  return states.reverse();
}

function findPathToFloor(initialState, destFloor) {
  const queue = [ initialState ];
  let state = initialState;
  let stateKey = keyForState(state);
  let seenStates = {};
  let seenStatesTransitions = {};

  let statesConsidered = 0;

  while (queue.length > 0) {
    state = queue.shift();
    statesConsidered++;

    stateKey = keyForState(state);
    if (stateKey in seenStates) {
      continue;
    }
    seenStates[stateKey] = state.parentKey;
    seenStatesTransitions[stateKey] = state.transition;

    if (isConsolidatedOnFloor(state, destFloor)) {
      break;
    }

    enqueueTransitions(queue, seenStates, state, destFloor);
  }

  return {
    statesConsidered,
    finalState: state,
    trace: traceThroughStates(seenStates, seenStatesTransitions, stateKey)
  };
}

(function run() {
  let initialState = parseInitialState(input);
  console.log('Initial state:');
  console.log(initialState);

  let result = findPathToFloor(initialState, 4);
  console.log(result.trace);
  console.log(`Considered ${result.statesConsidered} states`);
  console.log(`${result.trace.length - 1} steps`);
})();
