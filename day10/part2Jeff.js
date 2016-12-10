const fs = require('fs');

function inputToNode(name, value) {
  // console.log(`input to ${name}: ${value}`);
  if (name.startsWith('output')) {
    console.log(`${name} ${value}`);
  }
  let node = nodes[name];
  if (!node) {
    node = { name: name, inputs: [value] };
    nodes[name] = node;
  } else {
    if (!node.inputs) {
      node.inputs = [value];
    } else {
      node.inputs.push(value);
      maybePropagate(node);
    }
  }
}

function connectNode(name, low, high) {
  // console.log(`connect ${name} to ${low} and ${high}`);
  let node = nodes[name];
  if (!node) {
    node = { name: name, low: low, high: high };
    nodes[name] = node;
  } else {
    node.low = low;
    node.high = high;
    maybePropagate(node);
  }
}

function maybePropagate(node) {
  if (node.low && node.high && node.inputs && node.inputs.length === 2) {
    if (node.inputs[0] < node.inputs[1]) {
      inputToNode(node.low, node.inputs[0]);
      inputToNode(node.high, node.inputs[1]);
    } else {
      inputToNode(node.low, node.inputs[1]);
      inputToNode(node.high, node.inputs[0]);
    }
  }
}

let data = fs.readFileSync(process.argv[2], 'utf8');
let lines = data.split('\n');

let nodes = {};

for (let line of lines) {
  let inputMatch = line.match(/value ([0-9]+) goes to ([0-9a-z ]+)/);
  if (inputMatch) {
    inputToNode(inputMatch[2], parseInt(inputMatch[1], 10));
  }
  let branchMatch = line.match(/([0-9a-z ]+) gives low to ([0-9a-z ]+) and high to ([0-9a-z ]+)/);
  if (branchMatch) {
    connectNode(branchMatch[1], branchMatch[2], branchMatch[3]);
  }
}
