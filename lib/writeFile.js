const fs = require('fs');

const writeFile = (fileName, content) =>
  new Promise((resolve, reject) => {
    fs.writeFile(fileName, JSON.stringify(content), err => {
      if (err) {
        reject(err);
        return;
      }

      resolve(true);
    });
  });

module.exports = writeFile;
