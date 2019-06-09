//
const unit = document.getElementById ('unicode-data-finder-unit');
//
const tabs = unit.querySelectorAll ('.tab-bar .tab-radio');
const tabPanes = unit.querySelectorAll ('.tab-panes .tab-pane');
const tabInfos = unit.querySelectorAll ('.tab-infos .tab-info');
//
const nameSearchString = unit.querySelector ('.find-by-name .search-string');
const nameSearchMessage = unit.querySelector ('.find-by-name .search-message');
const nameWholeWord = unit.querySelector ('.find-by-name .whole-word');
const nameUseRegex = unit.querySelector ('.find-by-name .use-regex');
const nameSearchButton = unit.querySelector ('.find-by-name .search-button');
const nameResultsButton = unit.querySelector ('.find-by-name .results-button');
const nameHitCount = unit.querySelector ('.find-by-name .hit-count');
const nameTotalCount = unit.querySelector ('.find-by-name .total-count');
const nameSearchData = unit.querySelector ('.find-by-name .search-data');
const nameInstructions = unit.querySelector ('.find-by-name .instructions');
const nameRegexExamples = unit.querySelector ('.find-by-name .regex-examples');
//
const nameParams = { };
//
const matchSearchString = unit.querySelector ('.match-character .search-string');
const matchSearchMessage = unit.querySelector ('.match-character .search-message');
const matchDecomposition = unit.querySelector ('.match-character .match-decomposition');
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
const blockSpecimen = unit.querySelector ('.list-by-block .specimen');
const blockGoButton = unit.querySelector ('.list-by-block .go-button');
const blockSelectBlockRange = unit.querySelector ('.list-by-block .select-block-range');
const blockSelectBlockName = unit.querySelector ('.list-by-block .select-block-name');
const blockResultsButton = unit.querySelector ('.list-by-block .results-button');
const blockHitCount = unit.querySelector ('.list-by-block .hit-count');
const blockTotalCount = unit.querySelector ('.list-by-block .total-count');
const blockSearchData = unit.querySelector ('.list-by-block .search-data');
const blockInstructions = unit.querySelector ('.list-by-block .instructions');
//
const blockParams = { };
//
const blockSpecimenHistorySize = 256;   // 0: unlimited
//
let blockSpecimenHistory = [ ];
let blockSpecimenHistoryIndex = -1;
let blockSpecimenHistorySave = null;
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
    const unicode = require ('../../lib/unicode/unicode.js');
    //
    const dataTable = require ('./data-table.js');
    //
    const defaultPrefs =
    {
        tabName: "",
        //
        nameSearchString: "",
        nameWholeWord: false,
        nameUseRegex: false,
        namePageSize: 8,
        nameInstructions: true,
        nameRegexExamples: false,
        //
        matchSearchString: "",
        matchDecomposition: false,
        matchCaseSensitive: false,
        matchUseRegex: false,
        matchPageSize: 8,
        matchInstructions: true,
        matchRegexExamples: false,
        //
        blockSelectBlockRange: "",
        blockSpecimenHistory: [ ],
        blockPageSize: 8,
        blockPageIndex: 0,
        blockInstructions: true,
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
    nameParams.pageSize = prefs.namePageSize;
    nameParams.observer = null;
    nameParams.root = unit;
    //
    nameWholeWord.checked = prefs.nameWholeWord;
    nameUseRegex.checked = prefs.nameUseRegex;
    //
    nameSearchString.addEventListener
    (
        'keypress',
        (event) =>
        {
            if (event.key === 'Enter')
            {
                event.preventDefault ();
                nameSearchButton.click ();
            }
        }
    );
    nameSearchString.addEventListener
    (
        'focusin',
        (event) =>
        {
            if (event.currentTarget.classList.contains ('error'))
            {
                nameSearchMessage.classList.add ('shown');
            }
        }
    );
    nameSearchString.addEventListener
    (
        'focusout',
        (event) =>
        {
            if (event.currentTarget.classList.contains ('error'))
            {
                nameSearchMessage.classList.remove ('shown');
            }
        }
    );
    nameSearchString.addEventListener
    (
        'input',
        (event) =>
        {
            event.currentTarget.classList.remove ('error');
            nameSearchMessage.textContent = "";
            nameSearchMessage.classList.remove ('shown');
            if (nameUseRegex.checked)
            {
                try
                {
                    regexUnicode.build (event.currentTarget.value, { useRegex: nameUseRegex.checked });
                }
                catch (e)
                {
                    event.currentTarget.classList.add ('error');
                    nameSearchMessage.textContent = e.message;
                    if (event.currentTarget === document.activeElement)
                    {
                        nameSearchMessage.classList.add ('shown');
                    }
                }
            }
        }
    );
    nameSearchString.value = prefs.nameSearchString;
    nameSearchString.dispatchEvent (new Event ('input'));
    //
    nameUseRegex.addEventListener
    (
        'change',
        (event) => nameSearchString.dispatchEvent (new Event ('input'))
    );
    //
    function updateNameResults (hitCount, totalCount)
    {
        nameHitCount.textContent = hitCount;
        nameTotalCount.textContent = totalCount;
        nameResultsButton.disabled = (hitCount <= 0);
    }
    //
    let currentCharactersByName = [ ];
    //
    nameSearchButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (!nameSearchString.classList.contains ('error'))
            {
                let searchString = nameSearchString.value;
                if (searchString)
                {
                    let regex = null;
                    try
                    {
                        regex = regexUnicode.build (searchString, { wholeWord: nameWholeWord.checked, useRegex: nameUseRegex.checked });
                    }
                    catch (e)
                    {
                    }
                    if (regex)
                    {
                        clearSearch (nameSearchData);
                        currentCharactersByName = unicode.findCharactersByName (regex);
                        updateNameResults (currentCharactersByName.length, unicode.characterCount);
                        if (currentCharactersByName.length > 0)
                        {
                            nameParams.pageIndex = 0;
                            nameSearchData.appendChild (dataTable.create (currentCharactersByName, nameParams));
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
    let nameResultsMenu =
    remote.Menu.buildFromTemplate
    (
        [
            {
                label: "Copy Results", // "Copy Results as String"
                click: () => 
                {
                    if (currentCharactersByName.length > 0)
                    {
                        remote.clipboard.writeText (currentCharactersByName.join (""));
                    }
                }
            },
            {
                label: "Save Results...", // "Save Results to File"
                click: () => 
                {
                    saveResults (currentCharactersByName.join (""));
                }
            },
            { type: 'separator' },
            {
                label: "Clear Results",
                click: () => 
                {
                    clearSearch (nameSearchData);
                    currentCharactersByName = [ ];
                    updateNameResults (currentCharactersByName.length, unicode.characterCount);
                }
            }
        ]
    );
    //
    nameResultsButton.addEventListener
    (
        'click',
        (event) =>
        {
            pullDownMenus.popup (event.currentTarget, nameResultsMenu);
        }
    );
    //
    updateNameResults (currentCharactersByName.length, unicode.characterCount);
    //
    nameInstructions.open = prefs.nameInstructions;
    nameRegexExamples.open = prefs.nameRegexExamples;
    //
    matchParams.pageSize = prefs.matchPageSize;
    matchParams.observer = null;
    matchParams.root = unit;
    //
    matchDecomposition.checked = prefs.matchDecomposition;
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
                        currentCharactersByMatch = unicode.findCharactersByMatch (regex, matchDecomposition.checked);
                        updateMatchResults (currentCharactersByMatch.length, unicode.characterCount);
                        if (currentCharactersByMatch.length > 0)
                        {
                            matchParams.pageIndex = 0;
                            matchSearchData.appendChild (dataTable.create (currentCharactersByMatch, matchParams));
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
                    updateMatchResults (currentCharactersByMatch.length, unicode.characterCount);
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
    updateMatchResults (currentCharactersByMatch.length, unicode.characterCount);
    //
    matchInstructions.open = prefs.matchInstructions;
    matchRegexExamples.open = prefs.matchRegexExamples;
    //
    blockSpecimenHistory = prefs.blockSpecimenHistory;
    //
    blockParams.pageSize = prefs.blockPageSize;
    blockParams.pageIndex = prefs.blockPageIndex;
    blockParams.observer = null;
    blockParams.root = unit;
    //
    const { blocks } = require ('../../lib/unicode/parsed-extra-data.js');
    //
    let blockKeys = { };
    let allBlocks = blocks.map
    (
        block =>
        {
            let blockData = { };
            blockData.name = block.name;
            blockData.key = `${block.first}-${block.last}`;
            blockData.range = `U+${block.first}..U+${block.last}`;
            blockData.firstIndex = parseInt (block.first, 16);
            blockData.lastIndex = parseInt (block.last, 16);
            blockData.size = blockData.lastIndex - blockData.firstIndex + 1;
            blockKeys[blockData.key] = blockData;
            return blockData;
        }
    );
    //
    const keyIndex = require ('../../lib/key-index.js');
    //
    const firstIndex = keyIndex.build (allBlocks, 'firstIndex', (a, b) => a - b);
    const nameIndex = keyIndex.build (allBlocks, 'name', (a, b) => a.localeCompare (b));
    //
    function updateBlockResults (hitCount, totalCount)
    {
        blockHitCount.textContent = hitCount;
        blockTotalCount.textContent = totalCount;
        blockResultsButton.disabled = (hitCount <= 0);
    }
    //
    let assignedRegex = regexUnicode.build ('\\p{Assigned}', { useRegex: true });
    //
    let currentCharactersByBlock = [ ];
    //
    function displayRangeTable (blockKey, highlightedCharacter)
    {
        while (blockSearchData.firstChild)
        {
            blockSearchData.firstChild.remove ();
        }
        let block = blockKeys[blockKey];
        let characters = [ ];
        for (let index = block.firstIndex; index <= block.lastIndex; index++)
        {
            characters.push (String.fromCodePoint (index));
        }
        // Temporary hack until regexpu-core module gets updated to Unicode 12.1!
        currentCharactersByBlock = characters.filter (character => assignedRegex.test (character) || (character === "\u32FF"));
        updateBlockResults (currentCharactersByBlock.length, block.size);
        blockSearchData.appendChild (dataTable.create (characters, blockParams, highlightedCharacter));
    }
    //
    firstIndex.forEach
    (
        index =>
        {
            let block = allBlocks[index];
            let option = document.createElement ('option');
            option.value = block.key;
            option.textContent = block.range;
            option.title = block.name;
            blockSelectBlockRange.appendChild (option);
        }
    );
    //
    nameIndex.forEach
    (
        index =>
        {
            let block = allBlocks[index];
            let option = document.createElement ('option');
            option.value = block.key;
            option.textContent = block.name;
            option.title = block.range;
            blockSelectBlockName.appendChild (option);
        }
    );
    //
    const characterOrCodePointRegex = /^\s*(?:(.)|(?:[Uu]\+)?([0-9a-fA-F]{4,5}|10[0-9a-fA-F]{4}))\s*$/u;
    //
    function getBlockKeyfromCharacter (character)
    {
        let blockKey = null;
        if (character)
        {
            let index = character.codePointAt (0);
            for (let block of allBlocks)
            {
                if ((block.firstIndex <= index) && (index <= block.lastIndex))
                {
                    blockKey = block.key;
                    break;
                }
            }
        }
        return blockKey;
    }
    //
    function parseCharacter (inputString)
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
        }
        return character;
    }
    // 
    blockSpecimen.addEventListener
    (
        'input',
        (event) =>
        {
            event.currentTarget.classList.remove ('invalid');
            if (event.currentTarget.value)
            {
                if (!getBlockKeyfromCharacter (parseCharacter (event.currentTarget.value)))
                {
                    event.currentTarget.classList.add ('invalid');
                }
            }
        }
    );
    blockSpecimen.addEventListener
    (
        'keypress',
        (event) =>
        {
            if (event.key === 'Enter')
            {
                event.preventDefault ();
                blockGoButton.click ();
            }
        }
    );
    blockSpecimen.addEventListener
    (
        'keydown',
        (event) =>
        {
            if (event.altKey)
            {
                if (event.key === 'ArrowUp')
                {
                    event.preventDefault ();
                    if (blockSpecimenHistoryIndex === -1)
                    {
                        blockSpecimenHistorySave = event.currentTarget.value;
                    }
                    blockSpecimenHistoryIndex++;
                    if (blockSpecimenHistoryIndex > (blockSpecimenHistory.length - 1))
                    {
                        blockSpecimenHistoryIndex = (blockSpecimenHistory.length - 1);
                    }
                    if (blockSpecimenHistoryIndex !== -1)
                    {
                        event.currentTarget.value = blockSpecimenHistory[blockSpecimenHistoryIndex];
                        event.currentTarget.dispatchEvent (new Event ('input'));
                    }
                }
                else if (event.key === 'ArrowDown')
                {
                    event.preventDefault ();
                    blockSpecimenHistoryIndex--;
                    if (blockSpecimenHistoryIndex < -1)
                    {
                        blockSpecimenHistoryIndex = -1;
                        blockSpecimenHistorySave = null;
                    }
                    if (blockSpecimenHistoryIndex === -1)
                    {
                        if (blockSpecimenHistorySave !== null)
                        {
                            event.currentTarget.value = blockSpecimenHistorySave;
                            event.currentTarget.dispatchEvent (new Event ('input'));
                        }
                    }
                    else
                    {
                        event.currentTarget.value = blockSpecimenHistory[blockSpecimenHistoryIndex];
                        event.currentTarget.dispatchEvent (new Event ('input'));
                    }
                }
            }
        }
    );
    //
    blockGoButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (blockSpecimen.value)
            {
                let character = parseCharacter (blockSpecimen.value);
                let blockKey = getBlockKeyfromCharacter (character);
                if (blockKey)
                {
                    let codePoint = unicode.characterToCodePoint (character);
                    let indexOfUnihanCharacter = blockSpecimenHistory.indexOf (codePoint);
                    if (indexOfUnihanCharacter !== -1)
                    {
                        blockSpecimenHistory.splice (indexOfUnihanCharacter, 1);
                    }
                    blockSpecimenHistory.unshift (codePoint);
                    if ((blockSpecimenHistorySize > 0) && (blockSpecimenHistory.length > blockSpecimenHistorySize))
                    {
                        blockSpecimenHistory.pop ();
                    }
                    blockSpecimenHistoryIndex = -1;
                    blockSpecimenHistorySave = null;
                    blockSpecimen.value = "";
                    blockSelectBlockRange.value = blockKey;
                    blockSelectBlockName.value = blockKey;
                    displayRangeTable (blockKey, character);
                }
                else
                {
                    remote.shell.beep ();
                }
            }
            else
            {
                blockSpecimenHistoryIndex = -1;
                blockSpecimenHistorySave = null;
                displayRangeTable (blockSelectBlockRange.value);
            }
        }
    );
    //
    blockSelectBlockRange.value = prefs.blockSelectBlockRange;
    if (blockSelectBlockRange.selectedIndex < 0) // -1: no element is selected
    {
        blockSelectBlockRange.selectedIndex = 0;
    }
    //
    blockSelectBlockName.value = blockSelectBlockRange.value;
    displayRangeTable (blockSelectBlockName.value);
    //
    blockSelectBlockRange.addEventListener
    (
        'input',
        (event) =>
        {
            blockSelectBlockName.value = event.currentTarget.value;
            blockParams.pageIndex = 0;
            displayRangeTable (event.currentTarget.value);
        }
    );
    //
    blockSelectBlockName.addEventListener
    (
        'input',
        (event) =>
        {
            blockSelectBlockRange.value = event.currentTarget.value;
            blockParams.pageIndex = 0;
            displayRangeTable (event.currentTarget.value);
        }
    );
    //
    let blockResultsMenu =
    remote.Menu.buildFromTemplate
    (
        [
            {
                label: "Copy Results", // "Copy Results as String"
                click: () => 
                {
                    if (currentCharactersByBlock.length > 0)
                    {
                        remote.clipboard.writeText (currentCharactersByBlock.join (""));
                    }
                }
            },
            {
                label: "Save Results...", // "Save Results to File"
                click: () => 
                {
                    saveResults (currentCharactersByBlock.join (""));
                }
            }
        ]
    );
    //
    blockResultsButton.addEventListener
    (
        'click',
        (event) =>
        {
            pullDownMenus.popup (event.currentTarget, blockResultsMenu);
        }
    );
    //
    blockInstructions.open = prefs.blockInstructions;
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
        nameSearchString: nameSearchString.value,
        nameWholeWord: nameWholeWord.checked,
        nameUseRegex: nameUseRegex.checked,
        namePageSize: nameParams.pageSize,
        nameInstructions: nameInstructions.open,
        nameRegexExamples: nameRegexExamples.open,
        //
        matchSearchString: matchSearchString.value,
        matchDecomposition: matchDecomposition.checked,
        matchCaseSensitive: matchCaseSensitive.checked,
        matchUseRegex: matchUseRegex.checked,
        matchPageSize: matchParams.pageSize,
        matchInstructions: matchInstructions.open,
        matchRegexExamples: matchRegexExamples.open,
        //
        blockSelectBlockRange: blockSelectBlockRange.value,
        blockSpecimenHistory: blockSpecimenHistory,
        blockPageSize: blockParams.pageSize,
        blockPageIndex: blockParams.pageIndex,
        blockInstructions: blockInstructions.open,
        //
        defaultFolderPath: defaultFolderPath
    };
    context.setPrefs (prefs);
};
//
