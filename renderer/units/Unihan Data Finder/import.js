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
const tagSearchMessage = unit.querySelector ('.find-by-tag-value .search-message');
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
const gridSpecimenHistorySize = 256;   // 0: unlimited
//
let gridSpecimenHistory = [ ];
let gridSpecimenHistoryIndex = -1;
let gridSpecimenHistorySave = null;
//
module.exports.start = function (context)
{
    const { remote } = require ('electron');
    //
    const regexUnicode = require ('../../lib/regex-unicode.js');
    const unihanData = require ('../../lib/unicode/parsed-unihan-data.js');
    //
    let unihanCount = unihanData.fullSet.length;
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
        rsCompactLayout: false,
        rsInstructions: true,
        rsRadicalList: false,
        //
        gridSelectBlockRange: "4E00-9FFF",  // CJK Unified Ideographs
        gridSpecimenHistory: [ ],
        gridPageSize: 128,
        gridPageIndex: 0,
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
        'focusin',
        (event) =>
        {
            if (event.target.classList.contains ('error'))
            {
                tagSearchMessage.classList.add ('shown');
            }
        }
    );
    tagSearchString.addEventListener
    (
        'focusout',
        (event) =>
        {
            if (event.target.classList.contains ('error'))
            {
                tagSearchMessage.classList.remove ('shown');
            }
        }
    );
    tagSearchString.addEventListener
    (
        'input',
        (event) =>
        {
            event.target.classList.remove ('error');
            tagSearchMessage.textContent = "";
            tagSearchMessage.classList.remove ('shown');
            if (tagUseRegex.checked)
            {
                try
                {
                    regexUnicode.build (event.target.value, { useRegex: tagUseRegex.checked });
                }
                catch (e)
                {
                    event.target.classList.add ('error');
                    tagSearchMessage.textContent = e.message;
                    if (event.target === document.activeElement)
                    {
                        tagSearchMessage.classList.add ('shown');
                    }
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
                    let character = String.fromCodePoint (parseInt (codePoint.replace ("U+", ""), 16));
                    let index = character.codePointAt (0);
                    let blockName;
                    let blockRange;
                    for (let block of unihanBlocks)
                    {
                        if ((block.firstIndex <= index) && (index <= block.lastIndex))
                        {
                            blockName = block.name;
                            blockRange = block.range;
                            break;
                        }
                    }
                    characterInfoList.push
                    (
                        {
                            character: character,
                            codePoint: codePoint,
                            tag: tag,
                            value: ((matchingValues.length > 1) ? matchingValues : matchingValues[0]),
                            blockName: blockName,
                            blockRange: blockRange
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
            if (!tagSearchString.classList.contains ('error'))
            {
                let searchString = tagSearchString.value;
                if (searchString)
                {
                    let regex = null;
                    try
                    {
                        regex = regexUnicode.build (searchString, { wholeWord: tagWholeWord.checked, useRegex: tagUseRegex.checked });
                    }
                    catch (e)
                    {
                    }
                    if (regex)
                    {
                        clearSearch (tagSearchInfo, tagSearchData);
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
            else
            {
                remote.shell.beep ();
            }
        }
    );
    //
    tagInstructions.open = prefs.tagInstructions;
    tagRegexExamples.open = prefs.tagRegexExamples;
    //
    rsParams.compactLayout = prefs.rsCompactLayout;
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
    const { fromRadical, fromStrokes } = require ('../../lib/unicode/get-rs-strings.js');
    //
    let lastStrokes = 0;
    let optionGroup = null;
    kangxiRadicals.forEach
    (
        (radical, index) =>
        {
            if (lastStrokes !== radical.strokes)
            {
                if (optionGroup)
                {
                    rsRadicalSelect.appendChild (optionGroup);
                }
                optionGroup = document.createElement ('optgroup');
                optionGroup.label = `${fromStrokes (radical.strokes, true).replace (" ", "\u2002")}`;
                lastStrokes = radical.strokes;
            }
            let option = document.createElement ('option');
            option.textContent = `${fromRadical (index + 1).replace (/^(\S+)\s(\S+)\s/u, "$1\u2002$2\u2002")}`;
            option.value = index + 1;
            optionGroup.appendChild (option);
        }
    );
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
            items.push ({ shortTitle: fromStrokes (strokes), longTitle: fromStrokes (strokes, true), characters: [ ] });
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
                        let code = codePoint.replace ("U+", "");
                        let character = { symbol: String.fromCodePoint (parseInt (code, 16)), code: code };
                        if (options.extraSources)
                        {
                            let extraSource = !irgSourceValues.includes (rsValue);
                            if (extraSource)
                            {
                                character.extraSource = extraSource;
                                character.toolTip = irgSourceValues.map (rsValue => fromRSValue (rsValue, true).join (" +\xA0")).join ("\n");
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
                let title = fromRadical (rsRadicalSelect.selectedIndex + 1, false, true).replace (/^(\S+)\s(\S+)\s(\S+)\s/u, "$1\u2002$2\u2002$3\u2002");
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
    gridSpecimenHistory = prefs.gridSpecimenHistory;
    //
    gridParams.pageSize = prefs.gridPageSize;
    gridParams.pageIndex = prefs.gridPageIndex;
    gridParams.observer = null;
    gridParams.root = unit;
    //
    const gridDataTable = require ('./grid-data-table.js');
    //
    const unihanBlocks = require ('./unihan-blocks.json');
    //
    const keyIndex = require ('../../lib/key-index.js');
    //
    const nameIndex = keyIndex.build (unihanBlocks, "name", (a, b) => a.localeCompare (b));
    const firstIndex = keyIndex.build (unihanBlocks, "first", (a, b) =>  parseInt (a, 16) - parseInt (b, 16));
    //
    // Unihan character
    let unihanRegex = regexUnicode.build ('(?=\\p{Script=Han})(?=\\p{Other_Letter})', { useRegex: true });
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
            block.coreCount = 0;
            block.fullCount = 0;
            for (let index = block.firstIndex; index <= block.lastIndex; index++)
            {
                let character = String.fromCodePoint (index);
                if (unihanRegex.test (character))
                {
                    block.fullCount++;
                }
                block.characters.push (character);
            }
        }
    );
    //
    for (let codePoint of unihanData.coreSet)
    {
        let index = parseInt (codePoint.replace ("U+", ""), 16);
        for (let block of unihanBlocks)
        {
            if ((block.firstIndex <= index) && (index <= block.lastIndex))
            {
                block.coreCount++;
                break;
            }
        }
    }
    //
    function displayRangeTable (blockKey, highlightedCharacter)
    {
        gridSearchInfo.textContent = "";
        while (gridSearchData.firstChild)
        {
            gridSearchData.firstChild.remove ();
        }
        let block = blocks[blockKey];
        gridSearchInfo.innerHTML = `Unihan characters: <strong>${block.fullCount}</strong>&nbsp;/&nbsp;Block size: <strong>${block.size}</strong>`;
        gridSearchData.appendChild (gridDataTable.create (block.characters, gridParams, highlightedCharacter));
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
    const characterOrCodePointRegex = /^\s*(?:(.)|(?:[Uu]\+)?([0-9a-fA-F]{4,5}|10[0-9a-fA-F]{4}))\s*$/u;
    //
    function parseUnihanCharacter (inputString)
    {
        let character = "";
        let match = inputString.match (characterOrCodePointRegex);
        if (match)
        {
            if (match[1])
            {
                character = match[1];
            }
            else if (match[2])
            {
                character = String.fromCodePoint (parseInt (match[2], 16));
            }
            if (!unihanRegex.test (character))
            {
                character = "";
            }
        }
        return character;
    }
    // 
    gridSpecimen.addEventListener
    (
        'input',
        (event) =>
        {
            event.target.classList.remove ('invalid');
            if (event.target.value)
            {
                if (!parseUnihanCharacter (event.target.value))
                {
                    event.target.classList.add ('invalid');
                }
            }
        }
    );
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
    gridSpecimen.addEventListener
    (
        'keydown',
        (event) =>
        {
            if (event.altKey)
            {
                if (event.key === "ArrowUp")
                {
                    event.preventDefault ();
                    if (gridSpecimenHistoryIndex === -1)
                    {
                        gridSpecimenHistorySave = event.target.value;
                    }
                    gridSpecimenHistoryIndex++;
                    if (gridSpecimenHistoryIndex > (gridSpecimenHistory.length - 1))
                    {
                        gridSpecimenHistoryIndex = (gridSpecimenHistory.length - 1);
                    }
                    if (gridSpecimenHistoryIndex !== -1)
                    {
                        event.target.value = gridSpecimenHistory[gridSpecimenHistoryIndex];
                        event.target.dispatchEvent (new Event ('input'));
                    }
                }
                else if (event.key === "ArrowDown")
                {
                    event.preventDefault ();
                    gridSpecimenHistoryIndex--;
                    if (gridSpecimenHistoryIndex < -1)
                    {
                        gridSpecimenHistoryIndex = -1;
                        gridSpecimenHistorySave = null;
                    }
                    if (gridSpecimenHistoryIndex === -1)
                    {
                        if (gridSpecimenHistorySave !== null)
                        {
                            event.target.value = gridSpecimenHistorySave;
                            event.target.dispatchEvent (new Event ('input'));
                        }
                    }
                    else
                    {
                        event.target.value = gridSpecimenHistory[gridSpecimenHistoryIndex];
                        event.target.dispatchEvent (new Event ('input'));
                    }
                }
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
                let character = parseUnihanCharacter (gridSpecimen.value);
                if (character)
                {
                    let index = character.codePointAt (0);
                    let blockKey = null;
                    for (let block of unihanBlocks)
                    {
                        if ((block.firstIndex <= index) && (index <= block.lastIndex))
                        {
                            blockKey = block.key;
                            break;
                        }
                    }
                    if (blockKey)   // Better safe than sorry...
                    {
                        let indexOfUnihanCharacter = gridSpecimenHistory.indexOf (character);
                        if (indexOfUnihanCharacter !== -1)
                        {
                            gridSpecimenHistory.splice (indexOfUnihanCharacter, 1);
                        }
                        gridSpecimenHistory.unshift (character);
                        if ((gridSpecimenHistorySize > 0) && (gridSpecimenHistory.length > gridSpecimenHistorySize))
                        {
                            gridSpecimenHistory.pop ();
                        }
                        gridSpecimenHistoryIndex = -1;
                        gridSpecimenHistorySave = null;
                        gridSpecimen.value = "";
                        gridSelectBlockRange.value = blockKey;
                        gridSelectBlockName.value = blockKey;
                        displayRangeTable (blockKey, character);
                    }
                }
                else
                {
                    remote.shell.beep ();
                }
            }
            else
            {
                gridSpecimenHistoryIndex = -1;
                gridSpecimenHistorySave = null;
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
            gridParams.pageIndex = 0;
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
            gridParams.pageIndex = 0;
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
        rsCompactLayout: rsParams.compactLayout,
        rsInstructions: rsInstructions.open,
        rsRadicalList: rsRadicalList.open,
        //
        gridSelectBlockRange: gridSelectBlockRange.value,
        gridSpecimenHistory: gridSpecimenHistory,
        gridPageSize: gridParams.pageSize,
        gridPageIndex: gridParams.pageIndex,
        gridInstructions: gridInstructions.open,
        gridUnihanBlocks: gridUnihanBlocks.open
    };
    context.setPrefs (prefs);
};
//
