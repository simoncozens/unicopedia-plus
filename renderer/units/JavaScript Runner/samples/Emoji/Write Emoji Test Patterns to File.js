// Write Emoji Test Patterns to File
const fs = require ('fs');
const path = require ('path');
const { app } = require ('electron').remote;
const emojiTestPatterns = require ('emoji-test-patterns');
const jsonFile = path.join (app.getPath ('desktop'), 'emoji-test-patterns.json');
fs.writeFileSync (jsonFile, $.stringify (emojiTestPatterns, null, 4));
return `Wrote emoji test patterns to JSON file:\n${jsonFile}`;
