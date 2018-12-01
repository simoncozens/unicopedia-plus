// Get Max Stroke Count
const extraSources = true;
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
const { codePoints } = require ('./lib/unicode/parsed-unihan-data.js');
let maxStrokes = -1;
let maxCodePoint = "";
let maxTagValue = "";
for (let codePoint in codePoints)
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
                    let residualStrokes = Math.max (parseInt (residual), 0);
                    if (residualStrokes > maxStrokes)
                    {
                        maxStrokes = residualStrokes;
                        maxCodePoint = codePoint;
                        maxTagValue = `${rsTag} ${rsValue}`;
                    }
                }
            }
        }
    }
}
$.writeln (`Max Strokes: ${maxStrokes}`);
$.writeln (`Code Point: ${maxCodePoint}`);
$.writeln (`Tag Value: ${maxTagValue}`);
