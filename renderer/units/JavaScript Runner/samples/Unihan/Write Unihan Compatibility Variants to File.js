// Write Unihan Compatibility Variants to File
const fs = require ('fs');
const path = require ('path');
const { app } = require ('electron').remote;
let compatibilityVariants = require ('./lib/unicode/get-cjk-compatibility-variants.js');;
let sortedCompatibilityVariants = { };
let sortedCharacters = Object.keys (compatibilityVariants).sort ((a, b) => a.codePointAt (0) - b.codePointAt (0));
for (let character of sortedCharacters)
{
     let variants = compatibilityVariants[character];
     sortedCompatibilityVariants[character] = (variants.length === 1) ? variants[0] : variants;
}
const jsonFile = path.join (app.getPath ('desktop'), 'unihan-compatibility-variants.json');
fs.writeFileSync (jsonFile, $.stringify (sortedCompatibilityVariants, null, 4));
$.writeln (`Wrote Unihan compatibility variants to JSON file:\n${jsonFile}`);
