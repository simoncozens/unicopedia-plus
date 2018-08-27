// Write Parsed Emoji Data to File
const fs = require ('fs');
const path = require ('path');
const { app } = require ('electron').remote;
const parsedEmojiData = require ('./lib/unicode/parsed-emoji-data.js');
const jsonFile = path.join (app.getPath ('desktop'), 'emoji-data.json');
fs.writeFileSync (jsonFile, $.stringify (parsedEmojiData, null, 4));
return `Wrote parsed emoji data to JSON file:\n${jsonFile}`;
