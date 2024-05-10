// compress.js
const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');
// create a new instance of AdmZip
const zip = new AdmZip();

try {
  // get the list of files and directories in the Backend directory
  const filesAndDirs = fs.readdirSync(path.join(__dirname, '../Backend'));
  console.log('Files and directories in the Backend directory:', filesAndDirs);

  // iterate over the files and directories
  for (const fileOrDir of filesAndDirs) {
    // if it's not the node_modules directory, add it to the zip file
    if (fileOrDir !== 'node_modules') {
      const fullPath = path.join(__dirname, '../Backend', fileOrDir);
      console.log('Processing:', fullPath);

      // check if it's a file or a directory
      if (fs.lstatSync(fullPath).isDirectory()) {
        // if it's a directory, add it to the zip file
        zip.addLocalFolder(fullPath, fileOrDir);
        console.log('Added directory to zip:', fullPath);
      } else {
        // if it's a file, add it to the zip file
        zip.addLocalFile(fullPath);
        console.log('Added file to zip:', fullPath);
      }
    }
  }

  // write the zip file to disk
  const zipPath = path.join(__dirname, '../Backend.zip');
  zip.writeZip(zipPath);
  console.log('Zip file written to:', zipPath);
} catch (error) {
  console.error('An error occurred:', error);
}