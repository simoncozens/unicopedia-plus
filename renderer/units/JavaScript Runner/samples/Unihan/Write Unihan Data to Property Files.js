// Write Unihan Data to Property Files
const fs = require ('fs');
const path = require ('path');
const { app } = require ('electron').remote;
const { codePoints } = require ('./lib/unicode/parsed-unihan-data.js');
const properties = { };
for (let codePoint in codePoints)
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
for (let property in properties)
{
    const jsonFile = path.join (jsonDirectory, `${property}.json`);
    fs.writeFileSync (jsonFile, $.stringify (properties[property], null, 4));
    $.writeln (`Wrote Unihan property data to JSON file:\n${jsonFile}`);
}
