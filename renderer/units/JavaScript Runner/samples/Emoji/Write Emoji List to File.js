// Write Emoji List to File
const fs = require ('fs');
const path = require ('path');
const { app } = require ('electron').remote;
const emojiTestList = require ('emoji-test-list');
const jsonFile = path.join (app.getPath ('desktop'), 'emoji-list.json');
fs.writeFileSync (jsonFile, $.stringify (emojiTestList, null, 4));
return `Wrote emoji list to JSON file:\n${jsonFile}`;
