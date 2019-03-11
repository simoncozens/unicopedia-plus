// Display Unihan Data Count
const { fullSet, coreSet } = require ('./lib/unicode/parsed-unihan-data.js');
$.writeln (`Unihan Full Set Count: ${fullSet.length}`);
$.writeln (`Unihan IICore Set Count: ${coreSet.length}`);
