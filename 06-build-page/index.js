const fs = require('fs');
const path = require('node:path');
const { join } = require('path');
const { readdir, readFile, mkdir, copyFile, rm } = require('fs/promises');

const dist = join(__dirname, 'project-dist');
const assets = join(dist, 'assets');
// const folderAssets = path.join(__dirname, 'assets');
const template = join(__dirname, 'template.html');

const createFolder = (path) => {
  mkdir(path, { recursive: true }, (error) => {
    if (error) throw error;
  });
};
createFolder(dist);
const copyFiles = async (src, dest) => {
  createFolder(assets);
  await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    entry.isDirectory()
      ? await copyFiles(srcPath, destPath)
      : await copyFile(srcPath, destPath);
  }
};

(async () => {
  try {
    const original = join(__dirname, 'assets');
    const copy = join(dist, 'assets');
    await rm(copy, { recursive: true, force: true });
    await copyFiles(original, copy);
    console.log('Copying files is complete!');
  } catch (error) {
    console.log(error);
  }
})();

// const assetsNew = async () => {

//   readdir(folderAssets, { withFileTypes: true }, (error, fls) => {
//     if (error) throw error;
//     fls.forEach((file) => {
//       if (file.isDirectory()) {
//         mkdir(`${assets}/${file.name}`, { recursive: true }, (error) => {
//           if (error) throw error;
//         });
//         readdir(
//           `${folderAssets}/${file.name}`,
//           { withFileTypes: true },
//           (error, fls) => {
//             if (error) throw error;
//             fls.forEach((fl) => {
//               copyFile(
//                 `${folderAssets}/${file.name}/${fl.name}`,
//                 `${assets}/${file.name}/${fl.name}`,
//                 (error) => {
//                   if (error) throw error;
//                 },
//               );
//             });
//           },
//         );
//       }
//     });
//   });
//   console.log('Assets has been created!');
// };
// assetsNew();

(async function createCss() {
  try {
    const styles = join(__dirname, 'styles');
    const bundle = fs.createWriteStream(
      join(__dirname, 'project-dist', 'style.css'),
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

    console.log('CSS has been created!');
  } catch (error) {
    console.log(error);
  }
})();

(async function createHTML() {
  try {
    let readTemp = await readFile(template, 'utf8');
    const compFiles = await readdir(join(__dirname, 'components'));

    for (let file of compFiles) {
      const part = path.parse(file).name;
      if (readTemp.includes(part)) {
        const partHtml = path.join(join(__dirname, 'components'), file);
        const srcFile = await readFile(partHtml, 'utf8');
        readTemp = readTemp.replace(`{{${part}}}`, srcFile);
      }
    }
    fs.createWriteStream(join(dist, 'index.html')).write(readTemp);
    console.log('HTML has been created!');
  } catch (err) {
    console.log(err);
  }
})();
