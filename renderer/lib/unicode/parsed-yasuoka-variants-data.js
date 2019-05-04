//
const fs = require ('fs');
const path = require ('path');
//
let characters = { };
//
// Copy of UniVariants.txt contained in http://kanji.zinbun.kyoto-u.ac.jp/~yasuoka/ftp/CJKtable/UniVariants.Z
let lines = fs.readFileSync (path.join (__dirname, 'Yasuoka', 'UniVariants.txt'), { encoding: 'ascii' }).split ('\n');
for (let line of lines)
{
    if (line && (line[0] !== '#'))
    {
        let fields = line.split ('\t');
        let character = String.fromCodePoint (parseInt (fields[0], 16));
        characters[character] = fields[1].split (' ').map (code => String.fromCodePoint (parseInt (code, 16)));
    }
}
//
module.exports = characters;
//
