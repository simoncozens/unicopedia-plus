//
const unit = document.getElementById ('unicode-data-finder-unit');
//
const tabs = unit.querySelectorAll ('.tab-bar .tab-radio');
const tabPanes = unit.querySelectorAll ('.tab-panes .tab-pane');
const tabInfos = unit.querySelectorAll ('.tab-infos .tab-info');
//
const nameSearchString = unit.querySelector ('.find-by-name .search-string');
const nameWholeWord = unit.querySelector ('.find-by-name .whole-word');
const nameUseRegex = unit.querySelector ('.find-by-name .use-regex');
const nameSearchButton = unit.querySelector ('.find-by-name .search-button');
const nameSearchInfo = unit.querySelector ('.find-by-name .search-info');
const nameSearchData = unit.querySelector ('.find-by-name .search-data');
const nameInstructions = unit.querySelector ('.find-by-name .instructions');
const nameRegexExamples = unit.querySelector ('.find-by-name .regex-examples');
//
const symbolSearchString = unit.querySelector ('.match-symbol .search-string');
const symbolCaseSensitive = unit.querySelector ('.match-symbol .case-sensitive');
const symbolUseRegex = unit.querySelector ('.match-symbol .use-regex');
const symbolSearchButton = unit.querySelector ('.match-symbol .search-button');
const symbolSearchInfo = unit.querySelector ('.match-symbol .search-info');
const symbolSearchData = unit.querySelector ('.match-symbol .search-data');
const symbolInstructions = unit.querySelector ('.match-symbol .instructions');
const symbolRegexExamples = unit.querySelector ('.match-symbol .regex-examples');
//
const blockSpecimen = unit.querySelector ('.list-by-block .specimen');
const blockGoButton = unit.querySelector ('.list-by-block .go-button');
const blockSelectBlockRange = unit.querySelector ('.list-by-block .select-block-range');
const blockSelectBlockName = unit.querySelector ('.list-by-block .select-block-name');
const blockSearchInfo = unit.querySelector ('.list-by-block .search-info');
const blockSearchData = unit.querySelector ('.list-by-block .search-data');
const blockInstructions = unit.querySelector ('.list-by-block .instructions');
//
const nameParams = { };
const symbolParams = { };
const blockParams = { };
//
module.exports.start = function (context)
{
    const { remote } = require ('electron');
    //
    const unicode = require ('../../lib/unicode/unicode.js');
    //
    const dataTable = require ('./data-table.js');
    //
    const rewritePattern = require ('regexpu-core');
    //
    const extraData = require ('../../lib/unicode/parsed-extra-data.js');
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
        symbolSearchString: "",
        symbolCaseSensitive: false,
        symbolUseRegex: false,
        symbolPageSize: 8,
        symbolInstructions: true,
        symbolRegexExamples: false,
        //
        blockSelectBlockRange: "",
        blockSpecimen: "",
        blockPageSize: 8,
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
        'input',
        (event) =>
        {
            event.target.classList.remove ('error');
            event.target.title = "";
            if (nameUseRegex.checked)
            {
                try
                {
                    const flags = 'ui';
                    let pattern = event.target.value;
                    pattern = rewritePattern (pattern, flags, { unicodePropertyEscape: true, useUnicodeFlag: true });
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
            nameSearchInfo.textContent = "";
            while (nameSearchData.firstChild)
            {
                nameSearchData.firstChild.remove ();
            }
            let searchString = nameSearchString.value;
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
                    let pattern = (nameUseRegex.checked) ? searchString : Array.from (searchString).map ((char) => characterToEcmaScriptEscape (char)).join ('');
                    if (nameWholeWord.checked)
                    {
                        const beforeWordBoundary = '(?:^|[^\\p{Alphabetic}\\p{Mark}\\p{Decimal_Number}\\p{Connector_Punctuation}\\p{Join_Control}])';
                        const afterWordBoundary = '(?:$|[^\\p{Alphabetic}\\p{Mark}\\p{Decimal_Number}\\p{Connector_Punctuation}\\p{Join_Control}])';
                        pattern = `${beforeWordBoundary}(${pattern})${afterWordBoundary}`;
                    }
                    const flags = 'ui';
                    pattern = rewritePattern (pattern, flags, { unicodePropertyEscape: true, useUnicodeFlag: true });
                    regex = new RegExp (pattern, flags);
                }
                catch (e)
                {
                }
                if (regex)
                {
                    let start = window.performance.now ();
                    let characters = unicode.findCharactersByData (regex, false);
                    let stop = window.performance.now ();
                    let seconds = ((stop - start) / 1000).toFixed (2);
                    nameSearchInfo.innerHTML = `Characters: <strong>${characters.length}</strong>&nbsp;/&nbsp;${unicode.characterCount} (${seconds}&nbsp;seconds)`;
                    if (characters.length > 0)
                    {
                        nameSearchData.appendChild (dataTable.create (characters, nameParams));
                    }
                }
            }
        }
    );
    //
    nameParams.pageSize = prefs.namePageSize;
    nameParams.observer = null;
    nameParams.root = unit;
    //
    nameInstructions.open = prefs.nameInstructions;
    nameRegexExamples.open = prefs.nameRegexExamples;
    //
    symbolCaseSensitive.checked = prefs.symbolCaseSensitive;
    symbolUseRegex.checked = prefs.symbolUseRegex;
    //
    symbolSearchString.addEventListener
    (
        'keypress',
        (event) =>
        {
            if (event.key === "Enter")
            {
                event.preventDefault (); // ??
                symbolSearchButton.click ();
            }
        }
    );
    symbolSearchString.addEventListener
    (
        'input',
        (event) =>
        {
            event.target.classList.remove ('error');
            event.target.title = "";
            if (symbolUseRegex.checked)
            {
                try
                {
                    const flags = symbolCaseSensitive.checked ? 'u' : 'ui';
                    let pattern = event.target.value;
                    pattern = rewritePattern (pattern, flags, { unicodePropertyEscape: true, useUnicodeFlag: true });
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
    symbolSearchString.value = prefs.symbolSearchString;
    symbolSearchString.dispatchEvent (new Event ('input'));
    //
    symbolUseRegex.addEventListener
    (
        'change',
        (event) => symbolSearchString.dispatchEvent (new Event ('input'))
    );
    //
    symbolSearchButton.addEventListener
    (
        'click',
        (event) =>
        {
            symbolSearchInfo.textContent = "";
            while (symbolSearchData.firstChild)
            {
                symbolSearchData.firstChild.remove ();
            }
            let searchString = symbolSearchString.value;
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
                    let pattern = (symbolUseRegex.checked) ?
                        searchString :
                        Array.from (searchString).map ((char) => characterToEcmaScriptEscape (char)).join ('');
                    const flags = symbolCaseSensitive.checked ? 'u' : 'ui';
                    pattern = rewritePattern (pattern, flags, { unicodePropertyEscape: true, useUnicodeFlag: true });
                    regex = new RegExp (pattern, flags);
                }
                catch (e)
                {
                }
                if (regex)
                {
                    let start = window.performance.now ();
                    let characters = unicode.findCharactersByData (regex, true);
                    let stop = window.performance.now ();
                    let seconds = ((stop - start) / 1000).toFixed (2);
                    symbolSearchInfo.innerHTML = `Characters: <strong>${characters.length}</strong>&nbsp;/&nbsp;${unicode.characterCount} (${seconds}&nbsp;seconds)`;
                    if (characters.length > 0)
                    {
                        symbolSearchData.appendChild (dataTable.create (characters, symbolParams));
                    }
                }
            }
        }
    );
    //
    symbolParams.pageSize = prefs.symbolPageSize;
    symbolParams.observer = null;
    symbolParams.root = unit;
    //
    symbolInstructions.open = prefs.symbolInstructions;
    symbolRegexExamples.open = prefs.symbolRegexExamples;
    //
    blockParams.pageSize = prefs.blockPageSize;
    blockParams.observer = null;
    blockParams.root = unit;
    //
    function displayRangeTable (blockKey, charKey)
    {
        let blockRange = blockKey.split ('-');
        blockSearchInfo.textContent = "";
        while (blockSearchData.firstChild)
        {
            blockSearchData.firstChild.remove ();
        }
        let characters = [ ];
        for (let index = parseInt (blockRange[0], 16); index <= parseInt (blockRange[1], 16); index++)
        {
            characters.push (String.fromCodePoint (index));
        }
        let hilightedCharacter;
        if (charKey)
        {
            hilightedCharacter = String.fromCodePoint (parseInt (charKey, 16));
        }
        let flags = 'u';
        let pattern = rewritePattern ('\\p{Assigned}', flags, { unicodePropertyEscape: true, useUnicodeFlag: true });
        let regex = new RegExp (pattern, flags);
        let assignedCharacters = characters.filter (character => regex.test (character));
        blockSearchInfo.innerHTML = `Assigned characters: <strong>${assignedCharacters.length}</strong>&nbsp;/&nbsp;Block size: <strong>${characters.length}</strong>`;
        if (characters.length > 0)
        {
            blockSearchData.appendChild (dataTable.create (characters, blockParams, hilightedCharacter));
        }
    }
    //
    let blocks = { };
    let blockNames = [ ];
    extraData.blocks.forEach
    (
        block =>
        {
            blocks[block.name] = { first: block.first, last: block.last };
            blockNames.push (block.name);
            //
            let option = document.createElement ('option');
            option.value = `${block.first}-${block.last}`;
            option.textContent = `U+${block.first}..U+${block.last}`;
            option.title = block.name;
            blockSelectBlockRange.appendChild (option);
        }
    );
    blockNames.sort ((a, b) => a.localeCompare (b));
    blockNames.forEach
    (
        blockName =>
        {
            let option = document.createElement ('option');
            let block = blocks[blockName];
            option.value = `${block.first}-${block.last}`;
            option.textContent = blockName;
            option.title = `U+${block.first}..U+${block.last}`;
            blockSelectBlockName.appendChild (option);
        }
    );
    //
    blockSpecimen.value = prefs.blockSpecimen;
    //
    const specimenRegex = /^\s*(?:(.)|(?:[Uu]\+)?\s*([0-9a-fA-F]{4,5}|10[0-9a-fA-F]{4}))\s*$/u;
    //
    blockSpecimen.pattern = specimenRegex.source;
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
    //
    blockGoButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (blockSpecimen.value)
            {
                let match = blockSpecimen.value.match (specimenRegex);
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
                    let blockRange = null;
                    for (let block of extraData.blocks)
                    {
                        if ((parseInt (block.first, 16) <= num) && (num <= parseInt (block.last, 16)))
                        {
                            blockRange = `${block.first}-${block.last}`;
                            break;
                        }
                    }
                    if (blockRange)
                    {
                        blockSpecimen.value = `U+${hex}`;
                        blockSelectBlockRange.value = blockRange;
                        blockSelectBlockName.value = blockRange;
                        displayRangeTable (blockRange, hex);
                    }
                    else
                    {
                        remote.shell.beep ();
                        // blockSpecimen.value = "";
                    }
                }
            }
            else
            {
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
        symbolSearchString: symbolSearchString.value,
        symbolCaseSensitive: symbolCaseSensitive.checked,
        symbolUseRegex: symbolUseRegex.checked,
        symbolPageSize: symbolParams.pageSize,
        symbolInstructions: symbolInstructions.open,
        symbolRegexExamples: symbolRegexExamples.open,
        //
        blockSelectBlockRange: blockSelectBlockRange.value,
        blockSpecimen: blockSpecimen.value,
        blockPageSize: blockParams.pageSize,
        blockInstructions: blockInstructions.open
    };
    context.setPrefs (prefs);
};
//
