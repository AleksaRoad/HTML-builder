const { promises: fs } = require('fs');
const { join } = require('path');

const copyFiles = async (src, dest) => {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    entry.isDirectory()
      ? await copyFiles(srcPath, destPath)
      : await fs.copyFile(srcPath, destPath);
  }
};

(async () => {
  try {
    const original = join(__dirname, 'files');
    const copy = join(__dirname, 'files-copy');
    await fs.rm(copy, { recursive: true, force: true });
    await copyFiles(original, copy);
    console.log('Copying files is complete!');
  } catch (error) {
    console.log(error);
  }
})();
