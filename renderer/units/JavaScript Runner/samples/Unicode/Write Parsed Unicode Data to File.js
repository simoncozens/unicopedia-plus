// Write Parsed Unicode Data to File
const fs = require ('fs');
const path = require ('path');
const { app } = require ('electron').remote;
const parsedUnicodeData = require ('./lib/unicode/parsed-unicode-data.js');
const jsonFile = path.join (app.getPath ('desktop'), 'unicode-data.json');
if (confirm ("The parsed Unicode data file is more than 100 Megabytes. Proceed anyway?"))
{
    fs.writeFileSync (jsonFile, JSON.stringify (parsedUnicodeData, null, 4));
    $.write (`Wrote parsed Unicode data to JSON file:\n${jsonFile}`);
}
