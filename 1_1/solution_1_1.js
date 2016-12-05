const fs = require('fs');

fs.readFile('input_1_1.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});