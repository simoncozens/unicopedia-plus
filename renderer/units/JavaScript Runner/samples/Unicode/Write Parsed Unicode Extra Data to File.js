// Write Parsed Unicode Extra Data to File
const fs = require ('fs');
const path = require ('path');
const { app } = require ('electron').remote;
const extraData = require ('./lib/unicode/parsed-extra-data.js');
const jsonFile = path.join (app.getPath ('desktop'), 'unicode-extra-data.json');
fs.writeFileSync (jsonFile, JSON.stringify (extraData, null, 4));
$.write (`Wrote parsed Unicode extra data to JSON file:\n${jsonFile}`);
