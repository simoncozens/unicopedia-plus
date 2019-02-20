// Compare kKangXi with kIRGKangXi
const { codePoints, coreSet, fullSet } = require ('./lib/unicode/parsed-unihan-data.js');
let set = fullSet;
let diffs = [ ];
set.forEach
(
    codePoint =>
    {
        let { kKangXi, kIRGKangXi } = codePoints[codePoint];
        if (kKangXi && kIRGKangXi && (kKangXi !== kIRGKangXi))
        {
            let character = String.fromCodePoint (parseInt (codePoint.replace ("U+", ""), 16));
             diffs.push (`${character}\t${codePoint}\t${kKangXi}\t${kIRGKangXi}`);
        }
    }
);
$.writeln (`Found ${diffs.length} conflicts`);
diffs.forEach (diff => $.writeln (diff));
