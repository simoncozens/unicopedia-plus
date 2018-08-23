// Write Parsed Unicode Data to File
const fs = require ('fs');
const path = require ('path');
const { app } = require ('electron').remote;
const parsedUnicodeData = require ('./lib/unicode/parsed-unicode-data.js');
const jsonFile = path.join (app.getPath ('desktop'), 'unicode-data.json');
fs.writeFileSync (jsonFile, $.stringify (parsedUnicodeData, null, 4));
return `Wrote Unicode data to JSON file: ${jsonFile}`;
