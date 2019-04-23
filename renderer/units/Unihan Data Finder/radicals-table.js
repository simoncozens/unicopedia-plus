//
module.exports.create = function (kangxiRadicals)
{
    const { fromStrokes } = require ('../../lib/unicode/get-rs-strings.js');
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
    headerSimplified.className = 'header-simplified';
    headerSimplified.textContent = "Simplified";
    headerRow.appendChild (headerSimplified);
    let headerChineseSimplified = document.createElement ('th');
    headerChineseSimplified.className = 'header-simplified';
    headerChineseSimplified.textContent = "C-Simplified";
    headerRow.appendChild (headerChineseSimplified);
    let headerJapaneseSimplified = document.createElement ('th');
    headerJapaneseSimplified.className = 'header-simplified';
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
                dataStrokes.textContent = fromStrokes (radical.strokes, true);
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
            dataRow.appendChild (dataRadical);
            let dataName = document.createElement ('td');
            dataName.className = 'data-name';
            dataName.textContent = radical.name;
            dataRow.appendChild (dataName);
            let variants = [ ];
            let simplified = [ ];
            let chineseSimplified = [ ];
            let japaneseSimplified = [ ];
            if ("cjk" in radical)
            {
                for (let cjk of radical["cjk"])
                {
                    if (cjk.name.match (/c-simplified/i))
                    {
                        chineseSimplified.push (cjk.radical);
                    }
                    else if (cjk.name.match (/j-simplified/i))
                    {
                        japaneseSimplified.push (cjk.radical);
                    }
                    else if (cjk.name.match (/simplified/i))
                    {
                        simplified.push (cjk.radical);
                    }
                    else
                    {
                        variants.push (cjk.radical);
                    }
                }
            }
            let dataVariants = document.createElement ('td');
            dataVariants.className = 'data-variants';
            dataVariants.textContent = variants.join ("\xA0");
            dataRow.appendChild (dataVariants);
            let dataSimplified = document.createElement ('td');
            dataSimplified.className = 'data-simplified';
            dataSimplified.textContent = simplified.join ("\xA0");
            dataRow.appendChild (dataSimplified);
            let dataChineseSimplified = document.createElement ('td');
            dataChineseSimplified.className = 'data-simplified';
            dataChineseSimplified.textContent = chineseSimplified.join ("\xA0");
            dataRow.appendChild (dataChineseSimplified);
            let dataJapaneseSimplified = document.createElement ('td');
            dataJapaneseSimplified.className = 'data-simplified';
            dataJapaneseSimplified.textContent = japaneseSimplified.join ("\xA0");
            dataRow.appendChild (dataJapaneseSimplified);
            radicalsTable.appendChild (dataRow);
        }
    );
    let footerRow = headerRow.cloneNode (true);
    radicalsTable.appendChild (footerRow);
    return radicalsTable;
}
//
