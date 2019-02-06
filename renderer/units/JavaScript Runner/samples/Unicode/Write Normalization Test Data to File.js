// Write Normalization Test Data to File
const fs = require ('fs');
const path = require ('path');
const { app } = require ('electron').remote;
const normalizationTestData = require ('./lib/unicode/parsed-normalization-test-data.js');
const jsonFile = path.join (app.getPath ('desktop'), 'normalization-test-data.json');
let start = window.performance.now ();
fs.writeFileSync (jsonFile, $.stringify (normalizationTestData, null, 4));
let stop = window.performance.now ();
$.writeln (`Wrote parsed normalization test data to JSON file in ${((stop - start) / 1000).toFixed (2)} seconds:\n${jsonFile}`);
