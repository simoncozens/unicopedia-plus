// Write Parsed Numeric Values Data to File
const characters = require ('./lib/unicode/parsed-numeric-values-data.js');
const fs = require ('fs');
const path = require ('path');
const { app } = require ('electron').remote;
const jsonFile = path.join (app.getPath ('desktop'), 'numeric-values-data.json');
fs.writeFileSync (jsonFile, $.stringify (characters, null, 4));
$.writeln (`Wrote parsed numeric values data to JSON file:\n${jsonFile}`);
