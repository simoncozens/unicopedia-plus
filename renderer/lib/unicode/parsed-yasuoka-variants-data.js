//
const fs = require ('fs');
const path = require ('path');
//
let codePoints = { };
//
// Copy of UniVariants.txt contained in http://kanji.zinbun.kyoto-u.ac.jp/~yasuoka/ftp/CJKtable/UniVariants.Z
let lines = fs.readFileSync (path.join (__dirname, 'Yasuoka', 'UniVariants.txt'), { encoding: 'ascii' }).split ("\n");
for (let line of lines)
{
    if (line && (line[0] !== "#"))
    {
        let fields = line.split ("\t");
        codePoints[`U+${fields[0]}`] = fields[1].split (" ").map (code => `U+${code}`);
    }
}
//
module.exports = codePoints;
//
