const crypto = require('crypto');
const fs = require('fs');

const input = fs.readFileSync(process.argv[2], 'utf8').trim();

function getMD5(text) {
  const hash = crypto.createHash('md5');
  hash.update(text);
  return hash.digest('hex');
}

function isPositionValid(position) {
  return !!position.match(/([0-7])/);
}

function isFull(password) {
  return password.join('').length >= 8;
}

function maybePlacePosition(md5, oldPassword) {
  if (md5.startsWith('00000')) {
    let newPassword = oldPassword.slice(0); // clone

    let position = md5[5];
    if (isPositionValid(position) && !newPassword[position]) {
      newPassword[position] = md5[6];
      return newPassword;
    }
  }

  return oldPassword;
}

let index = 0;
let password = [];

console.log(`Door ID: ${input}`);

while (!isFull(password)) {
  let md5 = getMD5(input + index);

  let newPassword = maybePlacePosition(md5, password);
  if (newPassword !== password) {
    console.log(newPassword);
  }

  password = newPassword;
  index++;
}

console.log();
console.log(password.join(''));
