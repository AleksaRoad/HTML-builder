const path = require('node:path');
const fs = require('fs');

(async () => {
  try {
    const folderPath = path.join(__dirname, 'secret-folder');
    const files = await fs.promises.readdir(folderPath, {
      withFileTypes: true,
    });

    const fileStatsPromises = files.map(async (file) => {
      if (!file.isDirectory()) {
        const filePath = path.join(folderPath, file.name);
        const stat = await fs.promises.stat(filePath);
        return {
          fileName: path.basename(filePath),
          fileSize: stat.size,
        };
      }
    });
    const fileStats = await Promise.all(fileStatsPromises);

    fileStats.forEach((fileStat) => {
      if (fileStat) {
        console.log(
          `${fileStat.fileName.split('.')[0]} - ${
            fileStat.fileName.split('.')[1]
          } - ${fileStat.fileSize}b`,
        );
      }
    });
  } catch (error) {
    console.log(error.message);
  }
})();
