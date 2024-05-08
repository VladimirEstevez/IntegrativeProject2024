// compress.js
const AdmZip = require('adm-zip');
const path = require('path');

// create a new instance of AdmZip
const zip = new AdmZip();

// add the build directory to the zip file
zip.addLocalFolder(path.join(__dirname, '../Backend'));

// write the zip file to disk
zip.writeZip(path.join(__dirname, '../Backend.zip'));