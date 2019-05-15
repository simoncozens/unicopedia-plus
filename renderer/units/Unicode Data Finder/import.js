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
const nameSearchInfo = unit.querySelector ('.find-by-name .search-info');
const nameSearchData = unit.querySelector ('.find-by-name .search-data');
const nameInstructions = unit.querySelector ('.find-by-name .instructions');
const nameRegexExamples = unit.querySelector ('.find-by-name .regex-examples');
//
const nameParams = { };
//
const characterSearchString = unit.querySelector ('.match-character .search-string');
const characterSearchMessage = unit.querySelector ('.match-character .search-message');
const characterMatchDecomposition = unit.querySelector ('.match-character .match-decomposition');
const characterCaseSensitive = unit.querySelector ('.match-character .case-sensitive');
const characterUseRegex = unit.querySelector ('.match-character .use-regex');
const characterSearchButton = unit.querySelector ('.match-character .search-button');
const characterSearchInfo = unit.querySelector ('.match-character .search-info');
const characterSearchData = unit.querySelector ('.match-character .search-data');
const characterInstructions = unit.querySelector ('.match-character .instructions');
const characterRegexExamples = unit.querySelector ('.match-character .regex-examples');
//
const characterParams = { };
//
const blockSpecimen = unit.querySelector ('.list-by-block .specimen');
const blockGoButton = unit.querySelector ('.list-by-block .go-button');
const blockSelectBlockRange = unit.querySelector ('.list-by-block .select-block-range');
const blockSelectBlockName = unit.querySelector ('.list-by-block .select-block-name');
const blockSearchInfo = unit.querySelector ('.list-by-block .search-info');
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
module.exports.start = function (context)
{
    const { remote } = require ('electron');
    //
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
        characterSearchString: "",
        characterMatchDecomposition: false,
        characterCaseSensitive: false,
        characterUseRegex: false,
        characterPageSize: 8,
        characterInstructions: true,
        characterRegexExamples: false,
        //
        blockSelectBlockRange: "",
        blockSpecimenHistory: [ ],
        blockPageSize: 8,
        blockPageIndex: 0,
        blockInstructions: true
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
            if (event.key === "Enter")
            {
                event.preventDefault (); // ??
                nameSearchButton.click ();
            }
        }
    );
    nameSearchString.addEventListener
    (
        'focusin',
        (event) =>
        {
            if (event.target.classList.contains ('error'))
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
            if (event.target.classList.contains ('error'))
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
            event.target.classList.remove ('error');
            nameSearchMessage.textContent = "";
            nameSearchMessage.classList.remove ('shown');
            if (nameUseRegex.checked)
            {
                try
                {
                    regexUnicode.build (event.target.value, { useRegex: nameUseRegex.checked });
                }
                catch (e)
                {
                    event.target.classList.add ('error');
                    nameSearchMessage.textContent = e.message;
                    if (event.target === document.activeElement)
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
                        clearSearch (nameSearchInfo, nameSearchData);
                        let start = window.performance.now ();
                        let characters = unicode.findCharactersByName (regex);
                        let stop = window.performance.now ();
                        let seconds = ((stop - start) / 1000).toFixed (2);
                        let closeButton = document.createElement ('button');
                        closeButton.type = 'button';
                        closeButton.className = 'close-button';
                        closeButton.innerHTML = '<svg class="close-cross" viewBox="0 0 8 8"><polygon points="1,0 4,3 7,0 8,1 5,4 8,7 7,8 4,5 1,8 0,7 3,4 0,1" /></svg>';
                        closeButton.title = "Clear results";
                        closeButton.addEventListener ('click', event => { clearSearch (nameSearchInfo, nameSearchData); });
                        nameSearchInfo.appendChild (closeButton);
                        let infoText = document.createElement ('span');
                        infoText.innerHTML = `Characters: <strong>${characters.length}</strong>&nbsp;/&nbsp;${unicode.characterCount} (${seconds}&nbsp;seconds)`;
                        nameSearchInfo.appendChild (infoText);
                        if (characters.length > 0)
                        {
                            nameParams.pageIndex = 0;
                            nameSearchData.appendChild (dataTable.create (characters, nameParams));
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
    nameInstructions.open = prefs.nameInstructions;
    nameRegexExamples.open = prefs.nameRegexExamples;
    //
    characterParams.pageSize = prefs.characterPageSize;
    characterParams.observer = null;
    characterParams.root = unit;
    //
    characterMatchDecomposition.checked = prefs.characterMatchDecomposition;
    //
    characterCaseSensitive.checked = prefs.characterCaseSensitive;
    characterUseRegex.checked = prefs.characterUseRegex;
    //
    characterSearchString.addEventListener
    (
        'keypress',
        (event) =>
        {
            if (event.key === "Enter")
            {
                event.preventDefault (); // ??
                characterSearchButton.click ();
            }
        }
    );
    characterSearchString.addEventListener
    (
        'focusin',
        (event) =>
        {
            if (event.target.classList.contains ('error'))
            {
                characterSearchMessage.classList.add ('shown');
            }
        }
    );
    characterSearchString.addEventListener
    (
        'focusout',
        (event) =>
        {
            if (event.target.classList.contains ('error'))
            {
                characterSearchMessage.classList.remove ('shown');
            }
        }
    );
    characterSearchString.addEventListener
    (
        'input',
        (event) =>
        {
            event.target.classList.remove ('error');
            characterSearchMessage.textContent = "";
            characterSearchMessage.classList.remove ('shown');
            if (characterUseRegex.checked)
            {
                try
                {
                    regexUnicode.build (event.target.value, { caseSensitive: characterCaseSensitive.checked, useRegex: characterUseRegex.checked });
                }
                catch (e)
                {
                    event.target.classList.add ('error');
                    characterSearchMessage.textContent = e.message;
                    if (event.target === document.activeElement)
                    {
                        characterSearchMessage.classList.add ('shown');
                    }
                }
            }
        }
    );
    characterSearchString.value = prefs.characterSearchString;
    characterSearchString.dispatchEvent (new Event ('input'));
    //
    characterUseRegex.addEventListener
    (
        'change',
        (event) => characterSearchString.dispatchEvent (new Event ('input'))
    );
    //
    characterSearchButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (!characterSearchString.classList.contains ('error'))
            {
                let searchString = characterSearchString.value;
                if (searchString)
                {
                    let regex = null;
                    try
                    {
                        regex = regexUnicode.build (searchString, { caseSensitive: characterCaseSensitive.checked, useRegex: characterUseRegex.checked });
                    }
                    catch (e)
                    {
                    }
                    if (regex)
                    {
                        clearSearch (characterSearchInfo, characterSearchData);
                        let start = window.performance.now ();
                        let characters = unicode.findCharactersBySymbol (regex, characterMatchDecomposition.checked);
                        let stop = window.performance.now ();
                        let seconds = ((stop - start) / 1000).toFixed (2);
                        let closeButton = document.createElement ('button');
                        closeButton.type = 'button';
                        closeButton.className = 'close-button';
                        closeButton.innerHTML = '<svg class="close-cross" viewBox="0 0 8 8"><polygon points="1,0 4,3 7,0 8,1 5,4 8,7 7,8 4,5 1,8 0,7 3,4 0,1" /></svg>';
                        closeButton.title = "Clear results";
                        closeButton.addEventListener ('click', event => { clearSearch (characterSearchInfo, characterSearchData); });
                        characterSearchInfo.appendChild (closeButton);
                        let infoText = document.createElement ('span');
                        infoText.innerHTML = `Characters: <strong>${characters.length}</strong>&nbsp;/&nbsp;${unicode.characterCount} (${seconds}&nbsp;seconds)`;
                        characterSearchInfo.appendChild (infoText);
                        if (characters.length > 0)
                        {
                            characterParams.pageIndex = 0;
                            characterSearchData.appendChild (dataTable.create (characters, characterParams));
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
    characterInstructions.open = prefs.characterInstructions;
    characterRegexExamples.open = prefs.characterRegexExamples;
    //
    blockSpecimenHistory = prefs.blockSpecimenHistory;
    //
    blockParams.pageSize = prefs.blockPageSize;
    blockParams.pageIndex = prefs.blockPageIndex;
    blockParams.observer = null;
    blockParams.root = unit;
    //
    let assignedRegex = regexUnicode.build ('\\p{Assigned}', { useRegex: true });
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
    const firstIndex = keyIndex.build (allBlocks, "firstIndex", (a, b) => a - b);
    const nameIndex = keyIndex.build (allBlocks, "name", (a, b) => a.localeCompare (b));
    //
    function displayRangeTable (blockKey, highlightedCharacter)
    {
        blockSearchInfo.textContent = "";
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
        let assignedCount = characters.filter (character => assignedRegex.test (character) || (character === "\u32FF")).length;
        blockSearchInfo.innerHTML = `Assigned characters: <strong>${assignedCount}</strong>&nbsp;/&nbsp;Block size: <strong>${block.size}</strong>`;
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
            event.target.classList.remove ('invalid');
            if (event.target.value)
            {
                if (!getBlockKeyfromCharacter (parseCharacter (event.target.value)))
                {
                    event.target.classList.add ('invalid');
                }
            }
        }
    );
    blockSpecimen.addEventListener
    (
        'keypress',
        (event) =>
        {
            if (event.key === "Enter")
            {
                event.preventDefault (); // ??
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
                if (event.key === "ArrowUp")
                {
                    event.preventDefault ();
                    if (blockSpecimenHistoryIndex === -1)
                    {
                        blockSpecimenHistorySave = event.target.value;
                    }
                    blockSpecimenHistoryIndex++;
                    if (blockSpecimenHistoryIndex > (blockSpecimenHistory.length - 1))
                    {
                        blockSpecimenHistoryIndex = (blockSpecimenHistory.length - 1);
                    }
                    if (blockSpecimenHistoryIndex !== -1)
                    {
                        event.target.value = blockSpecimenHistory[blockSpecimenHistoryIndex];
                        event.target.dispatchEvent (new Event ('input'));
                    }
                }
                else if (event.key === "ArrowDown")
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
                            event.target.value = blockSpecimenHistorySave;
                            event.target.dispatchEvent (new Event ('input'));
                        }
                    }
                    else
                    {
                        event.target.value = blockSpecimenHistory[blockSpecimenHistoryIndex];
                        event.target.dispatchEvent (new Event ('input'));
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
            blockSelectBlockName.value = event.target.value;
            blockParams.pageIndex = 0;
            displayRangeTable (event.target.value);
        }
    );
    //
    blockSelectBlockName.addEventListener
    (
        'input',
        (event) =>
        {
            blockSelectBlockRange.value = event.target.value;
            blockParams.pageIndex = 0;
            displayRangeTable (event.target.value);
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
        characterSearchString: characterSearchString.value,
        characterMatchDecomposition: characterMatchDecomposition.checked,
        characterCaseSensitive: characterCaseSensitive.checked,
        characterUseRegex: characterUseRegex.checked,
        characterPageSize: characterParams.pageSize,
        characterInstructions: characterInstructions.open,
        characterRegexExamples: characterRegexExamples.open,
        //
        blockSelectBlockRange: blockSelectBlockRange.value,
        blockSpecimenHistory: blockSpecimenHistory,
        blockPageSize: blockParams.pageSize,
        blockPageIndex: blockParams.pageIndex,
        blockInstructions: blockInstructions.open
    };
    context.setPrefs (prefs);
};
//
