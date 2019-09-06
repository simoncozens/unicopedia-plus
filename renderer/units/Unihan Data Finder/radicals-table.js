//
module.exports.create = function (kangxiRadicals)
{
    const { fromRadicalStrokes } = require ('../../lib/unicode/get-rs-strings.js');
    const { getCharacterBasicData } = require ('../../lib/unicode/unicode.js');
    //
    function getTooltip (radical)
    {
        let data = getCharacterBasicData (radical);
        // return `${data.codePoint.replace (/U\+/, "U\u034F\+")}\xA0${data.name}`; // U+034F COMBINING GRAPHEME JOINER
        return `${data.codePoint.replace (/U\+/, "U\u034F\+")}\xA0${radical}\xA0${data.name}`; // U+034F COMBINING GRAPHEME JOINER
    }
    //
    let radicalsTable = document.createElement ('table');
    radicalsTable.className = 'radicals-table';
    let headerRow = document.createElement ('tr');
    headerRow.className = 'header-row';
    let headerIndex = document.createElement ('th');
    headerIndex.className = 'header-index';
    headerIndex.textContent = "#";
    headerRow.appendChild (headerIndex);
    let headerRadical = document.createElement ('th');
    headerRadical.className = 'header-radical';
    headerRadical.textContent = "Radical";
    headerRow.appendChild (headerRadical);
    let headerName = document.createElement ('th');
    headerName.className = 'header-name';
    headerName.textContent = "Name";
    headerRow.appendChild (headerName);
    let headerVariants = document.createElement ('th');
    headerVariants.className = 'header-variants';
    headerVariants.textContent = "CJK\xA0Variants";
    headerRow.appendChild (headerVariants);
    let headerSimplified = document.createElement ('th');
    headerSimplified.className = 'header-variants';
    headerSimplified.textContent = "Simplified";
    headerRow.appendChild (headerSimplified);
    let headerChineseSimplified = document.createElement ('th');
    headerChineseSimplified.className = 'header-variants';
    headerChineseSimplified.textContent = "C-Simplified";
    headerRow.appendChild (headerChineseSimplified);
    let headerJapaneseSimplified = document.createElement ('th');
    headerJapaneseSimplified.className = 'header-variants';
    headerJapaneseSimplified.textContent = "J-Simplified";
    headerRow.appendChild (headerJapaneseSimplified);
    radicalsTable.appendChild (headerRow);
    let lastStrokes = 0;
    let evenOdd;
    kangxiRadicals.forEach
    (
        (radical, index) =>
        {
            if (lastStrokes !== radical.strokes)
            {
                let strokesRow = document.createElement ('tr');
                strokesRow.className = 'strokes-row';
                let dataStrokes = document.createElement ('td');
                dataStrokes.className = 'data-strokes';
                dataStrokes.colSpan = 7;
                dataStrokes.textContent = fromRadicalStrokes (radical.strokes, true);
                strokesRow.appendChild (dataStrokes);
                radicalsTable.appendChild (strokesRow);
                lastStrokes = radical.strokes;
                evenOdd = 0;
            }
            let dataRow = document.createElement ('tr');
            dataRow.className = 'data-row';
            dataRow.classList.add (evenOdd++ % 2 ? 'odd' : 'even');
            let dataIndex = document.createElement ('td');
            dataIndex.className = 'data-index';
            dataIndex.textContent = index + 1;
            dataRow.appendChild (dataIndex);
            let dataRadical = document.createElement ('td');
            dataRadical.className = 'data-radical';
            dataRadical.textContent = radical.radical;
            dataRadical.title = getTooltip (radical.radical);
            dataRow.appendChild (dataRadical);
            let dataName = document.createElement ('td');
            dataName.className = 'data-name';
            dataName.textContent = radical.name;
            dataRow.appendChild (dataName);
            let radicalVariants =
            {
                cjkVariants: [ ],
                simplified: [ ],
                chineseSimplified: [ ],
                japaneseSimplified: [ ]
            };
            if ("cjk" in radical)
            {
                for (let cjk of radical["cjk"])
                {
                    if (cjk.name.match (/c-simplified/i))
                    {
                        radicalVariants.chineseSimplified.push (cjk.radical);
                    }
                    else if (cjk.name.match (/j-simplified/i))
                    {
                        radicalVariants.japaneseSimplified.push (cjk.radical);
                    }
                    else if (cjk.name.match (/simplified/i))
                    {
                        radicalVariants.simplified.push (cjk.radical);
                    }
                    else
                    {
                        radicalVariants.cjkVariants.push (cjk.radical);
                    }
                }
            }
            for (let radicalVariant in radicalVariants)
            {
                let dataVariants = document.createElement ('td');
                dataVariants.className = 'data-variants';
                radicalVariants[radicalVariant].forEach
                (
                    (variant, index) =>
                    {
                        if (index > 0)
                        {
                            dataVariants.appendChild (document.createTextNode ("\xA0"));
                        }
                        let dataVariant = document.createElement ('span');
                        dataVariant.textContent = variant;
                        dataVariant.title = getTooltip (variant);
                        dataVariants.appendChild (dataVariant);
                    }
                );
                dataRow.appendChild (dataVariants);
            }
            radicalsTable.appendChild (dataRow);
        }
    );
    let footerRow = headerRow.cloneNode (true);
    radicalsTable.appendChild (footerRow);
    return radicalsTable;
}
//
