// Test Unihan Data Regex
const { codePoints } = require ('./lib/unicode/parsed-unihan-data.js');
const unicodeData = require ('./lib/unicode/parsed-unicode-data.js');
const regexUnicode = require ('./lib/regex-unicode.js');
let unihanCharacters = Object.keys (codePoints).map (codePoint => String.fromCodePoint (parseInt (codePoint.replace ("U+", ""), 16))).sort ();
$.writeln (unihanCharacters.length);
let unihanRegex = regexUnicode.build ('(?=\\p{Script=Han})(?=\\p{Other_Letter})', { useRegex: true });
let unicodeCharacters = Object.keys (unicodeData).map (codePoint => String.fromCodePoint (parseInt (codePoint.replace ("U+", ""), 16))).sort ();
$.writeln (unicodeCharacters.length);
let matchingCharacters = unicodeCharacters.filter (character => unihanRegex.test (character));
$.writeln (matchingCharacters.length);
$.writeln (JSON.stringify (unihanCharacters) === JSON.stringify (matchingCharacters));
