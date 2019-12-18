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
const tagResultsButton = unit.querySelector ('.find-by-tag-value .results-button');
const tagHitCount = unit.querySelector ('.find-by-tag-value .hit-count');
const tagTotalCount = unit.querySelector ('.find-by-tag-value .total-count');
const tagSearchData = unit.querySelector ('.find-by-tag-value .search-data');
const tagInstructions = unit.querySelector ('.find-by-tag-value .instructions');
const tagRegexExamples = unit.querySelector ('.find-by-tag-value .regex-examples');
//
const tagParams = { };
//
let tagCurrentTag;
let tagShowCategories;
//
const matchSearchString = unit.querySelector ('.match-character .search-string');
const matchSearchMessage = unit.querySelector ('.match-character .search-message');
const matchVariants = unit.querySelector ('.match-character .match-variants');
const matchCaseSensitive = unit.querySelector ('.match-character .case-sensitive');
const matchUseRegex = unit.querySelector ('.match-character .use-regex');
const matchSearchButton = unit.querySelector ('.match-character .search-button');
const matchResultsButton = unit.querySelector ('.match-character .results-button');
const matchHitCount = unit.querySelector ('.match-character .hit-count');
const matchTotalCount = unit.querySelector ('.match-character .total-count');
const matchSearchData = unit.querySelector ('.match-character .search-data');
const matchInstructions = unit.querySelector ('.match-character .instructions');
const matchRegexExamples = unit.querySelector ('.match-character .regex-examples');
//
const matchParams = { };
//
const gridSpecimen = unit.querySelector ('.view-by-grid .specimen');
const gridGoButton = unit.querySelector ('.view-by-grid .go-button');
const gridSelectBlockRange = unit.querySelector ('.view-by-grid .select-block-range');
const gridSelectBlockName = unit.querySelector ('.view-by-grid .select-block-name');
const gridResultsButton = unit.querySelector ('.view-by-grid .results-button');
const gridHitCount = unit.querySelector ('.view-by-grid .hit-count');
const gridTotalCount = unit.querySelector ('.view-by-grid .total-count');
const gridSearchData = unit.querySelector ('.view-by-grid .search-data');
const gridInstructions = unit.querySelector ('.view-by-grid .instructions');
const gridUnihanBlocks = unit.querySelector ('.view-by-grid .unihan-blocks');
const gridBlocks = unit.querySelector ('.view-by-grid .blocks');
//
const gridParams = { };
//
const gridSpecimenHistorySize = 256;   // 0: unlimited
//
let gridSpecimenHistory = [ ];
let gridSpecimenHistoryIndex = -1;
let gridSpecimenHistorySave = null;
//
let defaultFolderPath;
//
module.exports.start = function (context)
{
    const { remote } = require ('electron');
    //
    const path = require ('path');
    //
    const fileDialogs = require ('../../lib/file-dialogs.js');
    const pullDownMenus = require ('../../lib/pull-down-menus.js');
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
        matchSearchString: "",
        matchVariants: false,
        matchCaseSensitive: false,
        matchUseRegex: false,
        matchPageSize: 8,
        matchInstructions: true,
        matchRegexExamples: false,
        //
        gridSelectBlockRange: "4E00-9FFF",  // CJK Unified Ideographs
        gridSpecimenHistory: [ ],
        gridPageSize: 128,
        gridPageIndex: 0,
        gridInstructions: true,
        gridUnihanBlocks: false,
        //
        defaultFolderPath: context.defaultFolderPath
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    defaultFolderPath = prefs.defaultFolderPath;
    //
    function saveResults (string)
    {
        fileDialogs.saveTextFile
        (
            "Save text file:",
            [ { name: "Text (*.txt)", extensions: [ 'txt' ] } ],
            defaultFolderPath,
            (filePath) =>
            {
                defaultFolderPath = path.dirname (filePath);
                return string;
            }
        );
    }
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
        tab.addEventListener ('click', (event) => { updateTab (event.currentTarget.parentElement.textContent); });
    }
    //
    function clearSearch (data)
    {
        while (data.firstChild)
        {
            data.firstChild.remove ();
        }
    }
    //
    const tagDataTable = require ('./tag-data-table.js');
    //
    tagParams.pageSize = prefs.tagPageSize;
    tagParams.observer = null;
    tagParams.root = unit;
    //
    tagCurrentTag = prefs.tagSelect;
    tagShowCategories = prefs.tagShowCategories;
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
                    option.title = unihanData.tags[tag].name;
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
                option.title = unihanData.tags[tag].name;
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
            tagShowCategories = event.currentTarget.checked;
            updateTagMenu ();
        }
    );
    //
    tagSelect.addEventListener ('input', event => { tagCurrentTag = event.currentTarget.value; });
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
            if (event.key === 'Enter')
            {
                event.preventDefault ();
                tagSearchButton.click ();
            }
        }
    );
    tagSearchString.addEventListener
    (
        'focusin',
        (event) =>
        {
            if (event.currentTarget.classList.contains ('error'))
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
            if (event.currentTarget.classList.contains ('error'))
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
            event.currentTarget.classList.remove ('error');
            tagSearchMessage.textContent = "";
            tagSearchMessage.classList.remove ('shown');
            if (tagUseRegex.checked)
            {
                try
                {
                    regexUnicode.build (event.currentTarget.value, { useRegex: tagUseRegex.checked });
                }
                catch (e)
                {
                    event.currentTarget.classList.add ('error');
                    tagSearchMessage.textContent = e.message;
                    if (event.currentTarget === document.activeElement)
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
                    matchingValues.push (value.match (regex) !== null);
                }
                if (matchingValues.includes (true))
                {
                    let character = String.fromCodePoint (parseInt (codePoint.replace ("U+", ""), 16));
                    characterInfoList.push
                    (
                        {
                            character: character,
                            codePoint: codePoint,
                            tag: tag,
                            value: ((values.length > 1) ? values : values[0]),
                            matching: ((matchingValues.length > 1) ? matchingValues : matchingValues[0])
                        }
                    );
                }
            }
        }
        return characterInfoList;
    }
    //
    function updateTagResults (hitCount, totalCount)
    {
        tagHitCount.textContent = hitCount;
        tagTotalCount.textContent = totalCount;
        tagResultsButton.disabled = (hitCount <= 0);
    }
    //
    let currentCharactersByTag = [ ];
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
                        clearSearch (tagSearchData);
                        let characterInfos = findCharactersByTag (regex, tagCurrentTag);
                        currentCharactersByTag = characterInfos.map (info => info.character);
                        updateTagResults (currentCharactersByTag.length, unihanCount);
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
    let tagResultsMenu =
    remote.Menu.buildFromTemplate
    (
        [
            {
                label: "Copy Results", // "Copy Results as String"
                click: () => 
                {
                    if (currentCharactersByTag.length > 0)
                    {
                        remote.clipboard.writeText (currentCharactersByTag.join (""));
                    }
                }
            },
            {
                label: "Save Results...", // "Save Results to File"
                click: () => 
                {
                    saveResults (currentCharactersByTag.join (""));
                }
            },
            { type: 'separator' },
            {
                label: "Clear Results",
                click: () => 
                {
                    clearSearch (tagSearchData);
                    currentCharactersByTag = [ ];
                    updateTagResults (currentCharactersByTag.length, unihanCount);
                }
            }
        ]
    );
    //
    tagResultsButton.addEventListener
    (
        'click',
        (event) =>
        {
            pullDownMenus.popup (event.currentTarget, tagResultsMenu);
        }
    );
    //
    updateTagResults (currentCharactersByTag.length, unihanCount);
    //
    tagInstructions.open = prefs.tagInstructions;
    tagRegexExamples.open = prefs.tagRegexExamples;
    //
    const matchDataTable = require ('./match-data-table.js');
    //
    const yasuokaVariants = require ('../../lib/unicode/parsed-yasuoka-variants-data.js');
    //
    matchParams.pageSize = prefs.matchPageSize;
    matchParams.observer = null;
    matchParams.root = unit;
    //
    matchVariants.checked = prefs.matchVariants;
    //
    matchCaseSensitive.checked = prefs.matchCaseSensitive;
    matchUseRegex.checked = prefs.matchUseRegex;
    //
    matchSearchString.addEventListener
    (
        'keypress',
        (event) =>
        {
            if (event.key === 'Enter')
            {
                event.preventDefault ();
                matchSearchButton.click ();
            }
        }
    );
    matchSearchString.addEventListener
    (
        'focusin',
        (event) =>
        {
            if (event.currentTarget.classList.contains ('error'))
            {
                matchSearchMessage.classList.add ('shown');
            }
        }
    );
    matchSearchString.addEventListener
    (
        'focusout',
        (event) =>
        {
            if (event.currentTarget.classList.contains ('error'))
            {
                matchSearchMessage.classList.remove ('shown');
            }
        }
    );
    matchSearchString.addEventListener
    (
        'input',
        (event) =>
        {
            event.currentTarget.classList.remove ('error');
            matchSearchMessage.textContent = "";
            matchSearchMessage.classList.remove ('shown');
            if (matchUseRegex.checked)
            {
                try
                {
                    regexUnicode.build (event.currentTarget.value, { caseSensitive: matchCaseSensitive.checked, useRegex: matchUseRegex.checked });
                }
                catch (e)
                {
                    event.currentTarget.classList.add ('error');
                    matchSearchMessage.textContent = e.message;
                    if (event.currentTarget === document.activeElement)
                    {
                        matchSearchMessage.classList.add ('shown');
                    }
                }
            }
        }
    );
    matchSearchString.value = prefs.matchSearchString;
    matchSearchString.dispatchEvent (new Event ('input'));
    //
    matchUseRegex.addEventListener
    (
        'change',
        (event) => matchSearchString.dispatchEvent (new Event ('input'))
    );
    //
    let variantTags =
    [
        'kCompatibilityVariant',
        'kSemanticVariant',
        'kSimplifiedVariant',
        'kSpecializedSemanticVariant',
        'kTraditionalVariant',
        'kZVariant'
    ];
    //
    function getVariants (codePoint)
    {
        let variantCodePoints = [ ];
        let codePointData = unihanData.codePoints[codePoint];
        // Unicode Variants
        for (let variantTag of variantTags)
        {
            if (variantTag in codePointData)
            {
                let variants = codePointData[variantTag];
                if (!Array.isArray (variants))
                {
                    variants = [ variants ];
                }
                for (let variant of variants)
                {
                    variant = variant.split ("<")[0];
                    if (!variantCodePoints.includes (variant))
                    {
                        variantCodePoints.push (variant);
                    }
                }
            }
        }
        // Yasuoka Variants
        let variants = yasuokaVariants[codePoint] || [ ];
        for (let variant of variants)
        {
            if (variant in unihanData.codePoints)
            {
                if (!variantCodePoints.includes (variant))
                {
                    variantCodePoints.push (variant);
                }
            }
        }
        return variantCodePoints;
    }
    //
    function findCharactersByMatch (regex, matchVariants)
    {
        let characterList = [ ];
        for (let codePoint of unihanData.fullSet)
        {
            let character = String.fromCodePoint (parseInt (codePoint.replace ("U+", ""), 16));
            if (regex.test (character))
            {
                characterList.push (character);
                if (matchVariants)
                {
                    let variants = getVariants (codePoint);
                    for (let variant of variants)
                    {
                        characterList.push (String.fromCodePoint (parseInt (variant.replace ("U+", ""), 16)));
                    }
                }
            }
            else if (matchVariants)
            {
                let variants = getVariants (codePoint);
                for (let variant of variants)
                {
                    let variantCharacter = String.fromCodePoint (parseInt (variant.replace ("U+", ""), 16));
                    if (regex.test (variantCharacter))
                    {
                        characterList.push (character);
                    }
                }
            }
        }
        return [...new Set (characterList)].sort ((a, b) => a.codePointAt (0) - b.codePointAt (0));
    }
    //
    function updateMatchResults (hitCount, totalCount)
    {
        matchHitCount.textContent = hitCount;
        matchTotalCount.textContent = totalCount;
        matchResultsButton.disabled = (hitCount <= 0);
    }
    //
    let currentCharactersByMatch = [ ];
    //
    matchSearchButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (!matchSearchString.classList.contains ('error'))
            {
                let searchString = matchSearchString.value;
                if (searchString)
                {
                    let regex = null;
                    try
                    {
                        regex = regexUnicode.build (searchString, { caseSensitive: matchCaseSensitive.checked, useRegex: matchUseRegex.checked });
                    }
                    catch (e)
                    {
                    }
                    if (regex)
                    {
                        clearSearch (matchSearchData);
                        currentCharactersByMatch = findCharactersByMatch (regex, matchVariants.checked);
                        updateMatchResults (currentCharactersByMatch.length, unihanCount);
                        if (currentCharactersByMatch.length > 0)
                        {
                            matchParams.pageIndex = 0;
                            matchSearchData.appendChild (matchDataTable.create (currentCharactersByMatch, matchParams));
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
    let matchResultsMenu =
    remote.Menu.buildFromTemplate
    (
        [
            {
                label: "Copy Results", // "Copy Results as String"
                click: () => 
                {
                    if (currentCharactersByMatch.length > 0)
                    {
                        remote.clipboard.writeText (currentCharactersByMatch.join (""));
                    }
                }
            },
            {
                label: "Save Results...", // "Save Results to File"
                click: () => 
                {
                    saveResults (currentCharactersByMatch.join (""));
                }
            },
            { type: 'separator' },
            {
                label: "Clear Results",
                click: () => 
                {
                    clearSearch (matchSearchData);
                    currentCharactersByMatch = [ ];
                    updateMatchResults (currentCharactersByMatch.length, unihanCount);
                }
            }
        ]
    );
    //
    matchResultsButton.addEventListener
    (
        'click',
        (event) =>
        {
            pullDownMenus.popup (event.currentTarget, matchResultsMenu);
        }
    );
    //
    updateMatchResults (currentCharactersByMatch.length, unihanCount);
    //
    matchInstructions.open = prefs.matchInstructions;
    matchRegexExamples.open = prefs.matchRegexExamples;
    //
    const gridDataTable = require ('./grid-data-table.js');
    //
    gridSpecimenHistory = prefs.gridSpecimenHistory;
    //
    gridParams.pageSize = prefs.gridPageSize;
    gridParams.pageIndex = prefs.gridPageIndex;
    gridParams.observer = null;
    gridParams.root = unit;
    //
    const unihanBlocks = require ('./unihan-blocks.json');
    //
    const keyIndex = require ('../../lib/key-index.js');
    //
    const nameIndex = keyIndex.build (unihanBlocks, 'name', (a, b) => a.localeCompare (b));
    const firstIndex = keyIndex.build (unihanBlocks, 'first', (a, b) =>  parseInt (a, 16) - parseInt (b, 16));
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
    function updateGridResults (hitCount, totalCount)
    {
        gridHitCount.textContent = hitCount;
        gridTotalCount.textContent = totalCount;
        gridResultsButton.disabled = (hitCount <= 0);
    }
    //
    let assignedRegex = regexUnicode.build ('\\p{Assigned}', { useRegex: true });
    //
    let currentCharactersByGrid = [ ];
    //
    function displayRangeTable (blockKey, highlightedCharacter)
    {
        while (gridSearchData.firstChild)
        {
            gridSearchData.firstChild.remove ();
        }
        let block = blocks[blockKey];
        let characters = [ ];
        for (let index = block.firstIndex; index <= block.lastIndex; index++)
        {
            characters.push (String.fromCodePoint (index));
        }
        currentCharactersByGrid = characters.filter (character => assignedRegex.test (character));
        updateGridResults (block.fullCount, block.size);
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
            event.currentTarget.classList.remove ('invalid');
            if (event.currentTarget.value)
            {
                if (!parseUnihanCharacter (event.currentTarget.value))
                {
                    event.currentTarget.classList.add ('invalid');
                }
            }
        }
    );
    gridSpecimen.addEventListener
    (
        'keypress',
        (event) =>
        {
            if (event.key === 'Enter')
            {
                event.preventDefault ();
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
                if (event.key === 'ArrowUp')
                {
                    event.preventDefault ();
                    if (gridSpecimenHistoryIndex === -1)
                    {
                        gridSpecimenHistorySave = event.currentTarget.value;
                    }
                    gridSpecimenHistoryIndex++;
                    if (gridSpecimenHistoryIndex > (gridSpecimenHistory.length - 1))
                    {
                        gridSpecimenHistoryIndex = (gridSpecimenHistory.length - 1);
                    }
                    if (gridSpecimenHistoryIndex !== -1)
                    {
                        event.currentTarget.value = gridSpecimenHistory[gridSpecimenHistoryIndex];
                        event.currentTarget.dispatchEvent (new Event ('input'));
                    }
                }
                else if (event.key === 'ArrowDown')
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
                            event.currentTarget.value = gridSpecimenHistorySave;
                            event.currentTarget.dispatchEvent (new Event ('input'));
                        }
                    }
                    else
                    {
                        event.currentTarget.value = gridSpecimenHistory[gridSpecimenHistoryIndex];
                        event.currentTarget.dispatchEvent (new Event ('input'));
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
            gridSelectBlockName.value = event.currentTarget.value;
            gridParams.pageIndex = 0;
            displayRangeTable (event.currentTarget.value);
        }
    );
    //
    gridSelectBlockName.addEventListener
    (
        'input',
        (event) =>
        {
            gridSelectBlockRange.value = event.currentTarget.value;
            gridParams.pageIndex = 0;
            displayRangeTable (event.currentTarget.value);
        }
    );
    //
    let gridResultsMenu =
    remote.Menu.buildFromTemplate
    (
        [
            {
                label: "Copy Results", // "Copy Results as String"
                click: () => 
                {
                    if (currentCharactersByGrid.length > 0)
                    {
                        remote.clipboard.writeText (currentCharactersByGrid.join (""));
                    }
                }
            },
            {
                label: "Save Results...", // "Save Results to File"
                click: () => 
                {
                    saveResults (currentCharactersByGrid.join (""));
                }
            }
        ]
    );
    //
    gridResultsButton.addEventListener
    (
        'click',
        (event) =>
        {
            pullDownMenus.popup (event.currentTarget, gridResultsMenu);
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
        matchSearchString: matchSearchString.value,
        matchVariants: matchVariants.checked,
        matchCaseSensitive: matchCaseSensitive.checked,
        matchUseRegex: matchUseRegex.checked,
        matchPageSize: matchParams.pageSize,
        matchInstructions: matchInstructions.open,
        matchRegexExamples: matchRegexExamples.open,
        //
        gridSelectBlockRange: gridSelectBlockRange.value,
        gridSpecimenHistory: gridSpecimenHistory,
        gridPageSize: gridParams.pageSize,
        gridPageIndex: gridParams.pageIndex,
        gridInstructions: gridInstructions.open,
        gridUnihanBlocks: gridUnihanBlocks.open,
        //
        defaultFolderPath: defaultFolderPath
    };
    context.setPrefs (prefs);
};
//
