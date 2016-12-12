const crypto = require('crypto');

const input = 'uqwqemis';

const password = ['_','_','_','_','_','_','_','_'];
let decrypted = 0;
let index = 0;
while (decrypted < 8) {
  let hash = crypto.createHash('md5');
  hash.update(input+index);
  let result = hash.digest('hex');
  if (result.startsWith('00000')) {
    console.log(result);
    let position = parseInt(result[5], 10);
    if (position >= 0 && position <= 7 && password[position] == '_') {
      password[position] = result[6];
      console.log(password.join(''));
      decrypted++;
    }
  }
  index++;
}
