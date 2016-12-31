const fs = require('fs');

const reg = {
  a: 12,
  b: 0,
  c: 0,
  d: 0
};

let instructionCounter = 0;
let programMemory;

function regToValue(r) {
  let value = Number(r);
  if (Number.isNaN(value)) {
    if (!(r in reg)) {
      return undefined;
    }
    value = reg[r];
  }
  return value;
}

function cpy(x, y) {
  if (y in reg) {
    let value = regToValue(x);
    if (value !== undefined) {
      reg[y] = value;
    }
  }
}

function inc(x) {
  if (x in reg) {
    reg[x]++;
  }
}

function dec(x) {
  if (x in reg) {
    reg[x]--;
  }
}

function jnz(x, y) {
  let xValue = regToValue(x);
  let yValue = regToValue(y);
  if (xValue !== undefined && yValue !== undefined && xValue !== 0) {
    let newInstructionCounter = instructionCounter + yValue;
    instructionCounter = newInstructionCounter - 1;
  }
}

const toggleDest = {
  inc: 'dec',
  dec: 'inc',
  tgl: 'inc',
  cpy: 'jnz',
  jnz: 'cpy'
};

function tgl(x, y) {
  let value = regToValue(x);
  if (value !== undefined) {
    let index = instructionCounter + value;
    let instr = programMemory[index];
    if (instr) {
      instr.instruction = toggleDest[instr.instruction]; 
    }
  }
}

const comm = { cpy, inc, dec, jnz, tgl };

function parseCommand(command) {
  let [ instruction, x, y ] = command.split(' ');
  return { instruction, x, y };
}

(function run() {
  const commands = fs.readFileSync(process.argv[2], 'utf8').split('\n');

  programMemory = commands.map(parseCommand);

  while (instructionCounter < commands.length) {
    let c = programMemory[instructionCounter];
    // console.log(c);

    let commandFn = comm[c.instruction];
    commandFn(c.x, c.y);
    instructionCounter++;

    // console.log(programMemory);
    // console.log(reg);
    // console.log('Counter: ' + instructionCounter);
  }
  console.log(reg);
})();
