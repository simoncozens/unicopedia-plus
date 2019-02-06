// Run Normalization Conformance Test
let start = window.performance.now ();
let errors = [ ];
const normalizationTestData = require ('./lib/unicode/parsed-normalization-test-data.js');
normalizationTestData.forEach
(
    part =>
    {
        for (let source in part)
        {
            let { nfc, nfd, nfkc, nfkd } = part[source];
            // NFC
            let nfcCondition =
            (
                (
                    (nfc === source.normalize ('NFC'))
                    &&
                    (nfc === nfc.normalize ('NFC'))
                    &&
                    (nfc === nfd.normalize ('NFC'))
                )
                &&
                (
                    (nfkc === nfkc.normalize ('NFC'))
                    &&
                    (nfkc === nfkd.normalize ('NFC'))
                )
            );
            if (!nfcCondition )
            {
                errors.push (`[NFC]  ${source}`);
            }
            // NFD
            let nfdCondition =
            (
                (
                    (nfd === source.normalize ('NFD'))
                    &&
                    (nfd === nfc.normalize ('NFD'))
                    &&
                    (nfd === nfd.normalize ('NFD'))
                )
                &&
                (
                    (nfkd === nfkc.normalize ('NFD'))
                    &&
                    (nfkd === nfkd.normalize ('NFD'))
                )
            );
            if (!nfdCondition )
            {
                errors.push (`[NFD]  ${source}`);
            }
            // NFKC
            let nfkcCondition =
            (
                (nfkc === source.normalize ('NFKC'))
                &&
                (nfkc === nfc.normalize ('NFKC'))
                &&
                (nfkc === nfd.normalize ('NFKC'))
                &&
                (nfkc === nfkc.normalize ('NFKC'))
                &&
                (nfkc === nfkd.normalize ('NFKC'))
            );
            if (!nfkcCondition )
            {
                errors.push (`[NFKC] ${source}`);
            }
            // NFKD
            let nfkdCondition =
            (
                (nfkd === source.normalize ('NFKD'))
                &&
                (nfkd === nfc.normalize ('NFKD'))
                &&
                (nfkd === nfd.normalize ('NFKD'))
                &&
                (nfkd === nfkc.normalize ('NFKD'))
                &&
                (nfkd === nfkd.normalize ('NFKD'))
            );
            if (!nfkdCondition )
            {
                errors.push (`[NFKD] ${source}`);
            }
        }
    }
);
const unicodeData = require ('./lib/unicode/parsed-unicode-data.js');
for (let codePoint in unicodeData)
{
    let character = String.fromCodePoint (parseInt (codePoint.replace ("U+", ""), 16));
    if (!(character in normalizationTestData[1]))
    {
        let defaultCondition =
        (
            (character === character.normalize ('NFC'))
            &&
            (character === character.normalize ('NFD'))
            &&
            (character === character.normalize ('NFKC'))
            &&
            (character === character.normalize ('NFKD'))
        );
        if (!defaultCondition )
        {
            errors.push (`[Default] ${character}`);
        }
    }
}
let stop = window.performance.now ();
$.write (`Performed normalization conformance test in ${((stop - start) / 1000).toFixed (2)} seconds: `);
if (errors.length > 0)
{
    $.writeln (`${errors.length} errors`);
    errors.forEach (error => $.writeln (error));
}
else
{
    $.writeln ("No errors");
}
