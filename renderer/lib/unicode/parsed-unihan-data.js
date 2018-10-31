//
// https://www.unicode.org/reports/tr38/
//
// All data in the Unihan database is stored in UTF-8 using Normalization Form C (NFC). 
// Note, however, that the "Syntax" descriptions below, used for validation of field values, 
// operate on Normalization Form D (NFD), primarily because that makes the regular expressions simpler.
//
const properties =
{
    "kAccountingNumeric":
    {
        "category": "Numeric Values",
        "syntax": "[0-9]+"
    },
    "kBigFive":
    {
        "category": "Other Mappings",
        "syntax": "[0-9A-F]{4}"
    },
    "kCangjie":
    {
        "category": "Dictionary-like Data",
        "syntax": "[A-Z]+"
    },
    "kCantonese":
    {
        "category": "Readings",
        "delimiter": " ",
        "syntax": "[a-z]{1,6}[1-6]"
    },
    "kCCCII":
    {
        "category": "Other Mappings",
        "delimiter": " ",   // ??
        "syntax": "[0-9A-F]{6}"
    },
    "kCheungBauer":
    {
        "category": "Dictionary-like Data",
        "delimiter": " ",   // ??
        "syntax": "[0-9]{3}\\/[0-9]{2};[A-Z]*;[a-z1-6\\[\\]\\/,]+"
    },
    "kCheungBauerIndex":
    {
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[0-9]{3}\\.[01][0-9]"
    },
    "kCihaiT":
    {
        "category": "Dictionary-like Data",
        "delimiter": " ",
        "syntax": "[1-9][0-9]{0,3}\\.[0-9]{3}"
    },
    "kCNS1986":
    {
        "category": "Other Mappings",
        "syntax": "[12E]-[0-9A-F]{4}"
    },
    "kCNS1992":
    {
        "category": "Other Mappings",
        "syntax": "[1-9]-[0-9A-F]{4}"
    },
    "kCompatibilityVariant":
    {
        "category": "Variants", // "IRG Sources" ??
        "syntax": "U\\+2?[0-9A-F]{4}"
    },
    "kCowles":
    {
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[0-9]{1,4}(\\.[0-9]{1,2})?"
    },
    "kDaeJaweon":
    {
        "category": "Dictionary Indices",
        "syntax": "[0-9]{4}\\.[0-9]{2}[01]"
    },
    "kDefinition":
    {
        "category": "Readings",
        "syntax": "[^\\t\"]+"
    },
    "kEACC":
    {
        "category": "Other Mappings",
        "syntax": "[0-9A-F]{6}"
    },
    "kFenn":
    {
        "category": "Dictionary-like Data",
        "delimiter": " ",
        "syntax": "[0-9]+a?[A-KP*]"
    },
    "kFennIndex":
    {
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[0-9][0-9]{0,2}\\.[01][0-9]"
    },
    "kFourCornerCode":
    {
        "category": "Dictionary-like Data",
        "delimiter": " ",
        "syntax": "[0-9]{4}(\\.[0-9])?"
    },
    "kFrequency":
    {
        "category": "Dictionary-like Data",
        "syntax": "[1-5]"
    },
    "kGB0":
    {
        "category": "Other Mappings",
        "syntax": "[0-9]{4}"
    },
    "kGB1":
    {
        "category": "Other Mappings",
        "syntax": "[0-9]{4}"
    },
    "kGB3":
    {
        "category": "Other Mappings",
        "syntax": "[0-9]{4}"
    },
    "kGB5":
    {
        "category": "Other Mappings",
        "syntax": "[0-9]{4}"
    },
    "kGB7":
    {
        "category": "Other Mappings",
        "syntax": "[0-9]{4}"
    },
    "kGB8":
    {
        "category": "Other Mappings",
        "syntax": "[0-9]{4}"
    },
    "kGradeLevel":
    {
        "category": "Dictionary-like Data",
        "syntax": "[1-6]"
    },
    "kGSR":
    {
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[0-9]{4}[a-vx-z]'?"
    },
    "kHangul":
    {
        "category": "Readings",
        "delimiter": " ",
        "syntax": "[\\u{1100}-\\u{1112}][\\u{1161}-\\u{1175}][\\u{11A8}-\\u{11C2}]?:[01EN]{1,3}"
    },
    "kHanYu":
    {
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[1-8][0-9]{4}\\.[0-3][0-9][0-3]"
    },
    "kHanyuPinlu":
    {
        "category": "Readings",
        "delimiter": " ",
        "syntax": "[a-z\\u{300}-\\u{302}\\u{304}\\u{308}\\u{30C}]+\\([0-9]+\\)"
    },
    "kHanyuPinyin":
    {
        "category": "Readings",
        "delimiter": " ",
        "syntax": "(\\d{5}\\.\\d{2}0,)*\\d{5}\\.\\d{2}0:([a-z\\u{300}-\\u{302}\\u{304}\\u{308}\\u{30C}]+,)*[a-z\\u{300}-\\u{302}\\u{304}\\u{308}\\u{30C}]+"
    },
    "kHDZRadBreak":
    {
        "category": "Dictionary-like Data",
        "syntax": "[\\u{2F00}-\\u{2FD5}]\\[U\\+2F[0-9A-D][0-9A-F]\\]:[1-8][0-9]{4}\\.[0-3][0-9]0"
    },
    "kHKGlyph":
    {
        "category": "Dictionary-like Data",
        "delimiter": " ",   // ??
        "syntax": "[0-9]{4}"
    },
    "kHKSCS":
    {
        "category": "Other Mappings",
        "syntax": "[0-9A-F]{4}"
    },
    "kIBMJapan":
    {
        "category": "Other Mappings",
        "delimiter": " ",
        "syntax": "F[ABC][0-9A-F]{2}"
    },
    "kIICore":
    {
        "category": "IRG Sources",
        "delimiter": " ",   // ??
        "syntax": "[ABC][GHJKMPT]{1,7}"
    },
    "kIRGDaeJaweon":
    {
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[0-9]{4}\\.[0-9]{2}[01]"
    },
    "kIRGDaiKanwaZiten":
    {
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[0-9]{5}'?"
    },
    "kIRGHanyuDaZidian":
    {
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[1-8][0-9]{4}\\.[0-3][0-9][01]"
    },
    "kIRGKangXi":
    {
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[01][0-9]{3}\\.[0-7][0-9][01]"
    },
    "kIRG_GSource":
    {
        "category": "IRG Sources",
        "syntax": "G(4K|BK|CH|CY|FZ|HC|HZ|((BK|CH|CY|DZ|GH|HC|RM|WZ|XC|XH|ZH)-[0-9]{4}\\.[0-9]{2})|HZ-[0-9]{5}\\.[0-9]{2}|(KX-[01][0-9]{3}\\.1?[0-9]{2})|((CYY|FZ|JZ|ZFY|ZJW)-[0-9]{5})|([0135789ES]-[0-9A-F]{4})|(XHZ-[0-9]{3})|(PGLG-[0-9]{4})|(IDC-[0-9]{3})|(K-[0-9A-F]{4})|((OCD|CE)-\\d{3})|(H-\\d{4})|(H-\\d{7})|(LGYJ-\\d{4})|(ZYS-\\d{5})|(Z-\\d{4})|(Z-\\d{7})|(G?F[CZ]-\\d{3,6}))"
    },
    "kIRG_HSource":
    {
        "category": "IRG Sources",
        "syntax": "H(-[0-9A-F]{4,5}|(B[012]|D)-[0-9A-F]{4})"
    },
    "kIRG_JSource":
    {
        "category": "IRG Sources",
        "syntax": "J1?((([0134AK]|A[34]|3A|ARIB|MJ)-[0-9A-F]{4,6})|(H-(((IB|JT|[0-9]{2})[0-9A-F]{4}S?))))"
    },
    "kIRG_KPSource":
    {
        "category": "IRG Sources",
        "syntax": "KP[01]-[0-9A-F]{4}"
    },
    "kIRG_KSource":
    {
        "category": "IRG Sources",
        "syntax": "K([0-5]-[0-9A-F]{4}|C-[0-9]{5})"
    },
    "kIRG_MSource":
    {
        "category": "IRG Sources",
        "syntax": "MAC-[0-9]{5}"
    },
    "kIRG_TSource":
    {
        "category": "IRG Sources",
        "syntax": "T[1-7B-F]-[0-9A-F]{4}"
    },
    "kIRG_USource":
    {
        "category": "IRG Sources",
        "syntax": "U(TC|CI|K|SAT)-[0-9]{5}"
    },
    "kIRG_VSource":
    {
        "category": "IRG Sources",
        "syntax": "V[0-4U]-[02]?[0-9A-F]{4}"
    },
    "kJa":
    {
        "category": "Other Mappings",
        "delimiter": " ",
        "syntax": "[0-9A-F]{4}S?"
    },
    "kJapaneseKun":
    {
        "category": "Readings",
        "delimiter": " ",
        "syntax": "[A-Z]+"
    },
    "kJapaneseOn":
    {
        "category": "Readings",
        "delimiter": " ",
        "syntax": "[A-Z]+"
    },
    "kJinmeiyoKanji":
    {
        "category": "Other Mappings",
        "delimiter": " ",
        "syntax": "(20[0-9]{2})(:U\\+2?[0-9A-F]{4})?"
    },
    "kJis0":
    {
        "category": "Other Mappings",
        "delimiter": " ",
        "syntax": "[0-9]{4}"
    },
    "kJIS0213":
    {
        "category": "Other Mappings",
        "delimiter": " ",
        "syntax": "[12],[0-9]{2},[0-9]{1,2}"
    },
    "kJis1":
    {
        "category": "Other Mappings",
        "delimiter": " ",
        "syntax": "[0-9]{4}"
    },
    "kJoyoKanji":
    {
        "category": "Other Mappings",
        "delimiter": " ",
        "syntax": "(20[0-9]{2})|(U\\+2?[0-9A-F]{4})"
    },
    "kKangXi":
    {
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[0-9]{4}\\.[0-9]{2}[01]"
    },
    "kKarlgren":
    {
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[1-9][0-9]{0,3}[A*]?"
    },
    "kKorean":
    {
        "category": "Readings",
        "delimiter": " ",
        "syntax": "[A-Z]+"
    },
    "kKoreanEducationHanja":
    {
        "category": "Other Mappings",
        "delimiter": " ",   // ??
        "syntax": "20[0-9]{2}"
    },
    "kKoreanName":
    {
        "category": "Other Mappings",
        "delimiter": " ",   // ??
        "syntax": "(20[0-9]{2})(:U\\+2?[0-9A-F]{4})*"
    },
    "kKPS0":
    {
        "category": "Other Mappings",
        "delimiter": " ",   // ??
        "syntax": "[0-9A-F]{4}"
    },
    "kKPS1":
    {
        "category": "Other Mappings",
        "delimiter": " ",   // ??
        "syntax": "[0-9A-F]{4}"
    },
    "kKSC0":
    {
        "category": "Other Mappings",
        "delimiter": " ",   // ??
        "syntax": "[0-9]{4}"
    },
    "kKSC1":
    {
        "category": "Other Mappings",
        "delimiter": " ",   // ??
        "syntax": "[0-9]{4}"
    },
    "kLau":
    {
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[1-9][0-9]{0,3}"
    },
    "kMainlandTelegraph":
    {
        "category": "Other Mappings",
        "delimiter": " ",   // ??
        "syntax": "[0-9]{4}"
    },
    "kMandarin":
    {
        "category": "Readings",
        "delimiter": " ",
        "syntax": "[a-z\\u{300}-\\u{302}\\u{304}\\u{308}\\u{30C}]+"
    },
    "kMatthews":
    {
        "category": "Dictionary Indices",
        "delimiter": " ",   // ??
        "syntax": "[1-9][0-9]{0,3}(a|\\.5)?"
    },
    "kMeyerWempe":
    {
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[1-9][0-9]{0,3}[a-t*]?"
    },
    "kMorohashi":
    {
        "category": "Dictionary Indices",
        "delimiter": " ",   // ??
        "syntax": "[0-9]{5}'?"
    },
    "kNelson":
    {
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[0-9]{4}"
    },
    "kOtherNumeric":
    {
        "category": "Numeric Values",
        "syntax": "[0-9]+"
    },
    "kPhonetic":
    {
        "category": "Dictionary-like Data",
        "delimiter": " ",
        "syntax": "[1-9][0-9]{0,3}[A-D]?\\*?"
    },
    "kPrimaryNumeric":
    {
        "category": "Numeric Values",
        "syntax": "[0-9]+"
    },
    "kPseudoGB1":
    {
        "category": "Other Mappings",
        "syntax": "[0-9]{4}"
    },
    "kRSAdobe_Japan1_6":
    {
        "category": "Radical-Stroke Counts",
        "delimiter": " ",
        "syntax": "[CV]\\+[0-9]{1,5}\\+[1-9][0-9]{0,2}\\.[1-9][0-9]?\\.[0-9]{1,2}"
    },
    "kRSJapanese":
    {
        "category": "Radical-Stroke Counts",
        "delimiter": " ",   // ??
        "syntax": "[1-9][0-9]{0,2}\\.[0-9]{1,2}"
    },
    "kRSKangXi":
    {
        "category": "Radical-Stroke Counts",
        "delimiter": " ",   // ??
        "syntax": "[1-9][0-9]{0,2}\\.-?[0-9]{1,2}"
    },
    "kRSKanWa":
    {
        "category": "Radical-Stroke Counts",
        "delimiter": " ",   // ??
        "syntax": "[1-9][0-9]{0,2}\\.[0-9]{1,2}"
    },
    "kRSKorean":
    {
        "category": "Radical-Stroke Counts",
        "delimiter": " ",   // ??
        "syntax": "[1-9][0-9]{0,2}\\.[0-9]{1,2}"
    },
    "kRSUnicode":
    {
        "category": "Radical-Stroke Counts",    // "IRG Sources" ??
        "delimiter": " ",
        "syntax": "[1-9][0-9]{0,2}'?\\.-?[0-9]{1,2}"
    },
    "kSBGY":
    {
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[0-9]{3}\\.[0-7][0-9]"
    },
    "kSemanticVariant":
    {
        "category": "Variants",
        "delimiter": " ",
        "syntax": "U\\+2?[0-9A-F]{4}(<k[A-Za-z0-9]+(:[TBZFJ]+)?(,k[A-Za-z0-9]+(:[TBZFJ]+)?)*)?"
    },
    "kSimplifiedVariant":
    {
        "category": "Variants",
        "delimiter": " ",
        "syntax": "U\\+2?[0-9A-F]{4}"
    },
    "kSpecializedSemanticVariant":
    {
        "category": "Variants",
        "delimiter": " ",
        "syntax": "U\\+2?[0-9A-F]{4}(<k[A-Za-z0-9]+(:[TBZFJ]+)?(,k[A-Za-z0-9]+(:[TBZFJ]+)?)*)?"
    },
    "kTaiwanTelegraph":
    {
        "category": "Other Mappings",
        "delimiter": " ",   // ??
        "syntax": "[0-9]{4}"
    },
    "kTang":
    {
        "category": "Readings",
        "delimiter": " ",
        "syntax": "\\*?[A-Za-z()\\u{E6}\\u{251}\\u{259}\\u{25B}\\u{300}\\u{30C}]+"
    },
    "kTGH":
    {
        "category": "Other Mappings",
        "delimiter": " ",   // ??
        "syntax": "20[0-9]{2}:[1-9][0-9]{0,3}"
    },
    "kTotalStrokes":
    {
        "category": "Dictionary-like Data",
        "delimiter": " ",
        "syntax": "[1-9][0-9]{0,2}"
    },
    "kTraditionalVariant":
    {
        "category": "Variants",
        "delimiter": " ",
        "syntax": "U\\+2?[0-9A-F]{4}"
    },
    "kVietnamese":
    {
        "category": "Readings",
        "delimiter": " ",
        "syntax": "[A-Za-z\\u{110}\\u{111}\\u{300}-\\u{303}\\u{306}\\u{309}\\u{31B}\\u{323}]+"
    },
    "kXerox":
    {
        "category": "Other Mappings",
        "delimiter": " ",   // ??
        "syntax": "[0-9]{3}:[0-9]{3}"
    },
    "kXHC1983":
    {
        "category": "Readings",
        "delimiter": " ",
        "syntax": "[0-9]{4}\\.[0-9]{3}\\*?(,[0-9]{4}\\.[0-9]{3}\\*?)*:[a-z\\u{300}\\u{301}\\u{304}\\u{308}\\u{30C}]+"
    },
    "kZVariant":
    {
        "category": "Variants",
        "delimiter": " ",
        "syntax": "U\\+2?[0-9A-F]{4}(<k[A-Za-z0-9]+(:[TBZ]+)?(,k[A-Za-z0-9]+(:[TBZ]+)?)*)?"
    }
};
//
for (let property in properties)
{
    if ("syntax" in properties[property])
    {
        properties[property]["regex"] = new RegExp ("^" + properties[property]["syntax"] + "$", 'u');
    }
}
//
function parseUnihanProperty (codePoint, property, value)
{
    let values = [ value ];
    //
    // https://www.unicode.org/reports/tr38/
    //
    // Validation is done as follows: 
    // The entry is split into subentries using the Delimiter (if defined), 
    // and each subentry converted to Normalization Form D (NFD). 
    // The value is valid if and only if each normalized subentry matches the field’s Syntax regular expression. 
    if (property in properties)
    {
        if ("delimiter" in properties[property])
        {
            values = value.split (properties[property]["delimiter"]);
        }
        if ("regex" in properties[property])
        {
            let regex = properties[property]["regex"];
            values.forEach
            (
                value =>
                {
                    if (!regex.test (value.normalize ('NFD')))
                    {
                        console.log ("Invalid Syntax:", codePoint, property, value);
                    }
                }
            );
        }
    }
    //
    return (values.length > 1) ? values : values[0];
}
//
const fs = require ('fs');
const path = require ('path');
//
// Copy of https://www.unicode.org/Public/UNIDATA/Unihan.zip
//
const filenames =
[
    "Unihan_DictionaryIndices.txt",
    "Unihan_DictionaryLikeData.txt",
    "Unihan_IRGSources.txt",
    "Unihan_NumericValues.txt",
    "Unihan_OtherMappings.txt",
    "Unihan_RadicalStrokeCounts.txt",
    "Unihan_Readings.txt",
    "Unihan_Variants.txt"
];
//
let codePoints = { };
//
for (let filename of filenames)
{
    let lines = fs.readFileSync (path.join (__dirname, 'Unihan', filename), { encoding: 'utf8' }).split ('\n');
    for (let line of lines)
    {
        if ((line) && (line[0] !== '#'))
        {
            let found = line.match (/^(U\+2?[0-9A-F]{4})\s+(\w+)\s+(.*)$/);
            if (found)
            {
                if (!(found[1] in codePoints))
                {
                    codePoints[found[1]] = { };
                }
                codePoints[found[1]][found[2]] = parseUnihanProperty (found[1], found[2], found[3]);
            }
        }
    }
}
//
module.exports = codePoints;
//
