//
const unit = document.getElementById ('unihan-data-finder-unit');
//
const tabs = unit.querySelectorAll ('.tab-bar .tab-radio');
const tabPanes = unit.querySelectorAll ('.tab-panes .tab-pane');
const tabInfos = unit.querySelectorAll ('.tab-infos .tab-info');
//
const tagSelect = unit.querySelector ('.find-by-tag-value .tag-select');
const tagCategoriesCheckbox = unit.querySelector ('.find-by-tag-value .categories-checkbox');
const tagSearchString = unit.querySelector ('.find-by-tag-value .search-string');
const tagWholeWord = unit.querySelector ('.find-by-tag-value .whole-word');
const tagUseRegex = unit.querySelector ('.find-by-tag-value .use-regex');
const tagSearchButton = unit.querySelector ('.find-by-tag-value .search-button');
const tagSearchInfo = unit.querySelector ('.find-by-tag-value .search-info');
const tagSearchData = unit.querySelector ('.find-by-tag-value .search-data');
const tagInstructions = unit.querySelector ('.find-by-tag-value .instructions');
const tagRegexExamples = unit.querySelector ('.find-by-tag-value .regex-examples');
//
const tagParams = { };
//
let tagCurrentTag;
let tagShowCategories;
//
const rsFullSetCheckbox = unit.querySelector ('.radical-strokes .full-set-checkbox');
const rsExtraSourcesCheckbox = unit.querySelector ('.radical-strokes .extra-sources-checkbox');
const rsRadicalSelect = unit.querySelector ('.radical-strokes .radical-select');
const rsStrokesSelect = unit.querySelector ('.radical-strokes .strokes-select');
const rsSearchButton = unit.querySelector ('.radical-strokes .search-button');
const rsSearchInfo = unit.querySelector ('.radical-strokes .search-info');
const rsSearchData = unit.querySelector ('.radical-strokes .search-data');
const rsInstructions = unit.querySelector ('.radical-strokes .instructions');
const rsRadicalList = unit.querySelector ('.radical-strokes .radical-list');
const rsRadicals = unit.querySelector ('.radical-strokes .radicals');
//
const rsParams = { };
//
let rsCurrentRadical;
let rsCurrentStrokes;
//
const gridParams = { };
//
const gridSpecimen = unit.querySelector ('.view-by-grid .specimen');
const gridGoButton = unit.querySelector ('.view-by-grid .go-button');
const gridSelectBlockRange = unit.querySelector ('.view-by-grid .select-block-range');
const gridSelectBlockName = unit.querySelector ('.view-by-grid .select-block-name');
const gridSearchInfo = unit.querySelector ('.view-by-grid .search-info');
const gridSearchData = unit.querySelector ('.view-by-grid .search-data');
const gridInstructions = unit.querySelector ('.view-by-grid .instructions');
const gridUnihanBlocks = unit.querySelector ('.view-by-grid .unihan-blocks');
const gridBlocks = unit.querySelector ('.view-by-grid .blocks');
//
module.exports.start = function (context)
{
    const { remote } = require ('electron');
    //
    const rewritePattern = require ('regexpu-core');
    //
    const unihanData = require ('../../lib/unicode/parsed-unihan-data.js');
    //
    unihanCount = unihanData.fullSet.length;
    //
    const defaultPrefs =
    {
        tabName: "",
        //
        tagSelect: "",
        tagShowCategories: false,
        tagSearchString: "",
        tagWholeWord: false,
        tagUseRegex: false,
        tagPageSize: 8,
        tagInstructions: true,
        tagRegexExamples: false,
        //
        rsFullSetCheckbox: false,
        rsExtraSourcesCheckbox: false,
        rsRadicalSelect: "",
        rsStrokesSelect: "",
        rsInstructions: true,
        rsRadicalList: false,
        //
        gridSelectBlockRange: "4E00-9FFF",  // CJK Unified Ideographs
        gridSpecimen: "",
        gridPageSize: 128,
        gridInstructions: true,
        gridUnihanBlocks: false
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    function updateTab (tabName)
    {
        let foundIndex = 0;
        tabs.forEach
        (
            (tab, index) =>
            {
                let match = (tab.parentElement.textContent === tabName);
                if (match)
                {
                    foundIndex = index;
                }
                else
                {
                    tab.checked = false;
                    tabPanes[index].hidden = true;
                    tabInfos[index].hidden = true;
                }
            }
        );
        tabs[foundIndex].checked = true;
        tabPanes[foundIndex].hidden = false;
        tabInfos[foundIndex].hidden = false;
    }
    //
    updateTab (prefs.tabName);
    //
    for (let tab of tabs)
    {
        tab.addEventListener ('click', (event) => { updateTab (event.target.parentElement.textContent); });
    }
    //
    function clearSearch (info, data)
    {
        while (info.firstChild)
        {
            info.firstChild.remove ();
        }
        while (data.firstChild)
        {
            data.firstChild.remove ();
        }
    }
    //
    tagParams.pageSize = prefs.tagPageSize;
    tagParams.observer = null;
    tagParams.root = unit;
    //
    tagCurrentTag = prefs.tagSelect;
    tagShowCategories = prefs.tagShowCategories;
    //
    const tagDataTable = require ('./tag-data-table.js');
    //
    function updateTagMenu ()
    {
        while (tagSelect.firstChild)
        {
            tagSelect.firstChild.remove ();
        }
        if (tagShowCategories)
        {
            for (let category of unihanData.categories)
            {
                let optionGroup = document.createElement ('optgroup');
                optionGroup.label = "◎\xA0" + category.name;
                for (let tag of category.tags)
                {
                    let option = document.createElement ('option');
                    option.textContent = tag;
                    optionGroup.appendChild (option);
                }
                tagSelect.appendChild (optionGroup);
            }
        }
        else
        {
            let sortedTags = Object.keys (unihanData.tags).sort ((a, b) => a.localeCompare (b));
            for (let tag of sortedTags)
            {
                let option = document.createElement ('option');
                option.textContent = tag;
                tagSelect.appendChild (option);
            }
        }
        //
        tagSelect.value = tagCurrentTag;
        if (tagSelect.selectedIndex < 0) // -1: no element is selected
        {
            tagSelect.selectedIndex = 0;
        }
        tagCurrentTag = tagSelect.value;
    }
    //
    tagCategoriesCheckbox.checked = tagShowCategories;
    tagCategoriesCheckbox.addEventListener
    (
        'input',
        event =>
        {
            tagShowCategories = event.target.checked;
            updateTagMenu ();
        }
    );
    //
    tagSelect.addEventListener ('input', event => { tagCurrentTag = event.target.value; });
    updateTagMenu ();
    //
    tagWholeWord.checked = prefs.tagWholeWord;
    tagUseRegex.checked = prefs.tagUseRegex;
    //
    tagSearchString.addEventListener
    (
        'keypress',
        (event) =>
        {
            if (event.key === "Enter")
            {
                event.preventDefault (); // ??
                tagSearchButton.click ();
            }
        }
    );
    tagSearchString.addEventListener
    (
        'input',
        (event) =>
        {
            event.target.classList.remove ('error');
            event.target.title = "";
            if (tagUseRegex.checked)
            {
                try
                {
                    const flags = 'ui';
                    let pattern = event.target.value;
                    pattern = rewritePattern (pattern, flags, { unicodePropertyEscape: true, lookbehind: true, useUnicodeFlag: true });
                    let regex = new RegExp (pattern, flags);
                }
                catch (e)
                {
                    event.target.classList.add ('error');
                    event.target.title = e;
                }
            }
        }
    );
    tagSearchString.value = prefs.tagSearchString;
    tagSearchString.dispatchEvent (new Event ('input'));
    //
    tagUseRegex.addEventListener
    (
        'change',
        (event) => tagSearchString.dispatchEvent (new Event ('input'))
    );
    //
    function findCharactersByTag (regex, tag)
    {
        let characterInfoList = [ ];
        let codePoints = unihanData.codePoints;
        for (let codePoint of unihanData.fullSet)
        {
            if (tag in codePoints[codePoint])
            {
                let values = codePoints[codePoint][tag];
                if (!Array.isArray (values))
                {
                    values = [ values ];
                }
                let matchingValues = [ ];
                for (let value of values)
                {
                    if (value.match (regex))
                    {
                        matchingValues.push (value);
                    }
                }
                if (matchingValues.length > 0)
                {
                    characterInfoList.push
                    (
                        {
                            character: String.fromCodePoint (parseInt (codePoint.replace ("U+", ""), 16)),
                            codePoint: codePoint,
                            tag: tag,
                            value: ((matchingValues.length > 1) ? matchingValues : matchingValues[0])
                        }
                    );
                }
            }
        }
        return characterInfoList;
    }
    //
    tagSearchButton.addEventListener
    (
        'click',
        (event) =>
        {
            clearSearch (tagSearchInfo, tagSearchData);
            let searchString = tagSearchString.value;
            if (searchString)
            {
                let regex = null;
                try
                {
                    function characterToEcmaScriptEscape (character)
                    {
                        let num = character.codePointAt (0);
                        let hex = num.toString (16).toUpperCase ();
                        return `\\u{${hex}}`;
                    }
                    //
                    let pattern = (tagUseRegex.checked) ? searchString : Array.from (searchString).map ((char) => characterToEcmaScriptEscape (char)).join ('');
                    if (tagWholeWord.checked)
                    {
                        const beforeWordBoundary = '(?<![\\p{Alphabetic}\\p{Mark}\\p{Decimal_Number}\\p{Connector_Punctuation}\\p{Join_Control}])';
                        const afterWordBoundary = '(?![\\p{Alphabetic}\\p{Mark}\\p{Decimal_Number}\\p{Connector_Punctuation}\\p{Join_Control}])';
                        pattern = `${beforeWordBoundary}(${pattern})${afterWordBoundary}`;
                    }
                    const flags = 'ui';
                    pattern = rewritePattern (pattern, flags, { unicodePropertyEscape: true, lookbehind: true, useUnicodeFlag: true });
                    regex = new RegExp (pattern, flags);
                }
                catch (e)
                {
                }
                if (regex)
                {
                    let start = window.performance.now ();
                    let characterInfos = findCharactersByTag (regex, tagCurrentTag);
                    let stop = window.performance.now ();
                    let seconds = ((stop - start) / 1000).toFixed (2);
                    let closeButton = document.createElement ('button');
                    closeButton.type = 'button';
                    closeButton.className = 'close-button';
                    closeButton.innerHTML = '<svg class="close-cross" viewBox="0 0 8 8"><polygon points="1,0 4,3 7,0 8,1 5,4 8,7 7,8 4,5 1,8 0,7 3,4 0,1" /></svg>';
                    closeButton.title = "Clear results";
                    closeButton.addEventListener ('click', event => { clearSearch (tagSearchInfo, tagSearchData); });
                    tagSearchInfo.appendChild (closeButton);
                    let infoText = document.createElement ('span');
                    infoText.innerHTML = `Unihan characters: <strong>${characterInfos.length}</strong>&nbsp;/&nbsp;${unihanCount} (${seconds}&nbsp;seconds)`;
                    tagSearchInfo.appendChild (infoText);
                    if (characterInfos.length > 0)
                    {
                        tagSearchData.appendChild (tagDataTable.create (characterInfos, tagParams));
                    }
                }
            }
        }
    );
    //
    tagInstructions.open = prefs.tagInstructions;
    tagRegexExamples.open = prefs.tagRegexExamples;
    //
    rsParams.observer = null;
    rsParams.root = unit;
    //
    const rsDataTable = require ('./rs-data-table.js');
    //
    rsFullSetCheckbox.checked = prefs.rsFullSetCheckbox;
    //
    rsExtraSourcesCheckbox.checked = prefs.rsExtraSourcesCheckbox;
    //
    rsCurrentRadical = prefs.rsRadicalSelect;
    rsCurrentStrokes = prefs.rsStrokesSelect;
    //
    const kangxiRadicals = require ('../../lib/unicode/kangxi-radicals.json');
    //
    let lastStrokes = 0;
    let optionGroup = null;
    for (let radical of kangxiRadicals)
    {
        if (lastStrokes !== radical.strokes)
        {
            if (optionGroup)
            {
                rsRadicalSelect.appendChild (optionGroup);
            }
            optionGroup = document.createElement ('optgroup');
            optionGroup.label = `${radical.strokes}\u2002Stroke${radical.strokes > 1 ? 's': ''}`;
            lastStrokes = radical.strokes;
        }
        let option = document.createElement ('option');
        option.textContent = `${radical.index}\u2002${radical.radical}\u2002(${radical.name})`;
        option.value = radical.index;
        optionGroup.appendChild (option);
    }
    rsRadicalSelect.appendChild (optionGroup);
    //
    rsRadicalSelect.value = rsCurrentRadical;
    if (rsRadicalSelect.selectedIndex < 0) // -1: no element is selected
    {
        rsRadicalSelect.selectedIndex = 0;
    }
    rsCurrentRadical = rsRadicalSelect.value;
    //
    rsRadicalSelect.addEventListener ('input', event => { rsCurrentRadical = event.target.value; });
    //
    const minStrokes = 0;
    const maxStrokes = 62;  // 𠔻 U+2053B kRSKangXi 12.62
    //
    let allOption = document.createElement ('option');
    allOption.textContent = "All";
    allOption.value = '*';
    rsStrokesSelect.appendChild (allOption);
    let separatorOption = document.createElement ('option');
    separatorOption.textContent = "\u2015";   // Horizontal bar
    separatorOption.disabled = true;
    rsStrokesSelect.appendChild (separatorOption);
    for (let strokesIndex = minStrokes; strokesIndex <= maxStrokes; strokesIndex++)
    {
        let option = document.createElement ('option');
        option.textContent = strokesIndex;
        rsStrokesSelect.appendChild (option);
    }
    //
    rsStrokesSelect.value = rsCurrentStrokes;
    if (rsStrokesSelect.selectedIndex < 0) // -1: no element is selected
    {
        rsStrokesSelect.selectedIndex = 0;
    }
    rsCurrentStrokes = rsStrokesSelect.value;
    //
    rsStrokesSelect.addEventListener ('input', event => { rsCurrentStrokes = event.target.value; });
    //
    const { fromRSValue } = require ('../../lib/unicode/get-rs-strings.js');
    //
    const rsTags =
    [
        "kRSUnicode",   // Must be first
        "kRSKangXi",
        "kRSJapanese",
        "kRSKanWa",
        "kRSKorean",
        "kRSAdobe_Japan1_6"
    ];
    //
    function findCharactersByRadicalStrokes (options)
    {
        let items = [ ];
        for (let strokes = options.minStrokes; strokes <= options.maxStrokes; strokes++)
        {
            items.push ({ strokes: strokes, characters: [ ] });
        }
        let codePoints = unihanData.codePoints;
        let set = options.fullSet ? unihanData.fullSet : unihanData.coreSet;
        for (let codePoint of set)
        {
            let rsValues = [ ];
            let irgSourceValues = null;
            for (let rsTag of rsTags)
            {
                let rsTagValues = codePoints[codePoint][rsTag];
                if (rsTagValues)
                {
                    if (!Array.isArray (rsTagValues))
                    {
                        rsTagValues = [ rsTagValues ];
                    }
                    if (rsTag == "kRSUnicode")
                    {
                        irgSourceValues = [...rsTagValues];
                    }
                    else if (!options.extraSources)
                    {
                        break;
                    }
                    for (let rsTagValue of rsTagValues)
                    {
                        if (rsTag === "kRSAdobe_Japan1_6")
                        {
                            let parsed = rsTagValue.match (/^([CV])\+[0-9]{1,5}\+([1-9][0-9]{0,2}\.[1-9][0-9]?\.[0-9]{1,2})$/);
                            if (parsed[1] === 'C')
                            {
                                let [ index, strokes, residual ] = parsed[2].split ('.');
                                rsValues.push ([ index, residual ].join ('.'));
                            }
                        }
                        else
                        {
                            rsValues.push (rsTagValue);
                        }
                    }
                }
            }
            // Remove duplicates
            rsValues = [...new Set (rsValues.map (rsValue => rsValue.replace ("'", "").replace (/\.-\d+/, ".0")))];
            irgSourceValues = [...new Set (irgSourceValues.map (rsValue => rsValue.replace ("'", "").replace (/\.-\d+/, ".0")))];
            for (let rsValue of rsValues)
            {
                let [ tagRadical, tagResidual ] = rsValue.split ('.');
                if (parseInt (tagRadical) === options.radical)
                {
                    let residualStrokes = parseInt (tagResidual);
                    if ((options.minStrokes <= residualStrokes) && (residualStrokes <= options.maxStrokes))
                    {
                        let character =
                        {
                            symbol: String.fromCodePoint (parseInt (codePoint.replace ("U+", ""), 16)),
                            codePoint: codePoint
                        };
                        if (options.extraSources)
                        {
                            let extraSource = !irgSourceValues.includes (rsValue);
                            if (extraSource)
                            {
                                character.extraSource = extraSource;
                                character.toolTip = irgSourceValues.map (rsValue => fromRSValue (rsValue, true).join (" +\xA0")).join ("\n")

                            }
                        }
                        items[residualStrokes - options.minStrokes].characters.push (character);
                    }
                }
            }
        }
        return items;
    }
    //
    rsSearchButton.addEventListener
    (
        'click',
        (event) =>
        {
            clearSearch (rsSearchInfo, rsSearchData);
            let findOptions =
            {
                fullSet: rsFullSetCheckbox.checked,
                extraSources: rsExtraSourcesCheckbox.checked,
                radical: parseInt (rsCurrentRadical),
                minStrokes: (rsCurrentStrokes === '*') ? minStrokes : parseInt (rsCurrentStrokes),
                maxStrokes: (rsCurrentStrokes === '*') ? maxStrokes : parseInt (rsCurrentStrokes)
            };
            let start = window.performance.now ();
            let items = findCharactersByRadicalStrokes (findOptions);
            let stop = window.performance.now ();
            let seconds = ((stop - start) / 1000).toFixed (2);
            let resultCount = 0;
            for (let item of items)
            {
                resultCount += item.characters.length;
            };
            let closeButton = document.createElement ('button');
            closeButton.type = 'button';
            closeButton.className = 'close-button';
            closeButton.innerHTML = '<svg class="close-cross" viewBox="0 0 8 8"><polygon points="1,0 4,3 7,0 8,1 5,4 8,7 7,8 4,5 1,8 0,7 3,4 0,1" /></svg>';
            closeButton.title = "Clear results";
            closeButton.addEventListener ('click', event => { clearSearch (rsSearchInfo, rsSearchData); });
            rsSearchInfo.appendChild (closeButton);
            let infoText = document.createElement ('span');
            infoText.innerHTML = `Unihan characters: <strong>${resultCount}</strong>&nbsp;/&nbsp;${unihanCount} (${seconds}&nbsp;seconds)`;
            rsSearchInfo.appendChild (infoText);
            if (resultCount > 0)
            {
                let title = "Radical\u2002" + rsRadicalSelect[rsRadicalSelect.selectedIndex].textContent;
                rsSearchData.appendChild (rsDataTable.create (title, items, rsParams));
            }
        }
    );
    //
    rsInstructions.open = prefs.rsInstructions;
    rsRadicalList.open = prefs.rsRadicalList;
    //
    let radicalsTable = require ('./radicals-table.js');
    //
    rsRadicals.appendChild (radicalsTable.create (kangxiRadicals));
    //
    gridParams.pageSize = prefs.gridPageSize;
    gridParams.observer = null;
    gridParams.root = unit;
    //
    //
    const gridDataTable = require ('./grid-data-table.js');
    //
    const unihanBlocks = require ('./unihan-blocks.json');
    //
    const tables = require ('../../lib/tables.js');
    //
    const nameIndex = tables.buildKeyIndex (unihanBlocks, "name", (a, b) => a.localeCompare (b));
    const firstIndex = tables.buildKeyIndex (unihanBlocks, "first", (a, b) =>  parseInt (a, 16) - parseInt (b, 16));
    //
    let flags = 'u';
    let unihanPattern = rewritePattern ('(?=\\p{Script=Han})(?=\\p{Other_Letter})', flags, { unicodePropertyEscape: true, useUnicodeFlag: true });
    let unihanRegex = new RegExp (unihanPattern, flags);
    //
    let blocks = { };
    //
    unihanBlocks.forEach
    (
        block =>
        {
            block.key = `${block.first}-${block.last}`;
            blocks[block.key] = block;
            block.range = `U+${block.first}..U+${block.last}`;
            block.firstIndex = parseInt (block.first, 16);
            block.lastIndex = parseInt (block.last, 16);
            block.size = block.lastIndex - block.firstIndex + 1;
            block.characters = [ ];
            for (let index = block.firstIndex; index <= block.lastIndex; index++)
            {
                block.characters.push (String.fromCodePoint (index));
            }
            block.count = block.characters.filter (character => unihanRegex.test (character)).length;
        }
    );
    //
    function displayRangeTable (blockKey, charKey)
    {
        gridSearchInfo.textContent = "";
        while (gridSearchData.firstChild)
        {
            gridSearchData.firstChild.remove ();
        }
        let block = blocks[blockKey];
        let hilightedCharacter;
        if (charKey)
        {
            hilightedCharacter = String.fromCodePoint (parseInt (charKey, 16));
        }
        gridSearchInfo.innerHTML = `Unihan characters: <strong>${block.count}</strong>&nbsp;/&nbsp;Block size: <strong>${block.size}</strong>`;
        gridSearchData.appendChild (gridDataTable.create (block.characters, gridParams, hilightedCharacter));
    }
    //
    firstIndex.forEach
    (
        index =>
        {
            let block = unihanBlocks[index];
            let option = document.createElement ('option');
            option.value = block.key;
            option.textContent = block.range;
            option.title = block.name;
            gridSelectBlockRange.appendChild (option);
        }
    );
    //
    nameIndex.forEach
    (
        index =>
        {
            let block = unihanBlocks[index];
            let option = document.createElement ('option');
            option.value = block.key;
            option.textContent = block.name;
            option.title = block.range;
            gridSelectBlockName.appendChild (option);
        }
    );
    //
    gridSpecimen.value = prefs.gridSpecimen;
    //
    const specimenRegex = /^\s*(?:(.)|(?:[Uu]\+)?\s*([0-9a-fA-F]{4,5}|10[0-9a-fA-F]{4}))\s*$/u;
    //
    gridSpecimen.pattern = specimenRegex.source;
    gridSpecimen.addEventListener
    (
        'keypress',
        (event) =>
        {
            if (event.key === "Enter")
            {
                event.preventDefault (); // ??
                gridGoButton.click ();
            }
        }
    );
    //
    gridGoButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (gridSpecimen.value)
            {
                let match = gridSpecimen.value.match (specimenRegex);
                if (match)
                {
                    let num;
                    if (match[1])
                    {
                        num = match[1].codePointAt (0);
                    }
                    else if (match[2])
                    {
                        num = parseInt (match[2], 16);
                    }
                    let hex = num.toString (16).toUpperCase ();
                    if (hex.length < 5)
                    {
                        hex = ("000" + hex).slice (-4);
                    }
                    let blockKey = null;
                    for (let block of unihanBlocks)
                    {
                        if ((block.firstIndex <= num) && (num <= block.lastIndex))
                        {
                            blockKey = block.key;
                            break;
                        }
                    }
                    let character = String.fromCodePoint (parseInt (hex, 16));
                    if (blockKey && unihanRegex.test (character))
                    {
                        gridSpecimen.value = character;
                        gridSelectBlockRange.value = blockKey;
                        gridSelectBlockName.value = blockKey;
                        displayRangeTable (blockKey, hex);
                    }
                    else
                    {
                        remote.shell.beep ();
                        // gridSpecimen.value = "";
                    }
                }
            }
            else
            {
                displayRangeTable (gridSelectBlockRange.value);
            }
        }
    );
    //
    gridSelectBlockRange.value = prefs.gridSelectBlockRange;
    if (gridSelectBlockRange.selectedIndex < 0) // -1: no element is selected
    {
        gridSelectBlockRange.selectedIndex = 0;
    }
    //
    gridSelectBlockName.value = gridSelectBlockRange.value;
    displayRangeTable (gridSelectBlockName.value);
    //
    gridSelectBlockRange.addEventListener
    (
        'input',
        (event) =>
        {
            gridSelectBlockName.value = event.target.value;
            displayRangeTable (event.target.value);
        }
    );
    //
    gridSelectBlockName.addEventListener
    (
        'input',
        (event) =>
        {
            gridSelectBlockRange.value = event.target.value;
            displayRangeTable (event.target.value);
        }
    );
    //
    gridInstructions.open = prefs.gridInstructions;
    gridUnihanBlocks.open = prefs.gridUnihanBlocks;
    //
    let blocksTable = require ('./blocks-table.js');
    //
    gridBlocks.appendChild (blocksTable.create (unihanBlocks));
}
//
module.exports.stop = function (context)
{
    function getCurrentTabName ()
    {
        let currentTabName = "";
        for (let tab of tabs)
        {
            if (tab.checked)
            {
                currentTabName = tab.parentElement.textContent;
                break;
            }
        }
        return currentTabName;
    }
    //
    let prefs =
    {
        tabName: getCurrentTabName (),
        //
        tagSelect: tagCurrentTag,
        tagShowCategories: tagShowCategories,
        tagSearchString: tagSearchString.value,
        tagWholeWord: tagWholeWord.checked,
        tagUseRegex: tagUseRegex.checked,
        tagPageSize: tagParams.pageSize,
        tagInstructions: tagInstructions.open,
        tagRegexExamples: tagRegexExamples.open,
        //
        rsFullSetCheckbox: rsFullSetCheckbox.checked,
        rsExtraSourcesCheckbox: rsExtraSourcesCheckbox.checked,
        rsRadicalSelect: rsCurrentRadical,
        rsStrokesSelect: rsCurrentStrokes,
        rsInstructions: rsInstructions.open,
        rsRadicalList: rsRadicalList.open,
        //
        gridSelectBlockRange: gridSelectBlockRange.value,
        gridSpecimen: gridSpecimen.value,
        gridPageSize: gridParams.pageSize,
        gridInstructions: gridInstructions.open,
        gridUnihanBlocks: gridUnihanBlocks.open
    };
    context.setPrefs (prefs);
};
//
