const crypto = require('crypto');
const fs = require('fs');

const input = fs.readFileSync(process.argv[2], 'utf8').trim();

function getMD5(text) {
  const hash = crypto.createHash('md5');
  hash.update(text);
  return hash.digest('hex');
}

let index = 0;
let password = [];

console.log(`Door ID: ${input}`);

while (password.length < 8) {
  let md5 = getMD5(input + index);

  if (md5.startsWith('00000')) {
    console.log(index + '\t' + md5);
    password.push(md5[5]);
  }

  index++;
}

console.log();
console.log(password.join(''));
