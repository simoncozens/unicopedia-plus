//
const fs = require ('fs');
const path = require ('path');
//
let codePoints = { };
//
// Copy of UniVariants.txt contained in http://kanji.zinbun.kyoto-u.ac.jp/~yasuoka/ftp/CJKtable/UniVariants.Z
let lines = fs.readFileSync (path.join (__dirname, 'UniVariants.txt'), { encoding: 'ascii' }).split ('\n');
for (let line of lines)
{
    if ((line) && (line[0] !== '#'))
    {
        let fields = line.split ('\t');
        let code = `U+${fields[0]}`;
        codePoints[code] = fields[1].split (' ').map (aliasCode => `U+${aliasCode}`);
    }
}
//
module.exports = codePoints;
//
