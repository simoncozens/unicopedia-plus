// Write Emoji Groups to File
const fs = require ('fs');
const path = require ('path');
const { app } = require ('electron').remote;
const emojiGroups = require ('emoji-test-groups');
const jsonFile = path.join (app.getPath ('desktop'), 'emoji-groups.json');
fs.writeFileSync (jsonFile, $.stringify (emojiGroups, null, 4));
return `Wrote emoji groups to JSON file:\n${jsonFile}`;
