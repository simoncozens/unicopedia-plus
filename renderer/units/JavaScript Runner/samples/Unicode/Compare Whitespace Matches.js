// Compare Whitespace Matches
const unicodeData = require ('./lib/unicode/parsed-unicode-data.js');
const spaceRegex = /\s/u;
const whiteSpaceRegex = /\p{White_Space}/u;
const spaceNotWhiteSpaceRegex = /(?=\s)(?!\p{White_Space})/u;
const whiteSpaceNotSpaceRegex = /(?=\p{White_Space})(?!\s)/u;
let spaceMatches = [ ];
let whiteSpaceMatches = [ ];
let spaceNotWhiteSpaceMatches = [ ];
let whiteSpaceNotSpaceMatches = [ ];
for (let codePoint in unicodeData)
{
    let character = String.fromCodePoint (parseInt (codePoint.replace ("U+", ""), 16));
    if (character.match (spaceRegex))
    {
        spaceMatches.push (codePoint);
    }
    if (character.match (whiteSpaceRegex))
    {
        whiteSpaceMatches.push (codePoint);
    }
    if (character.match (spaceNotWhiteSpaceRegex))
    {
        spaceNotWhiteSpaceMatches.push (codePoint);
    }
    if (character.match (whiteSpaceNotSpaceRegex))
    {
        whiteSpaceNotSpaceMatches.push (codePoint);
    }
}
$.writeln (`${spaceRegex} → `);
$.writeln ($.stringify (spaceMatches));
$.writeln (`${whiteSpaceRegex} → `);
$.writeln ($.stringify (whiteSpaceMatches));
$.writeln ();
$.write (`${spaceNotWhiteSpaceRegex} → `);
$.writeln ($.stringify (spaceNotWhiteSpaceMatches));
$.write (`${whiteSpaceNotSpaceRegex} → `);
$.writeln ($.stringify (whiteSpaceNotSpaceMatches));
