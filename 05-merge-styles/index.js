const fs = require('fs');
const { join } = require('path');
const { readdir, readFile } = require('fs/promises');

(async () => {
  try {
    const styles = join(__dirname, 'styles');
    const bundle = fs.createWriteStream(
      join(__dirname, 'project-dist', 'bundle.css'),
      'utf8',
    );
    const dirContent = await readdir(styles, { withFileTypes: true });
    const filesCss = dirContent.filter((file) => !file.isDirectory());
    const validStylesCss = filesCss.filter(
      (file) => file.name.split('.')[1] === 'css',
    );
    for (let style of validStylesCss) {
      const src = await readFile(join(styles, style.name), 'utf8');
      bundle.write(`${src}\n`);
    }

    console.log('Bundle has been created!');
  } catch (error) {
    console.log(error);
  }
})();
