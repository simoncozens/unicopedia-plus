// Write Unihan Data to File
let start = window.performance.now ();
const fs = require ('fs');
const path = require ('path');
const { app } = require ('electron').remote;
const { codePoints, fullSet } = require ('./lib/unicode/parsed-unihan-data.js');
let sortedCodePoints = { };
fullSet.forEach (codePoint => { sortedCodePoints[codePoint] = codePoints[codePoint]; });
const jsonFile = path.join (app.getPath ('desktop'), 'unihan-data.json');
fs.writeFileSync (jsonFile, JSON.stringify (sortedCodePoints, null, 4));
let stop = window.performance.now ();
$.writeln (`Wrote Unihan data to JSON file in ${((stop - start) / 1000).toFixed (2)} seconds:\n${jsonFile}`);
