const crypto = require('crypto');

const input = 'uqwqemis';

const password = [];
let index = 0;
while (password.length < 8) {
  let hash = crypto.createHash('md5');
  hash.update(input+index);
  let result = hash.digest('hex');
  if (result.startsWith('00000')) {
    console.log(result);
    password.push(result[5]);
  }
  index++;
}
console.log(password.join(''));