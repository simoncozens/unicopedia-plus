// Write Unihan Data to Property Files
let start = window.performance.now ();
const fs = require ('fs');
const path = require ('path');
const { app } = require ('electron').remote;
const { codePoints, fullSet } = require ('./lib/unicode/parsed-unihan-data.js');
const properties = { };
for (let codePoint of fullSet)
{
    let dataProperties = codePoints[codePoint];
    for (let property in dataProperties)
    {
        if (!(property in properties))
        {
            properties[property] = { };
        }
        properties[property][codePoint] = dataProperties[property];
    }
}
const jsonDirectory = path.join (app.getPath ('desktop'), 'unihan-data');
if (!fs.existsSync (jsonDirectory))
{
    fs.mkdirSync (jsonDirectory);
}
let jsonFiles = [ ];
for (let property in properties)
{
    const jsonFile = path.join (jsonDirectory, `${property}.json`);
    fs.writeFileSync (jsonFile, $.stringify (properties[property], null, 4));
    jsonFiles.push (jsonFile);
}
let stop = window.performance.now ();
$.writeln (`Wrote Unihan data to JSON property files in ${((stop - start) / 1000).toFixed (2)} seconds:`);
jsonFiles.forEach (jsonFile => { $.writeln (jsonFile); });
