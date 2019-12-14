//
// https://www.unicode.org/versions/Unicode12.1.0/ch04.pdf
//
/*
Table 4-8. Name Derivation Rule Prefix Strings
----------------------------------------------------------------
Range               Rule        Prefix String
----------------------------------------------------------------
AC00..D7A3          NR1         “HANGUL SYLLABLE”
3400..4DB5          NR2         “CJK UNIFIED IDEOGRAPH-”
4E00..9FEA          NR2         “CJK UNIFIED IDEOGRAPH-”
20000..2A6D6        NR2         “CJK UNIFIED IDEOGRAPH-”
2A700..2B734        NR2         “CJK UNIFIED IDEOGRAPH-”
2B740..2B81D        NR2         “CJK UNIFIED IDEOGRAPH-”
2B820..2CEA1        NR2         “CJK UNIFIED IDEOGRAPH-”
2CEB0..2EBE0        NR2         “CJK UNIFIED IDEOGRAPH-”
17000..187EC        NR2         “TANGUT IDEOGRAPH-”
1B170..1B2FB        NR2         “NUSHU CHARACTER-”
F900..FA6D*         NR2         “CJK COMPATIBILITY IDEOGRAPH-”
FA70..FAD9          NR2         “CJK COMPATIBILITY IDEOGRAPH-”
2F800..2FA1D        NR2         “CJK COMPATIBILITY IDEOGRAPH-”
----------------------------------------------------------------
*/
//
// Note: names could have also been obtained more directly by using the relevant data file:
// https://www.unicode.org/Public/UNIDATA/extracted/DerivedName.txt
//
const fs = require ('fs');
const path = require ('path');
//
// https://www.unicode.org/Public/5.1.0/ucd/UCD.html
// https://www.unicode.org/reports/tr44/
//
let lines;
//
let codePoints = { };
//
let firstIndex;
let lastIndex;
let rangeName;
//
// Copy of https://www.unicode.org/Public/UNIDATA/UnicodeData.txt
lines = fs.readFileSync (path.join (__dirname, 'UNIDATA', 'UnicodeData.txt'), { encoding: 'ascii' }).split ("\n");
for (let line of lines)
{
    if (line)
    {
        let fields = line.split (";");
        let found;
        if (found = fields[1].match (/^<(.+), First>$/))
        {
            firstIndex = parseInt (fields[0], 16);
            rangeName = found[1];
        }
        else if (found = fields[1].match (/^<(.+), Last>$/))
        {
            lastIndex = parseInt (fields[0], 16);
            if (rangeName !== found[1]) console.log ("[UnicodeData] rangeName mismatch:", rangeName, found[1]);
            for (let index = firstIndex; index <= lastIndex; index++)
            {
                let code = index.toString (16).toUpperCase ().padStart (4, "0");
                let name = "";
                let decomposition = "";
                if (rangeName === "Hangul Syllable")
                {
                    // "Hangul" in "UTR #15: Unicode Normalization Forms"
                    // https://www.unicode.org/reports/tr15/tr15-33.html#Hangul
                    // "Conjoining Jamo Behavior" in "The Unicode Standard, Version 12.1 - ch03.pdf" p. 144
                    // https://www.unicode.org/versions/Unicode12.1.0/ch03.pdf
                    let jamoInitials =
                    [
                        "G", "GG", "N", "D", "DD", "R", "M", "B", "BB",
                        "S", "SS", "", "J", "JJ", "C", "K", "T", "P", "H"
                    ];
                    let jamoMedials =
                    [
                        "A", "AE", "YA", "YAE", "EO", "E", "YEO", "YE", "O",
                        "WA", "WAE", "OE", "YO", "U", "WEO", "WE", "WI",
                        "YU", "EU", "YI", "I"
                    ];
                    let jamoFinals =
                    [
                        "", "G", "GG", "GS", "N", "NJ", "NH", "D", "L", "LG", "LM",
                        "LB", "LS", "LT", "LP", "LH", "M", "B", "BS",
                        "S", "SS", "NG", "J", "C", "K", "T", "P", "H"
                    ];
                    let s = index - firstIndex;
                    let n = jamoMedials.length * jamoFinals.length;
                    let t = jamoFinals.length;
                    let i = Math.floor (s / n);
                    let m = Math.floor ((s % n) / t);
                    let f = Math.floor (s % t);
                    name = rangeName.toUpperCase () + " " + jamoInitials[i] + jamoMedials[m] + jamoFinals[f];
                    decomposition =
                        (0x1100 + i).toString (16).toUpperCase () + " " +
                        (0x1161 + m).toString (16).toUpperCase () +
                        (f > 0 ? " " + (0x11A7 + f).toString (16).toUpperCase () : "");
                }
                else
                {
                    let character = String.fromCodePoint (index);
                    if (/\p{Unified_Ideograph}/u.test (character))
                    {
                        name = "CJK UNIFIED IDEOGRAPH-" + code;
                    }
                    else if (/\p{Private_Use}/u.test (character))
                    {
                        name = "PRIVATE USE-" + code;
                    }
                    else if (/\p{Surrogate}/u.test (character))
                    {
                        name = "SURROGATE-" + code;
                    }
                    else
                    {
                        name = rangeName.toUpperCase () + "-" + code;
                    }
                }
                codePoints[`U+${code}`] =
                {
                    code: code,
                    name: name,
                    category: fields[2],
                    combining: fields[3],
                    bidi: fields[4],
                    decomposition: decomposition || fields[5],
                    decimal: fields[6],
                    digit: fields[7],
                    numeric: fields[8],
                    mirrored: fields[9],
                    alias: fields[10],
                    comment: fields[11],
                    uppercase: fields[12],
                    lowercase: fields[13],
                    titlecase: fields[14]
                };
            }
        }
        else
        {
            codePoints[`U+${fields[0]}`] =
            {
                code: fields[0],
                name: fields[1],
                category: fields[2],
                combining: fields[3],
                bidi: fields[4],
                decomposition: fields[5],
                decimal: fields[6],
                digit: fields[7],
                numeric: fields[8],
                mirrored: fields[9],
                alias: fields[10],
                comment: fields[11],
                uppercase: fields[12],
                lowercase: fields[13],
                titlecase: fields[14]
            };
        }
    }
}
//
// Copy of https://www.unicode.org/Public/UNIDATA/NameAliases.txt
lines = fs.readFileSync (path.join (__dirname, 'UNIDATA', 'NameAliases.txt'), { encoding: 'ascii' }).split ("\n");
for (let line of lines)
{
    if (line && (line[0] !== "#"))
    {
        let fields = line.split (";");
        let code = fields[0];
        let alias = fields[1];
        let type = fields[2];
        let data = codePoints[`U+${code}`];
        if (type in data)
        {
            if (!Array.isArray (data[type]))
            {
                data[type] = [ data[type] ];
            }
            data[type].push (alias);
        }
        else
        {
            data[type] = alias;
        }
    }
}
//
let foldingStatus =
{
    "C": "<common>",
    "F": "<full>",
    "S": "<simple>",
    "T": "<special>"
};
//
// Copy of https://www.unicode.org/Public/UNIDATA/CaseFolding.txt
lines = fs.readFileSync (path.join (__dirname, 'UNIDATA', 'CaseFolding.txt'), { encoding: 'ascii' }).split ("\n");
for (let line of lines)
{
    if (line && (line[0] !== "#"))
    {
        let fields = line.split (";");
        let code = fields[0].trim ();
        let status = fields[1].trim ();
        let mapping = fields[2].trim ();
        let data = codePoints[`U+${code}`];
        if (!("foldings" in data))
        {
            data.foldings = [ ];
        }
        data.foldings.push (`${foldingStatus[status]} ${mapping}`);
    }
}
//
module.exports = codePoints;
//
