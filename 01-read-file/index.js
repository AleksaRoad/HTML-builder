const path = require('node:path');
const { stdout } = require('process');
const fs = require('fs');

(async () => {
  try {
    const readStream = fs.createReadStream(
      path.join(__dirname, 'text.txt'),
      'utf8',
    );
    readStream.pipe(stdout);
  } catch (error) {
    console.log(error.message);
  }
})();
