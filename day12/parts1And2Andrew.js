const fs = require('fs');

const reg = {
  a: 0,
  b: 0,
  c: 1,
  d: 0
};

let instructionCounter = 0;

function cpy(x, y) {
  let value = Number(x);
  if (!value) {
    value = reg[x];
  }
  reg[y] = value;
}

function inc(x) {
  reg[x]++;
}

function dec(x) {
  reg[x]--;
}

function jnz(x, y) {
  let value = Number(x);
  if (!value) {
    value = reg[x];
  }
  if (value !== 0) {
    instructionCounter += (y - 1);
  }
}

const comm = { cpy, inc, dec, jnz };

function parseAndRunCommand(command) {
  let [ instr, x, y ] = command.split(' ');
  let commandFn = comm[instr];
  commandFn(x, y);
}

(function run() {
  const commands = fs.readFileSync(process.argv[2], 'utf8').split('\n');

  while (instructionCounter < commands.length) {
    let line = commands[instructionCounter];
    // console.log(`Running command: ${line}`);
    parseAndRunCommand(line);
    // console.log(reg);
    instructionCounter++;
  }
  console.log(reg);
})();
