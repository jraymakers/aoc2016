const fs = require('fs');

let data = fs.readFileSync(process.argv[2], 'utf8');
let lines = data.split('\n');

let pc = 0;
let regs = {
  a: 0,
  b: 0,
  c: 1,
  d: 0
};

function getValue(token) {
  if (token.match(/a|b|c|d/)) {
    return regs[token];
  } else {
    return parseInt(token, 10);
  }
}

while (pc < lines.length) {
  let instr = lines[pc];
  let instrParts = instr.split(' ');
  switch (instrParts[0]) {
    case 'cpy':
      regs[instrParts[2]] = getValue(instrParts[1]);
      pc++
      break;
    case 'inc':
      regs[instrParts[1]]++;
      pc++
      break;
    case 'dec':
      regs[instrParts[1]]--;
      pc++
      break;
    case 'jnz':
      if (getValue(instrParts[1]) !== 0) {
        pc += parseInt(instrParts[2], 10);
      } else {
        pc++;
      }
      break;
  }
}
console.log(regs);