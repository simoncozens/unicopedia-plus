// Write CLDR Annotations to File
const fs = require ('fs');
const path = require ('path');
const { app } = require ('electron').remote;
const annotations = require ('./lib/unicode/get-cldr-annotations.js') ('en.xml');
const jsonFile = path.join (app.getPath ('desktop'), 'cldr-annotations.json');
fs.writeFileSync (jsonFile, $.stringify (annotations, null, 4));
$.writeln (`Wrote CLDR annotations to JSON file:\n${jsonFile}`);
