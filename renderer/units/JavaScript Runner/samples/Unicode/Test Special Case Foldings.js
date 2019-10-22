// Test Special Case Foldings
const { toCase } = require ('./lib/foldings.js');
let tests =
[
    { string: "I", folding: 'lowercase', locale: 'tr' },
    { string: "i", folding: 'uppercase', locale: 'tr' },
    { string: "i̇", folding: 'uppercase', locale: 'lt' }
];
for (let test of tests)
{
    $.write (`${test.string} → `);
    let strings =
    [
        toCase (test.string, test.folding),     // No locale
        toCase (test.string, test.folding, ''), // Default locale
        toCase (test.string, test.folding, test.locale)
    ];
    $.writeln (strings.join (", "));
}
