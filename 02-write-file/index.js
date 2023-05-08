/* eslint-disable no-inner-declarations */
const path = require('node:path');
const process = require('node:process');
const readline = require('node:readline');
const fs = require('fs');
const { stdin, stdout } = process;

(async () => {
  try {
    stdout.write('Hi, write some text and press "Enter" or "exit"!\n\n');
    const writeStream = fs.createWriteStream(
      path.join(__dirname, 'text.txt'),
      'utf8',
    );

    const interface = readline.createInterface({
      input: stdin,
      output: stdout,
    });

    function exit() {
      stdout.write('\nGood bye!!!\n');
      process.exit(1);
    }

    interface.on('line', (line) => {
      if (line.trim().toLowerCase() === 'exit') {
        exit();
      } else {
        writeStream.write(line + '\n');
      }
    });

    process.on('beforeExit', () => {
      stdout.write('\nGood bye!!!\n');
    });
    process.on('SIGINT', exit);
  } catch (error) {
    console.log(error.message);
  }
})();
