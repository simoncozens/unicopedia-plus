// Test Unihan Data Regex
const unihanData = require ('./lib/unicode/parsed-unihan-data.js');
let unihanCharacters = Object.keys (unihanData).map (codePoint => String.fromCodePoint (parseInt (codePoint.replace ("U+", ""), 16))).sort ();
$.writeln (unihanCharacters.length);
let pattern = '(?=\\p{Script=Han})(?=\\p{Other_Letter})';
let flags = 'u';
let rewritePattern = require ('regexpu-core');
pattern = rewritePattern (pattern, flags, { unicodePropertyEscape: true, useUnicodeFlag: true });
let regex = new RegExp (pattern, flags);
const unicodeData = require ('./lib/unicode/parsed-unicode-data.js');
let unicodeCharacters = Object.keys (unicodeData).map (codePoint => String.fromCodePoint (parseInt (codePoint.replace ("U+", ""), 16))).sort ();
$.writeln (unicodeCharacters.length);
let matchingCharacters = unicodeCharacters.filter (character => regex.test (character));
$.writeln (matchingCharacters.length);
$.writeln (JSON.stringify (unihanCharacters) === JSON.stringify (matchingCharacters));
