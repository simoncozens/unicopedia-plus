// Run Normalization Conformance Test
let start = window.performance.now ();
const normalizationTestData = require ('./lib/unicode/parsed-normalization-test-data.js');
const unicodeData = require ('./lib/unicode/parsed-unicode-data.js');
const unicode = require ('./lib/unicode/unicode.js');
let errors = [ ];
function assert (source, form, expected, compared)
{
    let returned = compared.normalize (form);
    if (expected !== returned)
    {
        errors.push (`\n${form} test failed for: ${source} <${unicode.charactersToCodePoints (source)}>\n\tExpected: ${expected} <${unicode.charactersToCodePoints (expected)}>\n\tReturned: ${returned} <${unicode.charactersToCodePoints (returned)}>`);
    }
}
normalizationTestData.forEach
(
    part =>
    {
        for (let source in part)
        {
            let { nfc, nfd, nfkc, nfkd } = part[source];
            // NFC
            assert (source, 'NFC', nfc, source);
            assert (source, 'NFC', nfc, nfc);
            assert (source, 'NFC', nfc, nfd);
            assert (source, 'NFC', nfkc, nfkc);
            assert (source, 'NFC', nfkc, nfkd);
            // NFD
            assert (source, 'NFD', nfd, source);
            assert (source, 'NFD', nfd, nfc);
            assert (source, 'NFD', nfd, nfd);
            assert (source, 'NFD', nfkd, nfkc);
            assert (source, 'NFD', nfkd, nfkd);
            // NFKC
            assert (source, 'NFKC', nfkc, source);
            assert (source, 'NFKC', nfkc, nfc);
            assert (source, 'NFKC', nfkc, nfd);
            assert (source, 'NFKC', nfkc, nfkc);
            assert (source, 'NFKC', nfkc, nfkd);
            // NFKD
            assert (source, 'NFKD', nfkd, source);
            assert (source, 'NFKD', nfkd, nfc);
            assert (source, 'NFKD', nfkd, nfd);
            assert (source, 'NFKD', nfkd, nfkc);
            assert (source, 'NFKD', nfkd, nfkd);
        }
    }
);
for (let codePoint in unicodeData)
{
    let source = String.fromCodePoint (parseInt (codePoint.replace ("U+", ""), 16));
    if (!(source in normalizationTestData[1]))
    {
        assert (source, 'NFC', source, source);
        assert (source, 'NFD', source, source);
        assert (source, 'NFKC', source, source);
        assert (source, 'NFKD', source, source);
    }
} 
let stop = window.performance.now ();
$.write (`Performed normalization conformance test in ${((stop - start) / 1000).toFixed (2)} seconds: `);
if (errors.length > 0)
{
    $.writeln (`${errors.length} error${(errors.length > 1) ? "s" : ""}`);
    errors.forEach (error => $.writeln (error));
}
else
{
    $.writeln ("No errors");
}
