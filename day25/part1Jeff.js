const fs = require('fs');

let data = fs.readFileSync(process.argv[2], 'utf8');
let lines = data.split('\n');

let instrs = lines.map((line) => line.split(' '));

let pc = 0;
let regs = {
  a: 0,
  b: 0,
  c: 0,
  d: 0
};

function getValue(token) {
  if (token.match(/a|b|c|d/)) {
    return regs[token];
  } else {
    return parseInt(token, 10);
  }
}

function toggle(instrAddr) {
  let instr = instrs[pc + instrAddr];
  if (instr) {
    switch (instr[0]) {
      case 'cpy':
        instr[0] = 'jnz';
        break;
      case 'inc':
        instr[0] = 'dec';
        break;
      case 'dec':
        instr[0] = 'inc';
        break;
      case 'jnz':
        instr[0] = 'cpy';
        break;
      case 'tgl':
        instr[0] = 'inc';
        break;
    }
  }
}

function run() {
  let nextClock = 0;
  while (pc < instrs.length) {
    let instr = instrs[pc];
    // console.log(instr);
    switch (instr[0]) {
      case 'cpy':
        if (instr[2].match(/a|b|c|d/)) {
          regs[instr[2]] = getValue(instr[1]);
        }
        pc++
        break;
      case 'inc':
        regs[instr[1]]++;
        pc++
        break;
      case 'dec':
        regs[instr[1]]--;
        pc++
        break;
      case 'jnz':
        if (getValue(instr[1]) !== 0) {
          pc += getValue(instr[2]);
        } else {
          pc++;
        }
        break;
      case 'tgl':
        toggle(getValue(instr[1]));
        pc++;
        break;
      case 'out':
        if (getValue(instr[1]) !== nextClock) return false;
        nextClock = nextClock === 0 ? 1 : 0;
        pc++;
        break;
    }
  }
}

let startA = 0;
while (true) {
  pc = 0;
  regs.a = startA;
  console.log(regs.a);
  console.log(run());
  startA++;
}
