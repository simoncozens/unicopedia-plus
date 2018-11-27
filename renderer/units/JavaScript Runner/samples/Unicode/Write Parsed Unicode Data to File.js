// Write Parsed Unicode Data to File
const fs = require ('fs');
const path = require ('path');
const { app } = require ('electron').remote;
const unicodeData = require ('./lib/unicode/parsed-unicode-data.js');
const jsonFile = path.join (app.getPath ('desktop'), 'unicode-data.json');
if (confirm ("The parsed Unicode data JSON file is more than 100 Megabytes. Proceed anyway?"))
{
    let start = window.performance.now ();
    fs.writeFileSync (jsonFile, JSON.stringify (unicodeData, null, 4));
    let stop = window.performance.now ();
    $.writeln (`Wrote parsed Unicode data to JSON file in ${((stop - start) / 1000).toFixed (2)} seconds:\n${jsonFile}`);
}
