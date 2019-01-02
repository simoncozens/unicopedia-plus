// Get Radical Statistics
const { codePoints, coreSet, fullSet } = require ('./lib/unicode/parsed-unihan-data.js');
const { fromRadical } = require ('./lib/unicode/get-rs-strings.js');
const set = fullSet;    // coreSet or fullSet
const extraSources = false;
const rsTags =
[
    "kRSUnicode",
    "kRSKangXi",
    "kRSJapanese",
    "kRSKanWa",
    "kRSKorean",
    "kRSAdobe_Japan1_6"
];
//
const radicals = [ ];
for (let index = 0; index < 214; index++)
{
    radicals.push ({ index: index + 1, count: 0 });
}
for (let codePoint of set)
{
    for (let rsTag of rsTags)
    {
        if (extraSources || (rsTag === "kRSUnicode"))
        {
            let rsTagValues = codePoints[codePoint][rsTag];
            if (rsTagValues)
            {
                let rsValue;
                if (!Array.isArray (rsTagValues))
                {
                    rsTagValues = [ rsTagValues ];
                }
                for (let rsTagValue of rsTagValues)
                {
                    if (rsTag === "kRSAdobe_Japan1_6")
                    {
                        let parsed = rsTagValue.match (/^[CV]\+[0-9]{1,5}\+([1-9][0-9]{0,2}\.[1-9][0-9]?\.[0-9]{1,2})$/);
                        if (parsed)
                        {
                            let [ index, strokes, residual ] = parsed[1].split ('.');
                            rsValue = [ index, residual ].join ('.');
                        }
                    }
                    else
                    {
                        rsValue = rsTagValue;
                    }
                    let [ index, residual ] = rsValue.split ('.');
                    radicals[parseInt (index) - 1].count++;
                }
            }
        }
    }
}
radicals.sort ((a, b) => a.count - b.count).reverse ();
$.writeln (`Unihan ${set === fullSet ? "full set" : "core set"}${extraSources ? " + Extra sources" : ""}:`);
for (let index = 0; index < radicals.length; index++)
{
    $.writeln (`Radical ${fromRadical (radicals[index].index)}: ${radicals[index].count} characters`);
}
