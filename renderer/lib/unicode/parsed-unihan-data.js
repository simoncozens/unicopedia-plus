//
// https://www.unicode.org/reports/tr38/
//
// All data in the Unihan database is stored in UTF-8 using Normalization Form C (NFC).
// Note, however, that the "Syntax" descriptions below, used for validation of field values,
// operate on Normalization Form D (NFD), primarily because that makes the regular expressions simpler.
//
const tags =
{
    "kAccountingNumeric":
    {
        "name": "Accounting Numeric",
        "category": "Numeric Values",
        "syntax": "[0-9]+"
    },
    "kBigFive":
    {
        "name": "Big Five",
        "category": "Other Mappings",
        "syntax": "[0-9A-F]{4}"
    },
    "kCangjie":
    {
        "name": "Cangjie",
        "category": "Dictionary-like Data",
        "syntax": "[A-Z]+"
    },
    "kCantonese":
    {
        "name": "Cantonese",
        "category": "Readings",
        "delimiter": " ",
        "syntax": "[a-z]{1,6}[1-6]"
    },
    "kCCCII":
    {
        "name": "CCCII (Chinese Character Code for Information Interchange)",
        "category": "Other Mappings",
        "delimiter": " ",   // ??
        "syntax": "[0-9A-F]{6}"
    },
    "kCheungBauer":
    {
        "name": "Cheung-Bauer",
        "category": "Dictionary-like Data",
        "delimiter": " ",   // ??
        "syntax": "[0-9]{3}\\/[0-9]{2};[A-Z]*;[a-z1-6\\[\\]\\/,]+"
    },
    "kCheungBauerIndex":
    {
        "name": "Cheung-Bauer Index",
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[0-9]{3}\\.[01][0-9]"
    },
    "kCihaiT":
    {
        "name": "Cihai",
        "category": "Dictionary-like Data",
        "delimiter": " ",
        "syntax": "[1-9][0-9]{0,3}\\.[0-9]{3}"
    },
    "kCNS1986":
    {
        "name": "CNS 11643-1986",
        "category": "Other Mappings",
        "syntax": "[12E]-[0-9A-F]{4}"
    },
    "kCNS1992":
    {
        "name": "CNS 11643-1992",
        "category": "Other Mappings",
        "syntax": "[1-9]-[0-9A-F]{4}"
    },
    "kCompatibilityVariant":
    {
        "name": "Compatibility Variant",
        "category": "Variants", // "IRG Sources" ??
        "syntax": "U\\+2?[0-9A-F]{4}"
    },
    "kCowles":
    {
        "name": "Cowles",
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[0-9]{1,4}(\\.[0-9]{1,2})?"
    },
    "kDaeJaweon":
    {
        "name": "Dae Jaweon",
        "category": "Dictionary Indices",
        "syntax": "[0-9]{4}\\.[0-9]{2}[01]"
    },
    "kDefinition":
    {
        "name": "Definition",
        "category": "Readings",
        "syntax": "[^\\t\"]+"
    },
    "kEACC":
    {
        "name": "EACC (East Asian Character Code for Bibliographic Use)",
        "category": "Other Mappings",
        "syntax": "[0-9A-F]{6}"
    },
    "kFenn":
    {
        "name": "Fenn",
        "category": "Dictionary-like Data",
        "delimiter": " ",
        "syntax": "[0-9]+a?[A-KP*]"
    },
    "kFennIndex":
    {
        "name": "Fenn Index",
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[0-9][0-9]{0,2}\\.[01][0-9]"
    },
    "kFourCornerCode":
    {
        "name": "Four-Corner Code",
        "category": "Dictionary-like Data",
        "delimiter": " ",
        "syntax": "[0-9]{4}(\\.[0-9])?"
    },
    "kFrequency":
    {
        "name": "Frequency",
        "category": "Dictionary-like Data",
        "syntax": "[1-5]"
    },
    "kGB0":
    {
        "name": "GB 2312-80",
        "category": "Other Mappings",
        "syntax": "[0-9]{4}"
    },
    "kGB1":
    {
        "name": "GB 12345-90",
        "category": "Other Mappings",
        "syntax": "[0-9]{4}"
    },
    "kGB3":
    {
        "name": "GB 7589-87",
        "category": "Other Mappings",
        "syntax": "[0-9]{4}"
    },
    "kGB5":
    {
        "name": "GB 7590-87",
        "category": "Other Mappings",
        "syntax": "[0-9]{4}"
    },
    "kGB7":
    {
        "name": "General Purpose Hanzi List for Modern Chinese Language, and General List of Simplified Hanzi",
        "category": "Other Mappings",
        "syntax": "[0-9]{4}"
    },
    "kGB8":
    {
        "name": "GB 8565.2-1988",
        "category": "Other Mappings",
        "syntax": "[0-9]{4}"
    },
    "kGradeLevel":
    {
        "name": "Grade Level",
        "category": "Dictionary-like Data",
        "syntax": "[1-6]"
    },
    "kGSR":
    {
        "name": "GSR (Grammata Serica Recensa)",
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[0-9]{4}[a-vx-z]'?"
    },
    "kHangul":
    {
        "name": "Hangul",
        "category": "Readings",
        "delimiter": " ",
        "syntax": "[\\u{1100}-\\u{1112}][\\u{1161}-\\u{1175}][\\u{11A8}-\\u{11C2}]?:[01EN]{1,3}"
    },
    "kHanYu":
    {
        "name": "Hanyu Da Zidian (HDZ)",
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[1-8][0-9]{4}\\.[0-3][0-9][0-3]"
    },
    "kHanyuPinlu":
    {
        "name": "Xiandai Hanyu Pinlu Cidian",
        "category": "Readings",
        "delimiter": " ",
        "syntax": "[a-z\\u{300}-\\u{302}\\u{304}\\u{308}\\u{30C}]+\\([0-9]+\\)"
    },
    "kHanyuPinyin":
    {
        "name": "Hanyu Pinyin",
        "category": "Readings",
        "delimiter": " ",
        "syntax": "(\\d{5}\\.\\d{2}0,)*\\d{5}\\.\\d{2}0:([a-z\\u{300}-\\u{302}\\u{304}\\u{308}\\u{30C}]+,)*[a-z\\u{300}-\\u{302}\\u{304}\\u{308}\\u{30C}]+"
    },
    "kHDZRadBreak":
    {
        "name": "HDZ (Hanyu Da Zidian) Radical Break",
        "category": "Dictionary-like Data",
        "syntax": "[\\u{2F00}-\\u{2FD5}]\\[U\\+2F[0-9A-D][0-9A-F]\\]:[1-8][0-9]{4}\\.[0-3][0-9]0"
    },
    "kHKGlyph":
    {
        "name": "HK Glyph",
        "category": "Dictionary-like Data",
        "delimiter": " ",   // ??
        "syntax": "[0-9]{4}"
    },
    "kHKSCS":
    {
        "name": "HK SCS (Hong Kong Supplementary Character)",
        "category": "Other Mappings",
        "syntax": "[0-9A-F]{4}"
    },
    "kIBMJapan":
    {
        "name": "IBM Japan",
        "category": "Other Mappings",
        "delimiter": " ",
        "syntax": "F[ABC][0-9A-F]{2}"
    },
    "kIICore":
    {
        "name": "IICore",
        "category": "IRG Sources",
        "delimiter": " ",   // ??
        "syntax": "[ABC][GHJKMPT]{1,7}"
    },
    "kIRGDaeJaweon":
    {
        "name": "IRG Dae Jaweon",
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[0-9]{4}\\.[0-9]{2}[01]"
    },
    "kIRGDaiKanwaZiten":
    {
        "name": "IRG Dai Kanwa Ziten",
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[0-9]{5}'?"
    },
    "kIRGHanyuDaZidian":
    {
        "name": "IRG Hanyu Da Zidian",
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[1-8][0-9]{4}\\.[0-3][0-9][01]"
    },
    "kIRGKangXi":
    {
        "name": "IRG KangXi",
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[01][0-9]{3}\\.[0-7][0-9][01]"
    },
    "kIRG_GSource":
    {
        "name": "IRG \"G\" Source",
        "category": "IRG Sources",
        "syntax": "G4K|G[013578EKS]-[0-9A-F]{4}|G9-[0-9A-F]{4,8}|G(DZ|GH|RM|WZ|XC|XH|ZH)-\\d{4}\\.\\d{2}|G(BK|CH|CY|HC)(-\\d{4}\\.\\d{2})?|GKX-\\d{4}\\.\\d{2,3}|GHZR?-\\d{5}\\.\\d{2}|G(CE|FC|IDC|OCD|XHZ)-\\d{3}|G(H|HF|LGYJ|PGLG)-\\d{4}|G(CYY|JZ|ZFY|ZJW|ZYS)-\\d{5}|GFZ(-\\d{5})?|GGFZ-\\d{6}|G(LK|Z)-\\d{7}"
    },
    "kIRG_HSource":
    {
        "name": "IRG \"H\" Source",
        "category": "IRG Sources",
        "syntax": "H(-[0-9A-F]{4,5}|(B[012]|D)-[0-9A-F]{4})"
    },
    "kIRG_JSource":
    {
        "name": "IRG \"J\" Source",
        "category": "IRG Sources",
        "syntax": "J1?((([0134AK]|A[34]|3A|ARIB|MJ)-[0-9A-F]{4,6})|(H-(((IB|JT|[0-9]{2})[0-9A-F]{4}S?))))"
    },
    "kIRG_KPSource":
    {
        "name": "IRG \"KP\" Source",
        "category": "IRG Sources",
        "syntax": "KP[01]-[0-9A-F]{4}"
    },
    "kIRG_KSource":
    {
        "name": "IRG \"K\" Source",
        "category": "IRG Sources",
        "syntax": "K([0-6]-[0-9A-F]{4}|C-[0-9]{5})"
    },
    "kIRG_MSource":
    {
        "name": "IRG \"M\" Source",
        "category": "IRG Sources",
        "syntax": "MAC-[0-9]{5}"
    },
    "kIRG_TSource":
    {
        "name": "IRG \"T\" Source",
        "category": "IRG Sources",
        "syntax": "T[1-7A-F]-[0-9A-F]{4}"
    },
    "kIRG_USource":
    {
        "name": "IRG \"U\" Source",
        "category": "IRG Sources",
        "syntax": "U(TC|CI|K|SAT)-[0-9]{5}"
    },
    "kIRG_VSource":
    {
        "name": "IRG \"V\" Source",
        "category": "IRG Sources",
        "syntax": "V[0-4U]-[02]?[0-9A-F]{4}"
    },
    "kJa":
    {
        "name": "JA (Unified Japanese IT Vendors Contemporary Ideographs, 1993)",
        "category": "Other Mappings",
        "delimiter": " ",
        "syntax": "[0-9A-F]{4}S?"
    },
    "kJapaneseKun":
    {
        "name": "Japanese Kun-Yomi",
        "category": "Readings",
        "delimiter": " ",
        "syntax": "[A-Z]+"
    },
    "kJapaneseOn":
    {
        "name": "Japanese On-Yomi",
        "category": "Readings",
        "delimiter": " ",
        "syntax": "[A-Z]+"
    },
    "kJinmeiyoKanji":
    {
        "name": "Jinmeiyō Kanji",
        "category": "Other Mappings",
        "delimiter": " ",
        "syntax": "(20[0-9]{2})(:U\\+2?[0-9A-F]{4})?"
    },
    "kJis0":
    {
        "name": "JIS X 0208-1990",
        "category": "Other Mappings",
        "delimiter": " ",
        "syntax": "[0-9]{4}"
    },
    "kJIS0213":
    {
        "name": "JIS X 0213:2004",
        "category": "Other Mappings",
        "delimiter": " ",
        "syntax": "[12],[0-9]{2},[0-9]{1,2}"
    },
    "kJis1":
    {
        "name": "JIS X 0212-1990",
        "category": "Other Mappings",
        "delimiter": " ",
        "syntax": "[0-9]{4}"
    },
    "kJoyoKanji":
    {
        "name": "Jōyō Kanji",
        "category": "Other Mappings",
        "delimiter": " ",
        "syntax": "(20[0-9]{2})|(U\\+2?[0-9A-F]{4})"
    },
    "kKangXi":
    {
        "name": "KangXi",
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[0-9]{4}\\.[0-9]{2}[01]"
    },
    "kKarlgren":
    {
        "name": "Karlgren",
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[1-9][0-9]{0,3}[A*]?"
    },
    "kKorean":
    {
        "name": "Korean",
        "category": "Readings",
        "delimiter": " ",
        "syntax": "[A-Z]+"
    },
    "kKoreanEducationHanja":
    {
        "name": "Korean Education Hanja",
        "category": "Other Mappings",
        "delimiter": " ",   // ??
        "syntax": "20[0-9]{2}"
    },
    "kKoreanName":
    {
        "name": "Korean Name",
        "category": "Other Mappings",
        "delimiter": " ",   // ??
        "syntax": "(20[0-9]{2})(:U\\+2?[0-9A-F]{4})*"
    },
    "kKPS0":
    {
        "name": "KPS 9566-97",
        "category": "Other Mappings",
        "delimiter": " ",   // ??
        "syntax": "[0-9A-F]{4}"
    },
    "kKPS1":
    {
        "name": "KPS 10721-2000",
        "category": "Other Mappings",
        "delimiter": " ",   // ??
        "syntax": "[0-9A-F]{4}"
    },
    "kKSC0":
    {
        "name": "KS X 1001:1992 (KS C 5601-1989)",
        "category": "Other Mappings",
        "delimiter": " ",   // ??
        "syntax": "[0-9]{4}"
    },
    "kKSC1":
    {
        "name": "KS X 1002:1991 (KS C 5657-1991)",
        "category": "Other Mappings",
        "delimiter": " ",   // ??
        "syntax": "[0-9]{4}"
    },
    "kLau":
    {
        "name": "Lau",
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[1-9][0-9]{0,3}"
    },
    "kMainlandTelegraph":
    {
        "name": "Mainland Telegraph",
        "category": "Other Mappings",
        "delimiter": " ",   // ??
        "syntax": "[0-9]{4}"
    },
    "kMandarin":
    {
        "name": "Mandarin",
        "category": "Readings",
        "delimiter": " ",
        "syntax": "[a-z\\u{300}-\\u{302}\\u{304}\\u{308}\\u{30C}]+"
    },
    "kMatthews":
    {
        "name": "Matthews",
        "category": "Dictionary Indices",
        "delimiter": " ",   // ??
        "syntax": "[1-9][0-9]{0,3}(a|\\.5)?"
    },
    "kMeyerWempe":
    {
        "name": "Meyer-Wempe",
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[1-9][0-9]{0,3}[a-t*]?"
    },
    "kMorohashi":
    {
        "name": "Morohashi",
        "category": "Dictionary Indices",
        "delimiter": " ",   // ??
        "syntax": "[0-9]{5}'?"
    },
    "kNelson":
    {
        "name": "Nelson",
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[0-9]{4}"
    },
    "kOtherNumeric":
    {
        "name": "Other Numeric",
        "category": "Numeric Values",
        "syntax": "[0-9]+"
    },
    "kPhonetic":
    {
        "name": "Phonetic Index (Ten Thousand Characters: An Analytic Dictionary)",
        "category": "Dictionary-like Data",
        "delimiter": " ",
        "syntax": "[1-9][0-9]{0,3}[A-D]?\\*?"
    },
    "kPrimaryNumeric":
    {
        "name": "Primary Numeric",
        "category": "Numeric Values",
        "syntax": "[0-9]+"
    },
    "kPseudoGB1":
    {
        "name": "\"GB 12345-90\"",
        "category": "Other Mappings",
        "syntax": "[0-9]{4}"
    },
    "kRSAdobe_Japan1_6":
    {
        "name": "Adobe-Japan1-6 Radical-Stroke Count",
        "category": "Radical-Stroke Counts",
        "delimiter": " ",
        "syntax": "[CV]\\+[0-9]{1,5}\\+[1-9][0-9]{0,2}\\.[1-9][0-9]?\\.[0-9]{1,2}"
    },
    "kRSJapanese":
    {
        "name": "Japanese Radical-Stroke Count",
        "category": "Radical-Stroke Counts",
        "delimiter": " ",   // ??
        "syntax": "[1-9][0-9]{0,2}\\.[0-9]{1,2}"
    },
    "kRSKangXi":
    {
        "name": "KangXi Radical-Stroke Count",
        "category": "Radical-Stroke Counts",
        "delimiter": " ",   // ??
        "syntax": "[1-9][0-9]{0,2}\\.-?[0-9]{1,2}"
    },
    "kRSKanWa":
    {
        "name": "Morohashi Radical-Stroke Count",
        "category": "Radical-Stroke Counts",
        "delimiter": " ",   // ??
        "syntax": "[1-9][0-9]{0,2}\\.[0-9]{1,2}"
    },
    "kRSKorean":
    {
        "name": "Korean Radical-Stroke Count",
        "category": "Radical-Stroke Counts",
        "delimiter": " ",   // ??
        "syntax": "[1-9][0-9]{0,2}\\.[0-9]{1,2}"
    },
    "kRSUnicode":
    {
        "name": "Unicode Radical-Stroke Count",
        "category": "Radical-Stroke Counts",    // "IRG Sources" ??
        "delimiter": " ",
        "syntax": "[1-9][0-9]{0,2}'?\\.-?[0-9]{1,2}"
    },
    "kSBGY":
    {
        "name": "SBGY (Song Ben Guang Yun)",
        "category": "Dictionary Indices",
        "delimiter": " ",
        "syntax": "[0-9]{3}\\.[0-7][0-9]"
    },
    "kSemanticVariant":
    {
        "name": "Semantic Variant",
        "category": "Variants",
        "delimiter": " ",
        "syntax": "U\\+2?[0-9A-F]{4}(<k[A-Za-z0-9]+(:[TBZFJ]+)?(,k[A-Za-z0-9]+(:[TBZFJ]+)?)*)?"
    },
    "kSimplifiedVariant":
    {
        "name": "Simplified Variant",
        "category": "Variants",
        "delimiter": " ",
        "syntax": "U\\+2?[0-9A-F]{4}"
    },
    "kSpecializedSemanticVariant":
    {
        "name": "Specialized Semantic Variant",
        "category": "Variants",
        "delimiter": " ",
        "syntax": "U\\+2?[0-9A-F]{4}(<k[A-Za-z0-9]+(:[TBZFJ]+)?(,k[A-Za-z0-9]+(:[TBZFJ]+)?)*)?"
    },
    "kTaiwanTelegraph":
    {
        "name": "Taiwan Telegraph",
        "category": "Other Mappings",
        "delimiter": " ",   // ??
        "syntax": "[0-9]{4}"
    },
    "kTang":
    {
        "name": "Tang",
        "category": "Readings",
        "delimiter": " ",
        "syntax": "\\*?[A-Za-z()\\u{E6}\\u{251}\\u{259}\\u{25B}\\u{300}\\u{30C}]+"
    },
    "kTGH":
    {
        "name": "TGH (Tōngyòng Guīfàn Hànzìbiǎo)",
        "category": "Other Mappings",
        "delimiter": " ",   // ??
        "syntax": "20[0-9]{2}:[1-9][0-9]{0,3}"
    },
    "kTotalStrokes":
    {
        "name": "Total Strokes",
        "category": "Dictionary-like Data",
        "delimiter": " ",
        "syntax": "[1-9][0-9]{0,2}"
    },
    "kTraditionalVariant":
    {
        "name": "Traditional Variant",
        "category": "Variants",
        "delimiter": " ",
        "syntax": "U\\+2?[0-9A-F]{4}"
    },
    "kVietnamese":
    {
        "name": "Vietnamese",
        "category": "Readings",
        "delimiter": " ",
        "syntax": "[A-Za-z\\u{110}\\u{111}\\u{300}-\\u{303}\\u{306}\\u{309}\\u{31B}\\u{323}]+"
    },
    "kXerox":
    {
        "name": "Xerox",
        "category": "Other Mappings",
        "delimiter": " ",   // ??
        "syntax": "[0-9]{3}:[0-9]{3}"
    },
    "kXHC1983":
    {
        "name": "XHC (Xiàndài Hànyǔ Cídiǎn) 1983",
        "category": "Readings",
        "delimiter": " ",
        "syntax": "[0-9]{4}\\.[0-9]{3}\\*?(,[0-9]{4}\\.[0-9]{3}\\*?)*:[a-z\\u{300}\\u{301}\\u{304}\\u{308}\\u{30C}]+"
    },
    "kZVariant":
    {
        "name": "Z-Variant",
        "category": "Variants",
        "delimiter": " ",
        "syntax": "U\\+2?[0-9A-F]{4}(<k[A-Za-z0-9]+(:[TBZ]+)?(,k[A-Za-z0-9]+(:[TBZ]+)?)*)?"
    }
};
//
for (let tag in tags)
{
    if ("syntax" in tags[tag])
    {
        tags[tag]["regex"] = new RegExp ("^" + tags[tag]["syntax"] + "$", 'u');
    }
}
//
// Tag categories (field types)
// https://www.unicode.org/reports/tr38/#N100FB
// https://www.unicode.org/cgi-bin/GetUnihanData.pl
//
// https://www.unicode.org/reports/tr38/#N1013C
// https://www.unicode.org/reports/tr38/#N101BA
// https://www.unicode.org/reports/tr38/#N10106
// https://www.unicode.org/reports/tr38/#N1024D
// https://www.unicode.org/reports/tr38/#N10130
// https://www.unicode.org/reports/tr38/#N101E4
// https://www.unicode.org/reports/tr38/#N1019C
// https://www.unicode.org/reports/tr38/#N10211
//
const categories =
[
    {
        "name": "Dictionary Indices",
        "tags":
        [
            "kCheungBauerIndex",
            "kCowles",
            "kDaeJaweon",
            "kFennIndex",
            "kGSR",
            "kHanYu",
            "kIRGDaeJaweon",
            "kIRGDaiKanwaZiten",
            "kIRGHanyuDaZidian",
            "kIRGKangXi",
            "kKangXi",
            "kKarlgren",
            "kLau",
            "kMatthews",
            "kMeyerWempe",
            "kMorohashi",
            "kNelson",
            "kSBGY"
        ]
    },
    {
        "name": "Dictionary-like Data",
        "tags":
        [
            "kCangjie",
            "kCheungBauer",
            "kCihaiT",
            "kFenn",
            "kFourCornerCode",
            "kFrequency",
            "kGradeLevel",
            "kHDZRadBreak",
            "kHKGlyph",
            "kPhonetic",
            "kTotalStrokes"
        ]
    },
    {
        "name": "IRG Sources",
        "tags":
        [
            "kIICore",
            "kIRG_GSource",
            "kIRG_HSource",
            "kIRG_JSource",
            "kIRG_KPSource",
            "kIRG_KSource",
            "kIRG_MSource",
            "kIRG_TSource",
            "kIRG_USource",
            "kIRG_VSource"
        ]
    },
    {
        "name": "Numeric Values",
        "tags":
        [
            "kAccountingNumeric",
            "kOtherNumeric",
            "kPrimaryNumeric"
        ]
    },
    {
        "name": "Other Mappings",
        "tags":
        [
            "kBigFive",
            "kCCCII",
            "kCNS1986",
            "kCNS1992",
            "kEACC",
            "kGB0",
            "kGB1",
            "kGB3",
            "kGB5",
            "kGB7",
            "kGB8",
            "kHKSCS",
            "kIBMJapan",
            "kJa",
            "kJinmeiyoKanji",
            "kJis0",
            "kJIS0213",
            "kJis1",
            "kJoyoKanji",
            "kKoreanEducationHanja",
            "kKoreanName",
            "kKPS0",
            "kKPS1",
            "kKSC0",
            "kKSC1",
            "kMainlandTelegraph",
            "kPseudoGB1",
            "kTaiwanTelegraph",
            "kTGH",
            "kXerox"
        ]
    },
    {
        "name": "Radical-Stroke Counts",   // "Radical-stroke Indices"
        "tags":
        [
            "kRSAdobe_Japan1_6",
            "kRSJapanese",
            "kRSKangXi",
            "kRSKanWa",
            "kRSKorean",
            "kRSUnicode"
        ]
    },
    {
        "name": "Readings",
        "tags":
        [
            "kCantonese",
            "kDefinition",
            "kHangul",
            "kHanyuPinlu",
            "kHanyuPinyin",
            "kJapaneseKun",
            "kJapaneseOn",
            "kKorean",
            "kMandarin",
            "kTang",
            "kVietnamese",
            "kXHC1983"
        ]
    },
    {
        "name": "Variants",
        "tags":
        [
            "kCompatibilityVariant",
            "kSemanticVariant",
            "kSimplifiedVariant",
            "kSpecializedSemanticVariant",
            "kTraditionalVariant",
            "kZVariant"
        ]
    }
];
//
function parseUnihanTag (codePoint, tag, value)
{
    let values = [ value ];
    //
    // https://www.unicode.org/reports/tr38/
    //
    // Validation is done as follows:
    // The entry is split into subentries using the Delimiter (if defined),
    // and each subentry converted to Normalization Form D (NFD).
    // The value is valid if and only if each normalized subentry matches the field’s Syntax regular expression.
    if (tag in tags)
    {
        if ("delimiter" in tags[tag])
        {
            values = value.split (tags[tag]["delimiter"]);
        }
        if ("regex" in tags[tag])
        {
            let regex = tags[tag]["regex"];
            values.forEach
            (
                value =>
                {
                    if (!regex.test (value.normalize ('NFD')))
                    {
                        console.log ("Invalid Syntax:", codePoint, tag, value);
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
const codePoints = { };
//
for (let filename of filenames)
{
    let lines = fs.readFileSync (path.join (__dirname, 'Unihan', filename), { encoding: 'utf8' }).split ("\n");
    for (let line of lines)
    {
        if (line && (line[0] !== "#"))
        {
            let found = line.match (/^(U\+2?[0-9A-F]{4})\s+(\w+)\s+(.*)$/);
            if (found)
            {
                if (!(found[1] in codePoints))
                {
                    codePoints[found[1]] = { };
                }
                codePoints[found[1]][found[2]] = parseUnihanTag (found[1], found[2], found[3]);
            }
        }
    }
}
//
const fullSet = Object.keys (codePoints).sort ((a, b) => parseInt (a.replace ("U+", ""), 16) - parseInt (b.replace ("U+", ""), 16));
const coreSet = fullSet.filter (key => ("kIICore" in codePoints[key]));
//
module.exports =
{
    tags,
    categories,
    codePoints,
    fullSet,
    coreSet
};
//
