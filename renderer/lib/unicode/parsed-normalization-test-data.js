//
const fs = require ('fs');
const path = require ('path');
//
let lines;
let currentData;
//
let normalizationTestData = [ ];
//
function fieldToString (field)
{
    let codePoints = field.trim ().split (' ');
    let string = "";
    for (let codePoint of codePoints)
    {
        string += String.fromCodePoint (parseInt (codePoint, 16));
    }
    return string;
}
// Copy of https://www.unicode.org/Public/UNIDATA/NormalizationTest.txt
lines = fs.readFileSync (path.join (__dirname, 'UNIDATA', 'NormalizationTest.txt'), { encoding: 'utf8' }).split ('\n');
for (let line of lines)
{
    if (line && (line[0] !== '#'))
    {
        if (line[0] === '@')
        {
            let found = line.match (/@Part(\d+)/);
            currentData = normalizationTestData[parseInt (found[1])] = { };
        }
        else
        {
            let fields = line.split (';');
            let source = fieldToString (fields[0]);
            let nfc = fieldToString (fields[1]);
            let nfd = fieldToString (fields[2]);
            let nfkc = fieldToString (fields[3]);
            let nfkd = fieldToString (fields[4]);
            currentData[source] = { nfc, nfd, nfkc, nfkd };
        }
    }
}
//
module.exports = normalizationTestData;
//
