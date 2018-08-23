// Generate Regional Indicators
let regionalIndicators = [ ];
for (let index = 0; index < 26; index++)
{
    regionalIndicators.push (String.fromCodePoint (0x1F1E6 + index));
}
$.write ($.stringify (regionalIndicators));
