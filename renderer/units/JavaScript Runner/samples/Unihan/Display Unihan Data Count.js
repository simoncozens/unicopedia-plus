// Display Unihan Data Count
const { codePoints } = require ('./lib/unicode/parsed-unihan-data.js');
return `Unihan Data Count: ${Object.keys (codePoints).length}`;
