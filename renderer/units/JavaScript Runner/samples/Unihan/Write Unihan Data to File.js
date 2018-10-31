// Write Unihan Data to File
const fs = require ('fs');
const path = require ('path');
const { app } = require ('electron').remote;
const unihanData = require ('./lib/unicode/parsed-unihan-data.js');
const jsonFile = path.join (app.getPath ('desktop'), 'unihan-data.json');
fs.writeFileSync (jsonFile, JSON.stringify (unihanData, null, 4));
return `Wrote Unihan data to JSON file:\n${jsonFile}`;
